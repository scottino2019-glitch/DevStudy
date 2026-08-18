import React, { useState, useMemo } from 'react';
import { useStudy } from '../context/StudyContext';
import { TRACKS, getTrackById } from '../data/tracks';
import { ScheduleBlock, DayOfWeek, TrackId, ExamDeadline } from '../types';
import { TrackIcon } from './TrackIcon';
import {
  Calendar,
  Clock,
  Plus,
  CheckCircle2,
  Circle,
  Play,
  Trash2,
  Edit3,
  CalendarDays,
  Target,
  Sparkles,
  Flame,
  Check,
  X,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  Bookmark
} from 'lucide-react';

const DAYS_OF_WEEK: { id: DayOfWeek; label: string; short: string }[] = [
  { id: 'mon', label: 'Lunedì', short: 'LUN' },
  { id: 'tue', label: 'Martedì', short: 'MAR' },
  { id: 'wed', label: 'Mercoledì', short: 'MER' },
  { id: 'thu', label: 'Giovedì', short: 'GIO' },
  { id: 'fri', label: 'Venerdì', short: 'VEN' },
  { id: 'sat', label: 'Sabato', short: 'SAB' },
  { id: 'sun', label: 'Domenica', short: 'DOM' },
];

interface WeeklySchedulePlannerProps {
  onOpenTimerForTopic?: (trackId: TrackId, topic: string) => void;
}

export const WeeklySchedulePlanner: React.FC<WeeklySchedulePlannerProps> = ({
  onOpenTimerForTopic,
}) => {
  const {
    data,
    activeTrackId,
    setActiveTrackId,
    setActiveTab,
    addScheduleBlock,
    updateScheduleBlock,
    deleteScheduleBlock,
    toggleScheduleBlockCompleted,
    addDeadline,
    deleteDeadline,
    updateDeadlineProgress,
    logStudySession,
  } = useStudy();

  const [selectedDayFilter, setSelectedDayFilter] = useState<DayOfWeek | 'all'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddDeadlineOpen, setIsAddDeadlineOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<ScheduleBlock | null>(null);

  // Form states for new schedule block
  const [formDay, setFormDay] = useState<DayOfWeek>('mon');
  const [formStart, setFormStart] = useState('09:00');
  const [formEnd, setFormEnd] = useState('11:00');
  const [formTrackId, setFormTrackId] = useState<TrackId>('javascript');
  const [formTitle, setFormTitle] = useState('');
  const [formTopic, setFormTopic] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Form state for new deadline
  const [dlTitle, setDlTitle] = useState('');
  const [dlTrackId, setDlTrackId] = useState<TrackId>('react');
  const [dlDate, setDlDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [dlType, setDlType] = useState<ExamDeadline['type']>('esame');
  const [dlPriority, setDlPriority] = useState<ExamDeadline['priority']>('alta');
  const [dlTopics, setDlTopics] = useState('');
  const [dlNotes, setDlNotes] = useState('');

  // Current day of week in IT
  const currentDayIndex = (new Date().getDay() + 6) % 7; // 0 = Lunedì, 6 = Domenica
  const currentDayId = DAYS_OF_WEEK[currentDayIndex]?.id || 'mon';

  // Filter schedule blocks
  const filteredBlocks = useMemo(() => {
    return data.scheduleBlocks.filter(b => {
      if (activeTrackId !== 'overview' && b.trackId !== activeTrackId) return false;
      if (selectedDayFilter !== 'all' && b.day !== selectedDayFilter) return false;
      return true;
    });
  }, [data.scheduleBlocks, activeTrackId, selectedDayFilter]);

  // Calculate stats
  const totalBlocks = data.scheduleBlocks.length;
  const completedBlocks = data.scheduleBlocks.filter(b => b.completed).length;
  const completionRate = totalBlocks > 0 ? Math.round((completedBlocks / totalBlocks) * 100) : 0;

  const handleOpenAdd = (defaultDay?: DayOfWeek) => {
    if (defaultDay) setFormDay(defaultDay);
    if (activeTrackId !== 'overview') setFormTrackId(activeTrackId);
    setFormTitle('');
    setFormTopic('');
    setFormNotes('');
    setEditingBlock(null);
    setIsAddModalOpen(true);
  };

  const handleSaveBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTopic.trim()) return;

    const trackObj = getTrackById(formTrackId);
    const subjectTitle = formTitle.trim() || trackObj.name;

    if (editingBlock) {
      updateScheduleBlock(editingBlock.id, {
        day: formDay,
        startTime: formStart,
        endTime: formEnd,
        trackId: formTrackId,
        subjectTitle,
        topic: formTopic.trim(),
        notes: formNotes.trim() || undefined,
      });
    } else {
      addScheduleBlock({
        day: formDay,
        startTime: formStart,
        endTime: formEnd,
        trackId: formTrackId,
        subjectTitle,
        topic: formTopic.trim(),
        notes: formNotes.trim() || undefined,
        completed: false,
      });
    }

    setIsAddModalOpen(false);
    setEditingBlock(null);
  };

  const handleStartTimerForBlock = (block: ScheduleBlock) => {
    if (onOpenTimerForTopic) {
      onOpenTimerForTopic(block.trackId, block.topic);
    } else {
      setActiveTrackId(block.trackId);
      setActiveTab('timer');
    }
  };

  const handleSaveDeadline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dlTitle.trim()) return;

    const topicsArray = dlTopics
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    addDeadline({
      title: dlTitle.trim(),
      trackId: dlTrackId,
      dueDate: dlDate,
      type: dlType,
      priority: dlPriority,
      progressPercentage: 0,
      topicsToReview: topicsArray.length > 0 ? topicsArray : ['Capitoli principali', 'Esercizi pratici'],
      notes: dlNotes.trim() || undefined,
    });

    setDlTitle('');
    setDlTopics('');
    setDlNotes('');
    setIsAddDeadlineOpen(false);
  };

  const getDaysRemaining = (dateStr: string) => {
    const target = new Date(dateStr).getTime();
    const today = new Date().setHours(0, 0, 0, 0);
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="py-6 space-y-8">
      {/* Top Banner / Planner Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 border border-indigo-200">
              <Calendar className="h-3.5 w-3.5" />
              <span>Orario & Planner Settimanale</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Pianificatore di Studio & Obiettivi
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              Organizza le tue fasce orarie di studio per <strong>HTML, CSS, JS, Tailwind, React e Python</strong>.
              Avvia il Pomodoro direttamente da ogni sessione e monitora le scadenze esami.
            </p>
          </div>

          {/* Quick Metrics & CTA */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-200 px-4 py-2.5">
              <div className="flex flex-col">
                <span className="text-[11px] font-medium text-slate-500">Sessioni Settimanali</span>
                <span className="text-sm font-bold text-slate-800">
                  {completedBlocks} / {totalBlocks} ({completionRate}%)
                </span>
              </div>
              <div className="h-2 w-16 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full bg-indigo-600 transition-all rounded-full"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => handleOpenAdd()}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-95 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Aggiungi Sessione</span>
            </button>
          </div>
        </div>

        {/* Day Filter Ribbon */}
        <div className="mt-6 flex items-center gap-1.5 overflow-x-auto border-t border-slate-100 pt-4 scrollbar-none">
          <button
            onClick={() => setSelectedDayFilter('all')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
              selectedDayFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            <span>Tutta la Settimana</span>
            <span className="ml-1 rounded-full bg-white/20 px-1.5 py-0.2 text-[10px] font-mono">
              {data.scheduleBlocks.length}
            </span>
          </button>

          {DAYS_OF_WEEK.map(d => {
            const isToday = d.id === currentDayId;
            const isSelected = selectedDayFilter === d.id;
            const dayBlocks = data.scheduleBlocks.filter(b => b.day === d.id);
            const isAllDone = dayBlocks.length > 0 && dayBlocks.every(b => b.completed);

            return (
              <button
                key={d.id}
                onClick={() => setSelectedDayFilter(d.id)}
                className={`relative flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : isToday
                    ? 'border border-indigo-300 bg-indigo-50 text-indigo-700 font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{d.label}</span>
                {isToday && (
                  <span className={`text-[9px] uppercase px-1 py-0.2 rounded font-black ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-indigo-200 text-indigo-800'
                  }`}>
                    Oggi
                  </span>
                )}
                {dayBlocks.length > 0 && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : isAllDone
                        ? 'bg-emerald-100 text-emerald-700 font-bold'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {dayBlocks.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Weekly Schedule 7-Day Columns or List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Orario Settimanale delle Lezioni & Sessioni di Studio
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Fai clic sulla spunta per segnare come completata o su "Studia" per avviare il timer
          </span>
        </div>

        {selectedDayFilter === 'all' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {DAYS_OF_WEEK.map(day => {
              const isToday = day.id === currentDayId;
              const dayBlocks = data.scheduleBlocks
                .filter(b => b.day === day.id)
                .filter(b => activeTrackId === 'overview' || b.trackId === activeTrackId)
                .sort((a, b) => a.startTime.localeCompare(b.startTime));

              return (
                <div
                  key={day.id}
                  className={`flex flex-col rounded-2xl border p-4 shadow-2xs transition-all ${
                    isToday
                      ? 'border-indigo-300 bg-indigo-50/30 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  {/* Day Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 text-sm">{day.label}</span>
                      {isToday && (
                        <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[9px] font-extrabold text-white tracking-wider uppercase">
                          Oggi
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleOpenAdd(day.id)}
                      className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 transition"
                      title={`Aggiungi sessione a ${day.label}`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Day Blocks List */}
                  {dayBlocks.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-6 text-center text-slate-400">
                      <CalendarDays className="h-6 w-6 mb-1 opacity-40" />
                      <p className="text-xs">Nessuna sessione</p>
                      <button
                        onClick={() => handleOpenAdd(day.id)}
                        className="mt-2 text-[11px] font-semibold text-indigo-600 hover:underline"
                      >
                        + Pianifica studio
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5 flex-1">
                      {dayBlocks.map(block => {
                        const track = getTrackById(block.trackId);
                        return (
                          <div
                            key={block.id}
                            className={`group relative rounded-xl border p-3 transition-all ${
                              block.completed
                                ? 'border-emerald-200 bg-emerald-50/40 opacity-80'
                                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              {/* Checkbox toggle */}
                              <button
                                onClick={() => toggleScheduleBlockCompleted(block.id)}
                                className="mt-0.5 shrink-0 text-slate-400 hover:text-emerald-600 transition"
                                title={block.completed ? 'Segna come da fare' : 'Segna come completata'}
                              >
                                {block.completed ? (
                                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                ) : (
                                  <Circle className="h-4 w-4 text-slate-300 group-hover:text-slate-400" />
                                )}
                              </button>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span
                                    className="rounded-md px-1.5 py-0.2 text-[10px] font-bold text-white shadow-2xs"
                                    style={{ backgroundColor: track.color }}
                                  >
                                    {track.name}
                                  </span>
                                  <span className="font-mono text-[10px] font-semibold text-slate-500">
                                    {block.startTime} - {block.endTime}
                                  </span>
                                </div>

                                <h4
                                  className={`text-xs font-bold text-slate-800 mt-1 line-clamp-1 ${
                                    block.completed ? 'line-through text-slate-500' : ''
                                  }`}
                                >
                                  {block.topic}
                                </h4>

                                {block.notes && (
                                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                    {block.notes}
                                  </p>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  onClick={() => handleStartTimerForBlock(block)}
                                  className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition"
                                  title="Avvia Timer Pomodoro per questo argomento"
                                >
                                  <Play className="h-3 w-3 fill-current" />
                                </button>
                                <button
                                  onClick={() => deleteScheduleBlock(block.id)}
                                  className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600 active:scale-95 transition"
                                  title="Elimina sessione"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Single Day Detailed View */
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {DAYS_OF_WEEK.find(d => d.id === selectedDayFilter)?.label}
                </h3>
                <p className="text-xs text-slate-500">
                  {filteredBlocks.length} sessioni pianificate
                </p>
              </div>
              <button
                onClick={() => handleOpenAdd(selectedDayFilter)}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition"
              >
                <Plus className="h-4 w-4" />
                <span>Aggiungi Sessione</span>
              </button>
            </div>

            {filteredBlocks.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <CalendarDays className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-medium">Nessuna sessione per questo giorno</p>
                <p className="text-xs text-slate-500 mt-1">
                  Aggiungi le tue ore di studio per organizzare la settimana
                </p>
                <button
                  onClick={() => handleOpenAdd(selectedDayFilter)}
                  className="mt-4 rounded-xl bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-100 transition"
                >
                  + Pianifica la prima sessione
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredBlocks.map(block => {
                  const track = getTrackById(block.trackId);
                  return (
                    <div
                      key={block.id}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-4 transition-all ${
                        block.completed
                          ? 'border-emerald-200 bg-emerald-50/40'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleScheduleBlockCompleted(block.id)}
                          className="mt-0.5 text-slate-400 hover:text-emerald-600 transition"
                        >
                          {block.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          ) : (
                            <Circle className="h-5 w-5 text-slate-300" />
                          )}
                        </button>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className="rounded-md px-2 py-0.5 text-xs font-bold text-white"
                              style={{ backgroundColor: track.color }}
                            >
                              {track.name}
                            </span>
                            <span className="font-mono text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                              {block.startTime} - {block.endTime}
                            </span>
                          </div>
                          <h4
                            className={`text-sm font-bold text-slate-900 mt-1.5 ${
                              block.completed ? 'line-through text-slate-500' : ''
                            }`}
                          >
                            {block.topic}
                          </h4>
                          {block.notes && (
                            <p className="text-xs text-slate-600 mt-1">{block.notes}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => handleStartTimerForBlock(block)}
                          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-indigo-700 transition"
                        >
                          <Play className="h-3 w-3 fill-current" />
                          <span>Avvia Pomodoro</span>
                        </button>
                        <button
                          onClick={() => deleteScheduleBlock(block.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Deadlines, Exams & Project Planner Section */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Scadenze, Esami & Consegna Progetti
              </h2>
              <p className="text-xs text-slate-500">
                Tieni traccia delle date cruciali, giorni rimanenti e livello di preparazione
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddDeadlineOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Nuova Scadenza / Esame</span>
          </button>
        </div>

        {data.deadlines.length === 0 ? (
          <div className="py-8 text-center text-slate-400">
            <Target className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-xs">Nessuna scadenza o esame registrato</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.deadlines.map(dl => {
              const track = getTrackById(dl.trackId);
              const daysLeft = getDaysRemaining(dl.dueDate);
              const isUrgent = daysLeft <= 7 && daysLeft >= 0;
              const isOverdue = daysLeft < 0;

              return (
                <div
                  key={dl.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/50 p-4 transition-all hover:bg-white hover:shadow-xs"
                >
                  <div>
                    {/* Header: Track & Days Countdown */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="rounded-md px-2 py-0.5 text-[10px] font-bold text-white"
                          style={{ backgroundColor: track.color }}
                        >
                          {track.name}
                        </span>
                        <span className="rounded-md bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 uppercase">
                          {dl.type}
                        </span>
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ${
                          isOverdue
                            ? 'bg-slate-200 text-slate-600'
                            : isUrgent
                            ? 'bg-red-100 text-red-700 animate-pulse'
                            : 'bg-indigo-100 text-indigo-700'
                        }`}
                      >
                        {isOverdue
                          ? 'Scaduto'
                          : daysLeft === 0
                          ? 'Oggi!'
                          : `${daysLeft} giorni rimasti`}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mb-1">
                      {dl.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono mb-3">
                      Data: {dl.dueDate}
                    </p>

                    {/* Review Topics */}
                    {dl.topicsToReview && dl.topicsToReview.length > 0 && (
                      <div className="mb-4 space-y-1">
                        <span className="text-[11px] font-bold text-slate-600 block">
                          Argomenti chiave:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {dl.topicsToReview.map((t, idx) => (
                            <span
                              key={idx}
                              className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[10px] text-slate-700"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Progress Slider */}
                  <div className="border-t border-slate-200 pt-3 mt-2">
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                      <span>Preparazione</span>
                      <span className="font-mono text-indigo-600">{dl.progressPercentage}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={dl.progressPercentage}
                      onChange={e => updateDeadlineProgress(dl.id, Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                    />

                    <div className="flex justify-between items-center mt-3">
                      <button
                        onClick={() => {
                          setActiveTrackId(dl.trackId);
                          setActiveTab('planner');
                        }}
                        className="text-[11px] font-bold text-indigo-600 hover:underline"
                      >
                        Vedi Roadmap Argomenti →
                      </button>
                      <button
                        onClick={() => deleteDeadline(dl.id)}
                        className="text-slate-400 hover:text-red-600 text-xs"
                        title="Elimina scadenza"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Schedule Block Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Pianifica Sessione di Studio
              </h3>
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
                  Giorno della Settimana *
                </label>
                <select
                  value={formDay}
                  onChange={e => setFormDay(e.target.value as DayOfWeek)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:outline-hidden"
                >
                  {DAYS_OF_WEEK.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ora Inizio *
                  </label>
                  <input
                    type="time"
                    value={formStart}
                    onChange={e => setFormStart(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs font-mono text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ora Fine *
                  </label>
                  <input
                    type="time"
                    value={formEnd}
                    onChange={e => setFormEnd(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs font-mono text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Materia / Tecnologia *
                </label>
                <select
                  value={formTrackId}
                  onChange={e => setFormTrackId(e.target.value as TrackId)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:outline-hidden"
                >
                  {TRACKS.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Argomento o Esercizio di Studio *
                </label>
                <input
                  type="text"
                  placeholder="Es. Hooks in React (useEffect e Custom Hooks)"
                  value={formTopic}
                  onChange={e => setFormTopic(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Note aggiuntive (opzionale)
                </label>
                <input
                  type="text"
                  placeholder="Es. Guardare video su YouTube + fare 3 esercizi"
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 placeholder-slate-400"
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
                  Salva nel Calendario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Exam / Deadline Modal */}
      {isAddDeadlineOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Nuova Scadenza / Esame / Progetto
              </h3>
              <button
                onClick={() => setIsAddDeadlineOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDeadline} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Titolo Scadenza *
                </label>
                <input
                  type="text"
                  placeholder="Es. Progetto Finale React o Esame Algoritmi"
                  value={dlTitle}
                  onChange={e => setDlTitle(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Materia *
                  </label>
                  <select
                    value={dlTrackId}
                    onChange={e => setDlTrackId(e.target.value as TrackId)}
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-800"
                  >
                    {TRACKS.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tipo *
                  </label>
                  <select
                    value={dlType}
                    onChange={e => setDlType(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-800"
                  >
                    <option value="esame">Esame</option>
                    <option value="progetto">Progetto</option>
                    <option value="certificazione">Certificazione</option>
                    <option value="ripasso">Ripasso Generale</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Data di Scadenza *
                </label>
                <input
                  type="date"
                  value={dlDate}
                  onChange={e => setDlDate(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Argomenti da ripassare (separati da virgola)
                </label>
                <input
                  type="text"
                  placeholder="Es. Hooks, Context API, Redux, Performance"
                  value={dlTopics}
                  onChange={e => setDlTopics(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddDeadlineOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700"
                >
                  Salva Scadenza
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
