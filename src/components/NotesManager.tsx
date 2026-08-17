import React, { useState, useMemo } from 'react';
import { useStudy } from '../context/StudyContext';
import { getTrackById, TRACKS } from '../data/tracks';
import { StudyNote } from '../types';
import {
  FileText,
  Pin,
  Plus,
  Search,
  Trash2,
  Edit3,
  Copy,
  Check,
  Tag,
  X,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface NotesManagerProps {
  onOpenNewNoteModal: () => void;
}

export const NotesManager: React.FC<NotesManagerProps> = ({ onOpenNewNoteModal }) => {
  const { data, activeTrackId, deleteNote, togglePinNote, updateNote } = useStudy();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [editingNote, setEditingNote] = useState<StudyNote | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter notes
  const notes = useMemo(() => {
    return data.notes
      .filter(n => {
        if (activeTrackId !== 'overview' && n.trackId !== activeTrackId) return false;
        if (selectedTag !== 'all' && !n.tags.includes(selectedTag)) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            n.title.toLowerCase().includes(q) ||
            n.content.toLowerCase().includes(q) ||
            n.tags.some(t => t.toLowerCase().includes(q))
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [data.notes, activeTrackId, selectedTag, searchQuery]);

  // Extract all tags
  const allTags = useMemo(() => {
    const relevant = activeTrackId === 'overview'
      ? data.notes
      : data.notes.filter(n => n.trackId === activeTrackId);
    const tags = new Set<string>();
    relevant.forEach(n => n.tags.forEach(t => tags.add(t)));
    return Array.from(tags);
  }, [data.notes, activeTrackId]);

  const handleCopyNote = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="py-6">
      {/* Header Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[240px] flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cerca appunti e note di studio..."
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
        </div>

        <button
          onClick={onOpenNewNoteModal}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800 active:scale-95 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Nuovo Appunto</span>
        </button>
      </div>

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mb-6">
          <span className="text-[11px] font-medium text-slate-400 mr-1">Tag:</span>
          <button
            onClick={() => setSelectedTag('all')}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
              selectedTag === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tutti
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? 'all' : tag)}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                selectedTag === tag
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Tag className="h-3 w-3 opacity-60" />
              <span>{tag}</span>
            </button>
          ))}
        </div>
      )}

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-base font-bold text-slate-800">
            Nessun appunto trovato
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
            Scrivi note personali, schemi riassuntivi, promemoria e cheat sheet durante le tue sessioni di studio.
          </p>
          <button
            onClick={onOpenNewNoteModal}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            <span>Scrivi il primo appunto</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notes.map(note => {
            const track = getTrackById(note.trackId);
            const isCopied = copiedId === note.id;

            return (
              <div
                key={note.id}
                className={`flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-xs transition hover:border-slate-300 ${
                  note.isPinned ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200'
                }`}
              >
                <div>
                  {/* Top: Track, Pin badge & Actions */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                        style={{ backgroundColor: `${track.color}15`, color: track.color }}
                      >
                        {track.name}
                      </span>
                      {note.isPinned && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                          <Pin className="h-3 w-3 fill-amber-500 text-amber-600" />
                          <span>In Evidenza</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => togglePinNote(note.id)}
                        className={`flex h-7 w-7 items-center justify-center rounded-lg transition ${
                          note.isPinned
                            ? 'text-amber-600 bg-amber-50'
                            : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                        }`}
                        title={note.isPinned ? 'Rimuovi da in evidenza' : 'Fissa in evidenza'}
                      >
                        <Pin className={`h-3.5 w-3.5 ${note.isPinned ? 'fill-amber-500' : ''}`} />
                      </button>

                      <button
                        onClick={() => handleCopyNote(note.id, `${note.title}\n\n${note.content}`)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        title="Copia appunto"
                      >
                        {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>

                      <button
                        onClick={() => setEditingNote(note)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Eliminare l'appunto "${note.title}"?`)) {
                            deleteNote(note.id);
                          }
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="mt-3 text-base font-bold text-slate-900">
                    {note.title}
                  </h3>

                  {/* Markdown formatted content */}
                  <div className="mt-2.5 whitespace-pre-wrap text-xs leading-relaxed text-slate-700 font-sans font-normal">
                    {note.content}
                  </div>
                </div>

                {/* Tags & Date footer */}
                <div className="mt-5 border-t border-slate-100 pt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                  <div className="flex flex-wrap items-center gap-1">
                    {note.tags.map(t => (
                      <span key={t} className="rounded bg-slate-100 px-1.5 py-0.2 font-mono text-[10px] text-slate-600">
                        #{t}
                      </span>
                    ))}
                  </div>
                  <span>
                    Aggiornato il {new Date(note.updatedAt).toLocaleDateString('it-IT')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Note Modal */}
      {editingNote && (
        <EditNoteModal
          note={editingNote}
          onClose={() => setEditingNote(null)}
          onSave={updated => {
            updateNote(editingNote.id, updated);
            setEditingNote(null);
          }}
        />
      )}
    </div>
  );
};

const EditNoteModal: React.FC<{
  note: StudyNote;
  onClose: () => void;
  onSave: (updated: Partial<StudyNote>) => void;
}> = ({ note, onClose, onSave }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tagsStr, setTagsStr] = useState(note.tags.join(', '));
  const [isPinned, setIsPinned] = useState(note.isPinned);
  const [trackId, setTrackId] = useState(note.trackId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagsStr
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    onSave({
      title,
      content,
      tags,
      isPinned,
      trackId,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <h3 className="text-base font-bold text-slate-900">Modifica Appunto di Studio</h3>
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
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Contenuto / Schemi / Codice *</label>
            <textarea
              required
              rows={8}
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full font-mono rounded-xl border border-slate-300 p-3 text-xs text-slate-800 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tag (separati da virgola)</label>
            <input
              type="text"
              value={tagsStr}
              onChange={e => setTagsStr(e.target.value)}
              placeholder="Es: BestPractice, CheatSheet, ES6"
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
