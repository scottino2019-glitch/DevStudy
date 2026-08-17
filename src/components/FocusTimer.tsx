import React, { useState, useEffect } from 'react';
import { useStudy } from '../context/StudyContext';
import { TRACKS, getTrackById } from '../data/tracks';
import { TrackId } from '../types';
import confetti from 'canvas-confetti';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Flame,
  Coffee,
  Sparkles,
  Calendar,
  Trash2,
  BookOpen
} from 'lucide-react';

interface FocusTimerProps {
  onClose?: () => void;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({ onClose }) => {
  const { data, activeTrackId, logStudySession } = useStudy();

  const initialTrack = activeTrackId !== 'overview' ? activeTrackId : 'javascript';
  const [selectedTrack, setSelectedTrack] = useState<TrackId>(initialTrack);
  const [timerMode, setTimerMode] = useState<'pomodoro' | 'deep' | 'shortBreak' | 'longBreak' | 'stopwatch'>('pomodoro');
  
  // Timer durations in seconds
  const modeSeconds: Record<string, number> = {
    pomodoro: 25 * 60,
    deep: 50 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
    stopwatch: 0,
  };

  const [timeLeft, setTimeLeft] = useState<number>(modeSeconds.pomodoro);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionTopic, setSessionTopic] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [elapsedStudySeconds, setElapsedStudySeconds] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const track = getTrackById(selectedTrack);

  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch {
      // audio context not allowed without interaction
    }
  };

  // Switch mode
  const handleModeChange = (mode: 'pomodoro' | 'deep' | 'shortBreak' | 'longBreak' | 'stopwatch') => {
    setIsRunning(false);
    setTimerMode(mode);
    setTimeLeft(modeSeconds[mode]);
    setElapsedStudySeconds(0);
  };

  // Timer tick
  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        if (timerMode === 'stopwatch') {
          setTimeLeft(prev => prev + 1);
          setElapsedStudySeconds(prev => prev + 1);
        } else {
          setTimeLeft(prev => {
            if (prev <= 1) {
              setIsRunning(false);
              playChime();
              try {
                confetti({
                  particleCount: 70,
                  spread: 80,
                  origin: { y: 0.6 },
                });
              } catch {}
              setToastMessage('🎉 Sessione completata! Ottimo lavoro.');
              setTimeout(() => setToastMessage(null), 5000);
              return 0;
            }
            return prev - 1;
          });
          if (timerMode === 'pomodoro' || timerMode === 'deep') {
            setElapsedStudySeconds(prev => prev + 1);
          }
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timerMode]);

  // Format MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const totalDuration = modeSeconds[timerMode] || 1;
  const progressPercent = timerMode === 'stopwatch'
    ? 100
    : Math.min(100, Math.round(((totalDuration - timeLeft) / totalDuration) * 100));

  const handleSaveSession = () => {
    const minutesToLog = Math.max(1, Math.round(elapsedStudySeconds / 60));
    logStudySession(
      selectedTrack,
      minutesToLog,
      sessionTopic || `Studio ${track.name}`,
      sessionNotes || undefined
    );
    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch {}
    playChime();
    setIsRunning(false);
    setTimeLeft(modeSeconds[timerMode]);
    setElapsedStudySeconds(0);
    setSessionTopic('');
    setSessionNotes('');
    setToastMessage(`✅ Registrati ${minutesToLog} minuti di studio per ${track.name}!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filter study logs for active track or all
  const filteredLogs = activeTrackId === 'overview'
    ? data.logs
    : data.logs.filter(l => l.trackId === activeTrackId);

  const totalMinutesStudied = filteredLogs.reduce((acc, curr) => acc + curr.durationMinutes, 0);

  return (
    <div className="py-6 space-y-8 max-w-4xl mx-auto">
      {/* Active Timer Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm text-center">
        {/* Mode switcher pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 max-w-md mx-auto mb-6">
          <button
            onClick={() => handleModeChange('pomodoro')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              timerMode === 'pomodoro'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🍅 Pomodoro (25m)
          </button>
          <button
            onClick={() => handleModeChange('deep')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              timerMode === 'deep'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🚀 Deep Work (50m)
          </button>
          <button
            onClick={() => handleModeChange('shortBreak')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              timerMode === 'shortBreak'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ☕ Pausa (5m)
          </button>
          <button
            onClick={() => handleModeChange('stopwatch')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              timerMode === 'stopwatch'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⏱️ Libero
          </button>
        </div>

        {/* Track selector for study session */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <span className="text-xs font-semibold text-slate-500 mr-1">Materia attiva:</span>
          {TRACKS.map(t => {
            const isSel = selectedTrack === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTrack(t.id)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition border ${
                  isSel
                    ? `${t.badgeBg} ring-2 ring-offset-1`
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
                style={isSel ? { borderColor: t.color } : {}}
              >
                {t.name}
              </button>
            );
          })}
        </div>

        {/* Toast Banner */}
        {toastMessage && (
          <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-800 animate-fade-in flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Timer Display */}
        <div className="my-6">
          <div className="font-mono text-6xl sm:text-7xl font-black tracking-tight text-slate-900">
            {formatTime(timeLeft)}
          </div>
          <div className="mt-3 flex items-center justify-center gap-2">
            <button
              onClick={() => setTimeLeft(prev => Math.max(60, prev - 300))}
              disabled={isRunning}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40"
              title="Sottrai 5 minuti"
            >
              -5 min
            </button>
            <span className="text-xs font-medium text-slate-500">
              {isRunning
                ? '⚡ Sessione di concentrazione attiva'
                : 'Premi Avvia quando sei pronto a studiare'}
            </span>
            <button
              onClick={() => setTimeLeft(prev => prev + 300)}
              disabled={isRunning}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40"
              title="Aggiungi 5 minuti"
            >
              +5 min
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold text-white shadow-md transition active:scale-95"
            style={{ backgroundColor: track.color }}
          >
            {isRunning ? (
              <>
                <Pause className="h-5 w-5" />
                <span>Pausa</span>
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                <span>{timeLeft === modeSeconds[timerMode] ? 'Avvia Studio' : 'Riprendi'}</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              setTimeLeft(modeSeconds[timerMode]);
              setElapsedStudySeconds(0);
            }}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 active:scale-95 transition"
            title="Azzera Timer"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>

        {/* Session Log Inputs */}
        {elapsedStudySeconds >= 10 && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 max-w-lg mx-auto text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Registra questa sessione ({Math.max(1, Math.round(elapsedStudySeconds / 60))} min)
              </span>
              <span className="text-[11px] font-semibold text-emerald-600">
                + {track.name}
              </span>
            </div>

            <input
              type="text"
              placeholder="Argomento o task affrontato (es: Esercizi Flexbox, Hook useEffect)..."
              value={sessionTopic}
              onChange={e => setSessionTopic(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-800 focus:border-slate-500"
            />

            <input
              type="text"
              placeholder="Note veloci o dubbi da rivedere (opzionale)..."
              value={sessionNotes}
              onChange={e => setSessionNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-800"
            />

            <button
              onClick={handleSaveSession}
              className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 active:scale-95 transition"
            >
              Salva e Registra Studio
            </button>
          </div>
        )}
      </div>

      {/* History of Study Sessions */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-slate-700" />
            <h3 className="text-base font-bold text-slate-900">
              Storico Sessioni di Studio
            </h3>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 font-mono text-xs font-bold text-slate-800">
            Totale: {totalMinutesStudied} minuti ({Math.round((totalMinutesStudied / 60) * 10) / 10} ore)
          </span>
        </div>

        {filteredLogs.length === 0 ? (
          <p className="text-center text-xs text-slate-400 py-8">
            Nessuna sessione registrata per questa materia. Avvia il timer per tracciare il tempo!
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLogs.map(log => {
              const logTrack = getTrackById(log.trackId);
              return (
                <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 gap-2">
                  <div className="flex items-start gap-3">
                    <span
                      className="mt-0.5 inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                      style={{ backgroundColor: `${logTrack.color}15`, color: logTrack.color }}
                    >
                      {logTrack.shortName}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">
                        {log.topic || `Studio ${logTrack.name}`}
                      </h4>
                      {log.notes && (
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {log.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center text-xs">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {log.durationMinutes} min
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      {new Date(log.date).toLocaleDateString('it-IT', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
