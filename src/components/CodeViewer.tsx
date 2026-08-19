import React, { useState, useMemo, useEffect } from 'react';
import {
  Copy,
  Check,
  Eye,
  Code as CodeIcon,
  RotateCcw,
  Sliders,
  Play,
  Terminal,
  Layers,
  Sparkles,
  Maximize2,
  ExternalLink
} from 'lucide-react';

export interface CodeViewerProps {
  code: string;
  language: string;
  title?: string;
  allowPreview?: boolean;
  initialShowPreview?: boolean;
  customHtml?: string;
  onSaveCustomHtml?: (html: string) => void;
  className?: string;
}

const CodeViewerBase: React.FC<CodeViewerProps> = ({
  code,
  language,
  title,
  allowPreview = true,
  initialShowPreview = false,
  customHtml: propCustomHtml,
  onSaveCustomHtml,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>(
    initialShowPreview ? 'preview' : 'code'
  );
  const [key, setKey] = useState(0);
  const [htmlContent, setHtmlContent] = useState<string>(propCustomHtml || '');
  const [showHtmlEditor, setShowHtmlEditor] = useState(false);
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);

  // Sync propCustomHtml when it changes from outside
  useEffect(() => {
    if (propCustomHtml !== undefined) {
      setHtmlContent(propCustomHtml);
    }
  }, [propCustomHtml]);

  // Sync initialShowPreview when prop changes
  useEffect(() => {
    if (initialShowPreview) {
      setActiveTab('preview');
    }
  }, [initialShowPreview]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const langNorm = (language || 'plaintext').toLowerCase().trim();

  const isPreviewable = useMemo(() => {
    return [
      'html',
      'htm',
      'css',
      'javascript',
      'js',
      'tsx',
      'jsx',
      'typescript',
      'ts',
      'react',
      'tailwind',
      'python',
      'py'
    ].includes(langNorm);
  }, [langNorm]);

  // Fast and safe CSS class extractor
  const parsedClasses = useMemo(() => {
    if (langNorm !== 'css') return [];
    const matches = new Set<string>();
    const safeRegex = /\.([a-zA-Z][a-zA-Z0-9_-]{2,30})/g;
    let m;
    let count = 0;
    while ((m = safeRegex.exec(code)) !== null && count < 10) {
      const cls = m[1];
      if (!cls.startsWith('dark') && !cls.startsWith('theme') && !cls.startsWith('media')) {
        matches.add(cls);
        count++;
      }
    }
    return Array.from(matches);
  }, [code, langNorm]);

  // Generate smart default HTML sandbox markup based on the CSS rules present
  const defaultGeneratedHtml = useMemo(() => {
    if (langNorm !== 'css') return '';
    const lowerCode = code.toLowerCase();

    // 1. Glow Buttons
    if (lowerCode.includes('btn-glow') || lowerCode.includes('glow-container') || lowerCode.includes('btn-outline-glow')) {
      return `<div class="glow-container">
  <button class="btn-glow">Pulsante Neon Glow ✨</button>
  <button class="btn-outline-glow">Bordo Neon ⚡</button>
  <button class="btn-glow" style="filter: hue-rotate(90deg);">Variante Smeraldo 🌿</button>
</div>`;
    }

    // 2. Glassmorphism Card
    if (lowerCode.includes('glass-card') || lowerCode.includes('glass-wrapper') || lowerCode.includes('backdrop-filter')) {
      return `<div class="glass-wrapper">
  <div class="glass-card">
    <span class="glass-badge">PRO LEVEL</span>
    <h3 class="glass-title">Glassmorphism Card</h3>
    <p class="glass-text">Effetto vetro smerigliato moderno con sfocatura dinamica dello sfondo (backdrop-filter) e bordi traslucidi.</p>
    <button style="background: rgba(255,255,255,0.25); border: 1px solid rgba(255,255,255,0.4); color: white; padding: 6px 14px; border-radius: 8px; font-weight: bold; cursor: pointer;">
      Interagisci
    </button>
  </div>
</div>`;
    }

    // 3. Grid Layout
    if (lowerCode.includes('card-grid') || lowerCode.includes('grid-card') || lowerCode.includes('grid-template-columns')) {
      return `<div class="card-grid">
  <div class="grid-card">
    <div class="grid-card-tag">CSS Grid</div>
    <h4 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #0f172a;">Card Reattiva 1</h4>
    <p style="font-size: 13px; color: #64748b; margin: 0 0 12px 0;">Ridimensiona la finestra per vedere le colonne adattarsi senza media query.</p>
    <span style="font-size: 11px; background: #eff6ff; color: #2563eb; padding: 3px 8px; border-radius: 6px; font-weight: bold;">Auto-fit</span>
  </div>
  <div class="grid-card">
    <div class="grid-card-tag">Transizioni 3D</div>
    <h4 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #0f172a;">Card Reattiva 2</h4>
    <p style="font-size: 13px; color: #64748b; margin: 0 0 12px 0;">Passa il mouse sopra per notare l'effetto di sollevamento e ombra profonda.</p>
    <span style="font-size: 11px; background: #fdf2f8; color: #db2777; padding: 3px 8px; border-radius: 6px; font-weight: bold;">Hover Lift</span>
  </div>
</div>`;
    }

    // 4. Fluid Typography & Hero Center
    if (lowerCode.includes('fluid-title') || lowerCode.includes('hero-center') || lowerCode.includes('clamp(')) {
      return `<div class="hero-center">
  <h1 class="fluid-title">Tipografia Fluida clamp()</h1>
  <p class="fluid-subtitle">
    Questo testo e il titolo scalano in modo continuo e armonioso in base alla larghezza dello schermo senza scatti.
  </p>
</div>`;
    }

    // 5. Pulse Status Badges
    if (lowerCode.includes('pulse-dot') || lowerCode.includes('status-badge') || lowerCode.includes('pulse-ring')) {
      return `<div style="padding: 24px; display: flex; flex-direction: column; gap: 12px; align-items: flex-start;">
  <div class="status-badge">
    <span class="pulse-dot"></span>
    <span>Sistema Operativo & Live</span>
  </div>
  <div class="status-badge" style="background: #eff6ff; color: #1e40af; border-color: #bfdbfe;">
    <span class="pulse-dot" style="background-color: #3b82f6;"></span>
    <span>Sessione di Studio Attiva</span>
  </div>
</div>`;
    }

    // 6. Generic fallback based on parsed classes
    if (parsedClasses.length > 0) {
      return `<div style="padding: 20px; display: flex; flex-direction: column; gap: 16px;">
  <div style="font-size: 12px; font-weight: bold; color: #64748b; text-transform: uppercase;">Elementi con classi rilevate:</div>
  ${parsedClasses
    .map(cls => {
      if (cls.includes('btn') || cls.includes('button')) {
        return `<button class="${cls}">Pulsante (.${cls})</button>`;
      }
      if (cls.includes('card') || cls.includes('box') || cls.includes('container') || cls.includes('wrapper')) {
        return `<div class="${cls}">
  <h3 style="margin-top: 0; font-size: 16px; font-weight: bold;">Card / Box (.${cls})</h3>
  <p style="font-size: 13px; opacity: 0.85;">Contenuto di prova formattato con la classe CSS .${cls}</p>
</div>`;
      }
      if (cls.includes('badge') || cls.includes('pill') || cls.includes('tag')) {
        return `<div><span class="${cls}">Badge (.${cls})</span></div>`;
      }
      if (cls.includes('title') || cls.includes('heading')) {
        return `<h2 class="${cls}">Titolo (.${cls})</h2>`;
      }
      if (cls.includes('text') || cls.includes('sub')) {
        return `<p class="${cls}">Paragrafo di testo (.${cls})</p>`;
      }
      return `<div class="${cls}">Elemento con classe: <strong>.${cls}</strong></div>`;
    })
    .join('\n  ')}
</div>`;
    }

    return `<div style="padding: 24px;">
  <h3 style="margin-top: 0; color: #0f172a; font-size: 16px; font-weight: bold;">Anteprima CSS Attiva</h3>
  <p style="color: #64748b; font-size: 13px;">Le regole CSS definite nello snippet sono applicate a questo documento.</p>
  <button style="padding: 8px 16px; border-radius: 8px; background: #3b82f6; color: white; border: none; font-weight: bold; cursor: pointer;">
    Pulsante di Prova
  </button>
</div>`;
  }, [code, langNorm, parsedClasses]);

  const activePreviewHtml = (htmlContent && htmlContent.trim()) ? htmlContent : defaultGeneratedHtml;

  const handleSaveHtml = (textToSave?: string) => {
    const value = textToSave !== undefined ? textToSave : (htmlContent || defaultGeneratedHtml);
    if (onSaveCustomHtml) {
      onSaveCustomHtml(value);
      setIsSavedFeedback(true);
      setTimeout(() => setIsSavedFeedback(false), 2000);
    }
  };

  const handleResetHtml = () => {
    setHtmlContent('');
    if (onSaveCustomHtml) {
      onSaveCustomHtml('');
      setIsSavedFeedback(true);
      setTimeout(() => setIsSavedFeedback(false), 2000);
    }
  };

  // Generate self-contained HTML for live preview
  const previewDoc = useMemo(() => {
    if (activeTab !== 'preview') return '';

    // --- HTML / Tailwind ---
    if (langNorm === 'html' || langNorm === 'htm' || langNorm === 'tailwind') {
      if (code.includes('<html') || code.includes('<!DOCTYPE')) {
        return code;
      }
      return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; background: #f8fafc; color: #0f172a; }
  </style>
</head>
<body>
  ${code}
</body>
</html>`;
    }

    // --- CSS ---
    if (langNorm === 'css') {
      if (code.includes('<style>') || code.includes('<div') || code.includes('<section')) {
        return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 16px; background: #f8fafc; color: #0f172a; }
  </style>
</head>
<body>
  ${code}
</body>
</html>`;
      }

      return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 16px;
      background: #f8fafc;
      color: #0f172a;
    }
    /* SNIPPET CSS RULES */
    ${code}
  </style>
</head>
<body>
  ${activePreviewHtml}
</body>
</html>`;
    }

    // --- REACT (TSX / JSX / React) ---
    if (['tsx', 'jsx', 'react', 'typescript', 'ts'].includes(langNorm)) {
      return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; padding: 16px; margin: 0; color: #0f172a; }
  </style>
</head>
<body>
  <div id="root">
    <div style="padding: 16px; color: #64748b; font-size: 12px; font-family: sans-serif;">⏳ Inizializzazione anteprima React...</div>
  </div>

  <script>
    window.addEventListener('DOMContentLoaded', () => {
      const rootEl = document.getElementById('root');

      try {
        if (!window.Babel || !window.React || !window.ReactDOM) {
          throw new Error("Librerie React o Babel non disponibili.");
        }

        const rawCode = ${JSON.stringify(code)};

        // 1. Strip import statements and clean export keywords
        let preparedCode = rawCode
          .replace(/import\s+.*?from\s+['"].*?['"];?/g, '')
          .replace(/import\s+['"].*?['"];?/g, '')
          .replace(/export\s+default\s+/g, 'window.__DefaultExportComponent = ')
          .replace(/export\s+function\s+/g, 'function ')
          .replace(/export\s+const\s+/g, 'const ')
          .replace(/export\s+let\s+/g, 'let ')
          .replace(/export\s+class\s+/g, 'class ');

        // 2. Transpile TSX / JSX / TypeScript with Babel
        const transpiled = Babel.transform(preparedCode, {
          presets: [
            ['react', { runtime: 'classic' }],
            ['typescript', { isTSX: true, allExtensions: true }]
          ],
          filename: 'snippet.tsx'
        }).code;

        // 3. Destructure standard React hooks
        const {
          useState,
          useEffect,
          useReducer,
          useMemo,
          useCallback,
          useRef,
          createContext,
          useContext,
          useLayoutEffect,
          useId
        } = React;

        // 4. Helper to evaluate declared entities
        function getDeclaredEntity(name) {
          try {
            const evalFn = new Function(
              'React', 'ReactDOM', 'useState', 'useEffect', 'useReducer',
              'useMemo', 'useCallback', 'useRef', 'createContext', 'useContext',
              'useLayoutEffect', 'useId',
              transpiled + '; return (typeof ' + name + ' !== "undefined" ? ' + name + ' : null);'
            );
            return evalFn(React, ReactDOM, useState, useEffect, useReducer, useMemo, useCallback, useRef, createContext, useContext, useLayoutEffect, useId);
          } catch(e) {
            return null;
          }
        }

        // 5. Dynamic Detection
        let ComponentToRender = null;

        // Check for default export
        if (typeof window.__DefaultExportComponent === 'function') {
          ComponentToRender = window.__DefaultExportComponent;
        }

        // Check for named React components (PascalCase)
        if (!ComponentToRender) {
          const componentRegex = /(?:function|const|let|var|class)\s+([A-Z][a-zA-Z0-9_]*)/g;
          let match;
          const componentNames = [];
          while ((match = componentRegex.exec(rawCode)) !== null) {
            componentNames.push(match[1]);
          }

          for (const name of componentNames) {
            const ent = getDeclaredEntity(name);
            if (typeof ent === 'function') {
              const Comp = ent;
              ComponentToRender = function ComponentHarness() {
                const [actionLogs, setActionLogs] = useState([]);
                const handleAction = (payload) => {
                  const msg = typeof payload === 'string' ? payload : JSON.stringify(payload);
                  setActionLogs(prev => [msg, ...prev.slice(0, 3)]);
                };

                return (
                  <div className="space-y-4">
                    <Comp 
                      onSave={handleAction} 
                      onSubmit={handleAction} 
                      onClick={handleAction} 
                      onChange={handleAction}
                    />
                    {actionLogs.length > 0 && (
                      <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-3 max-w-sm">
                        <div className="text-[11px] font-bold text-sky-900 mb-1">📡 Callback Intercettato:</div>
                        <div className="space-y-1">
                          {actionLogs.map((log, idx) => (
                            <div key={idx} className="font-mono text-[11px] text-sky-800 bg-white/90 px-2 py-1 rounded border border-sky-100">
                              {log}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              };
              break;
            }
          }
        }

        // Check for Custom Hooks (useXxx)
        if (!ComponentToRender) {
          const hookRegex = /(?:function|const|let|var)\s+(use[A-Z][a-zA-Z0-9_]*)/g;
          let hookMatch;
          const hookNames = [];
          while ((hookMatch = hookRegex.exec(rawCode)) !== null) {
            hookNames.push(hookMatch[1]);
          }

          if (hookNames.length > 0) {
            const hookName = hookNames[0];
            const hookFn = getDeclaredEntity(hookName);

            if (typeof hookFn === 'function') {
              if (hookName === 'useLocalStorage') {
                ComponentToRender = function UseLocalStorageDemo() {
                  const [key, setKey] = useState('demo_study_key');
                  const [val, setVal] = hookFn(key, 'Sessione React attiva');
                  const [inputVal, setInputVal] = useState(val || '');

                  return (
                    <div className="rounded-2xl border border-sky-200 bg-white p-5 shadow-xs max-w-md">
                      <div className="flex items-center justify-between mb-3">
                        <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-800">
                          Hook: {hookName}
                        </span>
                        <span className="text-[11px] text-emerald-600 font-bold">● Sincronizzato con LocalStorage</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-800 mb-1">Test Interattivo useLocalStorage</h3>
                      <p className="text-xs text-slate-500 mb-3">Modifica il valore per testare la persistenza reattiva.</p>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Valore memorizzato:</label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              value={inputVal} 
                              onChange={e => setInputVal(e.target.value)}
                              className="flex-1 rounded-xl border border-slate-300 p-2 text-xs focus:ring-1 focus:ring-sky-500"
                            />
                            <button
                              type="button"
                              onClick={() => setVal(inputVal)}
                              className="rounded-xl bg-sky-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-sky-500 transition shadow-xs"
                            >
                              Salva
                            </button>
                          </div>
                        </div>

                        <div className="rounded-xl bg-slate-900 text-sky-300 p-3 font-mono text-xs">
                          <span className="text-slate-400">// Valore attuale nello state & localStorage:</span>
                          <div className="mt-1 font-bold text-white">"{val}"</div>
                        </div>
                      </div>
                    </div>
                  );
                };
              } else if (hookName === 'useFetch') {
                ComponentToRender = function UseFetchDemo() {
                  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/todos/1');
                  const { data, loading, error } = hookFn(url);

                  return (
                    <div className="rounded-2xl border border-sky-200 bg-white p-5 shadow-xs max-w-md">
                      <div className="flex items-center justify-between mb-3">
                        <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-800">
                          Hook: {hookName}
                        </span>
                        {loading && <span className="text-[11px] text-sky-600 animate-pulse font-semibold">Caricamento in corso...</span>}
                      </div>

                      <h3 className="text-sm font-bold text-slate-800 mb-1">Test Interattivo useFetch</h3>
                      <p className="text-xs text-slate-500 mb-2">Testa le chiamate asincrone con switch di endpoint:</p>
                      <div className="flex gap-1.5 mb-3">
                        <button 
                          onClick={() => setUrl('https://jsonplaceholder.typicode.com/todos/1')}
                          className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold hover:bg-slate-50"
                        >
                          Todo 1
                        </button>
                        <button 
                          onClick={() => setUrl('https://jsonplaceholder.typicode.com/todos/2')}
                          className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold hover:bg-slate-50"
                        >
                          Todo 2
                        </button>
                        <button 
                          onClick={() => setUrl('https://jsonplaceholder.typicode.com/users/1')}
                          className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold hover:bg-slate-50"
                        >
                          User 1
                        </button>
                      </div>

                      {error ? (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                          Errore: {error}
                        </div>
                      ) : (
                        <div className="rounded-xl bg-slate-900 p-3 font-mono text-xs text-sky-300 overflow-x-auto max-h-48">
                          <pre>{JSON.stringify(data, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  );
                };
              } else {
                // Generic Custom Hook Harness
                ComponentToRender = function GenericHookHarness() {
                  let hookResult = null;
                  let hookError = null;
                  try {
                    hookResult = hookFn('test_key', 0);
                  } catch(e) {
                    hookError = e.message;
                  }

                  return (
                    <div className="rounded-2xl border border-sky-200 bg-white p-5 shadow-xs max-w-md">
                      <span className="inline-block rounded-full bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-800 mb-2">
                        Custom Hook: {hookName}
                      </span>
                      <h3 className="text-sm font-bold text-slate-800 mb-2">Esecuzione Reattiva dell'Hook</h3>
                      {hookError ? (
                        <p className="text-xs text-amber-700 font-mono bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                          Hook compilato con successo. ({hookError})
                        </p>
                      ) : (
                        <div className="bg-slate-900 text-sky-300 p-3 rounded-xl font-mono text-xs overflow-x-auto">
                          <pre>{typeof hookResult === 'object' ? JSON.stringify(hookResult, null, 2) : String(hookResult)}</pre>
                        </div>
                      )}
                    </div>
                  );
                };
              }
            }
          }
        }

        // Check for Reducers (studyReducer, etc.)
        if (!ComponentToRender) {
          const reducerRegex = /(?:function|const|let|var)\s+([a-zA-Z0-9_]*[rR]educer)/g;
          let redMatch;
          const redNames = [];
          while ((redMatch = reducerRegex.exec(rawCode)) !== null) {
            redNames.push(redMatch[1]);
          }

          if (redNames.length > 0) {
            const redName = redNames[0];
            const redFn = getDeclaredEntity(redName);

            if (typeof redFn === 'function') {
              ComponentToRender = function ReducerHarness() {
                const initialState = { isStudying: false, seconds: 0, activeSubject: 'React & TypeScript' };
                const [state, dispatch] = useReducer(redFn, initialState);

                useEffect(() => {
                  let timer;
                  if (state.isStudying) {
                    timer = setInterval(() => {
                      dispatch({ type: 'TICK' });
                    }, 1000);
                  }
                  return () => clearInterval(timer);
                }, [state.isStudying]);

                return (
                  <div className="rounded-2xl border border-purple-200 bg-white p-5 shadow-xs max-w-md">
                    <div className="flex items-center justify-between mb-3">
                      <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-bold text-purple-800">
                        Reducer: {redName}
                      </span>
                      <span className={"text-[11px] font-bold " + (state.isStudying ? "text-emerald-600 animate-pulse" : "text-slate-400")}>
                        {state.isStudying ? '● In esecuzione (TICK)' : '○ In pausa'}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-800 mb-2">Test Live del Reducer</h3>
                    
                    <div className="rounded-xl bg-slate-900 p-3 font-mono text-xs text-purple-300 mb-4 overflow-x-auto">
                      <div className="text-slate-500 mb-1">// Stato attuale:</div>
                      <pre className="text-white font-bold">{JSON.stringify(state, null, 2)}</pre>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => dispatch({ type: 'START', subject: 'React Hooks & State' })}
                        className="rounded-xl bg-purple-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-purple-500 active:scale-95 transition"
                      >
                        Dispatch: START
                      </button>
                      <button
                        type="button"
                        onClick={() => dispatch({ type: 'TICK' })}
                        className="rounded-xl border border-purple-300 px-3 py-1.5 text-xs font-bold text-purple-700 hover:bg-purple-50 active:scale-95 transition"
                      >
                        Dispatch: TICK (+1)
                      </button>
                      <button
                        type="button"
                        onClick={() => dispatch({ type: 'RESET' })}
                        className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
                      >
                        Dispatch: RESET
                      </button>
                    </div>
                  </div>
                );
              };
            }
          }
        }

        // Render to Root
        if (ComponentToRender) {
          ReactDOM.createRoot(rootEl).render(React.createElement(ComponentToRender));
        } else {
          ReactDOM.createRoot(rootEl).render(
            React.createElement('div', { className: 'rounded-2xl bg-emerald-50 border border-emerald-200 p-5' }, [
              React.createElement('h4', { className: 'text-sm font-bold text-emerald-900 mb-1', key: 'h4' }, '✅ Codice React Compilato con Successo'),
              React.createElement('p', { className: 'text-xs text-emerald-700', key: 'p' }, 'Sintassi TSX e tipi verificati senza errori.')
            ])
          );
        }

      } catch (err) {
        rootEl.innerHTML = \`
          <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 16px; border-radius: 12px; font-family: monospace; font-size: 12px; color: #b91c1c;">
            <div style="font-weight: bold; margin-bottom: 6px;">❌ Errore di Compilazione / Esecuzione React:</div>
            <div>\${err.message}</div>
          </div>
        \`;
      }
    });
  </script>
</body>
</html>`;
    }

    // --- JAVASCRIPT ---
    if (langNorm === 'javascript' || langNorm === 'js') {
      const cleanJsCode = code
        .replace(/import\s+.*?from\s+['"].*?['"];?/g, '')
        .replace(/export\s+default\s+/g, '')
        .replace(/export\s+function\s+/g, 'function ')
        .replace(/export\s+const\s+/g, 'const ');

      return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      padding: 16px;
      background: #0f172a;
      color: #38bdf8;
      font-size: 12px;
      line-height: 1.5;
      margin: 0;
    }
    .header {
      color: #94a3b8;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #1e293b;
      font-size: 11px;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .log-line {
      margin-bottom: 6px;
      padding: 6px 10px;
      background: #1e293b;
      border-radius: 6px;
      word-break: break-all;
      border-left: 3px solid #38bdf8;
    }
    .interactive-box {
      background: #1e293b;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 16px;
      border: 1px solid #334155;
    }
    input {
      background: #0f172a;
      border: 1px solid #475569;
      color: white;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 12px;
      width: 100%;
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  <div class="header">
    <span>⚡ Console & Test Output JavaScript:</span>
    <button onclick="location.reload()" style="background:#334155; color:#cbd5e1; border:none; padding:3px 8px; border-radius:4px; cursor:pointer; font-size:10px;">Riesegui ▷</button>
  </div>

  <div class="interactive-box">
    <div style="color: #cbd5e1; font-weight: bold; margin-bottom: 6px; font-size: 11px;">Input interattivo (ID: searchInput)</div>
    <input type="text" id="searchInput" placeholder="Digita qui per testare funzioni, debounce o event listeners..." />
  </div>

  <div id="output"></div>

  <script>
    const output = document.getElementById('output');
    const originalLog = console.log;
    console.log = function(...args) {
      originalLog.apply(console, args);
      const div = document.createElement('div');
      div.className = 'log-line';
      div.innerText = '❯ ' + args.map(a => {
        if (typeof a === 'object') {
          try { return JSON.stringify(a, null, 2); } catch { return String(a); }
        }
        return a;
      }).join(' ');
      output.appendChild(div);
    };

    try {
      ${cleanJsCode}
    } catch (err) {
      const errDiv = document.createElement('div');
      errDiv.style.color = '#f87171';
      errDiv.className = 'log-line';
      errDiv.style.borderLeftColor = '#ef4444';
      errDiv.innerText = '❌ ' + err.message;
      output.appendChild(errDiv);
    }
  </script>
</body>
</html>`;
    }

    // --- PYTHON ---
    if (langNorm === 'python' || langNorm === 'py') {
      return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      padding: 16px;
      background: #0f172a;
      color: #38bdf8;
      font-size: 12px;
      line-height: 1.5;
      margin: 0;
    }
    .header {
      color: #94a3b8;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #1e293b;
      font-size: 11px;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .term-box {
      background: #090d16;
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 12px;
      min-height: 120px;
    }
    .prompt-line {
      color: #10b981;
      margin-bottom: 4px;
    }
    .out-line {
      color: #f1f5f9;
      margin-bottom: 4px;
    }
    .comment-line {
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="header">
    <span>🐍 Terminale Python & Simulatore di Output:</span>
    <span style="color: #10b981;">Python 3.12 (Interactive)</span>
  </div>

  <div class="term-box">
    <div class="prompt-line">>>> python3 script.py</div>
    <div id="term-content"></div>
  </div>

  <script>
    const term = document.getElementById('term-content');
    const pyCode = ${JSON.stringify(code)};

    // Simple, reliable client-side Python simulation for print statements and basic expressions
    const lines = pyCode.split('\\n');
    let hasOutput = false;

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Detect print(...)
      const printMatch = trimmed.match(/^print\\((.*)\\)$/);
      if (printMatch) {
        hasOutput = true;
        let content = printMatch[1].trim();
        // Remove outer quotes if basic string
        if ((content.startsWith('"') && content.endsWith('"')) || (content.startsWith("'") && content.endsWith("'"))) {
          content = content.slice(1, -1);
        }
        const div = document.createElement('div');
        div.className = 'out-line';
        div.innerText = content;
        term.appendChild(div);
      }
    });

    if (!hasOutput) {
      const div = document.createElement('div');
      div.className = 'comment-line';
      div.innerText = '# Script Python valido pronto per l\\'esecuzione (funzioni e classi caricate in memoria).';
      term.appendChild(div);
    }
  </script>
</body>
</html>`;
    }

    return '';
  }, [code, langNorm, activeTab, activePreviewHtml]);

  return (
    <div className={`overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900 shadow-md ${className}`}>
      {/* Header bar with Segmented Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 bg-slate-950 px-4 py-2.5">
        {/* Left: Window Dots & Title */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>
          {title && (
            <span className="ml-2 font-mono text-xs font-medium text-slate-300">
              {title}
            </span>
          )}
          <span className="ml-1 rounded-md bg-slate-800 px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {language}
          </span>
        </div>

        {/* Center/Right: Tabs & Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Segmented Tab: Codice vs Anteprima Live */}
          {allowPreview && isPreviewable && (
            <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('code')}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  activeTab === 'code'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Visualizza codice sorgente"
              >
                <CodeIcon className="h-3.5 w-3.5" />
                <span>Codice</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  activeTab === 'preview'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-sky-300'
                }`}
                title="Visualizza anteprima live interattiva"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Anteprima Live</span>
              </button>
            </div>
          )}

          {/* HTML Sandbox toggle for CSS */}
          {activeTab === 'preview' && langNorm === 'css' && (
            <button
              type="button"
              onClick={() => setShowHtmlEditor(!showHtmlEditor)}
              className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold transition ${
                showHtmlEditor
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              title="Personalizza markup HTML di test per questo CSS"
            >
              <Sliders className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">HTML Sandbox</span>
            </button>
          )}

          {/* Reload preview */}
          {activeTab === 'preview' && (
            <button
              type="button"
              onClick={() => setKey(prev => prev + 1)}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition"
              title="Ricarica Anteprima"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              copied
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
            title="Copia codice negli appunti"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copiato!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copia</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* HTML Sandbox Editor for CSS Live Testing */}
      {activeTab === 'preview' && showHtmlEditor && langNorm === 'css' && (
        <div className="border-b border-slate-800 bg-slate-950 p-3">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-purple-300 flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5" /> Markup HTML di Prova per il tuo CSS:
            </span>
            <div className="flex items-center gap-2">
              {isSavedFeedback && (
                <span className="text-[11px] font-bold text-emerald-400 animate-in fade-in">
                  ✓ HTML Salvato!
                </span>
              )}
              {onSaveCustomHtml && (
                <button
                  type="button"
                  onClick={() => handleSaveHtml()}
                  className="flex items-center gap-1 rounded-md bg-purple-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-2xs hover:bg-purple-500 active:scale-95 transition"
                  title="Salva permanentemente questo HTML nello snippet"
                >
                  <Check className="h-3 w-3" />
                  <span>Salva HTML</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleResetHtml}
                className="text-[11px] text-slate-400 hover:text-slate-200 underline"
                title="Ripristina il markup HTML generato automaticamente"
              >
                Ripristina Predefinito
              </button>
            </div>
          </div>
          <textarea
            value={htmlContent !== '' ? htmlContent : defaultGeneratedHtml}
            onChange={e => {
              setHtmlContent(e.target.value);
            }}
            onBlur={e => {
              if (onSaveCustomHtml) {
                handleSaveHtml(e.target.value);
              }
            }}
            rows={4}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            autoComplete="off"
            className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 font-mono text-xs text-slate-200 focus:border-purple-400 focus:outline-hidden leading-relaxed"
            placeholder="Incolla o modifica qui l'HTML per testare le tue classi CSS..."
          />
          <p className="mt-1 text-[10px] text-slate-500">
            💡 Suggerimento: Le modifiche all'HTML vengono salvate automaticamente nello snippet e ricordate nelle prossime sessioni.
          </p>
        </div>
      )}

      {/* Main Content: Live Preview or Code Highlighting */}
      {activeTab === 'preview' && previewDoc ? (
        <div className="bg-slate-950 p-2">
          <iframe
            key={`${key}-${langNorm}-${code.length}`}
            srcDoc={previewDoc}
            title="Live Preview"
            sandbox="allow-scripts allow-modals allow-same-origin"
            className="w-full min-h-[300px] h-[340px] rounded-xl border border-slate-800 bg-white"
          />
        </div>
      ) : (
        <div className="overflow-x-auto p-4 text-xs font-mono leading-relaxed text-slate-200">
          <pre className="tab-4 whitespace-pre">
            <code>{code}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

export const CodeViewer = React.memo(CodeViewerBase);
