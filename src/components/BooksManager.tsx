import React, { useState, useMemo } from 'react';
import { useStudy } from '../context/StudyContext';
import { getTrackById, TRACKS } from '../data/tracks';
import { ReferenceBook, BookStatus, TrackId } from '../types';
import {
  BookOpen,
  Plus,
  Search,
  Trash2,
  Edit3,
  Bookmark,
  CheckCircle2,
  Clock,
  Check,
  X,
  FileText,
  Save,
  Tag,
  Sparkles
} from 'lucide-react';

interface BooksManagerProps {
  onOpenNewBookModal?: () => void;
}

export const BooksManager: React.FC<BooksManagerProps> = ({ onOpenNewBookModal }) => {
  const {
    data,
    activeTrackId,
    deleteBook,
    updateBookProgress,
    updateBook,
    addBook,
  } = useStudy();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | BookStatus>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);

  // Quick inline notes editor
  const [activeNotesBookId, setActiveNotesBookId] = useState<string | null>(null);
  const [editingNotesText, setEditingNotesText] = useState('');

  // New book form state
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newTrackId, setNewTrackId] = useState<TrackId>(
    activeTrackId !== 'overview' ? (activeTrackId as TrackId) : 'javascript'
  );
  const [newStatus, setNewStatus] = useState<BookStatus>('reading');
  const [newTotalPages, setNewTotalPages] = useState('300');
  const [newCurrentPage, setNewCurrentPage] = useState('1');
  const [newNotes, setNewNotes] = useState('');
  const [newKeyTakeaways, setNewKeyTakeaways] = useState('');

  // Filter books
  const filteredBooks = useMemo(() => {
    return data.books.filter(b => {
      if (activeTrackId !== 'overview' && b.trackId !== activeTrackId) return false;
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          (b.notes && b.notes.toLowerCase().includes(q)) ||
          (b.keyTakeaways && b.keyTakeaways.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [data.books, activeTrackId, statusFilter, searchQuery]);

  const activeTrackObj = activeTrackId !== 'overview' ? getTrackById(activeTrackId) : null;

  const handleOpenAddModal = () => {
    setNewTitle('');
    setNewAuthor('');
    setNewTrackId(activeTrackId !== 'overview' ? (activeTrackId as TrackId) : 'javascript');
    setNewStatus('reading');
    setNewTotalPages('300');
    setNewCurrentPage('1');
    setNewNotes('');
    setNewKeyTakeaways('');
    setIsAddModalOpen(true);
  };

  const handleSaveNewBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addBook({
      trackId: newTrackId,
      title: newTitle.trim(),
      author: newAuthor.trim() || 'Autore non specificato',
      status: newStatus,
      currentPage: parseInt(newCurrentPage, 10) || 0,
      totalPages: parseInt(newTotalPages, 10) || 100,
      notes: newNotes.trim() || undefined,
      keyTakeaways: newKeyTakeaways.trim() || undefined,
    });

    setIsAddModalOpen(false);
  };

  const handleOpenNotesEditor = (book: ReferenceBook) => {
    setActiveNotesBookId(book.id);
    setEditingNotesText(book.notes || '');
  };

  const handleSaveNotes = (bookId: string) => {
    updateBook(bookId, { notes: editingNotesText });
    setActiveNotesBookId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-2xs"
              style={{ backgroundColor: activeTrackObj?.color || '#4f46e5' }}
            >
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Libri & Testi di Riferimento con Appunti
              </h2>
              <p className="text-xs text-slate-500">
                {activeTrackObj
                  ? `Manuali, guide e libri di riferimento per ${activeTrackObj.name}`
                  : 'Tutti i libri di studio registrati'}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-95 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Aggiungi Libro di Riferimento</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cerca per titolo, autore o appunti..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500"
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

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {(
            [
              { id: 'all', label: 'Tutti' },
              { id: 'reading', label: 'In Lettura' },
              { id: 'completed', label: 'Completati' },
              { id: 'to_read', label: 'Da Leggere' },
            ] as const
          ).map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Books List Grid */}
      {filteredBooks.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white py-16 px-6 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            Nessun libro di riferimento trovato
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? 'Nessun risultato corrisponde ai criteri di ricerca inseriti.'
              : 'Aggiungi i nomi dei libri che stai studiando per tenere traccia dei capitoli e salvare i tuoi appunti.'}
          </p>
          <button
            onClick={handleOpenAddModal}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Aggiungi il primo libro</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredBooks.map(book => {
            const track = getTrackById(book.trackId);
            const total = book.totalPages || 1;
            const current = book.currentPage || 0;
            const percent = Math.min(100, Math.round((current / total) * 100));
            const isEditingNotes = activeNotesBookId === book.id;

            return (
              <div
                key={book.id}
                className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xs transition hover:border-slate-300 hover:shadow-md"
              >
                <div>
                  {/* Top line: Subject badge & Status badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="rounded-lg px-2.5 py-1 text-[11px] font-bold text-white"
                        style={{ backgroundColor: track.color }}
                      >
                        {track.name}
                      </span>
                      <span
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                          book.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : book.status === 'reading'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {book.status === 'completed'
                          ? 'Completato'
                          : book.status === 'reading'
                          ? 'In Lettura'
                          : 'Da Leggere'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => deleteBook(book.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                        title="Elimina libro"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Book Title & Author */}
                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                    {book.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Autore: <span className="font-semibold text-slate-700">{book.author}</span>
                  </p>

                  {/* Key takeaways / Sintesi rapida if present */}
                  {book.keyTakeaways && (
                    <div className="mt-3 rounded-xl bg-slate-50 border border-slate-100 p-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                        Concetto Chiave
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {book.keyTakeaways}
                      </p>
                    </div>
                  )}

                  {/* Appunti e Note Personali sul Libro */}
                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        <FileText className="h-3.5 w-3.5 text-indigo-600" />
                        <span>Appunti & Note sul Libro</span>
                      </div>
                      {!isEditingNotes && (
                        <button
                          onClick={() => handleOpenNotesEditor(book)}
                          className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
                        >
                          <Edit3 className="h-3 w-3" />
                          <span>{book.notes ? 'Modifica Appunti' : '+ Scrivi Appunti'}</span>
                        </button>
                      )}
                    </div>

                    {isEditingNotes ? (
                      <div className="space-y-2 mt-2">
                        <textarea
                          rows={4}
                          value={editingNotesText}
                          onChange={e => setEditingNotesText(e.target.value)}
                          placeholder="Scrivi qui i tuoi appunti, riassunti di capitolo, formule o definizioni apprese da questo libro..."
                          className="w-full rounded-xl border border-indigo-300 p-3 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setActiveNotesBookId(null)}
                            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                          >
                            Annulla
                          </button>
                          <button
                            onClick={() => handleSaveNotes(book.id)}
                            className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-indigo-700"
                          >
                            <Save className="h-3.5 w-3.5" />
                            <span>Salva Appunti</span>
                          </button>
                        </div>
                      </div>
                    ) : book.notes ? (
                      <div className="rounded-xl bg-indigo-50/50 border border-indigo-100 p-3 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {book.notes}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">
                        Nessun appunto ancora inserito. Clicca su "+ Scrivi Appunti" per aggiungere nozioni.
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom: Reading Progress Bar & Controls */}
                <div className="mt-5 border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                    <span>Avanzamento Pagine / Capitoli</span>
                    <span className="font-mono text-indigo-600 font-bold">
                      {current} / {total} ({percent}%)
                    </span>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: track.color || '#4f46e5',
                      }}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-slate-500">Pagina attuale:</span>
                      <input
                        type="number"
                        min="0"
                        max={total}
                        value={current}
                        onChange={e => {
                          const val = parseInt(e.target.value, 10) || 0;
                          const newSt = val >= total ? 'completed' : val > 0 ? 'reading' : 'to_read';
                          updateBookProgress(book.id, val, newSt);
                        }}
                        className="w-16 rounded-lg border border-slate-200 px-2 py-1 text-center font-mono text-xs font-bold text-slate-800"
                      />
                    </div>

                    <select
                      value={book.status}
                      onChange={e =>
                        updateBook(book.id, { status: e.target.value as BookStatus })
                      }
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 focus:outline-hidden"
                    >
                      <option value="to_read">Da Leggere</option>
                      <option value="reading">In Lettura</option>
                      <option value="completed">Completato</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Book Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Aggiungi Libro di Riferimento
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewBook} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Titolo del Libro / Manuale *
                </label>
                <input
                  type="text"
                  placeholder="Es. Eloquent JavaScript o Fluent Python"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Autore
                  </label>
                  <input
                    type="text"
                    placeholder="Es. Marijn Haverbeke"
                    value={newAuthor}
                    onChange={e => setNewAuthor(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Materia di Riferimento *
                  </label>
                  <select
                    value={newTrackId}
                    onChange={e => setNewTrackId(e.target.value as TrackId)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
                  >
                    {TRACKS.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Stato
                  </label>
                  <select
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value as BookStatus)}
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-800"
                  >
                    <option value="to_read">Da Leggere</option>
                    <option value="reading">In Lettura</option>
                    <option value="completed">Completato</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pagine Totali
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newTotalPages}
                    onChange={e => setNewTotalPages(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pagina Attuale
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newCurrentPage}
                    onChange={e => setNewCurrentPage(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sintesi o Concetti Chiave (opzionale)
                </label>
                <input
                  type="text"
                  placeholder="Es. Fondamentale per capire asincronia e closures"
                  value={newKeyTakeaways}
                  onChange={e => setNewKeyTakeaways(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Appunti Iniziali sul Libro (opzionale)
                </label>
                <textarea
                  rows={3}
                  placeholder="Scrivi qui i tuoi primi appunti, capitoli importanti, o note personali..."
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700"
                >
                  Salva Libro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
