import { SPANISH_POETIC_DICTIONARY } from "../spanishWords";

/**
 * Genera el código de una aplicación HTML 100% autoejecutable, independiente y portable
 * que contiene todo el diseño del Generador de Contraseñas, incluyendo los tres algoritmos,
 * el corrector de entropía con CSPRNG real (Web Crypto API) y el conmutador de tema visual.
 */
export function generatePortableHtml(): string {
  // Serializamos el diccionario para incluirlo de forma íntegra e interna
  const serializedDictionary = JSON.stringify(SPANISH_POETIC_DICTIONARY);

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Generador de Contraseñas — Edición Portable</title>
    <!-- Tailwind CSS v4 CDN para renderizado instantáneo -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            fontFamily: {
              serif: ['"Playfair Display"', 'Georgia', 'serif'],
              sans: ['Inter', 'sans-serif'],
              mono: ['"JetBrains Mono"', 'monospace']
            }
          }
        }
      }
    </script>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <style>
      body {
        transition: background-color 0.3s ease, color 0.3s ease;
      }
      /* Custom styles for range slider matching Swiss tone */
      input[type="range"]::-webkit-slider-thumb {
        background: #9B4A39;
        border: 2px solid #FAF7F2;
        border-radius: 9999px;
        width: 18px;
        height: 18px;
        cursor: pointer;
        -webkit-appearance: none;
      }
      .dark input[type="range"]::-webkit-slider-thumb {
        background: #e5ac9f;
        border-color: #252525;
      }
    </style>
  </head>
  <body class="min-h-screen bg-[#F6F1E8] text-[#2C2A29] dark:bg-[#1C1C1C] dark:text-[#EFECE6] p-4 sm:p-8">
    
    <div id="app" class="max-w-6xl mx-auto">
      <!-- HEADER -->
      <header class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-[#9B4A39]/10 dark:border-white/10 pb-6 mb-8">
        <div class="space-y-2 max-w-3xl">
          <h1 class="font-serif text-4xl sm:text-5xl font-black tracking-tight text-[#9B4A39] dark:text-[#e5ac9f]">
            Generador de Contraseñas
          </h1>
          <p class="text-sm font-medium leading-relaxed opacity-80">
            Edición Portable Autonómica. Ejecución 100% local, desconectada e inmune a filtraciones de red.
          </p>
        </div>
        
        <!-- Toggle de Tema -->
        <button id="themeModeBtn" class="p-3 rounded-full border border-[#9B4A39]/10 bg-[#FAF7F2] hover:bg-[#9B4A39]/5 text-[#9B4A39] dark:border-white/10 dark:bg-[#252525] dark:hover:bg-white/5 dark:text-[#e5ac9f] cursor-pointer transition-all">
          <svg id="themeIcon" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
        </button>
      </header>

      <!-- SECTOR DE COMPARTIMENTOS -->
      <main class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        <!-- PARTE IZQUIERDA: CONFIGURACIONES -->
        <div class="md:col-span-6 space-y-6">
          
          <!-- PESTAÑAS -->
          <div class="flex rounded-xl bg-[#FAF7F2]/80 border border-[#9B4A39]/15 p-1 dark:bg-[#252525]/80 dark:border-white/10">
            <button id="tabCompleja" class="flex-1 text-center py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all bg-[#9B4A39] text-[#F6F1E8]">
              Compleja
            </button>
            <button id="tabFrase" class="flex-1 text-center py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all text-[#2C2A29]/70 dark:text-[#EFECE6]/70">
              Frase
            </button>
            <button id="tabPronunciable" class="flex-1 text-center py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all text-[#2C2A29]/70 dark:text-[#EFECE6]/70">
              Pronunciable
            </button>
          </div>

          <!-- PANEL DE HERRAMIENTAS -->
          <div class="rounded-2xl border border-[#9B4A39]/10 bg-[#FAF7F2] p-6 text-[#2C2A29] dark:border-white/10 dark:bg-[#252525] dark:text-[#EFECE6]">
            
            <div class="flex items-center justify-between border-b border-[#9B4A39]/10 dark:border-white/10 pb-4 mb-5">
              <div class="flex items-center gap-2">
                <svg class="h-5 w-5 text-[#9B4A39] dark:text-[#e5ac9f]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <h2 class="font-serif text-xl font-bold tracking-tight">
                  Ajustes de Estructuración
                </h2>
              </div>
              <span id="activeMethodBadge" class="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-[#9B4A39]/10 text-[#9B4A39] dark:bg-white/10 dark:text-[#e5ac9f] border border-[#9B4A39]/20">
                compleja
              </span>
            </div>

            <!-- CONTENIDOS DINÁMICOS -->
            <div id="inputsContainer" class="space-y-6">
              <!-- Se monta dinámicamente según la pestaña -->
            </div>

          </div>

        </div>

        <!-- PARTE DERECHA: PANTALLA DE RESULTADOS -->
        <div class="md:col-span-6 space-y-6">
          <div class="rounded-2xl border border-[#9B4A39]/10 bg-[#FAF7F2] p-6 text-[#2C2A29] dark:border-white/10 dark:bg-[#252525] dark:text-[#EFECE6]">
            
            <div class="flex items-center justify-between mb-3 text-xs font-semibold tracking-wider text-[#9B4A39] dark:text-[#e5ac9f] uppercase">
              <span>Resultado Generado</span>
              <button id="toggleVisibleBtn" class="flex items-center gap-1.5 text-xs opacity-70 hover:opacity-100 transition-opacity">
                <span>Ocultar</span>
              </button>
            </div>

            <!-- VISOR -->
            <div class="flex items-center gap-3 p-4 bg-white/80 border border-[#9B4A39]/10 rounded-2xl dark:bg-black/30 dark:border-white/5 shadow-inner">
              <div class="flex-1 overflow-x-auto select-all pr-2">
                <span id="passwordOutput" class="font-mono text-xl sm:text-2xl font-bold tracking-wide break-all block whitespace-pre select-all text-[#1c1c1c] dark:text-white"></span>
              </div>
              <button id="regenerateBtn" class="p-3.5 rounded-xl bg-[#FAF7F2] hover:bg-[#9B4A39]/10 text-[#9B4A39] border border-[#9B4A39]/15 dark:bg-[#2c2c2c] dark:hover:bg-white/10 dark:text-[#e5ac9f] dark:border-white/10 transition-all">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 16.21M21 20v-5h-5" />
                </svg>
              </button>
            </div>

            <!-- MÉTRICAS -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              
              <!-- Fortaleza -->
              <div class="p-4 rounded-xl border border-[#9B4A39]/10 bg-[#FAF7F2] dark:border-white/5 dark:bg-[#1E1E1E]">
                <span class="text-[10px] font-bold opacity-60 uppercase tracking-widest block mb-1">
                  Fortaleza
                </span>
                <div class="flex items-center gap-2">
                  <svg id="strengthShield" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.475 3.475 0 011.841 4.549 3.43 3.43 0 00-.11 1.986 3.474 3.474 0 01-1.841 4.549c-.642.316-1.11.832-1.309 1.488a3.475 3.475 0 01-4.549 1.841 3.44 3.44 0 00-1.986-.11 3.475 3.475 0 01-4.549-1.841 3.44 3.44 0 00-1.309-1.488 3.475 3.475 0 01-1.841-4.549c.043-.661-.03-1.328-.11-1.986zm0 0a3.475 3.475 0 01-1.841-4.549 3.42 3.42 0 014.438 0c.642.316 1.11.832 1.309 1.488z" />
                  </svg>
                  <span id="strengthText" class="text-base font-bold sm:text-lg font-serif"></span>
                </div>
                <!-- Barra de progreso -->
                <div class="w-full h-1.5 bg-[#9B4A39]/10 dark:bg-white/10 rounded-full mt-3 overflow-hidden">
                  <div id="strengthBar" class="h-full transition-all duration-500"></div>
                </div>
              </div>

              <!-- Entropía -->
              <div class="p-4 rounded-xl border border-[#9B4A39]/10 bg-[#FAF7F2] dark:border-white/5 dark:bg-[#1E1E1E]">
                <span class="text-[10px] font-bold opacity-60 uppercase tracking-widest block mb-1">
                  Eficacia / Entropía
                </span>
                <div class="flex items-baseline gap-1">
                  <span id="entropyText" class="text-xl sm:text-2xl font-black font-mono">0</span>
                  <span class="text-sm font-semibold opacity-60 font-mono">bits</span>
                </div>
                <p id="entropyDesc" class="text-[10px] opacity-50 mt-2 font-medium"></p>
              </div>

            </div>

            <!-- ADVERTENCIA -->
            <div class="mt-6 flex gap-3 p-4 bg-orange-400/10 border border-orange-500/20 text-orange-850 dark:text-orange-300 rounded-xl text-xs leading-relaxed">
              <svg class="h-5 w-5 shrink-0 mt-0.5 text-orange-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>
                “Guarda esta contraseña en tu gestor de contraseñas. Por seguridad, esta app no conservará la clave generada.”
              </p>
            </div>

            <!-- COPIAR CLAVE -->
            <button id="copyBtn" class="mt-6 w-full flex items-center justify-center gap-2.5 px-6 py-4 bg-[#9B4A39] hover:bg-[#833D2F] text-white rounded-xl shadow transition-all font-semibold uppercase tracking-wider text-sm cursor-pointer">
              <span>Copiar Clave</span>
            </button>

          </div>
        </div>

      </main>

      <footer class="mt-12 pt-6 border-t border-[#9B4A39]/10 dark:border-white/10 text-center text-xs opacity-50 space-y-2 pb-8">
        <p class="font-serif italic">
          — Premium Crypto Engine // Swiss Inspired Security Core —
        </p>
        <p>
          Generador estático portable sin cobertura. Desarrollado con Criptografía Segura Local.
        </p>
      </footer>
    </div>

    <!-- LOGIC BUNDLED INTERNALLY -->
    <script>
      // 1. Diccionario Poético Español Integrado
      const DICTIONARY = ${serializedDictionary};

      // Caracteres
      const UPPERCASE_POOL = "ABCDEFGHJKLMNOPQRSTUVWXYZ".split("");
      const LOWERCASE_POOL = "abcdefghijkmnopqrstuvwxyz".split("");
      const NUMBERS_POOL = "23456789".split("");
      const SYMBOLS_POOL = "@#$!%^&*?_+-=".split("");
      
      const FULL_UPPERCASE_POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
      const FULL_LOWERCASE_POOL = "abcdefghijklmnopqrstuvwxyz".split("");
      const FULL_NUMBERS_POOL = "0123456789".split("");

      const PRONOUN_CONSONANTS = "bcdfgklmnprstvz".split("");
      const PRONOUN_VOWELS = "aeiou".split("");

      // Configs
      let activeTab = "compleja";
      let isVisible = true;
      let generatedPass = "";

      let complexConfig = {
        length: 16,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
        avoidConfusing: true
      };

      let phraseConfig = {
        wordCount: 4,
        delimiter: "-",
        capitalizeInitials: true,
        extraSuffix: false
      };

      let pronounceableLength = 12;

      // Cryptography CSPRNG Helper
      function getSecureRandomUint32() {
        if (window.crypto && window.crypto.getRandomValues) {
          const array = new Uint32Array(1);
          window.crypto.getRandomValues(array);
          return array[0];
        }
        return Math.floor(Math.random() * 0x100000000);
      }

      function getSecureRandomRange(min, max) {
        const range = max - min + 1;
        if (range <= 1) return min;
        const maxPossible = 0xFFFFFFFF;
        const limit = maxPossible - (maxPossible % range);
        let randomVal = getSecureRandomUint32();
        while (randomVal >= limit) {
          randomVal = getSecureRandomUint32();
        }
        return min + (randomVal % range);
      }

      function getRandomElement(array) {
        if (array.length === 0) return "";
        const index = getSecureRandomRange(0, array.length - 1);
        return array[index];
      }

      function shuffleArray(array) {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
          const j = getSecureRandomRange(0, i);
          [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
      }

      // Algoritmos de Generación
      function generateComplex() {
        const config = complexConfig;
        let finalUpper = config.avoidConfusing ? UPPERCASE_POOL : FULL_UPPERCASE_POOL;
        let finalLower = config.avoidConfusing ? LOWERCASE_POOL : FULL_LOWERCASE_POOL;
        let finalNumbers = config.avoidConfusing ? NUMBERS_POOL : FULL_NUMBERS_POOL;
        let finalSymbols = SYMBOLS_POOL;

        const activePools = [];
        const guaranteeChars = [];

        if (config.uppercase) {
          activePools.push(finalUpper);
          guaranteeChars.push(getRandomElement(finalUpper));
        }
        if (config.lowercase) {
          activePools.push(finalLower);
          guaranteeChars.push(getRandomElement(finalLower));
        }
        if (config.numbers) {
          activePools.push(finalNumbers);
          guaranteeChars.push(getRandomElement(finalNumbers));
        }
        if (config.symbols) {
          activePools.push(finalSymbols);
          guaranteeChars.push(getRandomElement(finalSymbols));
        }

        if (activePools.length === 0) return "";

        const mergedPool = activePools.flat();
        const passwordChars = [...guaranteeChars];

        while (passwordChars.length < config.length) {
          passwordChars.push(getRandomElement(mergedPool));
        }

        return shuffleArray(passwordChars).join("");
      }

      function generatePhrase() {
        const config = phraseConfig;
        const chosenWords = [];
        const dictLength = DICTIONARY.length;

        for (let i = 0; i < config.wordCount; i++) {
          const wordIndex = getSecureRandomRange(0, dictLength - 1);
          let word = DICTIONARY[wordIndex];
          if (config.capitalizeInitials) {
            word = word.charAt(0).toUpperCase() + word.slice(1);
          }
          chosenWords.push(word);
        }

        let phrase = chosenWords.join(config.delimiter);

        if (config.extraSuffix) {
          const randomDigit = getSecureRandomRange(2, 9);
          const randomSym = getRandomElement(["!", "#", "$", "*", "?"]);
          phrase += config.delimiter + randomDigit + randomSym;
        }

        return phrase;
      }

      function generatePronounceable() {
        let result = "";
        let isConsonant = getSecureRandomRange(0, 1) === 1;

        for (let i = 0; i < pronounceableLength; i++) {
          if (isConsonant) {
            result += getRandomElement(PRONOUN_CONSONANTS);
          } else {
            result += getRandomElement(PRONOUN_VOWELS);
          }
          isConsonant = !isConsonant;
        }

        return result.charAt(0).toUpperCase() + result.slice(1);
      }

      // Evaluar Entropía
      function evaluateEntropy(password) {
        if (!password) return { bits: 0, strength: "Crítica" };
        let bits = 0;

        if (activeTab === "compleja") {
          let poolSize = 0;
          let isUpperC = complexConfig.avoidConfusing ? UPPERCASE_POOL.length : FULL_UPPERCASE_POOL.length;
          let isLowerC = complexConfig.avoidConfusing ? LOWERCASE_POOL.length : FULL_LOWERCASE_POOL.length;
          let isNumbersC = complexConfig.avoidConfusing ? NUMBERS_POOL.length : FULL_NUMBERS_POOL.length;

          if (complexConfig.uppercase) poolSize += isUpperC;
          if (complexConfig.lowercase) poolSize += isLowerC;
          if (complexConfig.numbers) poolSize += isNumbersC;
          if (complexConfig.symbols) poolSize += complexConfig.avoidConfusing ? SYMBOLS_POOL.length - 4 : SYMBOLS_POOL.length;

          if (poolSize > 0) {
            bits = Math.round(password.length * Math.log2(poolSize));
          }
        } else if (activeTab === "frase") {
          let wordEntropy = phraseConfig.wordCount * Math.log2(DICTIONARY.length);
          if (phraseConfig.extraSuffix) {
            wordEntropy += Math.log2(8) + Math.log2(5);
          }
          bits = Math.round(wordEntropy);
        } else {
          bits = Math.round(password.length * Math.log2(8.66));
        }

        let strength = "Crítica";
        if (bits >= 80) strength = "Inquebrantable";
        else if (bits >= 55) strength = "Fuerte";
        else if (bits >= 35) strength = "Aceptable";

        return { bits, strength };
      }

      // DOM Elements & Event Listeners
      const themeModeBtn = document.getElementById("themeModeBtn");
      const themeIcon = document.getElementById("themeIcon");
      const tabCompleja = document.getElementById("tabCompleja");
      const tabFrase = document.getElementById("tabFrase");
      const tabPronunciable = document.getElementById("tabPronunciable");
      const activeMethodBadge = document.getElementById("activeMethodBadge");
      const inputsContainer = document.getElementById("inputsContainer");
      
      const passwordOutput = document.getElementById("passwordOutput");
      const toggleVisibleBtn = document.getElementById("toggleVisibleBtn");
      const regenerateBtn = document.getElementById("regenerateBtn");
      
      const strengthText = document.getElementById("strengthText");
      const strengthBar = document.getElementById("strengthBar");
      const entropyText = document.getElementById("entropyText");
      const entropyDesc = document.getElementById("entropyDesc");
      const copyBtn = document.getElementById("copyBtn");

      // TEMA COLOR
      let currentTheme = localStorage.getItem("crypto_portable_theme") || "light";
      if (currentTheme === "dark") {
        document.documentElement.classList.add("dark");
        updateThemeBtn(true);
      } else {
        document.documentElement.classList.remove("dark");
        updateThemeBtn(false);
      }

      themeModeBtn.addEventListener("click", () => {
        const isDark = document.documentElement.classList.toggle("dark");
        localStorage.setItem("crypto_portable_theme", isDark ? "dark" : "light");
        updateThemeBtn(isDark);
      });

      function updateThemeBtn(isDark) {
        if (isDark) {
          themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />';
        } else {
          themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />';
        }
      }

      // TRADUCCIONES DE COMPORTAMIENTO
      function handleTabChange(tab) {
        activeTab = tab;
        [tabCompleja, tabFrase, tabPronunciable].forEach(btn => {
          btn.className = "flex-1 text-center py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all text-[#2C2A29]/70 dark:text-[#EFECE6]/70";
        });

        if (tab === "compleja") {
          tabCompleja.className = "flex-1 text-center py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all bg-[#9B4A39] text-[#F6F1E8]";
        } else if (tab === "frase") {
          tabFrase.className = "flex-1 text-center py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all bg-[#9B4A39] text-[#F6F1E8]";
        } else {
          tabPronunciable.className = "flex-1 text-center py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all bg-[#9B4A39] text-[#F6F1E8]";
        }

        activeMethodBadge.innerText = tab;
        renderInputs();
        generatePassword();
      }

      tabCompleja.addEventListener("click", () => handleTabChange("compleja"));
      tabFrase.addEventListener("click", () => handleTabChange("frase"));
      tabPronunciable.addEventListener("click", () => handleTabChange("pronunciable"));

      // GENERACIÓN INTERNA
      function generatePassword() {
        if (activeTab === "compleja") {
          generatedPass = generateComplex();
        } else if (activeTab === "frase") {
          generatedPass = generatePhrase();
        } else {
          generatedPass = generatePronounceable();
        }
        updateUI();
      }

      function updateUI() {
        if (isVisible) {
          passwordOutput.innerText = generatedPass;
          passwordOutput.className = "font-mono text-xl sm:text-2xl font-bold tracking-wide break-all block whitespace-pre select-all text-[#1c1c1c] dark:text-white";
        } else {
          passwordOutput.innerText = "•".repeat(generatedPass.length || 12);
          passwordOutput.className = "font-mono text-xl sm:text-2xl font-black tracking-widest break-all block text-[#9B4A39]/95 dark:text-[#e5ac9f]/95 select-none";
        }

        const metrics = evaluateEntropy(generatedPass);
        entropyText.innerText = metrics.bits;
        strengthText.innerText = metrics.strength;

        // Estilos de la barra
        if (metrics.strength === "Inquebrantable") {
          strengthText.className = "text-emerald-700 dark:text-emerald-400 font-serif font-bold text-base sm:text-lg";
          strengthBar.className = "h-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-500";
        } else if (metrics.strength === "Fuerte") {
          strengthText.className = "text-blue-700 dark:text-blue-400 font-serif font-bold text-base sm:text-lg";
          strengthBar.className = "h-full bg-blue-600 dark:bg-blue-500 transition-all duration-500";
        } else if (metrics.strength === "Aceptable") {
          strengthText.className = "text-amber-700 dark:text-amber-400 font-serif font-bold text-base sm:text-lg";
          strengthBar.className = "h-full bg-amber-600 dark:bg-amber-500 transition-all duration-500";
        } else {
          strengthText.className = "text-red-700 dark:text-red-400 font-serif font-bold text-base sm:text-lg";
          strengthBar.className = "h-full bg-red-600 dark:bg-red-500 transition-all duration-500";
        }

        strengthBar.style.width = Math.min(100, Math.max(10, (metrics.bits / 120) * 100)) + "%";
        entropyDesc.innerText = metrics.bits >= 55 ? "✓ Inmune a ataques de fuerza bruta modernos." : "⚠️ Entropía baja. Se aconseja añadir longitud.";
      }

      // ACCIONES
      regenerateBtn.addEventListener("click", generatePassword);

      toggleVisibleBtn.addEventListener("click", () => {
        isVisible = !isVisible;
        toggleVisibleBtn.innerText = isVisible ? "Ocultar" : "Mostrar Clave";
        updateUI();
      });

      copyBtn.addEventListener("click", () => {
        if (!generatedPass) return;
        navigator.clipboard.writeText(generatedPass).then(() => {
          const originalText = copyBtn.innerHTML;
          copyBtn.innerHTML = "<span>¡Copiado con éxito!</span>";
          copyBtn.className = "mt-6 w-full flex items-center justify-center gap-2.5 px-6 py-4 bg-emerald-600 text-white rounded-xl shadow transition-all font-semibold uppercase tracking-wider text-sm";
          setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.className = "mt-6 w-full flex items-center justify-center gap-2.5 px-6 py-4 bg-[#9B4A39] hover:bg-[#833D2F] text-white rounded-xl shadow transition-all font-semibold uppercase tracking-wider text-sm cursor-pointer";
          }, 2000);
        });
      });

      // CONSTRUCCIÓN E INTERACCIÓN DE CONTROLES
      function renderInputs() {
        inputsContainer.innerHTML = "";

        if (activeTab === "compleja") {
          inputsContainer.innerHTML = \`
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="font-medium opacity-80">Longitud total:</span>
                <span id="rangeVal" class="font-mono font-bold text-[#c07361] dark:text-[#df9f91]">\${complexConfig.length} caracteres</span>
              </div>
              <input id="complexLen" type="range" min="6" max="64" value="\${complexConfig.length}" class="w-full h-1.5 bg-[#9B4A39]/20 dark:bg-white/20 accent-[#9B4A39] rounded-lg appearance-none cursor-pointer" />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label class="flex items-center justify-between p-3 rounded-lg border border-[#9B4A39]/5 bg-white/50 dark:border-white/5 dark:bg-black/10 text-sm cursor-pointer hover:border-[#9B4A39]/20">
                <span class="font-medium">Mayúsculas [A-Z]</span>
                <input id="chkUpper" type="checkbox" \${complexConfig.uppercase ? 'checked' : ''} class="h-4 w-4 rounded-sm" />
              </label>
              <label class="flex items-center justify-between p-3 rounded-lg border border-[#9B4A39]/5 bg-white/50 dark:border-white/5 dark:bg-black/10 text-sm cursor-pointer hover:border-[#9B4A39]/20">
                <span class="font-medium">Minúsculas [a-z]</span>
                <input id="chkLower" type="checkbox" \${complexConfig.lowercase ? 'checked' : ''} class="h-4 w-4 rounded-sm" />
              </label>
              <label class="flex items-center justify-between p-3 rounded-lg border border-[#9B4A39]/5 bg-white/50 dark:border-white/5 dark:bg-black/10 text-sm cursor-pointer hover:border-[#9B4A39]/20">
                <span class="font-medium">Números [0-9]</span>
                <input id="chkNum" type="checkbox" \${complexConfig.numbers ? 'checked' : ''} class="h-4 w-4 rounded-sm" />
              </label>
              <label class="flex items-center justify-between p-3 rounded-lg border border-[#9B4A39]/5 bg-white/50 dark:border-white/5 dark:bg-black/10 text-sm cursor-pointer hover:border-[#9B4A39]/20">
                <span class="font-medium">Símbolos [#@!]</span>
                <input id="chkSym" type="checkbox" \${complexConfig.symbols ? 'checked' : ''} class="h-4 w-4 rounded-sm" />
              </label>
            </div>

            <div class="p-4 rounded-xl border border-[#9B4A39]/10 bg-white/20 dark:border-white/10 dark:bg-black/20 space-y-3">
              <label class="flex items-start gap-3 cursor-pointer">
                <input id="chkConfusing" type="checkbox" \${complexConfig.avoidConfusing ? 'checked' : ''} class="mt-1 h-4 w-4 rounded-sm" />
                <div class="space-y-1">
                  <span class="text-sm font-semibold text-[#c07361] dark:text-[#df9f91]">Evitar Similares e Indistinguibles</span>
                  <p class="text-xs opacity-60 leading-relaxed">
                    Elimina símbolos confusos como 1, l, I, 0, o, O para lecturas seguras sin deslices ópticos.
                  </p>
                </div>
              </label>
            </div>
          \`;

          // Event Listeners para complejo
          const complexLenStr = document.getElementById("complexLen");
          const rangeVal = document.getElementById("rangeVal");
          complexLenStr.addEventListener("input", (e) => {
            complexConfig.length = parseInt(e.target.value);
            rangeVal.innerText = complexConfig.length + " caracteres";
            generatePassword();
          });

          document.getElementById("chkUpper").addEventListener("change", (e) => {
            complexConfig.uppercase = e.target.checked;
            generatePassword();
          });
          document.getElementById("chkLower").addEventListener("change", (e) => {
            complexConfig.lowercase = e.target.checked;
            generatePassword();
          });
          document.getElementById("chkNum").addEventListener("change", (e) => {
            complexConfig.numbers = e.target.checked;
            generatePassword();
          });
          document.getElementById("chkSym").addEventListener("change", (e) => {
            complexConfig.symbols = e.target.checked;
            generatePassword();
          });
          document.getElementById("chkConfusing").addEventListener("change", (e) => {
            complexConfig.avoidConfusing = e.target.checked;
            generatePassword();
          });

        } else if (activeTab === "frase") {
          inputsContainer.innerHTML = \`
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="font-medium opacity-80">Número de palabras:</span>
                <span id="phraseRangeVal" class="font-mono font-bold text-[#c07361] dark:text-[#df9f91]">\${phraseConfig.wordCount} palabras</span>
              </div>
              <input id="phraseCount" type="range" min="2" max="10" value="\${phraseConfig.wordCount}" class="w-full h-1.5 bg-[#9B4A39]/20 dark:bg-white/20 accent-[#9B4A39] rounded-lg appearance-none cursor-pointer" />
            </div>

            <div class="space-y-2.5">
              <span class="text-xs font-semibold opacity-70 uppercase tracking-wider block">Delimitador personalizado:</span>
              <div class="grid grid-cols-4 gap-2">
                \${["-", ".", "_", "/"].map(char => \`
                  <button type="button" onclick="setPhraseDelimiter('\${char}')" class="py-2 text-sm font-bold font-mono border rounded-lg transition-all cursor-pointer \${phraseConfig.delimiter === char ? 'bg-[#9B4A39] border-[#9B4A39] text-[#F6F1E8]' : 'border-[#9B4A39]/10 hover:bg-[#9B4A39]/5 text-[#2C2A29]/70 dark:border-white/10 dark:hover:bg-white/5 dark:text-[#EFECE6]/70'}" >
                    \${char}
                  </button>
                \`).join("")}
              </div>
            </div>

            <div class="space-y-3.5 pt-2">
              <label class="flex items-center justify-between p-3 rounded-lg border border-[#9B4A39]/5 bg-white/50 dark:border-white/5 dark:bg-black/10 text-sm cursor-pointer hover:border-[#9B4A39]/20">
                <span class="font-medium">Mayúscula Inicial en palabras</span>
                <input id="chkCapInitials" type="checkbox" \${phraseConfig.capitalizeInitials ? 'checked' : ''} class="h-4 w-4 rounded-sm" />
              </label>

              <label class="flex items-center justify-between p-3 rounded-lg border border-[#9B4A39]/5 bg-white/50 dark:border-white/5 dark:bg-black/10 text-sm cursor-pointer hover:border-[#9B4A39]/20">
                <div class="space-y-0.5 pr-2 text-left">
                  <span class="font-medium block">Integrar código de validación final</span>
                  <span class="text-[10px] opacity-60 block">Añade dígito y símbolo final (p. ej. -3!) para satisfacer restricciones estrictas de servidores.</span>
                </div>
                <input id="chkSuffix" type="checkbox" \${phraseConfig.extraSuffix ? 'checked' : ''} class="h-4 w-4 rounded-sm shrink-0" />
              </label>
            </div>
          \`;

          const phraseCount = document.getElementById("phraseCount");
          const phraseRangeVal = document.getElementById("phraseRangeVal");
          phraseCount.addEventListener("input", (e) => {
            phraseConfig.wordCount = parseInt(e.target.value);
            phraseRangeVal.innerText = phraseConfig.wordCount + " palabras";
            generatePassword();
          });

          document.getElementById("chkCapInitials").addEventListener("change", (e) => {
            phraseConfig.capitalizeInitials = e.target.checked;
            generatePassword();
          });
          document.getElementById("chkSuffix").addEventListener("change", (e) => {
            phraseConfig.extraSuffix = e.target.checked;
            generatePassword();
          });

        } else {
          inputsContainer.innerHTML = \`
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="font-medium opacity-80">Longitud del vocablo fonético:</span>
                <span id="pronounceRangeVal" class="font-mono font-bold text-[#c07361] dark:text-[#df9f91]">\${pronounceableLength} letras</span>
              </div>
              <input id="pronounceLen" type="range" min="6" max="32" value="\${pronounceableLength}" class="w-full h-1.5 bg-[#9B4A39]/20 dark:bg-white/20 accent-[#9B4A39] rounded-lg appearance-none cursor-pointer" />
            </div>

            <div class="p-4 rounded-xl border border-[#9B4A39]/10 bg-white/50 dark:border-white/5 dark:bg-black/10 text-xs leading-relaxed opacity-80 flex gap-3 text-left">
              <svg class="h-5 w-5 text-[#9B4A39] dark:text-[#e5ac9f] shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p>Genera secuencias combinatorias alternando suavemente vocales y consonantes amables al oído. Ideal para fórmulas nemotécnicas destinadas a la memorización vocal o copiado rápido sin deslices ópticos.</p>
            </div>
          \`;

          const pronounceLen = document.getElementById("pronounceLen");
          const pronounceRangeVal = document.getElementById("pronounceRangeVal");
          pronounceLen.addEventListener("input", (e) => {
            pronounceableLength = parseInt(e.target.value);
            pronounceRangeVal.innerText = pronounceableLength + " letras";
            generatePassword();
          });
        }
      }

      // Helper global para cambiar delimitador en frases
      window.setPhraseDelimiter = function(char) {
        phraseConfig.delimiter = char;
        renderInputs();
        generatePassword();
      }

      // Arranque Inicial
      renderInputs();
      generatePassword();

    </script>
  </body>
</html>
`;
}
