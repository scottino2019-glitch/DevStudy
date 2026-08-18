import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { TRACKS } from '../data/tracks';
import { ResourceType, BookStatus, TaskDifficulty, TaskPriority } from '../types';
import { X, Code2, ListTodo, BookOpen, Link as LinkIcon, FileText } from 'lucide-react';

// --- NEW SNIPPET MODAL ---
export const NewSnippetModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { activeTrackId, addSnippet } = useStudy();
  const defaultTrack = activeTrackId !== 'overview' ? activeTrackId : 'javascript';

  const [trackId, setTrackId] = useState(defaultTrack);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState(
    TRACKS.find(t => t.id === defaultTrack)?.codeLang || 'javascript'
  );
  const [code, setCode] = useState('');
  const [tagsStr, setTagsStr] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;

    const tags = tagsStr
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    addSnippet({
      trackId,
      title,
      description,
      language,
      code,
      tags,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 p-0 sm:p-4 backdrop-blur-xs overscroll-contain">
      <div className="w-full max-w-2xl max-h-[92dvh] sm:max-h-[85vh] flex flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-slate-700" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900">Nuovo Snippet di Codice</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Materia / Linguaggio</label>
              <select
                value={trackId}
                onChange={e => {
                  setTrackId(e.target.value);
                  const lang = TRACKS.find(t => t.id === e.target.value)?.codeLang;
                  if (lang) setLanguage(lang);
                }}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 bg-white"
              >
                {TRACKS.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Sintassi</label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 bg-white"
              >
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="javascript">JavaScript</option>
                <option value="tsx">React (TSX)</option>
                <option value="python">Python</option>
                <option value="plaintext">Testo</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Titolo Snippet *</label>
            <input
              type="text"
              required
              placeholder="Es: Funzione Debounce con Timeout, Griglia CSS responsive..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Descrizione & Note</label>
            <input
              type="text"
              placeholder="Spiega a cosa serve o quando usarlo..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">Codice *</label>
              <span className="text-[10px] text-slate-500 font-mono">Mobile safe</span>
            </div>
            <textarea
              required
              rows={7}
              placeholder="// Incolla qui il tuo codice di esempio..."
              value={code}
              onChange={e => setCode(e.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              autoComplete="off"
              className="w-full font-mono rounded-xl border border-slate-300 bg-slate-950 text-slate-100 p-3 text-xs focus:ring-1 focus:ring-sky-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tag (separati da virgola)</label>
            <input
              type="text"
              placeholder="Es: Hooks, Form, Performance, Animazione"
              value={tagsStr}
              onChange={e => setTagsStr(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 shadow-xs"
            >
              Crea Snippet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- NEW TASK MODAL ---
export const NewTaskModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { activeTrackId, addTask } = useStudy();
  const defaultTrack = activeTrackId !== 'overview' ? activeTrackId : 'html';

  const [trackId, setTrackId] = useState(defaultTrack);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<TaskDifficulty>('base');
  const [priority, setPriority] = useState<TaskPriority>('media');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number | undefined>(60);
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      trackId,
      title,
      category: category.trim() || 'Generale',
      description: description || undefined,
      difficulty,
      priority,
      estimatedMinutes: estimatedMinutes ? Number(estimatedMinutes) : undefined,
      dueDate: dueDate || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-slate-700" />
            <h3 className="text-base font-bold text-slate-900">Nuovo Obiettivo di Studio</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Materia</label>
              <select
                value={trackId}
                onChange={e => setTrackId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 bg-white"
              >
                {TRACKS.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Livello Difficoltà</label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as TaskDifficulty)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 bg-white"
              >
                <option value="base">Base</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzato">Avanzato</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Titolo Obiettivo / Argomento *</label>
            <input
              type="text"
              required
              placeholder="Es: Comprendere le differenze tra flex-basis e width"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Categoria / Modulo</label>
            <input
              type="text"
              placeholder="Es: Layout, Asincronia, Componenti, OOP"
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Dettagli / Esercizio</label>
            <textarea
              rows={2}
              placeholder="Descrizione opzionale dei requisiti o mini-progetto..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Minuti Stimati</label>
              <input
                type="number"
                value={estimatedMinutes || ''}
                onChange={e => setEstimatedMinutes(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="60"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Data Target (opzionale)</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 shadow-xs"
            >
              Aggiungi Obiettivo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- NEW BOOK MODAL ---
export const NewBookModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { activeTrackId, addBook } = useStudy();
  const defaultTrack = activeTrackId !== 'overview' ? activeTrackId : 'javascript';

  const [trackId, setTrackId] = useState(defaultTrack);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState<BookStatus>('reading');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(300);
  const [keyTakeaways, setKeyTakeaways] = useState('');
  const [notes, setNotes] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    addBook({
      trackId,
      title,
      author,
      status,
      currentPage: Number(currentPage),
      totalPages: Number(totalPages),
      keyTakeaways: keyTakeaways || undefined,
      notes: notes || undefined,
      linkUrl: linkUrl || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-amber-600" />
            <h3 className="text-base font-bold text-slate-900">Aggiungi Libro di Riferimento</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Materia</label>
              <select
                value={trackId}
                onChange={e => setTrackId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 bg-white"
              >
                {TRACKS.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Stato</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as BookStatus)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 bg-white"
              >
                <option value="reading">In Lettura</option>
                <option value="to_read">Da Leggere</option>
                <option value="completed">Completato</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Titolo del Libro *</label>
            <input
              type="text"
              required
              placeholder="Es: Eloquent JavaScript, Fluent Python..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Autore *</label>
            <input
              type="text"
              required
              placeholder="Es: Marijn Haverbeke, Eric Meyer..."
              value={author}
              onChange={e => setAuthor(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pagina Attuale</label>
              <input
                type="number"
                min={0}
                value={currentPage}
                onChange={e => setCurrentPage(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pagine Totali</label>
              <input
                type="number"
                min={1}
                value={totalPages}
                onChange={e => setTotalPages(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Punti Chiave / Takeaways</label>
            <textarea
              rows={2}
              placeholder="Le scoperte e i concetti fondamentali..."
              value={keyTakeaways}
              onChange={e => setKeyTakeaways(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Appunti Personali sul Libro (opzionale)</label>
            <textarea
              rows={3}
              placeholder="Scrivi qui i tuoi appunti, riassunti di capitoli o note di studio..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Link Scheda / Web (opzionale)</label>
            <input
              type="url"
              placeholder="https://..."
              value={linkUrl}
              onChange={e => setLinkUrl(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
            >
              Salva Libro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- NEW RESOURCE MODAL ---
export const NewResourceModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { activeTrackId, addResource } = useStudy();
  const defaultTrack = activeTrackId !== 'overview' ? activeTrackId : 'html';

  const [trackId, setTrackId] = useState(defaultTrack);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<ResourceType>('doc');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    addResource({
      trackId,
      title,
      url,
      type,
      description: description || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-sky-600" />
            <h3 className="text-base font-bold text-slate-900">Aggiungi Link & Documentazione</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Materia</label>
              <select
                value={trackId}
                onChange={e => setTrackId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 bg-white"
              >
                {TRACKS.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tipologia</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as ResourceType)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 bg-white"
              >
                <option value="doc">Documentazione</option>
                <option value="tutorial">Tutorial</option>
                <option value="cheatsheet">Cheat Sheet</option>
                <option value="video">Video</option>
                <option value="tool">Tool / Strumento</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Titolo *</label>
            <input
              type="text"
              required
              placeholder="Es: MDN Web Docs - Array Methods"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">URL *</label>
            <input
              type="url"
              required
              placeholder="https://..."
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Descrizione</label>
            <textarea
              rows={2}
              placeholder="Breve appunto sulla risorsa..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
            >
              Salva Risorsa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- NEW NOTE MODAL ---
export const NewNoteModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { activeTrackId, addNote } = useStudy();
  const defaultTrack = activeTrackId !== 'overview' ? activeTrackId : 'html';

  const [trackId, setTrackId] = useState(defaultTrack);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagsStr
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    addNote({
      trackId,
      title,
      content,
      tags,
      isPinned,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 p-0 sm:p-4 backdrop-blur-xs overscroll-contain">
      <div className="w-full max-w-xl max-h-[92dvh] sm:max-h-[85vh] flex flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl border border-slate-200">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-slate-700" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900">Nuovo Appunto di Studio</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Materia</label>
              <select
                value={trackId}
                onChange={e => setTrackId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 bg-white"
              >
                {TRACKS.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={e => setIsPinned(e.target.checked)}
                  className="rounded text-slate-900 focus:ring-slate-900"
                />
                <span>Fissa in evidenza</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Titolo dell'Appunto *</label>
            <input
              type="text"
              required
              placeholder="Es: Differenza tra Array.map e Array.forEach..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Contenuto Appunti / CheatSheet *</label>
            <textarea
              required
              rows={8}
              placeholder="Scrivi qui i tuoi appunti, spiegazioni ed elenchi puntati..."
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full font-mono rounded-xl border border-slate-300 p-3 text-xs text-slate-800 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tag (separati da virgola)</label>
            <input
              type="text"
              placeholder="Es: BestPractice, ES6, Regole"
              value={tagsStr}
              onChange={e => setTagsStr(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800"
            >
              Salva Appunto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
