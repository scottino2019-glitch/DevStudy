import React, { useState } from 'react';
import { Copy, Check, Play, Eye, Code as CodeIcon, RotateCcw } from 'lucide-react';

interface CodeViewerProps {
  code: string;
  language: string;
  title?: string;
  allowPreview?: boolean;
  className?: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  code,
  language,
  title,
  allowPreview = true,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
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

  const isWebCode = ['html', 'css', 'javascript', 'tsx', 'jsx'].includes(language.toLowerCase());

  // Generate preview document if HTML/CSS/JS
  const getPreviewDoc = () => {
    if (language.toLowerCase() === 'html') {
      // Check if it already has html structure
      if (code.includes('<html') || code.includes('<!DOCTYPE')) {
        return code;
      }
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; background: #fafafa; color: #1e293b; }
  </style>
</head>
<body>
  ${code}
</body>
</html>`;
    }

    if (language.toLowerCase() === 'css') {
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; background: #fafafa; }
    ${code}
  </style>
</head>
<body>
  <div class="card-grid">
    <div class="card">
      <h3>Card di Anteprima 1</h3>
      <p>Questa è una dimostrazione interattiva delle regole CSS definite nello snippet.</p>
    </div>
    <div class="card">
      <h3>Card di Anteprima 2</h3>
      <p>Osserva l'effetto hover, la spaziatura e il layout dinamico.</p>
    </div>
  </div>
</body>
</html>`;
    }

    if (language.toLowerCase() === 'javascript') {
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: monospace; padding: 20px; background: #0f172a; color: #38bdf8; }
    .log-line { margin-bottom: 6px; padding: 4px 8px; background: #1e293b; border-radius: 4px; }
  </style>
</head>
<body>
  <div id="output">
    <div style="color: #94a3b8; margin-bottom: 12px;">/* Console output dell'esecuzione: */</div>
  </div>
  <script>
    const output = document.getElementById('output');
    const originalLog = console.log;
    console.log = function(...args) {
      originalLog.apply(console, args);
      const div = document.createElement('div');
      div.className = 'log-line';
      div.innerText = '❯ ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ');
      output.appendChild(div);
    };
    try {
      ${code}
    } catch (err) {
      const errDiv = document.createElement('div');
      errDiv.style.color = '#ef4444';
      errDiv.className = 'log-line';
      errDiv.innerText = '❌ Errore: ' + err.message;
      output.appendChild(errDiv);
    }
  </script>
</body>
</html>`;
    }

    return '';
  };

  const lines = code.split('\n');

  return (
    <div className={`overflow-hidden rounded-xl border border-slate-700/80 bg-slate-900 shadow-md ${className}`}>
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
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                showLivePreview
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              title="Mostra / Nascondi Anteprima Live"
            >
              {showLivePreview ? <CodeIcon className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              <span>{showLivePreview ? 'Codice' : 'Live Preview'}</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
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

      {/* Content: Code or Live Iframe */}
      {showLivePreview && isWebCode ? (
        <div className="relative bg-white min-h-[220px]">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100 px-3 py-1.5 text-xs text-slate-600">
            <span className="font-semibold">⚡ Anteprima Sandbox Live</span>
            <span className="text-[11px] text-slate-400">Ambiente sicuro isolato</span>
          </div>
          <iframe
            title="Snippet Live Preview"
            srcDoc={getPreviewDoc()}
            sandbox="allow-scripts"
            className="w-full h-64 border-0 bg-white"
          />
        </div>
      ) : (
        <div className="relative max-h-96 overflow-x-auto overflow-y-auto p-4 font-mono text-[13px] leading-relaxed text-slate-200">
          <div className="flex">
            {/* Line numbers */}
            <div className="select-none pr-4 text-right text-slate-600 font-mono">
              {lines.map((_, i) => (
                <div key={i} className="leading-6">
                  {i + 1}
                </div>
              ))}
            </div>
            {/* Code lines */}
            <div className="flex-1 overflow-x-auto">
              <pre className="m-0 p-0 font-mono text-slate-200 whitespace-pre">
                <code>{code}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
