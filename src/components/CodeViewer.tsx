import React, { useState, useMemo, useEffect } from 'react';
import {
  Copy,
  Check,
  Eye,
  Code as CodeIcon,
  RotateCcw,
  Sparkles,
  Sliders,
  Edit3,
  CheckCircle2,
  Terminal
} from 'lucide-react';

interface CodeViewerProps {
  code: string;
  language: string;
  title?: string;
  allowPreview?: boolean;
  className?: string;
}

const CodeViewerBase: React.FC<CodeViewerProps> = ({
  code,
  language,
  title,
  allowPreview = true,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [key, setKey] = useState(0);
  const [customHtml, setCustomHtml] = useState<string>('');
  const [showHtmlEditor, setShowHtmlEditor] = useState(false);

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

  const isWebCode = ['html', 'css', 'javascript', 'js', 'tsx', 'jsx', 'typescript', 'ts'].includes(
    language.toLowerCase()
  );

  // Fast, safe class extractor without dangerous lookahead or regex backtracking
  const parsedClasses = useMemo(() => {
    if (language.toLowerCase() !== 'css') return [];
    const matches = new Set<string>();
    const safeRegex = /\.([a-zA-Z][a-zA-Z0-9_-]{2,30})/g;
    let m;
    let count = 0;
    while ((m = safeRegex.exec(code)) !== null && count < 8) {
      const cls = m[1];
      if (!cls.startsWith('dark') && !cls.startsWith('theme') && !cls.startsWith('media')) {
        matches.add(cls);
        count++;
      }
    }
    return Array.from(matches);
  }, [code, language]);

  // Generate smart default HTML sandbox markup based on the CSS rules present
  const defaultGeneratedHtml = useMemo(() => {
    const lang = language.toLowerCase();
    if (lang !== 'css') return '';

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
  <h3 style="margin-top: 0;">Card / Box (.${cls})</h3>
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
  <h2 style="margin-top: 0;">Anteprima CSS</h2>
  <p>Le regole CSS definite nello snippet sono applicate a questo documento.</p>
  <button style="padding: 8px 16px; border-radius: 8px; cursor: pointer;">Pulsante di Prova</button>
</div>`;
  }, [code, language, parsedClasses]);

  // Reset custom HTML when code changes
  useEffect(() => {
    setCustomHtml('');
  }, [code]);

  // Active HTML for CSS preview
  const activePreviewHtml = customHtml.trim() ? customHtml : defaultGeneratedHtml;

  // Generate rich preview document ONLY when live preview is open
  const previewDoc = useMemo(() => {
    if (!showLivePreview) return '';
    const lang = language.toLowerCase();

    // 1. HTML / Tailwind
    if (lang === 'html') {
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

    // 2. CSS (Dynamic runner with real-time selector execution & HTML sandbox)
    if (lang === 'css') {
      // If the snippet is already full HTML with <style> or <div>, render it directly
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
      transition: background 0.25s ease, color 0.25s ease;
    }

    /* CUSTOM SNIPPET CSS RULES */
    ${code}
  </style>
</head>
<body>
  ${activePreviewHtml}
</body>
</html>`;
    }

    // 3. React (TSX / JSX)
    if (lang === 'tsx' || lang === 'jsx' || lang === 'react') {
      const cleanCode = code
        .replace(/import\s+.*?from\s+['"].*?['"];?/g, '')
        .replace(/export\s+default\s+/g, 'const AppRoot = ')
        .replace(/export\s+function\s+/g, 'function ')
        .replace(/export\s+const\s+/g, 'const ');

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
    body { font-family: system-ui, -apple-system, sans-serif; background: #f8fafc; padding: 20px; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect, useReducer, useMemo, useCallback, useRef, createContext, useContext } = React;

    try {
      ${cleanCode}

      let ComponentToRender = null;
      if (typeof AppRoot !== 'undefined') {
        ComponentToRender = AppRoot;
      } else if (typeof StudyCounter !== 'undefined') {
        ComponentToRender = StudyCounter;
      } else if (typeof QuickNoteForm !== 'undefined') {
        ComponentToRender = function DemoQuickNote() {
          const [notes, setNotes] = useState(['Primo appunto React memorizzato']);
          return (
            <div className="space-y-4">
              <QuickNoteForm onSave={(n) => setNotes(prev => [n, ...prev])} />
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <h5 className="text-xs font-bold text-slate-700 mb-2">Lista Appunti Live:</h5>
                <ul className="text-xs space-y-1.5">
                  {notes.map((note, i) => (
                    <li key={i} className="p-2 bg-white rounded-lg border border-slate-200 text-slate-700 shadow-2xs">
                      📌 {note}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        };
      } else if (typeof useFetch !== 'undefined') {
        ComponentToRender = function DemoUseFetch() {
          const { data, loading, error } = useFetch('https://jsonplaceholder.typicode.com/todos/1');
          return (
            <div className="p-5 bg-white rounded-2xl border border-sky-200 shadow-xs">
              <span className="text-xs font-bold text-sky-800 bg-sky-100 px-2.5 py-1 rounded-full">
                Demo Custom Hook useFetch
              </span>
              <h4 className="text-sm font-bold text-slate-800 mt-3 mb-1">Dati recuperati dall'API:</h4>
              {loading && <p className="text-xs text-slate-500 animate-pulse">⏳ Caricamento dati in corso...</p>}
              {error && <p className="text-xs text-red-500 font-mono">❌ {error}</p>}
              {data && (
                <div className="mt-2 text-xs font-mono bg-slate-900 text-sky-300 p-3 rounded-xl">
                  <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
              )}
            </div>
          );
        };
      } else if (typeof useLocalStorage !== 'undefined') {
        ComponentToRender = function DemoUseLocalStorage() {
          const [val, setVal] = useLocalStorage('demo-key', 'Valore di prova sincronizzato');
          return (
            <div className="rounded-2xl border border-sky-200 bg-white p-6 shadow-sm">
              <span className="inline-block rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800 mb-3">
                Demo Hook useLocalStorage
              </span>
              <h3 className="text-base font-bold text-slate-900 mb-2">Valore salvato reattivo:</h3>
              <p className="font-mono text-sm bg-slate-100 p-3 rounded-xl text-slate-800 mb-4">{val}</p>
              <input
                type="text"
                value={val}
                onChange={e => setVal(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-sky-500"
                placeholder="Modifica valore nel localStorage..."
              />
            </div>
          );
        };
      } else if (typeof studyReducer !== 'undefined') {
        ComponentToRender = function DemoReducer() {
          const [state, dispatch] = useReducer(studyReducer, { isStudying: false, seconds: 0, activeSubject: 'React' });
          useEffect(() => {
            let timer;
            if (state.isStudying) {
              timer = setInterval(() => dispatch({ type: 'TICK' }), 1000);
            }
            return () => clearInterval(timer);
          }, [state.isStudying]);

          return (
            <div className="rounded-2xl border border-indigo-200 bg-white p-6 shadow-sm">
              <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-800 mb-3">
                Demo Pattern useReducer
              </span>
              <h3 className="text-base font-bold text-slate-900 mb-1">Materia attiva: {state.activeSubject}</h3>
              <div className="font-mono text-3xl font-black text-indigo-600 my-3">{state.seconds} secondi</div>
              <div className="flex gap-2">
                <button
                  onClick={() => dispatch({ type: 'START', subject: 'React & Redux' })}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 cursor-pointer"
                >
                  {state.isStudying ? 'In Corso' : 'Avvia Sessione'}
                </button>
                <button
                  onClick={() => dispatch({ type: 'RESET' })}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>
          );
        };
      }

      if (ComponentToRender) {
        ReactDOM.createRoot(document.getElementById('root')).render(<ComponentToRender />);
      } else {
        ReactDOM.createRoot(document.getElementById('root')).render(
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-medium text-emerald-800">
            ✅ Componente o hook React caricato ed eseguito correttamente!
          </div>
        );
      }
    } catch (err) {
      ReactDOM.createRoot(document.getElementById('root')).render(
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-xs font-mono text-red-700">
          ❌ Errore compilazione/esecuzione React: {err.message}
        </div>
      );
    }
  </script>
</body>
</html>`;
    }

    // 4. JavaScript
    if (lang === 'javascript' || lang === 'js') {
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
    }
    .header {
      color: #94a3b8;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #1e293b;
      font-size: 11px;
      font-weight: bold;
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
  <div class="header">⚡ Output console e test interattivo JavaScript:</div>

  <div class="interactive-box">
    <div style="color: #cbd5e1; font-weight: bold; margin-bottom: 6px;">Campo di Test Interattivo (ID: searchInput)</div>
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

    return '';
  }, [code, language, activePreviewHtml]);

  return (
    <div className={`overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900 shadow-md ${className}`}>
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 py-2.5">
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

        <div className="flex items-center gap-1.5">
          {allowPreview && isWebCode && (
            <button
              onClick={() => setShowLivePreview(!showLivePreview)}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                showLivePreview
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              title="Mostra / Nascondi Anteprima Live"
            >
              {showLivePreview ? <CodeIcon className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              <span>{showLivePreview ? 'Mostra Codice' : 'Live Preview'}</span>
            </button>
          )}

          {showLivePreview && language.toLowerCase() === 'css' && (
            <button
              onClick={() => setShowHtmlEditor(!showHtmlEditor)}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                showHtmlEditor
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              title="Personalizza markup HTML di test per questo CSS"
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>HTML Sandbox</span>
            </button>
          )}

          {showLivePreview && (
            <button
              onClick={() => setKey(prev => prev + 1)}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition"
              title="Ricarica Anteprima"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}

          <button
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
      {showLivePreview && showHtmlEditor && language.toLowerCase() === 'css' && (
        <div className="border-b border-slate-800 bg-slate-950 p-3">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-semibold text-purple-300 flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5" /> Modifica Markup HTML di Prova per il tuo CSS:
            </span>
            <button
              onClick={() => setCustomHtml(defaultGeneratedHtml)}
              className="text-[11px] text-slate-400 hover:text-slate-200 underline"
            >
              Ripristina HTML Predefinito
            </button>
          </div>
          <textarea
            value={customHtml || defaultGeneratedHtml}
            onChange={e => setCustomHtml(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2 font-mono text-xs text-slate-200 focus:border-purple-400 focus:outline-hidden"
            placeholder="Incolla o modifica qui l'HTML per testare le tue classi CSS..."
          />
        </div>
      )}

      {/* Main Content: Live Preview or Code Highlighting */}
      {showLivePreview && previewDoc ? (
        <div className="bg-slate-950 p-2">
          <iframe
            key={`${key}-${language}-${code.length}`}
            srcDoc={previewDoc}
            title="Live Preview"
            sandbox="allow-scripts allow-modals"
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
