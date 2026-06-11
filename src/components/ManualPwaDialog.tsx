import React from "react";
import { X, Smartphone, Monitor, ChevronRight, Download, Laptop, Copy, ShieldCheck } from "lucide-react";

interface ManualPwaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onNativeInstall: () => void;
  isInstallable: boolean; // Si detectamos beforeinstallprompt
}

export const ManualPwaDialog: React.FC<ManualPwaDialogProps> = ({
  isOpen,
  onClose,
  onNativeInstall,
  isInstallable,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#9B4A39]/20 bg-[#F6F1E8] text-[#2C2A29] shadow-xl dark:border-white/10 dark:bg-[#1E1E1E] dark:text-[#EFECE6] p-6 transition-all">
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#2C2A29]/50 hover:bg-[#9B4A39]/10 dark:text-[#EFECE6]/50 dark:hover:bg-white/10 transition-colors"
          title="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-[#9B4A39] text-[#F6F1E8] rounded-2xl dark:bg-[#F6F1E8] dark:text-[#1C1C1C]">
            <Download className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold tracking-tight">
              Instalar Premium Crypto Engine
            </h3>
            <p className="text-xs text-[#2C2A29]/60 dark:text-[#EFECE6]/60">
              Usa esta app sin cobertura, 100% aislado de internet y libre de rastreadores.
            </p>
          </div>
        </div>

        <p className="text-sm leading-relaxed mb-6">
          Esta aplicación soporta <strong className="font-sans text-[#9B4A39] dark:text-[#e5ac9f]">Progressive Web App (PWA)</strong>. Al instalarla, se añade un acceso directo a tu pantalla de inicio y se comporta como una aplicación móvil u de escritorio nativa ejecutándose de forma aislada.
        </p>

        {isInstallable ? (
          /* PWA Instalable por navegador */
          <div className="p-4 mb-6 rounded-xl bg-[#9B4A39]/10 border border-[#9B4A39]/20 dark:bg-white/5 dark:border-white/10">
            <h4 className="text-sm font-semibold flex items-center gap-2 mb-2 text-[#9B4A39] dark:text-[#e5ac9f]">
              <ShieldCheck className="h-4 w-4" />
              ¡Listo para instalación instantánea!
            </h4>
            <p className="text-xs text-[#2C2A29]/80 dark:text-[#EFECE6]/80 mb-3">
              Haz clic abajo para iniciar la autoinstalación en este navegador.
            </p>
            <button
              onClick={() => {
                onNativeInstall();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#9B4A39] hover:bg-[#833D2F] text-white font-medium text-sm rounded-xl shadow-sm transition-all hover:scale-[1.01] cursor-pointer"
            >
              <Download className="h-4 w-4" />
              Instalar en este Dispositivo
            </button>
          </div>
        ) : (
          /* Guía de instalación manual */
          <div className="space-y-4 mb-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#9B4A39]/80 dark:text-[#e5ac9f]/85">
              Guía de Instalación Manual
            </h4>

            {/* Apple iOS Safari */}
            <div className="flex items-start gap-3 p-3 rounded-xl border border-[#9B4A39]/5 bg-[#FAF7F2] dark:border-white/5 dark:bg-white/5">
              <Smartphone className="h-5 w-5 text-[#9B4A39] dark:text-[#e5ac9f] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-[#2C2A29] dark:text-[#EFECE6]">
                  En iPhone / iPad (Safari)
                </p>
                <p className="text-[11px] text-[#2C2A29]/70 dark:text-[#EFECE6]/70 mt-1">
                  1. Pulsa el botón de <strong className="font-semibold">Compartir</strong> (icono de cuadrado con flecha arriba) en el menú inferior.
                  <br />
                  2. Desliza hacia abajo y selecciona <strong className="font-semibold">"Añadir a pantalla de inicio"</strong>.
                </p>
              </div>
            </div>

            {/* Android / Chrome */}
            <div className="flex items-start gap-3 p-3 rounded-xl border border-[#9B4A39]/5 bg-[#FAF7F2] dark:border-white/5 dark:bg-white/5">
              <Smartphone className="h-5 w-5 text-[#9B4A39] dark:text-[#e5ac9f] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-[#2C2A29] dark:text-[#EFECE6]">
                  En Android / Chrome / Samsung
                </p>
                <p className="text-[11px] text-[#2C2A29]/70 dark:text-[#EFECE6]/70 mt-1">
                  1. Pulsa el botón de los <strong className="font-semibold">tres puntos vertical (...)</strong> en la barra de dirección.
                  <br />
                  2. Selecciona <strong className="font-semibold">"Instalar aplicación"</strong> o <strong className="font-semibold">"Añadir a pantalla de inicio"</strong>.
                </p>
              </div>
            </div>

            {/* Desktop macOS / Windows */}
            <div className="flex items-start gap-3 p-3 rounded-xl border border-[#9B4A39]/5 bg-[#FAF7F2] dark:border-white/5 dark:bg-white/5">
              <Monitor className="h-5 w-5 text-[#9B4A39] dark:text-[#e5ac9f] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-[#2C2A29] dark:text-[#EFECE6]">
                  En Ordenador (Chrome, Edge, Brave)
                </p>
                <p className="text-[11px] text-[#2C2A29]/70 dark:text-[#EFECE6]/70 mt-1">
                  En la barra de direcciones superior, pulsa el icono de <strong className="font-semibold">pantalla e instalación (⊕)</strong> junto al marcador de favoritos y acepta.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-[#9B4A39]/10 dark:border-white/10 pt-4 text-[11px]">
          <span className="text-[#2C2A29]/50 dark:text-[#EFECE6]/50">
            ✓ 100% Ejecución Local
          </span>
          <span className="text-[#2C2A29]/50 dark:text-[#EFECE6]/50">
            ✓ Cero Rastreadores
          </span>
          <span className="text-[#2C2A29]/50 dark:text-[#EFECE6]/50">
            ✓ Sin Conexión Necesaria
          </span>
        </div>
      </div>
    </div>
  );
};
