import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { Download, Upload, RefreshCw, X, Check, AlertTriangle } from 'lucide-react';

interface DataBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataBackupModal: React.FC<DataBackupModalProps> = ({ isOpen, onClose }) => {
  const { exportDataJson, importDataJson, resetToDefaults, data, setDailyGoal } = useStudy();
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [dailyGoalInput, setDailyGoalInput] = useState(data.dailyGoalMinutes || 60);

  if (!isOpen) return null;

  const handleExport = () => {
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `devstudy-planner-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!importText.trim()) return;
    const success = importDataJson(importText);
    if (success) {
      setImportStatus('success');
      setTimeout(() => {
        setImportStatus('idle');
        onClose();
      }, 1200);
    } else {
      setImportStatus('error');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        setImportText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm('Sei sicuro di voler ripristinare i dati di default? Eventuali modifiche non esportate andranno perse.')) {
      resetToDefaults();
      onClose();
    }
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    setDailyGoal(Number(dailyGoalInput));
    alert('Obiettivo giornaliero salvato!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <h3 className="text-base font-bold text-slate-900">
            Gestione Dati & Impostazioni
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Daily Goal Configuration */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              🎯 Obiettivo di Studio Giornaliero
            </h4>
            <form onSubmit={handleSaveGoal} className="flex items-center gap-3">
              <input
                type="number"
                min={15}
                max={600}
                step={5}
                value={dailyGoalInput}
                onChange={e => setDailyGoalInput(Number(e.target.value))}
                className="w-24 rounded-xl border border-slate-300 bg-white p-2 text-xs font-mono font-bold text-slate-900"
              />
              <span className="text-xs text-slate-600">minuti al giorno</span>
              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white shadow-2xs hover:bg-slate-800"
              >
                Salva
              </button>
            </form>
          </div>

          {/* Export section */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Esporta Backup JSON
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              Scarica una copia sicura di tutti i tuoi snippet, note, libri e obiettivi.
            </p>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 active:scale-95 transition"
            >
              <Download className="h-4 w-4" />
              <span>Scarica Backup (.json)</span>
            </button>
          </div>

          {/* Import section */}
          <div className="border-t border-slate-100 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Ripristina / Importa Dati
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              Carica un file JSON di backup precedentemente esportato.
            </p>

            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="mb-3 block w-full text-xs text-slate-500 file:mr-3 file:rounded-xl file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
            />

            {importText && (
              <button
                onClick={handleImport}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-500 transition"
              >
                <Upload className="h-4 w-4" />
                <span>Applica Dati Importati</span>
              </button>
            )}

            {importStatus === 'success' && (
              <p className="mt-2 text-xs font-bold text-emerald-600">
                ✅ Dati ripristinati con successo!
              </p>
            )}
            {importStatus === 'error' && (
              <p className="mt-2 text-xs font-bold text-red-600">
                ❌ Formato file JSON non valido.
              </p>
            )}
          </div>

          {/* Reset section */}
          <div className="border-t border-slate-100 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-red-600 mb-1">
              Ripristina Dati Iniziali
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              Reimposta tutti gli snippet, obiettivi, libri e note allo stato di fabbrica iniziale.
            </p>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Ripristina Starter Kit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
