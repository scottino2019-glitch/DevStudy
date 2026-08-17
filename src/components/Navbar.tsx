import React from 'react';
import { useStudy } from '../context/StudyContext';
import { TRACKS } from '../data/tracks';
import {
  Code,
  Search,
  Clock,
  Download,
  Flame,
  CheckCircle2,
  BookOpen,
  Sparkles,
  Layers,
  BarChart2
} from 'lucide-react';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenBackup: () => void;
  onOpenTimer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenBackup,
  onOpenTimer,
}) => {
  const { data, activeTrackId, setActiveTrackId, setActiveTab } = useStudy();

  // Calculate today's studied minutes
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLogs = data.logs.filter(l => l.date.startsWith(todayStr));
  const todayMinutes = todayLogs.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const goalPercent = Math.min(100, Math.round((todayMinutes / (data.dailyGoalMinutes || 60)) * 100));

  // Completed tasks count
  const completedTasks = data.tasks.filter(t => t.completed).length;
  const totalTasks = data.tasks.length;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => {
              setActiveTrackId('overview');
              setActiveTab('overview');
            }}
            className="flex cursor-pointer items-center gap-2.5 transition hover:opacity-90"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs font-bold">
              <Code className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-800 tracking-tight text-base sm:text-lg">
                  DevStudy
                </span>
                <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 border border-indigo-200 tracking-wide uppercase">
                  PLANNER
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                Studio programmazione & taccuino
              </p>
            </div>
          </div>
        </div>

        {/* Center: Global Search Bar Button */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <button
            onClick={onOpenSearch}
            className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-500 transition hover:border-slate-300 hover:bg-slate-100/80 hover:text-slate-700 shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-slate-400" />
              <span>Cerca argomenti, snippet, libri, appunti...</span>
            </div>
            <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-slate-500 shadow-xs">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right: Actions, Timer & Daily Goal */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Search Icon */}
          <button
            onClick={onOpenSearch}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            title="Cerca"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Daily Goal Pill */}
          <div className="hidden sm:flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700">
            <Flame className="h-4 w-4 text-amber-500" />
            <div className="flex flex-col">
              <span className="font-medium text-[11px] leading-tight text-slate-500">
                Oggi: <strong className="text-slate-800 font-semibold">{todayMinutes}m</strong> / {data.dailyGoalMinutes}m
              </span>
              <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
                  style={{ width: `${goalPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Focus Timer Button */}
          <button
            onClick={onOpenTimer}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-indigo-700 active:scale-95"
            title="Apri Timer di Studio Pomodoro"
          >
            <Clock className="h-3.5 w-3.5 text-indigo-100" />
            <span className="hidden xs:inline">Pomodoro</span>
          </button>

          {/* Backup & Export */}
          <button
            onClick={onOpenBackup}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-2xs transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
            title="Salva / Esporta / Ripristina Dati"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
