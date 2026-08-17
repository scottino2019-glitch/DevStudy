import React from 'react';
import { useStudy } from '../context/StudyContext';
import { TRACKS } from '../data/tracks';
import { TrackIcon } from './TrackIcon';
import { LayoutDashboard, CheckCircle2, Code2 } from 'lucide-react';

export const TrackSelector: React.FC = () => {
  const { activeTrackId, setActiveTrackId, data } = useStudy();

  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-2 overflow-x-auto py-2.5 scrollbar-none">
          {/* Overview button */}
          <button
            onClick={() => setActiveTrackId('overview')}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              activeTrackId === 'overview'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Panoramica</span>
            <span
              className={`ml-1 rounded-full px-1.5 py-0.2 font-mono text-[10px] ${
                activeTrackId === 'overview'
                  ? 'bg-slate-800 text-slate-200'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {data.tasks.filter(t => t.completed).length}/{data.tasks.length}
            </span>
          </button>

          {/* Each language track button */}
          {TRACKS.map(track => {
            const isActive = activeTrackId === track.id;
            const trackTasks = data.tasks.filter(t => t.trackId === track.id);
            const completedCount = trackTasks.filter(t => t.completed).length;
            const snippetsCount = data.snippets.filter(s => s.trackId === track.id).length;
            const percent = trackTasks.length > 0 ? Math.round((completedCount / trackTasks.length) * 100) : 0;

            return (
              <button
                key={track.id}
                onClick={() => setActiveTrackId(track.id)}
                className={`group relative flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? `${track.badgeBg} ring-2 ring-indigo-500/20 shadow-xs font-bold`
                    : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                }`}
                style={
                  isActive
                    ? { borderColor: track.color }
                    : {}
                }
              >
                {/* Visual color dot / icon */}
                <div
                  className="flex h-5 w-5 items-center justify-center rounded-md text-white shadow-2xs transition-transform group-hover:scale-105"
                  style={{ backgroundColor: track.color }}
                >
                  <TrackIcon name={track.iconName} className="h-3 w-3" />
                </div>

                <span>{track.name}</span>

                {/* Progress or Snippet counter badge */}
                <div className="flex items-center gap-1 font-mono text-[10px] opacity-80">
                  <span>{percent}%</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
