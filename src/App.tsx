import React, { useState } from 'react';
import { StudyProvider, useStudy } from './context/StudyContext';
import { Navbar } from './components/Navbar';
import { TrackSelector } from './components/TrackSelector';
import { TrackHeader } from './components/TrackHeader';
import { OverviewDashboard } from './components/OverviewDashboard';
import { DailyPlanner } from './components/DailyPlanner';
import { WeeklySchedulePlanner } from './components/WeeklySchedulePlanner';
import { SnippetManager } from './components/SnippetManager';
import { BooksManager } from './components/BooksManager';
import { FocusTimer } from './components/FocusTimer';
import { InstallPwaBanner } from './components/InstallPwaBanner';
import {
  NewSnippetModal,
  NewTaskModal,
  NewBookModal,
  NewResourceModal,
  NewNoteModal,
} from './components/CreateModals';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { DataBackupModal } from './components/DataBackupModal';
import { getTrackById } from './data/tracks';
import { X, Clock } from 'lucide-react';

const MainApp: React.FC = () => {
  const { activeTrackId, activeTab } = useStudy();

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);

  const [isNewSnippetOpen, setIsNewSnippetOpen] = useState(false);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isNewBookOpen, setIsNewBookOpen] = useState(false);
  const [isNewResourceOpen, setIsNewResourceOpen] = useState(false);
  const [isNewNoteOpen, setIsNewNoteOpen] = useState(false);

  const isOverview = activeTrackId === 'overview' && activeTab === 'overview';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* PWA Install Banner */}
      <InstallPwaBanner />

      {/* Top Navbar */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenBackup={() => setIsBackupOpen(true)}
        onOpenTimer={() => setIsTimerModalOpen(true)}
      />

      {/* Language Tracks Navigation Ribbon */}
      <TrackSelector />

      {/* Main Track Banner (if specific language selected) */}
      {!isOverview && (
        <TrackHeader
          onOpenNewSnippet={() => setIsNewSnippetOpen(true)}
          onOpenNewBook={() => setIsNewBookOpen(true)}
          onOpenTimer={() => setIsTimerModalOpen(true)}
        />
      )}

      {/* Content Container */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6">
        {isOverview ? (
          <OverviewDashboard onOpenTimer={() => setIsTimerModalOpen(true)} />
        ) : (
          <div>
            {activeTab === 'planner' && (
              <DailyPlanner
                onOpenTimerForTopic={() => setIsTimerModalOpen(true)}
              />
            )}
            {activeTab === 'snippets' && (
              <SnippetManager onOpenNewModal={() => setIsNewSnippetOpen(true)} />
            )}
            {(activeTab === 'books' || activeTab === 'resources') && (
              <BooksManager
                onOpenNewBookModal={() => setIsNewBookOpen(true)}
              />
            )}
            {activeTab === 'timer' && (
              <FocusTimer />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium text-slate-700">
            <span>DevStudy Planner</span>
            <span>•</span>
            <span className="text-slate-500">HTML, CSS, JavaScript, Tailwind, React, Python</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Salvataggio locale persistente nel browser con supporto esportazione JSON
          </p>
        </div>
      </footer>

      {/* Creation & Global Modals */}
      {isNewSnippetOpen && <NewSnippetModal onClose={() => setIsNewSnippetOpen(false)} />}
      {isNewTaskOpen && <NewTaskModal onClose={() => setIsNewTaskOpen(false)} />}
      {isNewBookOpen && <NewBookModal onClose={() => setIsNewBookOpen(false)} />}
      {isNewResourceOpen && <NewResourceModal onClose={() => setIsNewResourceOpen(false)} />}
      {isNewNoteOpen && <NewNoteModal onClose={() => setIsNewNoteOpen(false)} />}

      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <DataBackupModal isOpen={isBackupOpen} onClose={() => setIsBackupOpen(false)} />

      {/* Focus Timer Modal Popup */}
      {isTimerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Timer di Studio & Pomodoro
                </h3>
              </div>
              <button
                onClick={() => setIsTimerModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <FocusTimer onClose={() => setIsTimerModalOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <StudyProvider>
      <MainApp />
    </StudyProvider>
  );
}
