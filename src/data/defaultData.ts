import { AppStorageData } from '../types';

export const INITIAL_DATA: AppStorageData = {
  version: 1,
  dailyGoalMinutes: 60,
  snippets: [
    // --- HTML ---
    {
      id: 'snip-html-1',
      trackId: 'html',
      title: 'Scheletro HTML5 Moderno con Meta SEO & OpenGraph',
      description: 'Struttura base pronta con viewport responsive, tag OpenGraph per social e accessibilità semantica.',
      language: 'html',
      tags: ['Boilerplate', 'SEO', 'Semantica'],
      code: `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Guida pratica allo sviluppo web moderno">
  <!-- Open Graph / Social Sharing -->
  <meta property="og:title" content="Corso Frontend Moderno">
  <meta property="og:description" content="Impara HTML, CSS e JavaScript con esercizi pratici">
  <meta property="og:type" content="website">
  <title>App Dev - Studio Web</title>
</head>
<body>
  <header>
    <nav aria-label="Navigazione principale">
      <a href="#contenuto" class="skip-link">Salta al contenuto</a>
    </nav>
  </header>
  <main id="contenuto">
    <h1>Benvenuto nel Planner di Studio</h1>
    <p>Inizia a scrivere codice semantico e accessibile.</p>
  </main>
</body>
</html>`,
      isFavorite: true,
      createdAt: '2026-08-10T09:00:00.000Z',
      updatedAt: '2026-08-10T09:00:00.000Z',
    },
    {
      id: 'snip-html-2',
      trackId: 'html',
      title: 'Form Accessibile con Validazione Nativa & Datalist',
      description: 'Esempio di input con attributi pattern regex, required, autocomplete e datalist.',
      language: 'html',
      tags: ['Form', 'Validazione', 'Accessibilità'],
      code: `<form action="/submit" method="POST" novalidate>
  <fieldset>
    <legend>Dati di Registrazione Studio</legend>

    <label for="username">Nome Utente:</label>
    <input type="text" id="username" name="username" required minlength="3" autocomplete="username">

    <label for="lang-choice">Linguaggio preferito:</label>
    <input list="languages" id="lang-choice" name="language" placeholder="Seleziona...">
    <datalist id="languages">
      <option value="HTML5">
      <option value="CSS3">
      <option value="JavaScript">
      <option value="Tailwind CSS">
      <option value="React">
      <option value="Python">
    </datalist>

    <button type="submit">Salva Sessione</button>
  </fieldset>
</form>`,
      createdAt: '2026-08-11T10:30:00.000Z',
      updatedAt: '2026-08-11T10:30:00.000Z',
    },
    {
      id: 'snip-html-3',
      trackId: 'html',
      title: 'Elemento nativo <dialog> Modale con backdrop',
      description: 'Il tag HTML5 nativo per finestre di dialogo senza librerie esterne.',
      language: 'html',
      tags: ['Dialog', 'Modale', 'HTML5'],
      code: `<button id="openBtn" onclick="document.getElementById('myModal').showModal()">
  Apri Dialogo
</button>

<dialog id="myModal" style="padding: 24px; border-radius: 12px; border: 1px solid #ccc;">
  <h2>Sessione di Studio Completata!</h2>
  <p>Hai completato 45 minuti di studio continuo.</p>
  <form method="dialog">
    <button type="submit">Chiudi</button>
  </form>
</dialog>`,
      createdAt: '2026-08-12T14:00:00.000Z',
      updatedAt: '2026-08-12T14:00:00.000Z',
    },

    // --- CSS ---
    {
      id: 'snip-css-1',
      trackId: 'css',
      title: 'Layout Responsive con CSS Grid & auto-fit / minmax',
      description: 'Griglia fluida che si adatta a qualsiasi schermo senza media query!',
      language: 'css',
      tags: ['Grid', 'Responsive', 'Layout'],
      code: `.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}`,
      isFavorite: true,
      createdAt: '2026-08-10T11:00:00.000Z',
      updatedAt: '2026-08-10T11:00:00.000Z',
    },
    {
      id: 'snip-css-2',
      trackId: 'css',
      title: 'Centratura Perfetta & Tipografia Fluida con clamp()',
      description: 'Tecnica moderna per centrare in Flexbox/Grid e font size fluido con clamp().',
      language: 'css',
      tags: ['Centratura', 'clamp', 'Tipografia'],
      code: `/* Centratura con Grid */
.hero-center {
  display: grid;
  place-items: center;
  min-height: 50vh;
}

/* Tipografia fluida: min 1.5rem, ideale 4vw, max 3rem */
.fluid-title {
  font-size: clamp(1.5rem, 4vw + 1rem, 3.25rem);
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: #1e293b;
}`,
      createdAt: '2026-08-11T12:00:00.000Z',
      updatedAt: '2026-08-11T12:00:00.000Z',
    },
    {
      id: 'snip-css-3',
      trackId: 'css',
      title: 'CSS Custom Properties con Tema Scuro / Chiaro',
      description: 'Variabili CSS native per gestione dinamica dei colori e preferenze di sistema.',
      language: 'css',
      tags: ['Variabili', 'Dark Mode', 'Design Tokens'],
      code: `:root {
  --bg-primary: #f8fafc;
  --text-primary: #0f172a;
  --accent: #2563eb;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #0f172a;
    --text-primary: #f8fafc;
    --accent: #3b82f6;
  }
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: system-ui, sans-serif;
}`,
      createdAt: '2026-08-12T15:00:00.000Z',
      updatedAt: '2026-08-12T15:00:00.000Z',
    },

    // --- JavaScript ---
    {
      id: 'snip-js-1',
      trackId: 'javascript',
      title: 'Funzione Utilità Debounce con TypeScript/JS',
      description: 'Ottimizza ricerche e resize evitando chiamate ripetute ad ogni battitura.',
      language: 'javascript',
      tags: ['Performance', 'Utilità', 'Closures'],
      code: `function debounce(fn, delay = 300) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// Esempio d'uso con ricerca input:
const handleSearch = debounce((query) => {
  console.log("Ricerca per termine:", query);
  // effettua fetch o filtro
}, 400);

document.querySelector('#searchInput')?.addEventListener('input', (e) => {
  handleSearch(e.target.value);
});`,
      isFavorite: true,
      createdAt: '2026-08-10T14:20:00.000Z',
      updatedAt: '2026-08-10T14:20:00.000Z',
    },
    {
      id: 'snip-js-2',
      trackId: 'javascript',
      title: 'Fetch con Timeout & AbortController',
      description: 'Chiamata HTTP asincrona sicura con timeout automatico e gestione errori.',
      language: 'javascript',
      tags: ['Async', 'Fetch', 'Promises'],
      code: `async function fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    if (!res.ok) throw new Error(\`HTTP \${res.status}: \${res.statusText}\`);
    return await res.json();
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(\`Richiesta scaduta dopo \${timeoutMs}ms\`);
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}`,
      createdAt: '2026-08-11T16:00:00.000Z',
      updatedAt: '2026-08-11T16:00:00.000Z',
    },
    {
      id: 'snip-js-3',
      trackId: 'javascript',
      title: 'Raggruppamento dati con Array.reduce / Object.groupBy',
      description: 'Pattern moderno per raggruppare elementi di un array per categoria.',
      language: 'javascript',
      tags: ['Array', 'Reduce', 'Dati'],
      code: `const studySessions = [
  { track: 'react', minutes: 45 },
  { track: 'python', minutes: 60 },
  { track: 'react', minutes: 30 },
  { track: 'javascript', minutes: 50 },
];

// Metodo con reduce classico:
const totalByTrack = studySessions.reduce((acc, curr) => {
  acc[curr.track] = (acc[curr.track] || 0) + curr.minutes;
  return acc;
}, {});

console.log("Minuti totali per materia:", totalByTrack);
// Output: { react: 75, python: 60, javascript: 50 }`,
      createdAt: '2026-08-12T17:00:00.000Z',
      updatedAt: '2026-08-12T17:00:00.000Z',
    },

    // --- Tailwind CSS ---
    {
      id: 'snip-tw-1',
      trackId: 'tailwind',
      title: 'Card Progetto Moderna con Hover States & Badge',
      description: 'Componente scheda pulito con bordi morbidi, transizioni e contrasto elegante.',
      language: 'html',
      tags: ['Card', 'Componente', 'Hover'],
      code: `<div class="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-teal-300">
  <div class="flex items-center justify-between">
    <span class="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 border border-teal-200">
      Tailwind v4
    </span>
    <span class="text-xs text-slate-400">Oggi</span>
  </div>
  
  <h3 class="mt-4 text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
    Componente Dashboard
  </h3>
  
  <p class="mt-2 text-sm leading-relaxed text-slate-600">
    Esempio di utility class combinate per uno stile coeso e responsive.
  </p>
  
  <div class="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
    <span class="text-xs font-medium text-slate-500">Completato al 80%</span>
    <button class="rounded-lg bg-teal-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow hover:bg-teal-500 active:scale-95 transition">
      Dettagli
    </button>
  </div>
</div>`,
      isFavorite: true,
      createdAt: '2026-08-10T15:30:00.000Z',
      updatedAt: '2026-08-10T15:30:00.000Z',
    },
    {
      id: 'snip-tw-2',
      trackId: 'tailwind',
      title: 'Input con Icona & Floating Focus Ring',
      description: 'Campo di input stilizzato con icone ed effetto ring coerente sui focus.',
      language: 'html',
      tags: ['Input', 'Form', 'Focus'],
      code: `<div class="w-full max-w-sm">
  <label for="search" class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
    Cerca Snippet
  </label>
  <div class="relative rounded-xl shadow-xs">
    <input 
      type="text" 
      id="search"
      placeholder="Es: debounce, flexbox..." 
      class="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-4 pr-10 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-teal-500 focus:outline-hidden focus:ring-3 focus:ring-teal-500/20"
    />
    <button class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-teal-600">
      🔍
    </button>
  </div>
</div>`,
      createdAt: '2026-08-11T18:00:00.000Z',
      updatedAt: '2026-08-11T18:00:00.000Z',
    },

    // --- React ---
    {
      id: 'snip-react-1',
      trackId: 'react',
      title: 'Custom Hook useLocalStorage con Sincronizzazione',
      description: 'Hook React riutilizzabile per persistere lo stato nel localStorage con fallback sicuro.',
      language: 'tsx',
      tags: ['Hooks', 'LocalStorage', 'TypeScript'],
      code: `import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(\`Errore lettura localStorage key "\${key}":\`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(\`Errore salvataggio localStorage key "\${key}":\`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}`,
      isFavorite: true,
      createdAt: '2026-08-10T16:00:00.000Z',
      updatedAt: '2026-08-10T16:00:00.000Z',
    },
    {
      id: 'snip-react-2',
      trackId: 'react',
      title: 'Pattern useReducer per Stato Complesso di Studio',
      description: 'Gestione robusta di azioni (startSession, pauseSession, completeTask) con Reducer.',
      language: 'tsx',
      tags: ['useReducer', 'State', 'Architettura'],
      code: `type State = { isStudying: boolean; seconds: number; activeSubject: string };
type Action = 
  | { type: 'START'; subject: string }
  | { type: 'TICK' }
  | { type: 'RESET' };

function studyReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'START':
      return { ...state, isStudying: true, activeSubject: action.subject };
    case 'TICK':
      return { ...state, seconds: state.seconds + 1 };
    case 'RESET':
      return { ...state, isStudying: false, seconds: 0 };
    default:
      return state;
  }
}`,
      createdAt: '2026-08-11T19:30:00.000Z',
      updatedAt: '2026-08-11T19:30:00.000Z',
    },

    // --- Python ---
    {
      id: 'snip-py-1',
      trackId: 'python',
      title: 'List & Dict Comprehensions con Filtri',
      description: 'Costruzione sintetica di liste e dizionari in puro stile Pythonic.',
      language: 'python',
      tags: ['Comprehensions', 'Pythonic', 'Liste'],
      code: `# Lista di sessioni di studio in minuti
session_minutes = [25, 45, 15, 60, 90, 10, 30]

# Filtra solo sessioni lunghe (>= 30 min) e converti in ore
long_sessions_hours = [m / 60 for m in session_minutes if m >= 30]
print("Sessioni >= 30m in ore:", long_sessions_hours)

# Dizionario: materia -> ore studiate
topics = ["html", "css", "javascript", "react", "python"]
hours = [12, 18, 35, 40, 28]

study_tracker = {topic.upper(): hr for topic, hr in zip(topics, hours) if hr > 15}
print("Tracker materie avanzate:", study_tracker)
# Output: {'CSS': 18, 'JAVASCRIPT': 35, 'REACT': 40, 'PYTHON': 28}`,
      isFavorite: true,
      createdAt: '2026-08-10T17:00:00.000Z',
      updatedAt: '2026-08-10T17:00:00.000Z',
    },
    {
      id: 'snip-py-2',
      trackId: 'python',
      title: 'Context Manager personalizzato con @contextmanager',
      description: 'Gestione automatica di setup/teardown (es. timer di esecuzione o file lock).',
      language: 'python',
      tags: ['ContextManager', 'Decorators', 'Performance'],
      code: `import time
from contextlib import contextmanager

@contextmanager
def timer(session_name="Sessione di Studio"):
    start = time.perf_counter()
    print(f"⏱️ Inizio: {session_name}")
    try:
        yield
    finally:
        elapsed = time.perf_counter() - start
        print(f"✅ Concluso {session_name} in {elapsed:.2f} secondi")

# Utilizzo:
with timer("Algoritmo di ordinamento"):
    # Simula operazione
    numbers = [x**2 for x in range(100_000)]`,
      createdAt: '2026-08-11T20:00:00.000Z',
      updatedAt: '2026-08-11T20:00:00.000Z',
    },
  ],

  resources: [
    // HTML
    {
      id: 'res-html-1',
      trackId: 'html',
      title: 'MDN Web Docs - HTML Guida Completa',
      url: 'https://developer.mozilla.org/it/docs/Web/HTML',
      type: 'doc',
      description: 'Documentazione ufficiale Mozilla su elementi semantici, attributi e compatibilità browser.',
      rating: 5,
      isFavorite: true,
      createdAt: '2026-08-10T09:00:00.000Z',
    },
    {
      id: 'res-html-2',
      trackId: 'html',
      title: 'Web.dev - Learn HTML by Google',
      url: 'https://web.dev/learn/html',
      type: 'tutorial',
      description: 'Corso modulare su accessibilità, forms avanzati e struttura moderna.',
      rating: 5,
      createdAt: '2026-08-10T09:00:00.000Z',
    },
    {
      id: 'res-html-3',
      trackId: 'html',
      title: 'HTML5 Cheat Sheet interattivo',
      url: 'https://htmlcheatsheet.com/',
      type: 'cheatsheet',
      description: 'Tavola rapida di tutti i tag HTML5 con esempi live.',
      rating: 4,
      createdAt: '2026-08-10T09:00:00.000Z',
    },

    // CSS
    {
      id: 'res-css-1',
      trackId: 'css',
      title: 'CSS-Tricks: Complete Guide to Flexbox & Grid',
      url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/',
      type: 'cheatsheet',
      description: 'La guida visuale definitiva a Flexbox e CSS Grid Layout.',
      rating: 5,
      isFavorite: true,
      createdAt: '2026-08-10T09:00:00.000Z',
    },
    {
      id: 'res-css-2',
      trackId: 'css',
      title: 'Modern CSS Solutions by Stephanie Eckles',
      url: 'https://moderncss.dev/',
      type: 'tutorial',
      description: 'Pattern CSS moderni senza dipendenze né framework pesanti.',
      rating: 5,
      createdAt: '2026-08-10T09:00:00.000Z',
    },

    // JavaScript
    {
      id: 'res-js-1',
      trackId: 'javascript',
      title: 'The Modern JavaScript Tutorial (javascript.info)',
      url: 'https://javascript.info/',
      type: 'tutorial',
      description: 'Il tutorial più esaustivo da zero a concetti avanzati (event loop, closures, async).',
      rating: 5,
      isFavorite: true,
      createdAt: '2026-08-10T09:00:00.000Z',
    },
    {
      id: 'res-js-2',
      trackId: 'javascript',
      title: 'You Don’t Know JS Yet (Book Series GitHub)',
      url: 'https://github.com/getify/You-Dont-Know-JS',
      type: 'doc',
      description: 'Serie open source approfondita sui dettagli interni di JavaScript.',
      rating: 5,
      createdAt: '2026-08-10T09:00:00.000Z',
    },

    // Tailwind
    {
      id: 'res-tw-1',
      trackId: 'tailwind',
      title: 'Tailwind CSS Documentazione Ufficiale',
      url: 'https://tailwindcss.com/docs',
      type: 'doc',
      description: 'Tutte le classi, configurazione tema, colori e varianti interattive.',
      rating: 5,
      isFavorite: true,
      createdAt: '2026-08-10T09:00:00.000Z',
    },
    {
      id: 'res-tw-2',
      trackId: 'tailwind',
      title: 'Heroicons - Set di Icone Ufficiali Tailwind',
      url: 'https://heroicons.com/',
      type: 'tool',
      description: 'Icone SVG pronte da copiare per progetti Tailwind.',
      rating: 4,
      createdAt: '2026-08-10T09:00:00.000Z',
    },

    // React
    {
      id: 'res-react-1',
      trackId: 'react',
      title: 'React.dev - Nuova Documentazione Ufficiale con Esempi Interattivi',
      url: 'https://react.dev/',
      type: 'doc',
      description: 'Guide ufficiali su pensare in React, Hooks, gestione dello stato e best practice.',
      rating: 5,
      isFavorite: true,
      createdAt: '2026-08-10T09:00:00.000Z',
    },
    {
      id: 'res-react-2',
      trackId: 'react',
      title: 'React TypeScript Cheatsheet',
      url: 'https://react-typescript-cheatsheet.netlify.app/',
      type: 'cheatsheet',
      description: 'Come tipizzare props, eventi, hooks e context con TypeScript in React.',
      rating: 5,
      createdAt: '2026-08-10T09:00:00.000Z',
    },

    // Python
    {
      id: 'res-py-1',
      trackId: 'python',
      title: 'Python 3 Documentazione & Tutorial Ufficiale',
      url: 'https://docs.python.org/3/tutorial/',
      type: 'doc',
      description: 'Guida introduttiva e manuale completo delle librerie standard.',
      rating: 5,
      isFavorite: true,
      createdAt: '2026-08-10T09:00:00.000Z',
    },
    {
      id: 'res-py-2',
      trackId: 'python',
      title: 'Real Python Tutorials & Quizzes',
      url: 'https://realpython.com/',
      type: 'tutorial',
      description: 'Articoli chiari e approfonditi su ogni argomento Python.',
      rating: 5,
      createdAt: '2026-08-10T09:00:00.000Z',
    },
  ],

  books: [
    {
      id: 'book-html-1',
      trackId: 'html',
      title: 'HTML and CSS: Design and Build Websites',
      author: 'Jon Duckett',
      status: 'completed',
      currentPage: 512,
      totalPages: 512,
      rating: 5,
      keyTakeaways: 'La presentazione grafica più chiara e visuale per comprendere il box model e la struttura semantica.',
      notes: 'Ottimo per consolidare la gerarchia dei tag e le proprietà di base.',
      linkUrl: 'https://www.wiley.com/en-us/HTML+and+CSS:+Design+and+Build+Websites-p-9781118008188',
      createdAt: '2026-08-01T10:00:00.000Z',
      updatedAt: '2026-08-10T10:00:00.000Z',
    },
    {
      id: 'book-css-1',
      trackId: 'css',
      title: 'CSS Secrets: Better Solutions to Everyday Web Projects',
      author: 'Lea Verou',
      status: 'reading',
      currentPage: 180,
      totalPages: 390,
      rating: 5,
      keyTakeaways: 'Soluzioni eleganti con custom properties, gradienti complessi e trucchi geometrici.',
      notes: 'I capitoli su forme e bordi dinamici sono geniali.',
      linkUrl: 'https://www.oreilly.com/library/view/css-secrets/9781449372729/',
      createdAt: '2026-08-05T10:00:00.000Z',
      updatedAt: '2026-08-14T10:00:00.000Z',
    },
    {
      id: 'book-js-1',
      trackId: 'javascript',
      title: 'Eloquent JavaScript (3rd Edition)',
      author: 'Marijn Haverbeke',
      status: 'reading',
      currentPage: 245,
      totalPages: 472,
      rating: 5,
      keyTakeaways: 'Approfondimento su programmazione funzionale, regex, DOM e gestione asincrona.',
      notes: 'Libro fondamentale, esercizi impegnativi ma molto formativi.',
      linkUrl: 'https://eloquentjavascript.net/',
      createdAt: '2026-08-02T10:00:00.000Z',
      updatedAt: '2026-08-15T10:00:00.000Z',
    },
    {
      id: 'book-tw-1',
      trackId: 'tailwind',
      title: 'Refactoring UI',
      author: 'Adam Wathan & Steve Schoger',
      status: 'completed',
      currentPage: 250,
      totalPages: 250,
      rating: 5,
      keyTakeaways: 'Regole pratiche per sviluppatori per disegnare layout professionali con utility classes.',
      notes: 'La gerarchia dei colori neutri e lo spaziamento ritmico hanno trasformato il mio frontend.',
      linkUrl: 'https://www.refactoringui.com/',
      createdAt: '2026-08-03T10:00:00.000Z',
      updatedAt: '2026-08-12T10:00:00.000Z',
    },
    {
      id: 'book-react-1',
      trackId: 'react',
      title: 'Learning React (2nd Edition)',
      author: 'Alex Banks & Eve Porcello',
      status: 'reading',
      currentPage: 160,
      totalPages: 340,
      rating: 4,
      keyTakeaways: 'Dai concetti di JS funzionale ai Custom Hooks e React Router.',
      notes: 'Spiegazione chiara di useReducer e Context API.',
      linkUrl: 'https://www.oreilly.com/library/view/learning-react-2nd/9781492051718/',
      createdAt: '2026-08-07T10:00:00.000Z',
      updatedAt: '2026-08-16T10:00:00.000Z',
    },
    {
      id: 'book-py-1',
      trackId: 'python',
      title: 'Automate the Boring Stuff with Python',
      author: 'Al Sweigart',
      status: 'completed',
      currentPage: 504,
      totalPages: 504,
      rating: 5,
      keyTakeaways: 'Automazione pratica con file CSV/Excel, scraping web con BeautifulSoup e task scheduling.',
      notes: 'Perfetto per capire la potenza pratica di Python nei task quotidiani.',
      linkUrl: 'https://automatetheboringstuff.com/',
      createdAt: '2026-08-04T10:00:00.000Z',
      updatedAt: '2026-08-11T10:00:00.000Z',
    },
    {
      id: 'book-py-2',
      trackId: 'python',
      title: 'Fluent Python: Clear, Concise, and Effective Programming',
      author: 'Luciano Ramalho',
      status: 'to_read',
      currentPage: 0,
      totalPages: 800,
      rating: 5,
      keyTakeaways: 'Comprendere le dunder methods, generatori, decoratori e metaprogrammazione.',
      notes: 'Inizierò appena terminato il modulo base di OOP.',
      linkUrl: 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/',
      createdAt: '2026-08-08T10:00:00.000Z',
      updatedAt: '2026-08-08T10:00:00.000Z',
    },
  ],

  tasks: [
    // HTML Tasks
    {
      id: 'task-html-1',
      trackId: 'html',
      title: 'Padronanza dei Tag Semantici (header, nav, main, article, section, footer)',
      category: 'Semantica & Struttura',
      difficulty: 'base',
      priority: 'alta',
      completed: true,
      completedAt: '2026-08-10T11:00:00.000Z',
      estimatedMinutes: 60,
      actualMinutes: 50,
      notes: 'Completata creazione di una pagina blog semantica.',
      createdAt: '2026-08-08T09:00:00.000Z',
    },
    {
      id: 'task-html-2',
      trackId: 'html',
      title: 'Form avanzati con validazione HTML5, pattern regex & attributi ARIA',
      category: 'Form & Dati',
      difficulty: 'intermedio',
      priority: 'alta',
      completed: true,
      completedAt: '2026-08-12T14:30:00.000Z',
      estimatedMinutes: 90,
      actualMinutes: 80,
      createdAt: '2026-08-08T09:00:00.000Z',
    },
    {
      id: 'task-html-3',
      trackId: 'html',
      title: 'Accessibilità (WCAG): ruoli ARIA, skip link, navigazione da tastiera e contrasto',
      category: 'Accessibilità',
      difficulty: 'intermedio',
      priority: 'media',
      completed: false,
      dueDate: '2026-08-20',
      estimatedMinutes: 120,
      createdAt: '2026-08-08T09:00:00.000Z',
    },
    {
      id: 'task-html-4',
      trackId: 'html',
      title: 'Media tag moderni: picture, video con sottotitoli track e lazy loading nativo',
      category: 'Media & Performance',
      difficulty: 'intermedio',
      priority: 'bassa',
      completed: false,
      dueDate: '2026-08-25',
      estimatedMinutes: 45,
      createdAt: '2026-08-08T09:00:00.000Z',
    },

    // CSS Tasks
    {
      id: 'task-css-1',
      trackId: 'css',
      title: 'Mastery di Flexbox: allineamento, flex-grow/shrink e direzioni',
      category: 'Layout',
      difficulty: 'base',
      priority: 'alta',
      completed: true,
      completedAt: '2026-08-11T16:00:00.000Z',
      estimatedMinutes: 90,
      actualMinutes: 95,
      createdAt: '2026-08-08T09:00:00.000Z',
    },
    {
      id: 'task-css-2',
      trackId: 'css',
      title: 'CSS Grid avanzato: grid-template-areas, auto-fit/minmax e sovrapposizioni',
      category: 'Layout',
      difficulty: 'intermedio',
      priority: 'alta',
      completed: true,
      completedAt: '2026-08-14T18:00:00.000Z',
      estimatedMinutes: 120,
      actualMinutes: 110,
      createdAt: '2026-08-08T09:00:00.000Z',
    },
    {
      id: 'task-css-3',
      trackId: 'css',
      title: 'Custom Properties (CSS Variables) & Sistema di Design Tokens dinamico',
      category: 'Design System',
      difficulty: 'intermedio',
      priority: 'media',
      completed: false,
      dueDate: '2026-08-21',
      estimatedMinutes: 60,
      createdAt: '2026-08-08T09:00:00.000Z',
    },
    {
      id: 'task-css-4',
      trackId: 'css',
      title: 'Animazioni con @keyframes, transition fluide e prefers-reduced-motion',
      category: 'Animazioni',
      difficulty: 'avanzato',
      priority: 'media',
      completed: false,
      dueDate: '2026-08-28',
      estimatedMinutes: 90,
      createdAt: '2026-08-08T09:00:00.000Z',
    },

    // JavaScript Tasks
    {
      id: 'task-js-1',
      trackId: 'javascript',
      title: 'ES6+ Fondamentali: destructuring, rest/spread, template literals, arrow functions',
      category: 'Sintassi Moderna',
      difficulty: 'base',
      priority: 'alta',
      completed: true,
      completedAt: '2026-08-09T17:00:00.000Z',
      estimatedMinutes: 120,
      actualMinutes: 100,
      createdAt: '2026-08-08T09:00:00.000Z',
    },
    {
      id: 'task-js-2',
      trackId: 'javascript',
      title: 'Asincronia: Promise, async/await, Promise.all, Promise.allSettled e try/catch',
      category: 'Asincronia',
      difficulty: 'intermedio',
      priority: 'alta',
      completed: true,
      completedAt: '2026-08-15T15:00:00.000Z',
      estimatedMinutes: 150,
      actualMinutes: 140,
      createdAt: '2026-08-08T09:00:00.000Z',
    },
    {
      id: 'task-js-3',
      trackId: 'javascript',
      title: 'Event Loop & Microtasks/Macrotasks: come il motore JS gestisce il runtime',
      category: 'Core Runtime',
      difficulty: 'avanzato',
      priority: 'alta',
      completed: false,
      dueDate: '2026-08-22',
      estimatedMinutes: 120,
      createdAt: '2026-08-08T09:00:00.000Z',
    },
    {
      id: 'task-js-4',
      trackId: 'javascript',
      title: 'Scope, Closures, Currying e memorizzazione delle funzioni',
      category: 'Funzionale',
      difficulty: 'avanzato',
      priority: 'media',
      completed: false,
      dueDate: '2026-08-26',
      estimatedMinutes: 90,
      createdAt: '2026-08-08T09:00:00.000Z',
    },

    // Tailwind Tasks
    {
      id: 'task-tw-1',
      trackId: 'tailwind',
      title: 'Principi Utility-First, scala dello spaziamento e gerarchia tipografica',
      category: 'Fondamenti',
      difficulty: 'base',
      priority: 'alta',
      completed: true,
      completedAt: '2026-08-11T12:00:00.000Z',
      estimatedMinutes: 60,
      actualMinutes: 45,
      createdAt: '2026-08-08T09:00:00.000Z',
    },
    {
      id: 'task-tw-2',
      trackId: 'tailwind',
      title: 'Varianti di stato avanzate (hover, focus-visible, active, group-hover, peer)',
      category: 'Interattività',
      difficulty: 'intermedio',
      priority: 'alta',
      completed: false,
      dueDate: '2026-08-19',
      estimatedMinutes: 75,
      createdAt: '2026-08-08T09:00:00.000Z',
    },
    {
      id: 'task-tw-3',
      trackId: 'tailwind',
      title: 'Configurazione Tailwind v4 con direttiva @theme e custom design tokens',
      category: 'Configurazione',
      difficulty: 'avanzato',
      priority: 'media',
      completed: false,
      dueDate: '2026-08-24',
      estimatedMinutes: 90,
      createdAt: '2026-08-08T09:00:00.000Z',
    },

    // React Tasks
    {
      id: 'task-react-1',
      trackId: 'react',
      title: 'Componenti Funzionali, Props, JSX e Rendering Condizionale',
      category: 'Basi',
      difficulty: 'base',
      priority: 'alta',
      completed: true,
      completedAt: '2026-08-12T18:00:00.000Z',
      estimatedMinutes: 90,
      actualMinutes: 90,
      createdAt: '2026-08-08T09:00:00.000Z',
    },
    {
      id: 'task-react-2',
      trackId: 'react',
      title: 'Gestione dello stato con useState e cicli di vita con useEffect',
      category: 'Hooks Core',
      difficulty: 'intermedio',
      priority: 'alta',
      completed: true,
      completedAt: '2026-08-16T17:00:00.000Z',
      estimatedMinutes: 120,
      actualMinutes: 130,
      createdAt: '2026-08-08T09:00:00.000Z',
    },
    {
      id: 'task-react-3',
      trackId: 'react',
      title: 'Creazione di Custom Hooks riutilizzabili (useDebounce, useLocalStorage, useFetch)',
      category: 'Custom Hooks',
      difficulty: 'intermedio',
      priority: 'alta',
      completed: false,
      dueDate: '2026-08-20',
      estimatedMinutes: 120,
      createdAt: '2026-08-08T09:00:00.000Z',
    },
    {
      id: 'task-react-4',
      trackId: 'react',
      title: 'Context API e useReducer per architetture di stato scalabili',
      category: 'State Management',
      difficulty: 'avanzato',
      priority: 'media',
      completed: false,
      dueDate: '2026-08-27',
      estimatedMinutes: 150,
      createdAt: '2026-08-08T09:00:00.000Z',
    },

    // Python Tasks
    {
      id: 'task-py-1',
      trackId: 'python',
      title: 'Tipi di dato nativi: List, Tuple, Set, Dict e relative operazioni',
      category: 'Basi',
      difficulty: 'base',
      priority: 'alta',
      completed: true,
      completedAt: '2026-08-10T16:00:00.000Z',
      estimatedMinutes: 90,
      actualMinutes: 75,
      createdAt: '2026-08-08T09:00:00.000Z',
    },
    {
      id: 'task-py-2',
      trackId: 'python',
      title: 'Programmazione a Oggetti (OOP): Classi, __init__, ereditarietà e incapsulamento',
      category: 'OOP',
      difficulty: 'intermedio',
      priority: 'alta',
      completed: true,
      completedAt: '2026-08-15T18:00:00.000Z',
      estimatedMinutes: 120,
      actualMinutes: 110,
      createdAt: '2026-08-08T09:00:00.000Z',
    },
    {
      id: 'task-py-3',
      trackId: 'python',
      title: 'Gestione file, eccezioni personalizzate e Context Managers con statement with',
      category: 'File & Errori',
      difficulty: 'intermedio',
      priority: 'media',
      completed: false,
      dueDate: '2026-08-21',
      estimatedMinutes: 90,
      createdAt: '2026-08-08T09:00:00.000Z',
    },
    {
      id: 'task-py-4',
      trackId: 'python',
      title: 'Generators, iteratori con yield e Decorators personalizzati',
      category: 'Avanzato',
      difficulty: 'avanzato',
      priority: 'alta',
      completed: false,
      dueDate: '2026-08-29',
      estimatedMinutes: 150,
      createdAt: '2026-08-08T09:00:00.000Z',
    },
  ],

  notes: [
    {
      id: 'note-html-1',
      trackId: 'html',
      title: 'Regole d’oro per la semantica dei tag HTML5',
      content: `### Gerarchia Corretta
1. Usare sempre un solo \`<h1>\` principale per pagina.
2. Mai usare \`<div>\` generici quando esiste un tag con significato preciso (\`<nav>\`, \`<header>\`, \`<main>\`, \`<aside>\`, \`<footer>\`).
3. Tutte le immagini devono avere un attributo \`alt=""\` (anche vuoto se puramente decorativa).
4. Ogni input nei form DEVE avere una label associata tramite \`for="id_input"\` per gli screen reader.`,
      tags: ['Semantica', 'Accessibilità', 'BestPractice'],
      isPinned: true,
      createdAt: '2026-08-10T10:00:00.000Z',
      updatedAt: '2026-08-10T10:00:00.000Z',
    },
    {
      id: 'note-css-1',
      trackId: 'css',
      title: 'Flexbox vs CSS Grid: Quando usare quale?',
      content: `### Quando usare Flexbox (1D - Monodimensionale):
- Allineare elementi su una sola riga o colonna (es: navbar, badge con icona, gruppo di bottoni).
- Quando il contenuto deve decidere la propria dimensione (\`flex: 1\`, \`gap: 8px\`).

### Quando usare CSS Grid (2D - Bidimensionale):
- Layout di pagina completi (sidebar + main content + header).
- Griglie di card responsive con \`grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))\`.
- Quando serve controllare sia le righe che le colonne contemporaneamente.`,
      tags: ['Flexbox', 'Grid', 'GuidaRapida'],
      isPinned: true,
      createdAt: '2026-08-11T11:00:00.000Z',
      updatedAt: '2026-08-11T11:00:00.000Z',
    },
    {
      id: 'note-js-1',
      trackId: 'javascript',
      title: 'Differenza tra let, const e var & Hoisting',
      content: `### Schema riassuntivo:
- **\`const\`**: Block-scoped, non riassegnabile (ma le proprietà degli oggetti/array possono mutare!). Usare come scelta predefinita al 95%.
- **\`let\`**: Block-scoped, riassegnabile. Usare solo per contatori o variabili che cambiano valore.
- **\`var\`**: Function-scoped, soggetto a hoisting completo. Da NON usare nel codice moderno.

\`\`\`javascript
// Mutazione permessa in const:
const utente = { nome: "Luca" };
utente.nome = "Marco"; // OK!
// utente = {}; // Errore TypeError!
\`\`\``,
      tags: ['Scope', 'Variabili', 'ES6'],
      isPinned: true,
      createdAt: '2026-08-12T12:00:00.000Z',
      updatedAt: '2026-08-12T12:00:00.000Z',
    },
    {
      id: 'note-tw-1',
      trackId: 'tailwind',
      title: 'Convenzione di spaziatura e breakpoint responsive',
      content: `### Breakpoint predefiniti:
- \`sm\`: min-width 640px (telefoni orizzontali)
- \`md\`: min-width 768px (tablet)
- \`lg\`: min-width 1024px (laptop)
- \`xl\`: min-width 1280px (desktop)
- \`2xl\`: min-width 1536px (schermi grandi)

### Spaziature comuni:
- \`p-2\` = 0.5rem (8px)
- \`p-4\` = 1rem (16px)
- \`p-6\` = 1.5rem (24px)
- \`p-8\` = 2rem (32px)`,
      tags: ['Breakpoints', 'Spaziatura', 'CheatSheet'],
      isPinned: false,
      createdAt: '2026-08-13T13:00:00.000Z',
      updatedAt: '2026-08-13T13:00:00.000Z',
    },
    {
      id: 'note-react-1',
      trackId: 'react',
      title: 'Le 3 Regole d’oro degli Hooks in React',
      content: `1. **Chiama gli Hooks solo al livello più alto**: Mai all'interno di cicli, condizioni \`if\` o funzioni annidate.
2. **Chiama gli Hooks solo da funzioni React**: Da componenti funzione o da altri custom hooks (che iniziano con \`use\`).
3. **Pulisci sempre gli effetti collaterali**: Se in \`useEffect\` crei un timer o event listener, ritorna sempre una funzione di cleanup:
\`\`\`tsx
useEffect(() => {
  const handler = () => console.log("resize");
  window.addEventListener("resize", handler);
  return () => window.removeEventListener("resize", handler);
}, []);
\`\`\``,
      tags: ['Hooks', 'Regole', 'useEffect'],
      isPinned: true,
      createdAt: '2026-08-14T14:00:00.000Z',
      updatedAt: '2026-08-14T14:00:00.000Z',
    },
    {
      id: 'note-py-1',
      trackId: 'python',
      title: 'Metodi speciali Dunder (__init__, __str__, __repr__, __len__)',
      content: `### Dunder Methods essenziali:
\`\`\`python
class Corso:
    def __init__(self, titolo, ore):
        self.titolo = titolo
        self.ore = ore
        
    def __str__(self):
        return f"{self.titolo} ({self.ore}h)"
        
    def __repr__(self):
        return f"Corso(titolo='{self.titolo}', ore={self.ore})"
        
    def __len__(self):
        return self.ore

corso = Corso("Python Avanzato", 40)
print(corso)        # Chiama __str__ -> Python Avanzato (40h)
print(len(corso))   # Chiama __len__ -> 40
\`\`\``,
      tags: ['OOP', 'Dunder', 'Pythonic'],
      isPinned: true,
      createdAt: '2026-08-15T15:00:00.000Z',
      updatedAt: '2026-08-15T15:00:00.000Z',
    },
  ],

  logs: [
    {
      id: 'log-1',
      trackId: 'react',
      durationMinutes: 45,
      date: '2026-08-16T16:30:00.000Z',
      topic: 'Studio di useEffect e cleanup function',
      notes: 'Creata sandbox con event listener puliti correttamente.',
    },
    {
      id: 'log-2',
      trackId: 'python',
      durationMinutes: 60,
      date: '2026-08-15T18:00:00.000Z',
      topic: 'Esercizi su OOP ed ereditarietà',
      notes: 'Capite le differenze tra __str__ e __repr__.',
    },
    {
      id: 'log-3',
      trackId: 'css',
      durationMinutes: 50,
      date: '2026-08-14T17:30:00.000Z',
      topic: 'CSS Grid responsive senza media queries',
      notes: 'Applicato auto-fit e minmax su 10 card di prova.',
    },
    {
      id: 'log-4',
      trackId: 'javascript',
      durationMinutes: 40,
      date: '2026-08-13T15:00:00.000Z',
      topic: 'Promise.all vs allSettled',
      notes: 'Scritto helper con timeout e abort controller.',
    },
  ],

  scheduleBlocks: [
    {
      id: 'sch-1',
      day: 'mon',
      startTime: '09:00',
      endTime: '11:00',
      trackId: 'javascript',
      subjectTitle: 'JavaScript Avanzato',
      topic: 'Async / Await, Promises e gestione errori API',
      completed: true,
      notes: 'Rivedere differenze tra Promise.all e Promise.allSettled',
    },
    {
      id: 'sch-2',
      day: 'mon',
      startTime: '15:00',
      endTime: '16:30',
      trackId: 'html',
      subjectTitle: 'HTML5 Semantico & Form',
      topic: 'Accessibilità WCAG, tag semantici e form nativi',
      completed: true,
    },
    {
      id: 'sch-3',
      day: 'tue',
      startTime: '10:00',
      endTime: '12:30',
      trackId: 'react',
      subjectTitle: 'React & Hooks',
      topic: 'Gestione stato complessa con useReducer e Custom Hooks',
      completed: false,
      notes: 'Completare l\'esercizio sul counter condiviso',
    },
    {
      id: 'sch-4',
      day: 'tue',
      startTime: '16:00',
      endTime: '17:30',
      trackId: 'tailwind',
      subjectTitle: 'Tailwind CSS',
      topic: 'Layout responsive e design system personalizzato',
      completed: false,
    },
    {
      id: 'sch-5',
      day: 'wed',
      startTime: '09:30',
      endTime: '11:30',
      trackId: 'python',
      subjectTitle: 'Python & OOP',
      topic: 'Classi, ereditarietà, decoratori e gestione file',
      completed: false,
      notes: 'Implementare classe per gestione database JSON',
    },
    {
      id: 'sch-6',
      day: 'wed',
      startTime: '15:00',
      endTime: '17:00',
      trackId: 'javascript',
      subjectTitle: 'JavaScript & DOM',
      topic: 'Event Delegation, Web Storage e Fetch API',
      completed: false,
    },
    {
      id: 'sch-7',
      day: 'thu',
      startTime: '10:00',
      endTime: '12:00',
      trackId: 'css',
      subjectTitle: 'CSS Grid & Flexbox',
      topic: 'Layout a griglia complessi, clamp() e subgrid',
      completed: false,
    },
    {
      id: 'sch-8',
      day: 'thu',
      startTime: '15:30',
      endTime: '17:30',
      trackId: 'react',
      subjectTitle: 'React Progetti Pratici',
      topic: 'Costruzione Dashboard con Context API e Routing',
      completed: false,
    },
    {
      id: 'sch-9',
      day: 'fri',
      startTime: '09:00',
      endTime: '11:00',
      trackId: 'python',
      subjectTitle: 'Python Data & Algoritmi',
      topic: 'Strutture dati, list comprehension e moduli standard',
      completed: false,
    },
    {
      id: 'sch-10',
      day: 'fri',
      startTime: '14:30',
      endTime: '16:00',
      trackId: 'tailwind',
      subjectTitle: 'Tailwind Animazioni & Dark Mode',
      topic: 'Transizioni fluide e supporto dark/light theme',
      completed: false,
    },
    {
      id: 'sch-11',
      day: 'sat',
      startTime: '10:00',
      endTime: '12:30',
      trackId: 'react',
      subjectTitle: 'Ripasso Generale & Mock Project',
      topic: 'Integrazione completa HTML + Tailwind + React + API',
      completed: false,
    },
  ],

  deadlines: [
    {
      id: 'dl-1',
      title: 'Progetto Finale Frontend React & Tailwind',
      trackId: 'react',
      dueDate: '2026-08-30',
      type: 'progetto',
      priority: 'alta',
      progressPercentage: 65,
      topicsToReview: ['Custom Hooks', 'Gestione Errori', 'Responsive Design', 'Testing'],
      notes: 'Consegna repository GitHub con README e deploy live',
    },
    {
      id: 'dl-2',
      title: 'Esame / Test Competenze JavaScript & Algoritmi',
      trackId: 'javascript',
      dueDate: '2026-09-10',
      type: 'esame',
      priority: 'alta',
      progressPercentage: 80,
      topicsToReview: ['Closures', 'Event Loop', 'Array Methods (map, filter, reduce)', 'Prototypes'],
      notes: 'Ripassare le domande a risposta multipla e scrivere 5 funzioni di test',
    },
    {
      id: 'dl-3',
      title: 'Certificazione Fondamenti Python',
      trackId: 'python',
      dueDate: '2026-09-25',
      type: 'certificazione',
      priority: 'media',
      progressPercentage: 45,
      topicsToReview: ['OOP', 'Moduli e Pacchetti', 'Gestione Eccezioni', 'Librerie Standard'],
      notes: 'Completare simulazioni online prima della data del test',
    },
  ],
};
