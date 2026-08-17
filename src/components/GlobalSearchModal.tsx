import React, { useState, useMemo, useEffect } from 'react';
import { useStudy } from '../context/StudyContext';
import { getTrackById, TRACKS } from '../data/tracks';
import {
  Search,
  X,
  Code2,
  ListTodo,
  BookOpen,
  Link as LinkIcon,
  FileText,
  ArrowRight
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const { data, setActiveTrackId, setActiveTab } = useStudy();
  const [query, setQuery] = useState('');

  // Keyboard shortcut Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();

    const matchingSnippets = data.snippets.filter(
      s =>
        s.title.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.tags.some(t => t.toLowerCase().includes(q))
    );

    const matchingTasks = data.tasks.filter(
      t =>
        t.title.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.notes?.toLowerCase().includes(q)
    );

    const matchingBooks = data.books.filter(
      b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.keyTakeaways?.toLowerCase().includes(q)
    );

    const matchingResources = data.resources.filter(
      r =>
        r.title.toLowerCase().includes(q) ||
        r.url.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q)
    );

    const matchingNotes = data.notes.filter(
      n =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags.some(t => t.toLowerCase().includes(q))
    );

    const totalCount =
      matchingSnippets.length +
      matchingTasks.length +
      matchingBooks.length +
      matchingResources.length +
      matchingNotes.length;

    return {
      totalCount,
      snippets: matchingSnippets,
      tasks: matchingTasks,
      books: matchingBooks,
      resources: matchingResources,
      notes: matchingNotes,
    };
  }, [query, data]);

  if (!isOpen) return null;

  const handleSelect = (trackId: string, tab: any) => {
    setActiveTrackId(trackId);
    setActiveTab(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 p-4 pt-16 sm:pt-24 backdrop-blur-xs">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Search input bar */}
        <div className="flex items-center border-b border-slate-200 px-4 py-3 bg-slate-50">
          <Search className="h-5 w-5 text-slate-400 mr-3" />
          <input
            autoFocus
            type="text"
            placeholder="Cerca tra tutti i linguaggi: snippet, task, libri, documentazione..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden"
          />
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[65vh] overflow-y-auto p-4 space-y-5">
          {!results ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Digita per cercare contemporaneamente in HTML, CSS, JavaScript, Tailwind, React e Python...
            </div>
          ) : results.totalCount === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              Nessun risultato per "<strong>{query}</strong>"
            </div>
          ) : (
            <>
              {/* Snippets */}
              {results.snippets.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">
                    <Code2 className="h-4 w-4 text-emerald-500" />
                    <span>Snippet di Codice ({results.snippets.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.snippets.map(s => {
                      const track = getTrackById(s.trackId);
                      return (
                        <div
                          key={s.id}
                          onClick={() => handleSelect(s.trackId, 'snippets')}
                          className="group flex cursor-pointer items-center justify-between rounded-xl p-2.5 hover:bg-slate-100 transition"
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase"
                              style={{ backgroundColor: `${track.color}15`, color: track.color }}
                            >
                              {track.shortName}
                            </span>
                            <span className="text-xs font-semibold text-slate-800">
                              {s.title}
                            </span>
                          </div>
                          <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tasks */}
              {results.tasks.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">
                    <ListTodo className="h-4 w-4 text-blue-500" />
                    <span>Obiettivi di Studio ({results.tasks.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.tasks.map(t => {
                      const track = getTrackById(t.trackId);
                      return (
                        <div
                          key={t.id}
                          onClick={() => handleSelect(t.trackId, 'planner')}
                          className="group flex cursor-pointer items-center justify-between rounded-xl p-2.5 hover:bg-slate-100 transition"
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase"
                              style={{ backgroundColor: `${track.color}15`, color: track.color }}
                            >
                              {track.shortName}
                            </span>
                            <span className={`text-xs font-medium ${t.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                              {t.title}
                            </span>
                          </div>
                          <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Books */}
              {results.books.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">
                    <BookOpen className="h-4 w-4 text-amber-500" />
                    <span>Libri di Riferimento ({results.books.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.books.map(b => {
                      const track = getTrackById(b.trackId);
                      return (
                        <div
                          key={b.id}
                          onClick={() => handleSelect(b.trackId, 'resources')}
                          className="group flex cursor-pointer items-center justify-between rounded-xl p-2.5 hover:bg-slate-100 transition"
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase"
                              style={{ backgroundColor: `${track.color}15`, color: track.color }}
                            >
                              {track.shortName}
                            </span>
                            <div>
                              <span className="text-xs font-bold text-slate-800 block">
                                {b.title}
                              </span>
                              <span className="text-[11px] text-slate-500">di {b.author}</span>
                            </div>
                          </div>
                          <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Resources */}
              {results.resources.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">
                    <LinkIcon className="h-4 w-4 text-sky-500" />
                    <span>Link Web & Documentazione ({results.resources.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.resources.map(r => {
                      const track = getTrackById(r.trackId);
                      return (
                        <div
                          key={r.id}
                          onClick={() => handleSelect(r.trackId, 'resources')}
                          className="group flex cursor-pointer items-center justify-between rounded-xl p-2.5 hover:bg-slate-100 transition"
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase"
                              style={{ backgroundColor: `${track.color}15`, color: track.color }}
                            >
                              {track.shortName}
                            </span>
                            <span className="text-xs font-semibold text-slate-800 truncate max-w-sm">
                              {r.title}
                            </span>
                          </div>
                          <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Notes */}
              {results.notes.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">
                    <FileText className="h-4 w-4 text-purple-500" />
                    <span>Appunti & CheatSheet ({results.notes.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.notes.map(n => {
                      const track = getTrackById(n.trackId);
                      return (
                        <div
                          key={n.id}
                          onClick={() => handleSelect(n.trackId, 'notes')}
                          className="group flex cursor-pointer items-center justify-between rounded-xl p-2.5 hover:bg-slate-100 transition"
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase"
                              style={{ backgroundColor: `${track.color}15`, color: track.color }}
                            >
                              {track.shortName}
                            </span>
                            <span className="text-xs font-semibold text-slate-800">
                              {n.title}
                            </span>
                          </div>
                          <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
