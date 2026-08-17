import React, { useState, useMemo } from 'react';
import { useStudy } from '../context/StudyContext';
import { getTrackById, TRACKS } from '../data/tracks';
import { StudyTask, TaskDifficulty, TaskPriority } from '../types';
import {
  CheckCircle2,
  Circle,
  Plus,
  Search,
  Filter,
  Clock,
  Calendar,
  Trash2,
  Edit3,
  Flame,
  Award,
  BookCheck,
  X,
  ChevronDown,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface RoadmapPlannerProps {
  onOpenNewTaskModal: () => void;
}

export const RoadmapPlanner: React.FC<RoadmapPlannerProps> = ({ onOpenNewTaskModal }) => {
  const { data, activeTrackId, toggleTaskCompleted, deleteTask, updateTask } = useStudy();
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTask, setEditingTask] = useState<StudyTask | null>(null);

  // Filter tasks
  const tasks = useMemo(() => {
    return data.tasks.filter(t => {
      if (activeTrackId !== 'overview' && t.trackId !== activeTrackId) {
        return false;
      }
      if (statusFilter === 'pending' && t.completed) return false;
      if (statusFilter === 'completed' && !t.completed) return false;
      if (difficultyFilter !== 'all' && t.difficulty !== difficultyFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesCat = t.category.toLowerCase().includes(q);
        const matchesNotes = t.notes?.toLowerCase().includes(q);
        return matchesTitle || matchesCat || matchesNotes;
      }
      return true;
    });
  }, [data.tasks, activeTrackId, statusFilter, difficultyFilter, searchQuery]);

  // Group tasks by category
  const categories = useMemo(() => {
    const map = new Map<string, StudyTask[]>();
    tasks.forEach(t => {
      const cat = t.category || 'Generale';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(t);
    });
    return Array.from(map.entries());
  }, [tasks]);

  const allTrackTasks = activeTrackId === 'overview'
    ? data.tasks
    : data.tasks.filter(t => t.trackId === activeTrackId);
  const totalCompleted = allTrackTasks.filter(t => t.completed).length;
  const progressPercent = allTrackTasks.length > 0 ? Math.round((totalCompleted / allTrackTasks.length) * 100) : 0;

  return (
    <div className="py-6">
      {/* Progress header card */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Roadmap di Apprendimento
                </h2>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-semibold text-slate-700">
                  {totalCompleted} / {allTrackTasks.length} Obiettivi
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Spunta gli argomenti man mano che li assimili per monitorare la tua crescita
              </p>
            </div>
          </div>

          <div className="w-full sm:w-64">
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>Completamento</span>
              <span className="font-mono text-emerald-600">{progressPercent}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cerca argomento di studio..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-slate-400 focus:outline-hidden shadow-2xs"
            />
          </div>

          {/* Status filters */}
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-0.5 text-xs font-medium">
            <button
              onClick={() => setStatusFilter('all')}
              className={`rounded-lg px-2.5 py-1.5 transition ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              Tutti
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`rounded-lg px-2.5 py-1.5 transition ${
                statusFilter === 'pending' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              Da Fare
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`rounded-lg px-2.5 py-1.5 transition ${
                statusFilter === 'completed' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              Completati
            </button>
          </div>

          {/* Difficulty filter */}
          <select
            value={difficultyFilter}
            onChange={e => setDifficultyFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-2xs"
          >
            <option value="all">Tutti i Livelli</option>
            <option value="base">Base</option>
            <option value="intermedio">Intermedio</option>
            <option value="avanzato">Avanzato</option>
          </select>
        </div>

        {/* Add button */}
        <button
          onClick={onOpenNewTaskModal}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800 active:scale-95 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Nuovo Obiettivo</span>
        </button>
      </div>

      {/* Task categories and list */}
      {categories.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
          <BookCheck className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-base font-bold text-slate-800">
            Nessun obiettivo trovato
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'all' || difficultyFilter !== 'all'
              ? 'Nessun task corrisponde ai filtri attuali.'
              : 'Aggiungi argomenti, concetti o mini-progetti alla tua roadmap di studio.'}
          </p>
          <button
            onClick={onOpenNewTaskModal}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            <span>Aggiungi Obiettivo di Studio</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map(([categoryName, catTasks]) => (
            <div key={categoryName} className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
              <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                    {categoryName}
                  </span>
                  <span className="rounded-full bg-slate-200 px-2 py-0.2 font-mono text-[10px] text-slate-700">
                    {catTasks.filter(t => t.completed).length}/{catTasks.length}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {catTasks.map(task => {
                  const track = getTrackById(task.trackId);
                  return (
                    <div
                      key={task.id}
                      className={`group flex flex-col sm:flex-row sm:items-center justify-between p-4 transition gap-3 ${
                        task.completed ? 'bg-slate-50/40' : 'bg-white hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="flex items-start gap-3.5 flex-1">
                        {/* Checkbox */}
                        <button
                          onClick={() => toggleTaskCompleted(task.id)}
                          className="mt-0.5 shrink-0 text-slate-400 hover:text-emerald-600 transition"
                          title={task.completed ? 'Segna come da fare' : 'Segna come completato'}
                        >
                          {task.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-50" />
                          ) : (
                            <Circle className="h-5 w-5 text-slate-300 group-hover:text-slate-400" />
                          )}
                        </button>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Track pill if overview */}
                            {activeTrackId === 'overview' && (
                              <span
                                className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                                style={{ backgroundColor: `${track.color}15`, color: track.color }}
                              >
                                {track.shortName}
                              </span>
                            )}

                            <span
                              className={`text-sm font-semibold ${
                                task.completed ? 'line-through text-slate-400' : 'text-slate-800'
                              }`}
                            >
                              {task.title}
                            </span>
                          </div>

                          {task.description && (
                            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                              {task.description}
                            </p>
                          )}

                          {task.notes && (
                            <div className="mt-1.5 rounded-lg bg-amber-50/80 border border-amber-200/60 px-2.5 py-1 text-[11px] text-amber-900">
                              <strong>Appunto:</strong> {task.notes}
                            </div>
                          )}

                          {/* Meta attributes (difficulty, time, date) */}
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                            {/* Difficulty */}
                            <span
                              className={`rounded-md px-2 py-0.5 font-medium ${
                                task.difficulty === 'base'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : task.difficulty === 'intermedio'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'bg-purple-50 text-purple-700 border border-purple-200'
                              }`}
                            >
                              {task.difficulty.toUpperCase()}
                            </span>

                            {/* Estimated time */}
                            {task.estimatedMinutes && (
                              <span className="flex items-center gap-1 text-slate-500">
                                <Clock className="h-3 w-3" />
                                <span>~{task.estimatedMinutes} min</span>
                              </span>
                            )}

                            {/* Due date */}
                            {task.dueDate && (
                              <span className="flex items-center gap-1 text-slate-500">
                                <Calendar className="h-3 w-3" />
                                <span>Scadenza: {task.dueDate}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 self-end sm:self-center opacity-80 group-hover:opacity-100">
                        <button
                          onClick={() => setEditingTask(task)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                          title="Modifica obiettivo"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Rimuovere l'obiettivo "${task.title}"?`)) {
                              deleteTask(task.id);
                            }
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                          title="Elimina obiettivo"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={updated => {
            updateTask(editingTask.id, updated);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};

interface EditTaskModalProps {
  task: StudyTask;
  onClose: () => void;
  onSave: (updated: Partial<StudyTask>) => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, onClose, onSave }) => {
  const [title, setTitle] = useState(task.title);
  const [category, setCategory] = useState(task.category);
  const [description, setDescription] = useState(task.description || '');
  const [difficulty, setDifficulty] = useState<TaskDifficulty>(task.difficulty);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [estimatedMinutes, setEstimatedMinutes] = useState<number | undefined>(task.estimatedMinutes);
  const [dueDate, setDueDate] = useState(task.dueDate || '');
  const [notes, setNotes] = useState(task.notes || '');
  const [trackId, setTrackId] = useState(task.trackId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title,
      category,
      description,
      difficulty,
      priority,
      estimatedMinutes: estimatedMinutes ? Number(estimatedMinutes) : undefined,
      dueDate: dueDate || undefined,
      notes: notes || undefined,
      trackId,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <h3 className="text-base font-bold text-slate-900">Modifica Obiettivo di Studio</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Linguaggio</label>
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Difficoltà</label>
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">Titolo Argomento *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Categoria / Sezione</label>
            <input
              type="text"
              required
              value={category}
              onChange={e => setCategory(e.target.value)}
              placeholder="Es: Layout, Asincronia, Hooks, OOP"
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Dettagli / Obiettivo Specifico</label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tempo Stimato (minuti)</label>
              <input
                type="number"
                value={estimatedMinutes || ''}
                onChange={e => setEstimatedMinutes(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Es: 60"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Data Scadenza (opzionale)</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Note Personali & Riflessioni</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Es: Ho avuto difficoltà con il cleanup, ripassare mercoledì"
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
              Salva Modifiche
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
