import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Check, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const InstallPwaBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already standalone
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(isStandaloneMode);

    // Check if iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  if (isStandalone || isDismissed || isInstalled) {
    return null;
  }

  // Show banner if install prompt is ready or if on iOS browser
  if (!deferredPrompt && !isIos) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white px-4 py-2.5 shadow-md">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/30 text-indigo-300 ring-1 ring-white/20">
            <Smartphone className="h-4 w-4" />
          </div>
          <div>
            <span className="font-bold block sm:inline mr-1.5 text-white">
              Installa DevStudy come App (PWA):
            </span>
            <span className="text-indigo-200 text-[11px]">
              {isIos && !deferredPrompt
                ? 'Tocca Condividi e seleziona "Aggiungi a schermata Home" per usarlo a schermo intero offline.'
                : 'Accedi istantaneamente dal desktop o smartphone, con supporto offline completo.'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-1.5 text-xs font-bold text-indigo-900 shadow-xs hover:bg-indigo-50 active:scale-95 transition"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Installa App</span>
            </button>
          )}

          {isIos && !deferredPrompt && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-indigo-200">
              <Share className="h-3 w-3" />
              <span>Condividi → Aggiungi a Home</span>
            </span>
          )}

          <button
            onClick={() => setIsDismissed(true)}
            className="rounded-lg p-1.5 text-indigo-300 hover:bg-white/10 hover:text-white transition"
            title="Chiudi"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
