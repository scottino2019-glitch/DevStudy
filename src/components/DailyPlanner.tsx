import React, { useState, useMemo } from 'react';
import { useStudy } from '../context/StudyContext';
import { getTrackById, TRACKS } from '../data/tracks';
import { ScheduleBlock, DayOfWeek, TrackId } from '../types';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Plus,
  Play,
  Trash2,
  Edit3,
  Check,
  X,
  Target,
  Sparkles,
  ChevronRight,
  Flame,
  BookOpen
} from 'lucide-react';

interface DailyPlannerProps {
  onOpenTimerForTopic?: (trackId: string, topic: string) => void;
}

const DAYS_MAP: { id: DayOfWeek; label: string; short: string }[] = [
  { id: 'mon', label: 'Lunedì', short: 'Lun' },
  { id: 'tue', label: 'Martedì', short: 'Mar' },
  { id: 'wed', label: 'Mercoledì', short: 'Mer' },
  { id: 'thu', label: 'Giovedì', short: 'Gio' },
  { id: 'fri', label: 'Venerdì', short: 'Ven' },
  { id: 'sat', label: 'Sabato', short: 'Sab' },
  { id: 'sun', label: 'Domenica', short: 'Dom' },
];

function getTodayDayOfWeek(): DayOfWeek {
  const dayIndex = new Date().getDay(); // 0 is Sun, 1 is Mon...
  switch (dayIndex) {
    case 1:
      return 'mon';
    case 2:
      return 'tue';
    case 3:
      return 'wed';
    case 4:
      return 'thu';
    case 5:
      return 'fri';
    case 6:
      return 'sat';
    case 0:
    default:
      return 'sun';
  }
}

export const DailyPlanner: React.FC<DailyPlannerProps> = ({ onOpenTimerForTopic }) => {
  const {
    data,
    activeTrackId,
    addScheduleBlock,
    updateScheduleBlock,
    deleteScheduleBlock,
    toggleScheduleBlockCompleted,
  } = useStudy();

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(getTodayDayOfWeek());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<ScheduleBlock | null>(null);

  // New block form
  const [formStartTime, setFormStartTime] = useState('09:00');
  const [formEndTime, setFormEndTime] = useState('10:30');
  const [formTrackId, setFormTrackId] = useState<TrackId>(
    activeTrackId !== 'overview' ? (activeTrackId as TrackId) : 'javascript'
  );
  const [formSubjectTitle, setFormSubjectTitle] = useState('');
  const [formTopic, setFormTopic] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const activeTrackObj = activeTrackId !== 'overview' ? getTrackById(activeTrackId) : null;

  // Filter blocks for selected day and active track
  const dayBlocks = useMemo(() => {
    return data.scheduleBlocks
      .filter(b => {
        if (b.day !== selectedDay) return false;
        if (activeTrackId !== 'overview' && b.trackId !== activeTrackId) return false;
        return true;
      })
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [data.scheduleBlocks, selectedDay, activeTrackId]);

  const totalDaySessions = dayBlocks.length;
  const completedDaySessions = dayBlocks.filter(b => b.completed).length;
  const dayPercent =
    totalDaySessions > 0 ? Math.round((completedDaySessions / totalDaySessions) * 100) : 0;

  const handleOpenAddModal = () => {
    setFormStartTime('09:00');
    setFormEndTime('10:30');
    setFormTrackId(activeTrackId !== 'overview' ? (activeTrackId as TrackId) : 'javascript');
    const track = getTrackById(activeTrackId !== 'overview' ? activeTrackId : 'javascript');
    setFormSubjectTitle(track.name);
    setFormTopic('');
    setFormNotes('');
    setEditingBlock(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (block: ScheduleBlock) => {
    setEditingBlock(block);
    setFormStartTime(block.startTime);
    setFormEndTime(block.endTime);
    setFormTrackId(block.trackId);
    setFormSubjectTitle(block.subjectTitle);
    setFormTopic(block.topic);
    setFormNotes(block.notes || '');
    setIsAddModalOpen(true);
  };

  const handleSaveBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTopic.trim()) return;

    if (editingBlock) {
      updateScheduleBlock(editingBlock.id, {
        day: selectedDay,
        startTime: formStartTime,
        endTime: formEndTime,
        trackId: formTrackId,
        subjectTitle: formSubjectTitle.trim() || getTrackById(formTrackId).name,
        topic: formTopic.trim(),
        notes: formNotes.trim() || undefined,
      });
    } else {
      addScheduleBlock({
        day: selectedDay,
        startTime: formStartTime,
        endTime: formEndTime,
        trackId: formTrackId,
        subjectTitle: formSubjectTitle.trim() || getTrackById(formTrackId).name,
        topic: formTopic.trim(),
        completed: false,
        notes: formNotes.trim() || undefined,
      });
    }

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-2xs"
            style={{ backgroundColor: activeTrackObj?.color || '#4f46e5' }}
          >
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Planner Giornaliero di Studio
            </h2>
            <p className="text-xs text-slate-500">
              {activeTrackObj
                ? `Organizza e spunta le sessioni giornaliere per ${activeTrackObj.name}`
                : 'Orario e programma di studio per tutti i giorni'}
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-95 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Aggiungi Sessione di Studio</span>
        </button>
      </div>

      {/* Day of Week Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {DAYS_MAP.map(day => {
          const isSelected = selectedDay === day.id;
          const isToday = getTodayDayOfWeek() === day.id;
          const countForDay = data.scheduleBlocks.filter(b => {
            if (b.day !== day.id) return false;
            if (activeTrackId !== 'overview' && b.trackId !== activeTrackId) return false;
            return true;
          }).length;

          return (
            <button
              key={day.id}
              onClick={() => setSelectedDay(day.id)}
              className={`relative flex flex-col items-center justify-center min-w-[90px] flex-1 rounded-2xl p-3 text-xs font-bold transition-all border ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-600 text-white shadow-md'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="text-[11px] opacity-80">{day.short}</span>
              <span className="text-sm font-extrabold">{day.label}</span>

              <div className="mt-1 flex items-center gap-1">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-bold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {countForDay} {countForDay === 1 ? 'task' : 'task'}
                </span>
                {isToday && (
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isSelected ? 'bg-amber-300' : 'bg-indigo-600'
                    }`}
                    title="Oggi"
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Day Progress & Metric Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-slate-200 text-indigo-600 font-bold font-mono text-sm">
            {completedDaySessions}/{totalDaySessions}
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 block">
              Programma per {DAYS_MAP.find(d => d.id === selectedDay)?.label}
            </span>
            <span className="text-[11px] text-slate-500">
              {totalDaySessions === 0
                ? 'Nessuna sessione programmata per questo giorno'
                : `${completedDaySessions} di ${totalDaySessions} sessioni completate (${dayPercent}%)`}
            </span>
          </div>
        </div>

        {totalDaySessions > 0 && (
          <div className="w-full sm:w-48">
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${dayPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Daily Sessions List */}
      {dayBlocks.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white py-14 px-6 text-center">
          <Calendar className="h-10 w-10 mx-auto text-slate-300 mb-2" />
          <h3 className="text-base font-bold text-slate-800">
            Nessuna sessione per {DAYS_MAP.find(d => d.id === selectedDay)?.label}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Pianifica l'orario e l'argomento di studio per questa giornata.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition"
          >
            <Plus className="h-4 w-4" />
            <span>+ Pianifica Sessione</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {dayBlocks.map(block => {
            const track = getTrackById(block.trackId);

            return (
              <div
                key={block.id}
                className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-5 transition-all ${
                  block.completed
                    ? 'border-emerald-200 bg-emerald-50/40 opacity-90'
                    : 'border-slate-200 bg-white shadow-xs hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                {/* Left: Checkbox + Time + Topic + Notes */}
                <div className="flex items-start gap-3.5 flex-1">
                  <button
                    onClick={() => toggleScheduleBlockCompleted(block.id)}
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition ${
                      block.completed
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-300 bg-white hover:border-slate-400'
                    }`}
                  >
                    {block.completed && <Check className="h-4 w-4 stroke-[3]" />}
                  </button>

                  <div className="space-y-1">
                    {/* Time pill & Subject */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-700">
                        <Clock className="h-3 w-3 text-slate-400" />
                        {block.startTime} - {block.endTime}
                      </span>
                      <span
                        className="rounded-md px-2 py-0.5 text-[11px] font-bold text-white"
                        style={{ backgroundColor: track.color }}
                      >
                        {block.subjectTitle || track.name}
                      </span>
                      {block.completed && (
                        <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                          Completato
                        </span>
                      )}
                    </div>

                    {/* Topic */}
                    <h3
                      className={`text-sm font-extrabold text-slate-900 ${
                        block.completed ? 'line-through text-slate-500' : ''
                      }`}
                    >
                      {block.topic}
                    </h3>

                    {/* Notes if present */}
                    {block.notes && (
                      <p className="text-xs text-slate-600 italic">
                        Note: {block.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Actions (Timer Pomodoro, Edit, Delete) */}
                <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {onOpenTimerForTopic && (
                    <button
                      onClick={() => onOpenTimerForTopic(block.trackId, block.topic)}
                      className="flex items-center gap-1.5 rounded-xl bg-indigo-50 border border-indigo-200 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-600 hover:text-white transition active:scale-95"
                      title="Avvia sessione Pomodoro per questo argomento"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>Avvia Timer</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleOpenEdit(block)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                    title="Modifica sessione"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => deleteScheduleBlock(block.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                    title="Elimina sessione"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Block Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {editingBlock ? 'Modifica Sessione di Studio' : 'Pianifica Nuova Sessione'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBlock} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Materia *
                </label>
                <select
                  value={formTrackId}
                  onChange={e => {
                    const tid = e.target.value as TrackId;
                    setFormTrackId(tid);
                    setFormSubjectTitle(getTrackById(tid).name);
                  }}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
                >
                  {TRACKS.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Orario Inizio
                  </label>
                  <input
                    type="time"
                    value={formStartTime}
                    onChange={e => setFormStartTime(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Orario Fine
                  </label>
                  <input
                    type="time"
                    value={formEndTime}
                    onChange={e => setFormEndTime(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Argomento / Task da Svolgere *
                </label>
                <input
                  type="text"
                  placeholder="Es. Esercizi su Flexbox, Studio di Promises..."
                  value={formTopic}
                  onChange={e => setFormTopic(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Note di Studio (opzionale)
                </label>
                <input
                  type="text"
                  placeholder="Es. Capitolo 3 del libro o link esercizi"
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
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
                  {editingBlock ? 'Salva Modifiche' : 'Pianifica'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
