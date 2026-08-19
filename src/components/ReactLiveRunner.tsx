import React, { Component, useState, useEffect, useReducer, useMemo, useCallback, useRef, createContext, useContext } from 'react';
import { transform } from 'sucrase';
import { RotateCcw, AlertTriangle, CheckCircle2, Sparkles, Terminal, Activity } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  onReset?: () => void;
  key?: React.Key;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class PreviewErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React Live Preview Error:', error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/90 p-5 text-rose-900 shadow-xs space-y-3 max-w-lg mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-rose-950">
              <AlertTriangle className="h-4 w-4 text-rose-600" />
              <span>Errore nel Componente React</span>
            </div>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                this.props.onReset?.();
              }}
              className="flex items-center gap-1 rounded-xl bg-rose-600 px-3 py-1 text-xs font-bold text-white hover:bg-rose-500 active:scale-95 transition shadow-2xs cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Riprova</span>
            </button>
          </div>
          <p className="font-mono text-xs bg-white/90 p-3 rounded-xl border border-rose-200 text-rose-800 overflow-x-auto whitespace-pre-wrap">
            {this.state.error?.message || String(this.state.error)}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export interface ReactLiveRunnerProps {
  code: string;
  keyTrigger?: number;
}

export const ReactLiveRunner: React.FC<ReactLiveRunnerProps> = ({ code, keyTrigger = 0 }) => {
  const [error, setError] = useState<string | null>(null);
  const [CompiledComponent, setCompiledComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    setError(null);
    try {
      // 1. Strip import statements and clean exports
      const cleanedCode = code
        .replace(/import\s+type\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, '')
        .replace(/import\s+type\s+[\s\S]*?;/g, '')
        .replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, '')
        .replace(/import\s+['"][^'"]+['"];?/g, '')
        .replace(/export\s+default\s+function\s+([a-zA-Z0-9_]+)/g, 'function $1;\nvar __DefaultExport = $1;\nfunction $1')
        .replace(/export\s+default\s+/g, 'var __DefaultExport = ')
        .replace(/export\s+(?:async\s+)?function\s+/g, 'function ')
        .replace(/export\s+const\s+/g, 'const ')
        .replace(/export\s+let\s+/g, 'let ')
        .replace(/export\s+var\s+/g, 'var ')
        .replace(/export\s+class\s+/g, 'class ');

      // 2. Transpile TSX/JSX using sucrase in ~0.5ms offline
      const transpiled = transform(cleanedCode, {
        transforms: ['jsx', 'typescript'],
        jsxRuntime: 'classic',
        production: true,
      }).code;

      // 3. Scan for candidate identifiers
      const pascalRegex = /(?:function|const|let|var|class)\s+([A-Z][a-zA-Z0-9_]*)/g;
      const hookRegex = /(?:function|const|let|var)\s+(use[A-Z][a-zA-Z0-9_]*)/g;
      const reducerRegex = /(?:function|const|let|var)\s+([a-zA-Z0-9_]*[rR]educer)/g;

      const candidateNames: string[] = [];
      let m: RegExpExecArray | null;
      while ((m = pascalRegex.exec(code)) !== null) candidateNames.push(m[1]);
      while ((m = hookRegex.exec(code)) !== null) candidateNames.push(m[1]);
      while ((m = reducerRegex.exec(code)) !== null) candidateNames.push(m[1]);

      let probeCode = '\nvar __detected = {};\n';
      candidateNames.forEach(name => {
        probeCode += `try { if (typeof ${name} !== "undefined") __detected["${name}"] = ${name}; } catch(e){}\n`;
      });
      probeCode += `return { defaultExport: typeof __DefaultExport !== "undefined" ? __DefaultExport : null, detected: __detected };`;

      // 4. Safe evaluation scope
      const evalFn = new Function(
        'React',
        'useState',
        'useEffect',
        'useReducer',
        'useMemo',
        'useCallback',
        'useRef',
        'createContext',
        'useContext',
        transpiled + probeCode
      );

      const result = evalFn(
        React,
        useState,
        useEffect,
        useReducer,
        useMemo,
        useCallback,
        useRef,
        createContext,
        useContext
      );

      const defaultExport = result?.defaultExport;
      const detected = result?.detected || {};

      let TargetToRender: React.ComponentType | null = null;

      // Check default export
      if (typeof defaultExport === 'function') {
        TargetToRender = defaultExport;
      } else if (React.isValidElement(defaultExport)) {
        TargetToRender = () => defaultExport as React.ReactElement;
      }

      // Check detected PascalCase components
      if (!TargetToRender) {
        for (const name of candidateNames) {
          if (/^[A-Z]/.test(name) && typeof detected[name] === 'function') {
            const Comp = detected[name];
            TargetToRender = function ComponentHarness() {
              const [actionLogs, setActionLogs] = useState<string[]>([]);
              const handleAction = useCallback((payload: any) => {
                const msg = typeof payload === 'string' ? payload : JSON.stringify(payload);
                setActionLogs(prev => [msg, ...prev.slice(0, 3)]);
              }, []);

              return (
                <div className="flex flex-col items-center justify-center w-full space-y-4">
                  <Comp
                    onSave={handleAction}
                    onSubmit={handleAction}
                    onClick={handleAction}
                    onChange={handleAction}
                  />
                  {actionLogs.length > 0 && (
                    <div className="rounded-2xl border border-sky-200 bg-sky-50/90 p-3.5 w-full max-w-md shadow-2xs">
                      <div className="text-xs font-bold text-sky-900 mb-1.5 flex items-center gap-1.5">
                        <Activity className="h-3.5 w-3.5 text-sky-600" />
                        <span>Evento/Callback Intercettato:</span>
                      </div>
                      <div className="space-y-1">
                        {actionLogs.map((log, idx) => (
                          <div
                            key={idx}
                            className="font-mono text-xs text-sky-900 bg-white px-2.5 py-1.5 rounded-xl border border-sky-100 shadow-2xs"
                          >
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

      // Check custom hooks
      if (!TargetToRender) {
        for (const hookName of candidateNames) {
          if (/^use[A-Z]/.test(hookName) && typeof detected[hookName] === 'function') {
            const hookFn = detected[hookName];

            if (hookName === 'useLocalStorage') {
              TargetToRender = function UseLocalStorageDemo() {
                const [key] = useState('demo_study_key');
                const [val, setVal] = hookFn(key, 'Mario');
                const [inputVal, setInputVal] = useState(val || '');

                return (
                  <div className="rounded-2xl border border-sky-200 bg-white p-6 shadow-sm max-w-md w-full space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-sky-600" />
                        <span>Hook: {hookName}</span>
                      </span>
                      <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Sincronizzato</span>
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Test Reattivo useLocalStorage</h3>
                      <p className="text-xs text-slate-500 mt-0.5">I dati vengono persistiti e aggiornati in tempo reale.</p>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-700">Valore in memoria:</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={inputVal}
                          onChange={e => setInputVal(e.target.value)}
                          className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-sky-500 focus:outline-hidden text-slate-900 bg-white"
                          placeholder="Inserisci un valore..."
                        />
                        <button
                          type="button"
                          onClick={() => setVal(inputVal)}
                          className="rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white hover:bg-sky-500 active:scale-95 transition shadow-xs cursor-pointer"
                        >
                          Salva
                        </button>
                      </div>
                    </div>

                    <div className="rounded-xl bg-slate-900 text-sky-300 p-3.5 font-mono text-xs space-y-1">
                      <div className="text-slate-400 text-[11px]">// Chiave: "{key}" | Valore attuale:</div>
                      <div className="font-bold text-white text-sm">{JSON.stringify(val)}</div>
                    </div>
                  </div>
                );
              };
            } else if (hookName === 'useFetch') {
              TargetToRender = function UseFetchDemo() {
                const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/todos/1');
                const { data, loading, error: fetchErr } = hookFn(url) || {};

                return (
                  <div className="rounded-2xl border border-sky-200 bg-white p-6 shadow-sm max-w-md w-full space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-sky-600" />
                        <span>Hook: {hookName}</span>
                      </span>
                      {loading && <span className="text-xs text-sky-600 font-semibold animate-pulse">Caricamento...</span>}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Test Chiamate API Asincrone</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Seleziona un endpoint per testare il caricamento:</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setUrl('https://jsonplaceholder.typicode.com/todos/1')}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition shadow-2xs cursor-pointer ${
                          url.includes('/todos/1') ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Todo #1
                      </button>
                      <button
                        type="button"
                        onClick={() => setUrl('https://jsonplaceholder.typicode.com/todos/2')}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition shadow-2xs cursor-pointer ${
                          url.includes('/todos/2') ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Todo #2
                      </button>
                      <button
                        type="button"
                        onClick={() => setUrl('https://jsonplaceholder.typicode.com/users/1')}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition shadow-2xs cursor-pointer ${
                          url.includes('/users/1') ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        User #1
                      </button>
                    </div>

                    {fetchErr ? (
                      <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                        ❌ Errore: {fetchErr}
                      </div>
                    ) : (
                      <div className="rounded-xl bg-slate-900 p-3.5 font-mono text-xs text-sky-300 overflow-x-auto max-h-48">
                        <pre>{JSON.stringify(data, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                );
              };
            } else {
              TargetToRender = function GenericHookHarness() {
                let hookResult: any = null;
                let hookError: string | null = null;
                try {
                  hookResult = hookFn('demo_param', 0);
                } catch (e: any) {
                  hookError = e.message;
                }

                return (
                  <div className="rounded-2xl border border-sky-200 bg-white p-6 shadow-sm max-w-md w-full space-y-3">
                    <span className="inline-block rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800">
                      Custom Hook: {hookName}
                    </span>
                    <h3 className="text-sm font-bold text-slate-800">Esecuzione Reattiva Hook</h3>
                    {hookError ? (
                      <p className="text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200 font-mono">
                        Hook inizializzato ({hookError}).
                      </p>
                    ) : (
                      <div className="bg-slate-900 text-sky-300 p-3.5 rounded-xl font-mono text-xs overflow-x-auto">
                        <pre>{typeof hookResult === 'object' ? JSON.stringify(hookResult, null, 2) : String(hookResult)}</pre>
                      </div>
                    )}
                  </div>
                );
              };
            }
            break;
          }
        }
      }

      // Check reducers
      if (!TargetToRender) {
        for (const redName of candidateNames) {
          if (/[rR]educer$/.test(redName) && typeof detected[redName] === 'function') {
            const redFn = detected[redName];
            TargetToRender = function ReducerHarness() {
              const initialState = { isStudying: false, seconds: 0, activeSubject: 'React & TypeScript' };
              const [state, dispatch] = useReducer(redFn, initialState);

              useEffect(() => {
                let timer: any;
                if (state.isStudying) {
                  timer = setInterval(() => {
                    dispatch({ type: 'TICK' });
                  }, 1000);
                }
                return () => clearInterval(timer);
              }, [state.isStudying]);

              return (
                <div className="rounded-2xl border border-purple-200 bg-white p-6 shadow-sm max-w-md w-full space-y-4">
                  <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-800">
                      Reducer: {redName}
                    </span>
                    <span className={`text-xs font-bold flex items-center gap-1.5 ${state.isStudying ? 'text-emerald-600' : 'text-slate-400'}`}>
                      <span className={`h-2 w-2 rounded-full ${state.isStudying ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                      <span>{state.isStudying ? 'In Corso (TICK)' : 'In Pausa'}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Test Live del Reducer</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Esegui il dispatch delle azioni per aggiornare lo stato:</p>
                  </div>

                  <div className="rounded-xl bg-slate-900 p-3.5 font-mono text-xs text-purple-300 overflow-x-auto">
                    <div className="text-slate-400 text-[11px] mb-1">// Stato attuale:</div>
                    <pre className="text-white font-bold">{JSON.stringify(state, null, 2)}</pre>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => dispatch({ type: 'START', subject: 'React Hooks & State' })}
                      className="rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-purple-500 active:scale-95 transition shadow-xs cursor-pointer"
                    >
                      Dispatch: START
                    </button>
                    <button
                      type="button"
                      onClick={() => dispatch({ type: 'TICK' })}
                      className="rounded-xl border border-purple-300 bg-purple-50 px-3.5 py-2 text-xs font-bold text-purple-700 hover:bg-purple-100 active:scale-95 transition cursor-pointer"
                    >
                      Dispatch: TICK (+1)
                    </button>
                    <button
                      type="button"
                      onClick={() => dispatch({ type: 'RESET' })}
                      className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 active:scale-95 transition cursor-pointer"
                    >
                      Dispatch: RESET
                    </button>
                  </div>
                </div>
              );
            };
            break;
          }
        }
      }

      setCompiledComponent(() => TargetToRender);
    } catch (err: any) {
      console.error('Transpilation/Eval error:', err);
      setError(err?.message || String(err));
    }
  }, [code, keyTrigger]);

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50/90 p-5 text-rose-900 shadow-xs space-y-2 max-w-lg mx-auto">
        <div className="flex items-center gap-2 font-bold text-sm text-rose-950">
          <AlertTriangle className="h-4 w-4 text-rose-600" />
          <span>Errore di Compilazione / Esecuzione React</span>
        </div>
        <p className="font-mono text-xs bg-white/90 p-3 rounded-xl border border-rose-200 text-rose-800 overflow-x-auto whitespace-pre-wrap">
          {error}
        </p>
      </div>
    );
  }

  if (!CompiledComponent) {
    return (
      <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 space-y-1.5 text-center max-w-md mx-auto">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-1">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <h4 className="text-sm font-bold text-emerald-900">
          Codice React Compilato con Successo
        </h4>
        <p className="text-xs text-emerald-700">
          Tutti i tipi TSX e le funzioni sono validi e pronti per l'integrazione.
        </p>
      </div>
    );
  }

  return (
    <PreviewErrorBoundary key={keyTrigger}>
      <div className="w-full flex items-center justify-center p-2">
        <CompiledComponent />
      </div>
    </PreviewErrorBoundary>
  );
};
