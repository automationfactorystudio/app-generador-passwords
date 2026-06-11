import { useState, useEffect, useCallback } from "react";
import { 
  Lock, 
  RotateCw, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  Sun, 
  Moon, 
  Info, 
  ShieldCheck, 
  Sparkles, 
  BookOpen, 
  Sliders, 
  Download 
} from "lucide-react";
import { 
  generateComplexPassword, 
  generatePhrasePassword, 
  generatePronounceablePassword, 
  calculateEntropy 
} from "./utils/cryptoEngine";
import { generatePortableHtml } from "./utils/portableDownloader";
import { ManualPwaDialog } from "./components/ManualPwaDialog";
import { 
  ThemeMode, 
  GenMethod, 
  ComplexConfig, 
  PhraseConfig, 
} from "./types";

export default function App() {
  // 1. Estado de Tema (Claro / Oscuro)
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("crypto_engine_theme");
    if (saved === "dark" || saved === "light") return saved;
    // Fallback preferente del sistema operativo
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  // Sincronizar el tema con la clase HTML global de Tailwind
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("crypto_engine_theme", themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode(prev => (prev === "light" ? "dark" : "light"));
  };

  // 2. Método de generación activo (Compleja / Frase / Pronunciable)
  const [activeTab, setActiveTab] = useState<GenMethod>("compleja");

  // 3. Configuraciones de cada algoritmo
  const [complexConfig, setComplexConfig] = useState<ComplexConfig>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    avoidConfusing: true,
  });

  const [phraseConfig, setPhraseConfig] = useState<PhraseConfig>({
    wordCount: 4,
    delimiter: "-",
    capitalizeInitials: true,
    extraSuffix: false,
  });

  const [pronounceableLength, setPronounceableLength] = useState<number>(12);

  // 4. Estados del resultado generado
  const [generatedPassword, setGeneratedPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // 5. Configuración de soporte PWA (Instalación nativa)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isPwaInstallable, setIsPwaInstallable] = useState<boolean>(false);
  const [isPwaDialogOpen, setIsPwaDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsPwaInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleNativePwaInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`Resultado de instalación PWA: ${outcome}`);
    setDeferredPrompt(null);
    setIsPwaInstallable(false);
  };

  const downloadPortableFile = () => {
    const htmlContent = generatePortableHtml();
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "generador_contrasenas_premium.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 6. Núcleo de Generación de Contraseñas
  const handleGenerate = useCallback(() => {
    let password = "";

    if (activeTab === "compleja") {
      password = generateComplexPassword(complexConfig);
    } else if (activeTab === "frase") {
      password = generatePhrasePassword(phraseConfig);
    } else if (activeTab === "pronunciable") {
      password = generatePronounceablePassword(pronounceableLength);
    }

    setGeneratedPassword(password);
    setIsCopied(false);
  }, [activeTab, complexConfig, phraseConfig, pronounceableLength]);

  // Generar al cargar inicialmente la aplicación o cambiar de pestaña
  useEffect(() => {
    handleGenerate();
  }, [activeTab, handleGenerate]);

  // 7. Visualización de métricas en tiempo real de la clave activa
  const { bits: currentEntropy, strength: currentStrength } = calculateEntropy(
    generatedPassword,
    activeTab,
    { complexConfig, phraseConfig }
  );

  // 8. Funciones de apoyo
  const handleCopy = async () => {
    if (!generatedPassword) return;
    try {
      await navigator.clipboard.writeText(generatedPassword);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Error al copiar contraseña en portapapeles:", err);
    }
  };

  const getStrengthProgressColor = (strength: string) => {
    switch (strength) {
      case "Inquebrantable":
        return "bg-emerald-600 dark:bg-emerald-500";
      case "Fuerte":
        return "bg-blue-600 dark:bg-blue-500";
      case "Aceptable":
        return "bg-amber-600 dark:bg-amber-500";
      default:
        return "bg-red-600 dark:bg-red-500";
    }
  };

  const getStrengthTextColor = (strength: string) => {
    switch (strength) {
      case "Inquebrantable":
        return "text-emerald-700 dark:text-emerald-400";
      case "Fuerte":
        return "text-blue-700 dark:text-blue-400";
      case "Aceptable":
        return "text-amber-700 dark:text-amber-400";
      default:
        return "text-red-700 dark:text-red-400";
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F1E8] text-[#2C2A29] dark:bg-[#1C1C1C] dark:text-[#EFECE6] p-4 sm:p-8 transition-colors duration-300">
      
      {/* HEADER DE LA APLICACIÓN */}
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-[#9B4A39]/10 dark:border-white/10 pb-6 mb-8">
        <div className="space-y-2 max-w-3xl">
          <h1 className="font-serif text-4xl sm:text-5xl font-black tracking-tight text-[#9B4A39] dark:text-[#e5ac9f] flex items-center gap-3">
            Generador de Contraseñas
          </h1>
          <p className="text-sm font-medium leading-relaxed text-[#2C2A29]/70 dark:text-[#EFECE6]/70">
            Archivo único autoejecutable. Puedes guardar esto directamente en tu PC (clic derecho -&gt; Guardar como) o transferirlo al móvil para generar claves sin cobertura, libre de rastreos.
          </p>
        </div>

        {/* CONTROLES DE CABECERA (Tema y PWA) */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Botón Descargar Portable */}
          <button
            onClick={downloadPortableFile}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-orange-600/10 border border-orange-600/30 hover:bg-orange-600/20 text-orange-850 dark:text-orange-200 dark:bg-orange-500/10 dark:border-orange-500/20 dark:hover:bg-orange-500/20 transition-all text-xs font-semibold uppercase tracking-wider cursor-pointer font-sans"
            title="Descarga la App completa en un solo archivo HTML autónomo para abrirlo sin internet en cualquier PC o móvil"
          >
            <Download className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <span>Descargar App Portable (.html)</span>
          </button>

          {/* Botón PWA */}
          <button
            onClick={() => setIsPwaDialogOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#9B4A39]/5 border border-[#9B4A39]/15 hover:bg-[#9B4A39]/10 text-[#9B4A39] dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 dark:text-[#EFECE6] transition-all text-xs font-semibold uppercase tracking-wider cursor-pointer"
            title="Instalar como Aplicación Offline (PWA)"
          >
            <Download className="h-4 w-4" />
            <span>PWA Offline</span>
          </button>

          {/* Selector de Tema */}
          <button
            onClick={toggleTheme}
            id="theme-toggler"
            className="p-3 rounded-full border border-[#9B4A39]/10 bg-[#FAF7F2] hover:bg-[#9B4A39]/5 text-[#9B4A39] dark:border-white/10 dark:bg-[#252525] dark:hover:bg-white/5 dark:text-[#e5ac9f] transition-all cursor-pointer"
            title={themeMode === "light" ? "Activar Lienzo Editorial Nocturno" : "Activar Lienzo Editorial Claro"}
          >
            {themeMode === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </button>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL: GRID DE DOS COLUMNAS */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* PARTE IZQUIERDA: CONFIGURACIONES (Ajustes de Estructuración) */}
        <div className="md:col-span-6 space-y-6">
          
          {/* SECTOR DE MÉTODOS (Pestañas) */}
          <div className="flex rounded-xl bg-[#FAF7F2]/80 border border-[#9B4A39]/15 p-1 dark:bg-[#252525]/80 dark:border-white/10">
            <button
              onClick={() => setActiveTab("compleja")}
              className={`flex-1 text-center py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                activeTab === "compleja"
                  ? "bg-[#9B4A39] text-[#F6F1E8] shadow-xs"
                  : "text-[#2C2A29]/70 hover:bg-[#9B4A39]/5 dark:text-[#EFECE6]/70 dark:hover:bg-white/5"
              }`}
            >
              Compleja
            </button>
            <button
              onClick={() => setActiveTab("frase")}
              className={`flex-1 text-center py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                activeTab === "frase"
                  ? "bg-[#9B4A39] text-[#F6F1E8] shadow-xs"
                  : "text-[#2C2A29]/70 hover:bg-[#9B4A39]/5 dark:text-[#EFECE6]/70 dark:hover:bg-white/5"
              }`}
            >
              Frase
            </button>
            <button
              onClick={() => setActiveTab("pronunciable")}
              className={`flex-1 text-center py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                activeTab === "pronunciable"
                  ? "bg-[#9B4A39] text-[#F6F1E8] shadow-xs"
                  : "text-[#2C2A29]/70 hover:bg-[#9B4A39]/5 dark:text-[#EFECE6]/70 dark:hover:bg-white/5"
              }`}
            >
              Pronunciable
            </button>
          </div>

          {/* CAJA DE AJUSTES */}
          <section className="rounded-2xl border border-[#9B4A39]/10 bg-[#FAF7F2] p-6 text-[#2C2A29] dark:border-white/10 dark:bg-[#252525] dark:text-[#EFECE6] transition-colors duration-300">
            <div className="flex items-center justify-between border-b border-[#9B4A39]/10 dark:border-white/10 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <Sliders className="h-5 w-5 text-[#9B4A39] dark:text-[#e5ac9f]" />
                <h2 className="font-serif text-xl font-bold tracking-tight">
                  Ajustes de Estructuración
                </h2>
              </div>
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-[#9B4A39]/10 text-[#9B4A39] dark:bg-white/10 dark:text-[#e5ac9f] border border-[#9B4A39]/20">
                {activeTab}
              </span>
            </div>

            {/* OPCIONES DINÁMICAS BASADAS EN LA PESTAÑA SELECCIONADA */}
            
            {/* 1. COMPLEJA */}
            {activeTab === "compleja" && (
              <div className="space-y-6">
                {/* Sliders de longitud */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-[#2C2A29]/70 dark:text-[#EFECE6]/70">
                      Longitud total:
                    </span>
                    <span className="font-mono font-bold text-[#c07361] dark:text-[#df9f91]">
                      {complexConfig.length} caracteres
                    </span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="64"
                    value={complexConfig.length}
                    onChange={(e) =>
                      setComplexConfig(prev => ({
                        ...prev,
                        length: parseInt(e.target.value) || 16,
                      }))
                    }
                    className="w-full h-1.5 bg-[#9B4A39]/20 dark:bg-white/20 accent-[#9B4A39] rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Grid de Checkboxes de composición */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center justify-between p-3 rounded-lg border border-[#9B4A39]/5 bg-white/50 dark:border-white/5 dark:bg-black/10 text-sm cursor-pointer hover:border-[#9B4A39]/20">
                    <span className="font-medium">Mayúsculas [A-Z]</span>
                    <input
                      type="checkbox"
                      checked={complexConfig.uppercase}
                      onChange={(e) =>
                        setComplexConfig(prev => ({
                          ...prev,
                          uppercase: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded-sm border-gray-300 text-[#9B4A39] focus:ring-[#9B4A39] accent-[#9B4A39]"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-lg border border-[#9B4A39]/5 bg-white/50 dark:border-white/5 dark:bg-black/10 text-sm cursor-pointer hover:border-[#9B4A39]/20">
                    <span className="font-medium">Minúsculas [a-z]</span>
                    <input
                      type="checkbox"
                      checked={complexConfig.lowercase}
                      onChange={(e) =>
                        setComplexConfig(prev => ({
                          ...prev,
                          lowercase: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded-sm border-gray-300 text-[#9B4A39] focus:ring-[#9B4A39] accent-[#9B4A39]"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-lg border border-[#9B4A39]/5 bg-white/50 dark:border-white/5 dark:bg-black/10 text-sm cursor-pointer hover:border-[#9B4A39]/20">
                    <span className="font-medium">Números [0-9]</span>
                    <input
                      type="checkbox"
                      checked={complexConfig.numbers}
                      onChange={(e) =>
                        setComplexConfig(prev => ({
                          ...prev,
                          numbers: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded-sm border-gray-300 text-[#9B4A39] focus:ring-[#9B4A39] accent-[#9B4A39]"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-lg border border-[#9B4A39]/5 bg-white/50 dark:border-white/5 dark:bg-black/10 text-sm cursor-pointer hover:border-[#9B4A39]/20">
                    <span className="font-medium">Símbolos [#@!]</span>
                    <input
                      type="checkbox"
                      checked={complexConfig.symbols}
                      onChange={(e) =>
                        setComplexConfig(prev => ({
                          ...prev,
                          symbols: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded-sm border-gray-300 text-[#9B4A39] focus:ring-[#9B4A39] accent-[#9B4A39]"
                    />
                  </label>
                </div>

                {/* Filtro Anti-Confusión */}
                <div className="p-4 rounded-xl border border-[#9B4A39]/10 bg-white/20 dark:border-white/10 dark:bg-black/20 space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={complexConfig.avoidConfusing}
                      onChange={(e) =>
                        setComplexConfig(prev => ({
                          ...prev,
                          avoidConfusing: e.target.checked,
                        }))
                      }
                      className="mt-1 h-4 w-4 rounded-sm border-gray-300 text-[#9B4A39] focus:ring-[#9B4A39] accent-[#9B4A39]"
                    />
                    <div className="space-y-1">
                      <span className="text-sm font-semibold text-[#c07361] dark:text-[#df9f91]">
                        Evitar Similares e Indistinguibles
                      </span>
                      <p className="text-xs text-[#2C2A29]/60 dark:text-[#EFECE6]/60 leading-relaxed">
                        Elimina símbolos confusos como <code className="px-1 py-0.5 rounded-xs bg-[#2af]/10 font-mono text-[10px]">1, l, I, 0, o, O</code> para lecturas seguras sin errores.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* 2. FRASE (Diccionario del castellano poético) */}
            {activeTab === "frase" && (
              <div className="space-y-6">
                {/* Sliders de número de palabras */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-[#2C2A29]/70 dark:text-[#EFECE6]/70">
                      Número de palabras:
                    </span>
                    <span className="font-mono font-bold text-[#c07361] dark:text-[#df9f91]">
                      {phraseConfig.wordCount} palabras
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="10"
                    value={phraseConfig.wordCount}
                    onChange={(e) =>
                      setPhraseConfig(prev => ({
                        ...prev,
                        wordCount: parseInt(e.target.value) || 4,
                      }))
                    }
                    className="w-full h-1.5 bg-[#9B4A39]/20 dark:bg-white/20 accent-[#9B4A39] rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Botonera de Delimitador */}
                <div className="space-y-2.5">
                  <span className="text-xs font-semibold text-[#2C2A29]/70 dark:text-[#EFECE6]/70 uppercase tracking-wider block">
                    Delimitador personalizado:
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {["-", ".", "_", "/"].map((char) => (
                      <button
                        key={char}
                        type="button"
                        onClick={() =>
                          setPhraseConfig(prev => ({
                            ...prev,
                            delimiter: char,
                          }))
                        }
                        className={`py-2 text-sm font-bold font-mono border rounded-lg transition-all cursor-pointer ${
                          phraseConfig.delimiter === char
                            ? "bg-[#9B4A39] border-[#9B4A39] text-[#F6F1E8]"
                            : "border-[#9B4A39]/10 hover:bg-[#9B4A39]/5 text-[#2C2A29]/70 dark:border-white/10 dark:hover:bg-white/5 dark:text-[#EFECE6]/70"
                        }`}
                      >
                        {char === " " ? "Espacio ( )" : char}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Opciones de frase */}
                <div className="space-y-3.5 pt-2">
                  <label className="flex items-center justify-between p-3 rounded-lg border border-[#9B4A39]/5 bg-white/50 dark:border-white/5 dark:bg-black/10 text-sm cursor-pointer hover:border-[#9B4A39]/20">
                    <span className="font-medium">Mayúscula Inicial en palabras</span>
                    <input
                      type="checkbox"
                      checked={phraseConfig.capitalizeInitials}
                      onChange={(e) =>
                        setPhraseConfig(prev => ({
                          ...prev,
                          capitalizeInitials: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded-sm border-gray-300 text-[#9B4A39] focus:ring-[#9B4A39] accent-[#9B4A39]"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-lg border border-[#9B4A39]/5 bg-white/50 dark:border-white/5 dark:bg-black/10 text-sm cursor-pointer hover:border-[#9B4A39]/20">
                    <div className="space-y-0.5 pr-2">
                      <span className="font-medium block">Integrar código de validación final</span>
                      <span className="text-[10px] text-[#2C2A29]/50 dark:text-[#EFECE6]/50 block">Añade dígito y símbolo final (p. ej. -3!) para satisfacer restricciones estrictas de servidores.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={phraseConfig.extraSuffix}
                      onChange={(e) =>
                        setPhraseConfig(prev => ({
                          ...prev,
                          extraSuffix: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded-sm border-gray-300 text-[#9B4A39] focus:ring-[#9B4A39] accent-[#9B4A39] shrink-0"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* 3. PRONUNCIABLE (Fonemas rítmicos) */}
            {activeTab === "pronunciable" && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-[#2C2A29]/70 dark:text-[#EFECE6]/70">
                      Longitud del vocablo fonético:
                    </span>
                    <span className="font-mono font-bold text-[#c07361] dark:text-[#df9f91]">
                      {pronounceableLength} letras
                    </span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="32"
                    value={pronounceableLength}
                    onChange={(e) => setPronounceableLength(parseInt(e.target.value) || 12)}
                    className="w-full h-1.5 bg-[#9B4A39]/20 dark:bg-white/20 accent-[#9B4A39] rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-xl border border-[#9B4A39]/10 bg-white/50 dark:border-white/5 dark:bg-black/10 text-xs leading-relaxed text-[#2C2A29]/80 dark:text-[#EFECE6]/80 flex gap-3">
                  <BookOpen className="h-5 w-5 text-[#9B4A39] dark:text-[#e5ac9f] shrink-0 mt-0.5" />
                  <p>
                    Genera secuencias combinatorias alternando suavemente vocales y consonantes amables al oído. Ideal para fórmulas nemotécnicas destinadas a la memorización vocal o copiado rápido sin deslices ópticos.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* PARTE DERECHA: RESULTADOS (Visores de Contraseña y Métricas) */}
        <div className="md:col-span-6 space-y-6">
          <section className="rounded-2xl border border-[#9B4A39]/10 bg-[#FAF7F2] p-6 text-[#2C2A29] dark:border-white/10 dark:bg-[#252525] dark:text-[#EFECE6] transition-colors duration-300">
            
            {/* Cabecera del generador */}
            <div className="flex items-center justify-between mb-3 text-xs font-semibold tracking-wider text-[#9B4A39] dark:text-[#e5ac9f] uppercase">
              <span>Resultado Generado</span>
              
              <button
                type="button"
                onClick={() => setIsPasswordVisible(prev => !prev)}
                className="flex items-center gap-1.5 text-xs text-[#2C2A29]/60 hover:text-[#2C2A29] dark:text-[#EFECE6]/60 dark:hover:text-[#EFECE6] transition-colors capitalize cursor-pointer font-sans"
              >
                {isPasswordVisible ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    <span>Ocultar</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    <span>Mostrar Clave</span>
                  </>
                )}
              </button>
            </div>

            {/* CASILLA PRINCIPAL CON LLAVE Y ROTACIÓN */}
            <div className="flex items-center gap-3 p-4 bg-white/80 border border-[#9B4A39]/10 rounded-2xl dark:bg-black/30 dark:border-white/5 shadow-inner transition-colors duration-300">
              <div className="flex-1 overflow-x-auto select-all pr-2 scrollbar-none">
                {isPasswordVisible ? (
                  <span className="font-mono text-xl sm:text-2xl font-bold tracking-wide break-all block whitespace-pre select-all text-[#1c1c1c] dark:text-white">
                    {generatedPassword || "Cargando..."}
                  </span>
                ) : (
                  <span className="font-mono text-xl sm:text-2xl font-black tracking-widest break-all block text-[#9B4A39]/90 dark:text-[#e5ac9f]/90 select-none">
                    {"•".repeat(generatedPassword ? generatedPassword.length : 12)}
                  </span>
                )}
              </div>

              {/* Botón Re-generar / Refrescar */}
              <button
                onClick={handleGenerate}
                className="p-3.5 rounded-xl bg-[#FAF7F2] hover:bg-[#9B4A39]/10 text-[#9B4A39] border border-[#9B4A39]/15 dark:bg-[#2c2c2c] dark:hover:bg-white/10 dark:text-[#e5ac9f] dark:border-white/10 active:scale-95 transition-all cursor-pointer"
                title="Generar nueva clave"
              >
                <RotateCw className="h-5 w-5" />
              </button>
            </div>

            {/* MÉTRICAS SECUNDARIAS: FORTALEZA Y ENTROPÍA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {/* Bloque 1: Fortaleza */}
              <div className="p-4 rounded-xl border border-[#9B4A39]/10 bg-[#FAF7F2] dark:border-white/5 dark:bg-[#1E1E1E]">
                <span className="text-[10px] font-bold text-[#2C2A29]/50 dark:text-[#EFECE6]/50 uppercase tracking-widest block mb-2">
                  Fortaleza
                </span>
                <div className="flex items-center gap-2">
                  <ShieldCheck className={`h-5 w-5 ${getStrengthTextColor(currentStrength)}`} />
                  <span className={`text-base font-bold sm:text-lg ${getStrengthTextColor(currentStrength)} font-serif`}>
                    {currentStrength}
                  </span>
                </div>
                {/* Minibarra de progreso visual */}
                <div className="w-full h-1.5 bg-[#9B4A39]/10 dark:bg-white/10 rounded-full mt-3 overflow-hidden">
                  <div 
                    className={`h-full ${getStrengthProgressColor(currentStrength)} transition-all duration-500`}
                    style={{ 
                      width: `${Math.min(100, Math.max(10, (currentEntropy / 120) * 100))}%` 
                    }}
                  />
                </div>
              </div>

              {/* Bloque 2: Entropía bits */}
              <div className="p-4 rounded-xl border border-[#9B4A39]/10 bg-[#FAF7F2] dark:border-white/5 dark:bg-[#1E1E1E]">
                <span className="text-[10px] font-bold text-[#2C2A29]/50 dark:text-[#EFECE6]/50 uppercase tracking-widest block mb-1">
                  Eficacia / Entropía
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-black font-mono">
                    {currentEntropy}
                  </span>
                  <span className="text-sm font-semibold text-[#2C2A29]/60 dark:text-[#EFECE6]/60 font-mono">
                    bits
                  </span>
                </div>
                <p className="text-[10px] text-[#2C2A29]/50 dark:text-[#EFECE6]/50 mt-2 font-medium">
                  {currentEntropy >= 55 
                    ? "✓ Inmune a ataques de fuerza bruta modernos." 
                    : "⚠️ Entropía baja. Se aconseja añadir longitud."}
                </p>
              </div>
            </div>

            {/* ADVERTENCIA CRIPTOGRÁFICA DE LOCALIDAD (Aviso Criptográfico) */}
            <div className="mt-6 flex gap-3 p-4 bg-orange-400/10 border border-orange-500/20 text-orange-850 dark:text-orange-300 rounded-xl text-xs leading-relaxed">
              <Info className="h-5 w-5 shrink-0 mt-0.5 text-orange-500" />
              <p>
                “Guarda esta contraseña en tu gestor de contraseñas. Por seguridad, esta app no conservará la clave generada.”
              </p>
            </div>

            {/* BOTÓN SOLO DE COPIAR CLAVE (Se omitió el botón manual de archivar historial) */}
            <div className="mt-6 p-1 bg-white/20 dark:bg-black/10 rounded-2xl border border-[#9B4A39]/5 dark:border-white/5">
              <button
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2.5 px-6 py-4 bg-[#9B4A39] hover:bg-[#833D2F] text-white rounded-xl shadow-xs hover:shadow-md transition-all font-semibold uppercase tracking-wider text-sm active:scale-[0.99] cursor-pointer"
              >
                {isCopied ? (
                  <>
                    <Check className="h-5 w-5" />
                    <span>¡Copiado con éxito!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5" />
                    <span>Copiar Clave</span>
                  </>
                )}
              </button>
            </div>

          </section>
        </div>
      </main>

      {/* FOOTER GENERAL */}
      <footer className="max-w-6xl mx-auto mt-12 pt-6 border-t border-[#9B4A39]/10 dark:border-white/10 text-center text-xs text-[#2C2A29]/50 dark:text-[#EFECE6]/50 space-y-2 pb-8">
        <p className="font-serif italic">
          — Premium Crypto Engine // Swiss Inspired Security Core —
        </p>
        <p>
          Generador autónomo estático certificado. Soporte nativo para Progressive Web App (PWA) con tolerancia a pérdidas de red y 0% de fuga de datos.
        </p>
      </footer>

      {/* DIÁLOGO / MODAL DE INSTALACIÓN PWA */}
      <ManualPwaDialog
        isOpen={isPwaDialogOpen}
        onClose={() => setIsPwaDialogOpen(false)}
        onNativeInstall={handleNativePwaInstall}
        isInstallable={isPwaInstallable}
      />
    </div>
  );
}
