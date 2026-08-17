import React from 'react';
import { useStudy, MainTabType } from '../context/StudyContext';
import { getTrackById } from '../data/tracks';
import { TrackIcon } from './TrackIcon';
import {
  ExternalLink,
  Code2,
  BookOpen,
  Calendar,
  Clock,
  Plus,
  Play
} from 'lucide-react';

interface TrackHeaderProps {
  onOpenNewSnippet: () => void;
  onOpenNewBook: () => void;
  onOpenTimer: () => void;
}

export const TrackHeader: React.FC<TrackHeaderProps> = ({
  onOpenNewSnippet,
  onOpenNewBook,
  onOpenTimer,
}) => {
  const { activeTrackId, activeTab, setActiveTab, data } = useStudy();
  const track = getTrackById(activeTrackId);

  // Statistics for this track
  const trackSnippets = data.snippets.filter(s => s.trackId === activeTrackId);
  const trackBooks = data.books.filter(b => b.trackId === activeTrackId);
  const trackSchedule = data.scheduleBlocks.filter(s => s.trackId === activeTrackId);
  const completedSchedule = trackSchedule.filter(s => s.completed).length;
  const trackLogs = data.logs.filter(l => l.trackId === activeTrackId);
  const totalMinutes = trackLogs.reduce((acc, curr) => acc + curr.durationMinutes, 0);

  const tabs: { id: MainTabType; label: string; icon: React.ElementType; count: string | number }[] = [
    { id: 'planner', label: 'Planner Giornaliero', icon: Calendar, count: `${completedSchedule}/${trackSchedule.length}` },
    { id: 'snippets', label: 'Raccolta Codice', icon: Code2, count: trackSnippets.length },
    { id: 'books', label: 'Libri & Appunti', icon: BookOpen, count: trackBooks.length },
    { id: 'timer', label: 'Timer Studio', icon: Clock, count: `${totalMinutes}m` },
  ];

  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        {/* Banner Area */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm ring-4 ring-slate-100"
              style={{ backgroundColor: track.color }}
            >
              <TrackIcon name={track.iconName} className="h-7 w-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                  {track.name}
                </h1>
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider"
                  style={{ backgroundColor: `${track.color}15`, color: track.color }}
                >
                  Sessione Materia
                </span>
                {track.docUrl && track.docUrl !== '#' && (
                  <a
                    href={track.docUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 transition"
                  >
                    <span>Guida Ufficiale</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              <p className="mt-1 text-sm text-slate-600 max-w-2xl">
                {track.tagline}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenTimer}
              className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-600 hover:text-white transition shadow-2xs"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Avvia Timer ({totalMinutes}m)</span>
            </button>

            {activeTab === 'snippets' && (
              <button
                onClick={onOpenNewSnippet}
                className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition shadow-2xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Nuovo Snippet</span>
              </button>
            )}

            {activeTab === 'books' && (
              <button
                onClick={onOpenNewBook}
                className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition shadow-2xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Aggiungi Libro</span>
              </button>
            )}
          </div>
        </div>

        {/* 3 Main Pillars Navigation Tabs */}
        <div className="mt-6 flex space-x-1 sm:space-x-4 overflow-x-auto border-t border-slate-100 pt-1 scrollbar-none">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex shrink-0 items-center gap-2 border-b-2 py-3 px-3.5 text-xs font-bold transition-all ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                <span
                  className={`ml-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
