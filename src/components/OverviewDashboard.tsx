import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { TRACKS } from '../data/tracks';
import { TrackIcon } from './TrackIcon';
import { WeeklySchedulePlanner } from './WeeklySchedulePlanner';
import {
  Code,
  CheckCircle2,
  BookOpen,
  Clock,
  Flame,
  ArrowRight,
  Star,
  Sparkles,
  TrendingUp,
  FileCode2,
  Library,
  ListTodo,
  CalendarDays,
  Target
} from 'lucide-react';

interface OverviewDashboardProps {
  onOpenTimer: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ onOpenTimer }) => {
  const { data, setActiveTrackId, setActiveTab } = useStudy();
  const [overviewTab, setOverviewTab] = useState<'planner' | 'tracks' | 'stats'>('planner');

  // Metrics
  const totalCompletedTasks = data.tasks.filter(t => t.completed).length;
  const totalTasks = data.tasks.length;
  const globalTaskPercent = totalTasks > 0 ? Math.round((totalCompletedTasks / totalTasks) * 100) : 0;

  const totalMinutes = data.logs.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10;

  const totalSnippets = data.snippets.length;
  const readingBooks = data.books.filter(b => b.status === 'reading');
  const favoriteSnippets = data.snippets.filter(s => s.isFavorite).slice(0, 2);

  return (
    <div className="py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-6 sm:p-8 text-white shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Planner Studio Programmazione</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Taccuino & Percorsi di Studio
            </h1>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              Gestisci i tuoi progressi per <strong>HTML, CSS, JavaScript, Tailwind, React e Python</strong> con snippet riutilizzabili, manuali di riferimento e roadmap strutturate.
            </p>
          </div>

          {/* Quick Global Stats Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-700/60 backdrop-blur-xs">
            <div className="p-2 text-center">
              <span className="block font-mono text-xl sm:text-2xl font-black text-amber-400">
                {totalHours}h
              </span>
              <span className="text-[11px] font-medium text-slate-400">Tempo Studio</span>
            </div>
            <div className="p-2 text-center">
              <span className="block font-mono text-xl sm:text-2xl font-black text-emerald-400">
                {globalTaskPercent}%
              </span>
              <span className="text-[11px] font-medium text-slate-400">Roadmap</span>
            </div>
            <div className="p-2 text-center">
              <span className="block font-mono text-xl sm:text-2xl font-black text-sky-400">
                {totalSnippets}
              </span>
              <span className="text-[11px] font-medium text-slate-400">Snippet</span>
            </div>
            <div className="p-2 text-center">
              <span className="block font-mono text-xl sm:text-2xl font-black text-indigo-300">
                {data.books.length}
              </span>
              <span className="text-[11px] font-medium text-slate-400">Libri Guida</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Pill Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setOverviewTab('planner')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            overviewTab === 'planner'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <CalendarDays className="h-4 w-4" />
          <span>Orario & Planner Settimanale</span>
          <span className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] ${
            overviewTab === 'planner' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'
          }`}>
            {data.scheduleBlocks.length}
          </span>
        </button>

        <button
          onClick={() => setOverviewTab('tracks')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            overviewTab === 'tracks'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Code className="h-4 w-4" />
          <span>Sessioni per Materia & Guide</span>
        </button>

        <button
          onClick={() => setOverviewTab('stats')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            overviewTab === 'stats'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          <span>Storico & Ore Studio</span>
        </button>
      </div>

      {overviewTab === 'planner' && (
        <WeeklySchedulePlanner onOpenTimerForTopic={() => onOpenTimer()} />
      )}

      {overviewTab === 'tracks' && (
        <>
          {/* 6 Track Cards Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Sessioni per Linguaggio & Framework
                </h2>
                <p className="text-xs text-slate-500">
                  Seleziona una materia per accedere ai rispettivi snippet, task, libri e appunti
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {TRACKS.map(track => {
                const trackTasks = data.tasks.filter(t => t.trackId === track.id);
                const completedCount = trackTasks.filter(t => t.completed).length;
                const percent = trackTasks.length > 0 ? Math.round((completedCount / trackTasks.length) * 100) : 0;
                const snipCount = data.snippets.filter(s => s.trackId === track.id).length;
                const bookCount = data.books.filter(b => b.trackId === track.id).length;
                const noteCount = data.notes.filter(n => n.trackId === track.id).length;
                const trackLogs = data.logs.filter(l => l.trackId === track.id);
                const trackMins = trackLogs.reduce((acc, curr) => acc + curr.durationMinutes, 0);

                return (
                  <div
                    key={track.id}
                    onClick={() => {
                      setActiveTrackId(track.id);
                      setActiveTab('planner');
                    }}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:-translate-y-1 hover:border-slate-400 hover:shadow-md"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-2xs transition-transform group-hover:scale-105"
                          style={{ backgroundColor: track.color }}
                        >
                          <TrackIcon name={track.iconName} className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-slate-700">
                            {track.name}
                          </h3>
                          <span className="font-mono text-[11px] font-medium text-slate-400">
                            {trackMins} min studiati
                          </span>
                        </div>
                      </div>

                      <span className="font-mono text-xs font-bold text-slate-800 rounded-md bg-slate-100 px-2 py-1">
                        {percent}%
                      </span>
                    </div>

                    {/* Tagline */}
                    <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {track.tagline}
                    </p>

                    {/* Progress bar */}
                    <div className="mt-4">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${percent}%`, backgroundColor: track.color }}
                        />
                      </div>
                    </div>

                    {/* Counter metrics pills */}
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                      <div className="flex items-center gap-3 font-medium">
                        <span>{snipCount} snippet</span>
                        <span>•</span>
                        <span>{bookCount} libri</span>
                        <span>•</span>
                        <span>{noteCount} appunti</span>
                      </div>
                      <div
                        className="flex items-center gap-1 font-bold text-slate-800 group-hover:translate-x-0.5 transition-transform"
                        style={{ color: track.color }}
                      >
                        <span>Apri</span>
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Row: Currently Reading Books + Favorite Snippets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Reading Books */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-amber-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Libri in Lettura Attiva
                  </h3>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {readingBooks.length} manuali
                </span>
              </div>

              {readingBooks.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  Nessun libro impostato su "In Lettura". Aggiungine uno nella sezione Risorse!
                </p>
              ) : (
                <div className="space-y-3">
                  {readingBooks.map(book => {
                    const track = TRACKS.find(t => t.id === book.trackId);
                    const percent = Math.round((book.currentPage / (book.totalPages || 1)) * 100);
                    return (
                      <div
                        key={book.id}
                        onClick={() => {
                          setActiveTrackId(book.trackId);
                          setActiveTab('books');
                        }}
                        className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 transition hover:bg-slate-100"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900 truncate">
                            {book.title}
                          </span>
                          <span className="font-mono text-xs font-bold text-slate-700">
                            {book.currentPage} / {book.totalPages} pag. ({percent}%)
                          </span>
                        </div>
                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-amber-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Favorite Snippets Spotlight */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-500" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Snippet di Codice Preferiti
                  </h3>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {data.snippets.filter(s => s.isFavorite).length} salvati
                </span>
              </div>

              {favoriteSnippets.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  Aggiungi snippet ai preferiti con la stella per ritrovarli subito qui!
                </p>
              ) : (
                <div className="space-y-4">
                  {favoriteSnippets.map(snippet => (
                    <div key={snippet.id} className="rounded-xl border border-slate-200 bg-slate-900 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-bold text-slate-200">
                          {snippet.title}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400 uppercase">
                          {snippet.language}
                        </span>
                      </div>
                      <pre className="font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-24">
                        <code>{snippet.code.slice(0, 140)}...</code>
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {overviewTab === 'stats' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">
                Riepilogo e Statistiche Studio
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
              Totale: {totalHours} Ore ({totalMinutes} Minuti)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-center">
              <span className="text-xs text-slate-500 font-medium block">Obiettivo Giornaliero</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">
                {data.dailyGoalMinutes} min/giorno
              </span>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-center">
              <span className="text-xs text-slate-500 font-medium block">Sessioni Concluse</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">
                {data.logs.length} sessioni
              </span>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-center">
              <span className="text-xs text-slate-500 font-medium block">Obiettivi Roadmap</span>
              <span className="text-2xl font-black text-emerald-600 mt-1 block">
                {totalCompletedTasks} / {totalTasks} ({globalTaskPercent}%)
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Tempo Studio per Materia
            </h4>
            <div className="space-y-3">
              {TRACKS.map(t => {
                const trackMins = data.logs
                  .filter(l => l.trackId === t.id)
                  .reduce((acc, curr) => acc + curr.durationMinutes, 0);
                const percent = totalMinutes > 0 ? Math.round((trackMins / totalMinutes) * 100) : 0;

                return (
                  <div key={t.id} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: t.color }}
                        />
                        <span>{t.name}</span>
                      </div>
                      <span className="font-mono text-slate-500">
                        {trackMins} min ({percent}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${percent}%`, backgroundColor: t.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
