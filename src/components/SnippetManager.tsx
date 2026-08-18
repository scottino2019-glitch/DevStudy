import React, { useState, useMemo } from 'react';
import { useStudy } from '../context/StudyContext';
import { getTrackById, TRACKS } from '../data/tracks';
import { CodeViewer } from './CodeViewer';
import { CodeSnippet } from '../types';
import { TrackIcon } from './TrackIcon';
import {
  Search,
  Plus,
  Star,
  Trash2,
  Edit3,
  Tag,
  Code2,
  X,
  Layers,
  Eye
} from 'lucide-react';

interface SnippetManagerProps {
  onOpenNewModal: () => void;
}

export const SnippetManager: React.FC<SnippetManagerProps> = ({ onOpenNewModal }) => {
  const { data, activeTrackId, setActiveTrackId, deleteSnippet, toggleFavoriteSnippet, updateSnippet } = useStudy();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [showAllPreviews, setShowAllPreviews] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<CodeSnippet | null>(null);

  // Filter snippets based on active track or all
  const snippets = useMemo(() => {
    return data.snippets.filter(s => {
      if (activeTrackId !== 'overview' && s.trackId !== activeTrackId) {
        return false;
      }
      if (onlyFavorites && !s.isFavorite) {
        return false;
      }
      if (selectedTag !== 'all' && !s.tags.includes(selectedTag)) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = s.title.toLowerCase().includes(query);
        const matchesDesc = s.description?.toLowerCase().includes(query);
        const matchesCode = s.code.toLowerCase().includes(query);
        const matchesTags = s.tags.some(t => t.toLowerCase().includes(query));
        return matchesTitle || matchesDesc || matchesCode || matchesTags;
      }
      return true;
    });
  }, [data.snippets, activeTrackId, onlyFavorites, selectedTag, searchQuery]);

  // Extract all unique tags for active track
  const allTags = useMemo(() => {
    const relevantSnippets = activeTrackId === 'overview'
      ? data.snippets
      : data.snippets.filter(s => s.trackId === activeTrackId);
    const tags = new Set<string>();
    relevantSnippets.forEach(s => s.tags.forEach(t => tags.add(t)));
    return Array.from(tags);
  }, [data.snippets, activeTrackId]);

  return (
    <div className="py-6">
      {/* Subject Filter Ribbon */}
      <div className="mb-6 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
        <button
          onClick={() => {
            setActiveTrackId('overview');
            setSelectedTag('all');
          }}
          className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition shadow-xs ${
            activeTrackId === 'overview'
              ? 'bg-slate-900 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Tutte le Materie</span>
          <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
            activeTrackId === 'overview' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
          }`}>
            {data.snippets.length}
          </span>
        </button>

        {TRACKS.map(track => {
          const trackCount = data.snippets.filter(s => s.trackId === track.id).length;
          const isActive = activeTrackId === track.id;
          return (
            <button
              key={track.id}
              onClick={() => {
                setActiveTrackId(track.id);
                setSelectedTag('all');
              }}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition shadow-xs ${
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div
                className="flex h-4 w-4 items-center justify-center rounded-md text-[10px]"
                style={{ color: isActive ? '#38bdf8' : track.color }}
              >
                <TrackIcon name={track.iconName} className="h-3.5 w-3.5" />
              </div>
              <span>{track.name}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  isActive
                    ? 'bg-slate-800 text-slate-200'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {trackCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Controls Bar: Search, Tags, Filter, Add */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search box */}
          <div className="relative min-w-[240px] flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cerca snippet per nome, codice o tag..."
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

          {/* Favorites filter */}
          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
              onlyFavorites
                ? 'border-amber-400 bg-amber-50 text-amber-800'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Star className={`h-3.5 w-3.5 ${onlyFavorites ? 'fill-amber-400 text-amber-500' : 'text-slate-400'}`} />
            <span>Preferiti</span>
          </button>

          {/* Toggle all previews */}
          <button
            onClick={() => setShowAllPreviews(!showAllPreviews)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
              showAllPreviews
                ? 'border-sky-500 bg-sky-50 text-sky-800'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
            title="Mostra l'anteprima live su tutti gli snippet"
          >
            <Eye className={`h-3.5 w-3.5 ${showAllPreviews ? 'text-sky-600' : 'text-slate-400'}`} />
            <span>{showAllPreviews ? 'Tutte Anteprime (Attive)' : 'Mostra Anteprime'}</span>
          </button>
        </div>

        {/* Add new snippet button */}
        <button
          onClick={onOpenNewModal}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800 active:scale-95 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Nuovo Snippet</span>
        </button>
      </div>

      {/* Tags chips */}
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
            Tutti ({activeTrackId === 'overview' ? data.snippets.length : data.snippets.filter(s => s.trackId === activeTrackId).length})
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

      {/* Snippet Grid / Cards */}
      {snippets.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <Code2 className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-800">
            Nessun frammento di codice trovato
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
            {searchQuery || selectedTag !== 'all' || onlyFavorites
              ? 'Nessun risultato corrisponde ai filtri selezionati.'
              : 'Salva esempi di codice, trucchi e pattern per consultarli o riutilizzarli in qualsiasi momento.'}
          </p>
          <button
            onClick={onOpenNewModal}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            <span>Crea il primo Snippet</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {snippets.map(snippet => {
            const track = getTrackById(snippet.trackId);
            return (
              <div
                key={snippet.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition hover:border-slate-300"
              >
                {/* Header of snippet card */}
                <div className="flex flex-col gap-2 border-b border-slate-100 bg-slate-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-2.5">
                    {/* Track Badge */}
                    <span
                      className="mt-0.5 inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider"
                      style={{ backgroundColor: `${track.color}15`, color: track.color }}
                    >
                      {track.shortName}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {snippet.title}
                      </h3>
                      {snippet.description && (
                        <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">
                          {snippet.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions (favorite, edit, delete) */}
                  <div className="flex items-center gap-1 self-end sm:self-center">
                    <button
                      onClick={() => toggleFavoriteSnippet(snippet.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-amber-500 transition"
                      title={snippet.isFavorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
                    >
                      <Star
                        className={`h-4 w-4 ${
                          snippet.isFavorite ? 'fill-amber-400 text-amber-500' : ''
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => setEditingSnippet(snippet)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                      title="Modifica Snippet"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteSnippet(snippet.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 active:scale-95 transition"
                      title="Elimina Snippet"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Tags */}
                {snippet.tags && snippet.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 px-4 pt-3 pb-1 bg-white">
                    {snippet.tags.map(t => (
                      <span
                        key={t}
                        onClick={() => setSelectedTag(t)}
                        className="cursor-pointer rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:bg-slate-200 transition"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Code display with line numbers and live preview */}
                <div className="p-4 pt-2">
                  <CodeViewer
                    code={snippet.code}
                    language={snippet.language}
                    allowPreview={true}
                    initialShowPreview={showAllPreviews}
                    customHtml={snippet.outputPreview}
                    onSaveCustomHtml={newHtml => {
                      updateSnippet(snippet.id, { outputPreview: newHtml });
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Snippet Modal */}
      {editingSnippet && (
        <EditSnippetModal
          snippet={editingSnippet}
          onClose={() => setEditingSnippet(null)}
          onSave={updated => {
            updateSnippet(editingSnippet.id, updated);
            setEditingSnippet(null);
          }}
        />
      )}
    </div>
  );
};

interface EditSnippetModalProps {
  snippet: CodeSnippet;
  onClose: () => void;
  onSave: (updated: Partial<CodeSnippet>) => void;
}

const EditSnippetModal: React.FC<EditSnippetModalProps> = ({ snippet, onClose, onSave }) => {
  const [title, setTitle] = useState(snippet.title);
  const [description, setDescription] = useState(snippet.description || '');
  const [code, setCode] = useState(snippet.code);
  const [language, setLanguage] = useState(snippet.language);
  const [outputPreview, setOutputPreview] = useState(snippet.outputPreview || '');
  const [tagsStr, setTagsStr] = useState(snippet.tags.join(', '));
  const [trackId, setTrackId] = useState(snippet.trackId);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim() || isSaving) return;
    setIsSaving(true);

    const tags = tagsStr
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    onSave({
      title: title.trim(),
      description: description.trim(),
      code,
      language,
      outputPreview: outputPreview.trim() || undefined,
      tags,
      trackId,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 p-0 sm:p-4 backdrop-blur-xs overscroll-contain">
      <div className="w-full max-w-2xl max-h-[92dvh] sm:max-h-[85vh] flex flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-slate-700" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900">Modifica Snippet di Codice</h3>
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Materia / Sessione</label>
              <select
                value={trackId}
                onChange={e => setTrackId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-medium text-slate-800 bg-white"
              >
                {TRACKS.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Linguaggio Sintassi</label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-medium text-slate-800 bg-white"
              >
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="javascript">JavaScript</option>
                <option value="tsx">React (TSX / JSX)</option>
                <option value="python">Python</option>
                <option value="plaintext">Testo Semplice</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Titolo Snippet *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Titolo dello snippet..."
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Descrizione / Note d'uso</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Descrizione o istruzioni d'uso..."
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">Codice Sorgente *</label>
              <span className="text-[10px] text-slate-500 font-mono">Mobile safe (senza autocorrezione)</span>
            </div>
            <textarea
              required
              rows={7}
              value={code}
              onChange={e => setCode(e.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              autoComplete="off"
              className="w-full font-mono rounded-xl border border-slate-300 bg-slate-950 text-slate-100 p-3 text-xs focus:ring-1 focus:ring-sky-400 transition"
            />
          </div>

          {language === 'css' && (
            <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-purple-900">
                  Markup HTML di Prova (Sandbox Anteprima)
                </label>
                <span className="text-[10px] text-purple-600">Opzionale</span>
              </div>
              <p className="text-[11px] text-purple-700">
                Markup HTML utilizzato per renderizzare l'anteprima live di questo foglio di stile CSS.
              </p>
              <textarea
                rows={3}
                value={outputPreview}
                onChange={e => setOutputPreview(e.target.value)}
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                autoComplete="off"
                placeholder="<div class=&quot;mia-classe&quot;>Contenuto di prova</div>"
                className="w-full font-mono rounded-xl border border-purple-200 bg-white text-slate-900 p-2.5 text-xs focus:ring-1 focus:ring-purple-400"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tag (separati da virgola)</label>
            <input
              type="text"
              value={tagsStr}
              onChange={e => setTagsStr(e.target.value)}
              placeholder="Es: Hooks, Form, Performance, Grid"
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
              disabled={isSaving}
              className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 shadow-xs transition disabled:opacity-50"
            >
              {isSaving ? 'Salvataggio...' : 'Salva Modifiche'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
