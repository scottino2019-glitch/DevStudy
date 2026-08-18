import React, { useState, useMemo } from 'react';
import { useStudy } from '../context/StudyContext';
import { getTrackById, TRACKS } from '../data/tracks';
import { ReferenceBook, ReferenceResource, ResourceType, BookStatus } from '../types';
import {
  BookOpen,
  ExternalLink,
  Plus,
  Search,
  Star,
  Trash2,
  Edit3,
  Bookmark,
  CheckCircle2,
  Clock,
  Link as LinkIcon,
  Video,
  FileText,
  Wrench,
  Copy,
  Check,
  X,
  Library,
  Sparkles
} from 'lucide-react';

interface ResourcesManagerProps {
  onOpenNewResourceModal: () => void;
  onOpenNewBookModal: () => void;
}

export const ResourcesManager: React.FC<ResourcesManagerProps> = ({
  onOpenNewResourceModal,
  onOpenNewBookModal,
}) => {
  const {
    data,
    activeTrackId,
    deleteBook,
    updateBookProgress,
    updateBook,
    deleteResource,
    toggleFavoriteResource,
    updateResource,
  } = useStudy();

  const [subTab, setSubTab] = useState<'books' | 'links'>('books');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingBook, setEditingBook] = useState<ReferenceBook | null>(null);
  const [editingResource, setEditingResource] = useState<ReferenceResource | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter books
  const books = useMemo(() => {
    return data.books.filter(b => {
      if (activeTrackId !== 'overview' && b.trackId !== activeTrackId) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.keyTakeaways?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [data.books, activeTrackId, searchQuery]);

  // Filter web resources
  const resources = useMemo(() => {
    return data.resources.filter(r => {
      if (activeTrackId !== 'overview' && r.trackId !== activeTrackId) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.title.toLowerCase().includes(q) ||
          r.url.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [data.resources, activeTrackId, searchQuery]);

  const handleCopyLink = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getResourceTypeIcon = (type: ResourceType) => {
    switch (type) {
      case 'doc':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'video':
        return <Video className="h-4 w-4 text-red-500" />;
      case 'tutorial':
        return <Sparkles className="h-4 w-4 text-amber-500" />;
      case 'cheatsheet':
        return <Bookmark className="h-4 w-4 text-emerald-500" />;
      case 'tool':
        return <Wrench className="h-4 w-4 text-purple-500" />;
      default:
        return <LinkIcon className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className="py-6">
      {/* Sub-tab switcher: Libri vs Link Web */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 p-1">
          <button
            onClick={() => setSubTab('books')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              subTab === 'books'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="h-4 w-4 text-amber-600" />
            <span>Libri di Riferimento</span>
            <span className="rounded-full bg-slate-200 px-1.5 py-0.2 font-mono text-[10px] text-slate-700">
              {books.length}
            </span>
          </button>

          <button
            onClick={() => setSubTab('links')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              subTab === 'links'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LinkIcon className="h-4 w-4 text-sky-600" />
            <span>Documentazione & Link Web</span>
            <span className="rounded-full bg-slate-200 px-1.5 py-0.2 font-mono text-[10px] text-slate-700">
              {resources.length}
            </span>
          </button>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          {subTab === 'books' ? (
            <button
              onClick={onOpenNewBookModal}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800 active:scale-95 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Aggiungi Libro</span>
            </button>
          ) : (
            <button
              onClick={onOpenNewResourceModal}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800 active:scale-95 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Aggiungi Link / Doc</span>
            </button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder={subTab === 'books' ? 'Cerca per titolo, autore o appunti libro...' : 'Cerca per titolo, url o descrizione...'}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-slate-400 focus:outline-hidden shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* CONTENT: BOOKS VIEW */}
      {subTab === 'books' && (
        <>
          {books.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
              <Library className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-base font-bold text-slate-800">
                Nessun libro salvato
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
                Salva manuali tecnici, libri di riferimento e tieni traccia del numero di pagine lette.
              </p>
              <button
                onClick={onOpenNewBookModal}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800"
              >
                <Plus className="h-4 w-4" />
                <span>Aggiungi il primo Libro</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {books.map(book => {
                const track = getTrackById(book.trackId);
                const percent =
                  book.totalPages > 0
                    ? Math.round((book.currentPage / book.totalPages) * 100)
                    : 0;

                return (
                  <div
                    key={book.id}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-slate-300"
                  >
                    <div>
                      {/* Top row: Track & Status badge */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                            style={{ backgroundColor: `${track.color}15`, color: track.color }}
                          >
                            {track.name}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                              book.status === 'completed'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : book.status === 'reading'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {book.status === 'completed'
                              ? 'Completato'
                              : book.status === 'reading'
                              ? 'In Lettura'
                              : 'Da Leggere'}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingBook(book)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                            title="Modifica Libro"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => deleteBook(book.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 active:scale-95 transition"
                            title="Elimina Libro"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Title & Author */}
                      <h3 className="mt-3 text-base font-bold text-slate-900 leading-snug">
                        {book.title}
                      </h3>
                      <p className="text-xs font-medium text-slate-500">
                        di {book.author}
                      </p>

                      {/* Key Takeaways */}
                      {book.keyTakeaways && (
                        <div className="mt-3 rounded-xl bg-slate-50 border border-slate-200/70 p-3 text-xs text-slate-700 leading-relaxed">
                          <span className="font-bold text-slate-900">💡 Concetti Chiave: </span>
                          {book.keyTakeaways}
                        </div>
                      )}

                      {/* Notes */}
                      {book.notes && (
                        <p className="mt-2 text-xs text-slate-600 italic">
                          "{book.notes}"
                        </p>
                      )}
                    </div>

                    {/* Reading Progress Tracker Controls */}
                    <div className="mt-5 border-t border-slate-100 pt-4">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <div className="flex items-center gap-1.5 font-medium text-slate-700">
                          <span>Pagina:</span>
                          <input
                            type="number"
                            min={0}
                            max={book.totalPages || 9999}
                            value={book.currentPage}
                            onChange={e => {
                              const val = Math.max(0, parseInt(e.target.value) || 0);
                              updateBookProgress(book.id, val);
                            }}
                            className="w-16 rounded-md border border-slate-300 px-1.5 py-0.5 text-center font-mono font-bold text-slate-900"
                          />
                          <span className="text-slate-400">/ {book.totalPages} pag.</span>
                        </div>

                        <span className="font-mono font-bold text-slate-800">
                          {percent}%
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200/80">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${percent}%`,
                            backgroundColor: book.status === 'completed' ? '#10B981' : track.color,
                          }}
                        />
                      </div>

                      {/* External Link */}
                      {book.linkUrl && (
                        <div className="mt-3 flex justify-end">
                          <a
                            href={book.linkUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900"
                          >
                            <span>Scheda / Acquisto</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* CONTENT: WEB LINKS VIEW */}
      {subTab === 'links' && (
        <>
          {resources.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
              <LinkIcon className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-base font-bold text-slate-800">
                Nessuna risorsa web salvata
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
                Salva link alla documentazione ufficiale, cheat sheet, video lezioni e articoli di riferimento.
              </p>
              <button
                onClick={onOpenNewResourceModal}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800"
              >
                <Plus className="h-4 w-4" />
                <span>Salva il primo Link</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map(res => {
                const track = getTrackById(res.trackId);
                const isCopied = copiedId === res.id;

                return (
                  <div
                    key={res.id}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-slate-300"
                  >
                    <div>
                      {/* Top badges & favorite */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                            style={{ backgroundColor: `${track.color}15`, color: track.color }}
                          >
                            {track.name}
                          </span>
                          <span className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 capitalize">
                            {getResourceTypeIcon(res.type)}
                            <span>{res.type}</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleFavoriteResource(res.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-amber-500"
                            title="Aggiungi ai preferiti"
                          >
                            <Star className={`h-3.5 w-3.5 ${res.isFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
                          </button>
                          <button
                            onClick={() => setEditingResource(res)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => deleteResource(res.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 active:scale-95 transition"
                            title="Elimina risorsa"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h4 className="mt-2 text-sm font-bold text-slate-900 leading-snug">
                        {res.title}
                      </h4>

                      {/* Description */}
                      {res.description && (
                        <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                          {res.description}
                        </p>
                      )}
                    </div>

                    {/* Bottom row: URL & Open Button */}
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                      <button
                        onClick={() => handleCopyLink(res.id, res.url)}
                        className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-slate-700 transition truncate max-w-[200px]"
                        title="Copia link"
                      >
                        {isCopied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                        <span className="truncate">{res.url.replace(/^https?:\/\//, '')}</span>
                      </button>

                      <a
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-slate-800 active:scale-95 transition"
                      >
                        <span>Apri</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Edit Book Modal */}
      {editingBook && (
        <EditBookModal
          book={editingBook}
          onClose={() => setEditingBook(null)}
          onSave={updated => {
            updateBook(editingBook.id, updated);
            setEditingBook(null);
          }}
        />
      )}

      {/* Edit Resource Modal */}
      {editingResource && (
        <EditResourceModal
          resource={editingResource}
          onClose={() => setEditingResource(null)}
          onSave={updated => {
            updateResource(editingResource.id, updated);
            setEditingResource(null);
          }}
        />
      )}
    </div>
  );
};

// Edit Book Modal Sub-Component
const EditBookModal: React.FC<{
  book: ReferenceBook;
  onClose: () => void;
  onSave: (updated: Partial<ReferenceBook>) => void;
}> = ({ book, onClose, onSave }) => {
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [status, setStatus] = useState<BookStatus>(book.status);
  const [currentPage, setCurrentPage] = useState(book.currentPage);
  const [totalPages, setTotalPages] = useState(book.totalPages);
  const [keyTakeaways, setKeyTakeaways] = useState(book.keyTakeaways || '');
  const [notes, setNotes] = useState(book.notes || '');
  const [linkUrl, setLinkUrl] = useState(book.linkUrl || '');
  const [trackId, setTrackId] = useState(book.trackId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    onSave({
      title,
      author,
      status,
      currentPage: Number(currentPage),
      totalPages: Number(totalPages),
      keyTakeaways: keyTakeaways || undefined,
      notes: notes || undefined,
      linkUrl: linkUrl || undefined,
      trackId,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <h3 className="text-base font-bold text-slate-900">Modifica Libro di Riferimento</h3>
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Stato Lettura</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as BookStatus)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 bg-white"
              >
                <option value="to_read">Da Leggere</option>
                <option value="reading">In Lettura</option>
                <option value="completed">Completato</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Titolo del Libro *</label>
            <input
              type="text"
              required
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">Punti Chiave Appresi</label>
            <textarea
              rows={2}
              value={keyTakeaways}
              onChange={e => setKeyTakeaways(e.target.value)}
              placeholder="I concetti più importanti scoperti durante la lettura..."
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Link di Riferimento / Web</label>
            <input
              type="url"
              value={linkUrl}
              onChange={e => setLinkUrl(e.target.value)}
              placeholder="https://..."
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
              Salva
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Resource Modal Sub-Component
const EditResourceModal: React.FC<{
  resource: ReferenceResource;
  onClose: () => void;
  onSave: (updated: Partial<ReferenceResource>) => void;
}> = ({ resource, onClose, onSave }) => {
  const [title, setTitle] = useState(resource.title);
  const [url, setUrl] = useState(resource.url);
  const [type, setType] = useState<ResourceType>(resource.type);
  const [description, setDescription] = useState(resource.description || '');
  const [trackId, setTrackId] = useState(resource.trackId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    onSave({
      title,
      url,
      type,
      description: description || undefined,
      trackId,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <h3 className="text-base font-bold text-slate-900">Modifica Link / Documentazione</h3>
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">Titolo Risorsa *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">URL / Link Web *</label>
            <input
              type="url"
              required
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Descrizione</label>
            <textarea
              rows={2}
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
              Salva
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
