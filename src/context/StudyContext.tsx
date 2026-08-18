import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AppStorageData,
  CodeSnippet,
  ReferenceResource,
  ReferenceBook,
  StudyTask,
  StudyNote,
  StudySessionLog,
  TrackId,
  ScheduleBlock,
  ExamDeadline,
  DayOfWeek,
} from '../types';
import { INITIAL_DATA } from '../data/defaultData';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'dev_study_planner_data_v1';

export type MainTabType = 'planner' | 'snippets' | 'books' | 'timer' | 'overview' | 'roadmap' | 'resources' | 'notes';

interface StudyContextType {
  data: AppStorageData;
  activeTrackId: string; // 'overview' or track ID ('html', 'css', etc.)
  setActiveTrackId: (id: string) => void;
  activeTab: MainTabType;
  setActiveTab: (tab: MainTabType) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Snippets
  addSnippet: (snippet: Omit<CodeSnippet, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSnippet: (id: string, snippet: Partial<CodeSnippet>) => void;
  deleteSnippet: (id: string) => void;
  toggleFavoriteSnippet: (id: string) => void;

  // Resources
  addResource: (resource: Omit<ReferenceResource, 'id' | 'createdAt'>) => void;
  updateResource: (id: string, resource: Partial<ReferenceResource>) => void;
  deleteResource: (id: string) => void;
  toggleFavoriteResource: (id: string) => void;

  // Books
  addBook: (book: Omit<ReferenceBook, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBook: (id: string, book: Partial<ReferenceBook>) => void;
  deleteBook: (id: string) => void;
  updateBookProgress: (id: string, currentPage: number, status?: ReferenceBook['status']) => void;

  // Tasks
  addTask: (task: Omit<StudyTask, 'id' | 'createdAt' | 'completed' | 'completedAt'>) => void;
  updateTask: (id: string, task: Partial<StudyTask>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompleted: (id: string) => void;

  // Notes
  addNote: (note: Omit<StudyNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, note: Partial<StudyNote>) => void;
  deleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;

  // Schedule Blocks
  addScheduleBlock: (block: Omit<ScheduleBlock, 'id'>) => void;
  updateScheduleBlock: (id: string, block: Partial<ScheduleBlock>) => void;
  deleteScheduleBlock: (id: string) => void;
  toggleScheduleBlockCompleted: (id: string) => void;

  // Deadlines & Exams
  addDeadline: (deadline: Omit<ExamDeadline, 'id'>) => void;
  updateDeadline: (id: string, deadline: Partial<ExamDeadline>) => void;
  deleteDeadline: (id: string) => void;
  updateDeadlineProgress: (id: string, progress: number) => void;

  // Study Logs & Timer
  logStudySession: (trackId: TrackId, durationMinutes: number, topic?: string, notes?: string) => void;
  setDailyGoal: (minutes: number) => void;

  // Import / Export / Reset
  exportDataJson: () => string;
  importDataJson: (jsonString: string) => boolean;
  resetToDefaults: () => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppStorageData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            ...INITIAL_DATA,
            ...parsed,
            snippets: Array.isArray(parsed.snippets) ? parsed.snippets : INITIAL_DATA.snippets,
            books: Array.isArray(parsed.books) ? parsed.books : INITIAL_DATA.books,
            tasks: Array.isArray(parsed.tasks) ? parsed.tasks : INITIAL_DATA.tasks,
            scheduleBlocks: Array.isArray(parsed.scheduleBlocks) ? parsed.scheduleBlocks : INITIAL_DATA.scheduleBlocks,
            deadlines: Array.isArray(parsed.deadlines) ? parsed.deadlines : INITIAL_DATA.deadlines,
            resources: Array.isArray(parsed.resources) ? parsed.resources : INITIAL_DATA.resources,
            notes: Array.isArray(parsed.notes) ? parsed.notes : INITIAL_DATA.notes,
            logs: Array.isArray(parsed.logs) ? parsed.logs : (INITIAL_DATA.logs || []),
            dailyGoalMinutes: typeof parsed.dailyGoalMinutes === 'number' ? parsed.dailyGoalMinutes : INITIAL_DATA.dailyGoalMinutes,
          };
        }
      }
    } catch (e) {
      console.error('Failed to load study planner data from localStorage', e);
    }
    return INITIAL_DATA;
  });

  const [activeTrackId, setActiveTrackId] = useState<string>('overview');
  const [activeTab, setActiveTab] = useState<MainTabType>('planner');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [data]);

  // Snippets
  const addSnippet = (snippet: Omit<CodeSnippet, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newSnippet: CodeSnippet = {
      ...snippet,
      id: `snip-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };
    setData(prev => ({
      ...prev,
      snippets: [newSnippet, ...prev.snippets],
    }));
  };

  const updateSnippet = (id: string, patch: Partial<CodeSnippet>) => {
    const now = new Date().toISOString();
    setData(prev => ({
      ...prev,
      snippets: prev.snippets.map(s => (s.id === id ? { ...s, ...patch, updatedAt: now } : s)),
    }));
  };

  const deleteSnippet = (id: string) => {
    setData(prev => ({
      ...prev,
      snippets: prev.snippets.filter(s => s.id !== id),
    }));
  };

  const toggleFavoriteSnippet = (id: string) => {
    setData(prev => ({
      ...prev,
      snippets: prev.snippets.map(s => (s.id === id ? { ...s, isFavorite: !s.isFavorite } : s)),
    }));
  };

  // Resources
  const addResource = (resource: Omit<ReferenceResource, 'id' | 'createdAt'>) => {
    const now = new Date().toISOString();
    const newRes: ReferenceResource = {
      ...resource,
      id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
    };
    setData(prev => ({
      ...prev,
      resources: [newRes, ...prev.resources],
    }));
  };

  const updateResource = (id: string, patch: Partial<ReferenceResource>) => {
    setData(prev => ({
      ...prev,
      resources: prev.resources.map(r => (r.id === id ? { ...r, ...patch } : r)),
    }));
  };

  const deleteResource = (id: string) => {
    setData(prev => ({
      ...prev,
      resources: prev.resources.filter(r => r.id !== id),
    }));
  };

  const toggleFavoriteResource = (id: string) => {
    setData(prev => ({
      ...prev,
      resources: prev.resources.map(r => (r.id === id ? { ...r, isFavorite: !r.isFavorite } : r)),
    }));
  };

  // Books
  const addBook = (book: Omit<ReferenceBook, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newBook: ReferenceBook = {
      ...book,
      id: `book-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };
    setData(prev => ({
      ...prev,
      books: [newBook, ...prev.books],
    }));
  };

  const updateBook = (id: string, patch: Partial<ReferenceBook>) => {
    const now = new Date().toISOString();
    setData(prev => ({
      ...prev,
      books: prev.books.map(b => (b.id === id ? { ...b, ...patch, updatedAt: now } : b)),
    }));
  };

  const deleteBook = (id: string) => {
    setData(prev => ({
      ...prev,
      books: prev.books.filter(b => b.id !== id),
    }));
  };

  const updateBookProgress = (id: string, currentPage: number, status?: ReferenceBook['status']) => {
    const now = new Date().toISOString();
    setData(prev => ({
      ...prev,
      books: prev.books.map(b => {
        if (b.id !== id) return b;
        let newStatus = status || b.status;
        if (currentPage >= b.totalPages && b.totalPages > 0) {
          newStatus = 'completed';
        } else if (currentPage > 0 && newStatus === 'to_read') {
          newStatus = 'reading';
        }
        return {
          ...b,
          currentPage: Math.min(currentPage, b.totalPages),
          status: newStatus,
          updatedAt: now,
        };
      }),
    }));
  };

  // Tasks
  const addTask = (task: Omit<StudyTask, 'id' | 'createdAt' | 'completed' | 'completedAt'>) => {
    const newTask: StudyTask = {
      ...task,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setData(prev => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
    }));
  };

  const updateTask = (id: string, patch: Partial<StudyTask>) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => (t.id === id ? { ...t, ...patch } : t)),
    }));
  };

  const deleteTask = (id: string) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id),
    }));
  };

  const toggleTaskCompleted = (id: string) => {
    setData(prev => {
      const task = prev.tasks.find(t => t.id === id);
      const isNowCompleted = !task?.completed;
      
      if (isNowCompleted) {
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#E44D26', '#2563EB', '#D97706', '#0D9488', '#0284C7', '#059669'],
          });
        } catch {
          // ignore confetti if not available
        }
      }

      return {
        ...prev,
        tasks: prev.tasks.map(t =>
          t.id === id
            ? {
                ...t,
                completed: isNowCompleted,
                completedAt: isNowCompleted ? new Date().toISOString() : undefined,
              }
            : t
        ),
      };
    });
  };

  // Notes
  const addNote = (note: Omit<StudyNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newNote: StudyNote = {
      ...note,
      id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };
    setData(prev => ({
      ...prev,
      notes: [newNote, ...prev.notes],
    }));
  };

  const updateNote = (id: string, patch: Partial<StudyNote>) => {
    const now = new Date().toISOString();
    setData(prev => ({
      ...prev,
      notes: prev.notes.map(n => (n.id === id ? { ...n, ...patch, updatedAt: now } : n)),
    }));
  };

  const deleteNote = (id: string) => {
    setData(prev => ({
      ...prev,
      notes: prev.notes.filter(n => n.id !== id),
    }));
  };

  const togglePinNote = (id: string) => {
    setData(prev => ({
      ...prev,
      notes: prev.notes.map(n => (n.id === id ? { ...n, isPinned: !n.isPinned } : n)),
    }));
  };

  // Schedule Blocks
  const addScheduleBlock = (block: Omit<ScheduleBlock, 'id'>) => {
    const newBlock: ScheduleBlock = {
      ...block,
      id: `sch-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      completed: block.completed ?? false,
    };
    setData(prev => ({
      ...prev,
      scheduleBlocks: [...prev.scheduleBlocks, newBlock],
    }));
  };

  const updateScheduleBlock = (id: string, patch: Partial<ScheduleBlock>) => {
    setData(prev => ({
      ...prev,
      scheduleBlocks: prev.scheduleBlocks.map(b => (b.id === id ? { ...b, ...patch } : b)),
    }));
  };

  const deleteScheduleBlock = (id: string) => {
    setData(prev => ({
      ...prev,
      scheduleBlocks: prev.scheduleBlocks.filter(b => b.id !== id),
    }));
  };

  const toggleScheduleBlockCompleted = (id: string) => {
    setData(prev => {
      const block = prev.scheduleBlocks.find(b => b.id === id);
      const isNowCompleted = !block?.completed;
      if (isNowCompleted) {
        try {
          confetti({
            particleCount: 40,
            spread: 50,
            origin: { y: 0.7 },
          });
        } catch {
          // ignore
        }
      }
      return {
        ...prev,
        scheduleBlocks: prev.scheduleBlocks.map(b =>
          b.id === id ? { ...b, completed: isNowCompleted } : b
        ),
      };
    });
  };

  // Deadlines & Exams
  const addDeadline = (deadline: Omit<ExamDeadline, 'id'>) => {
    const newDl: ExamDeadline = {
      ...deadline,
      id: `dl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setData(prev => ({
      ...prev,
      deadlines: [...prev.deadlines, newDl],
    }));
  };

  const updateDeadline = (id: string, patch: Partial<ExamDeadline>) => {
    setData(prev => ({
      ...prev,
      deadlines: prev.deadlines.map(d => (d.id === id ? { ...d, ...patch } : d)),
    }));
  };

  const deleteDeadline = (id: string) => {
    setData(prev => ({
      ...prev,
      deadlines: prev.deadlines.filter(d => d.id !== id),
    }));
  };

  const updateDeadlineProgress = (id: string, progress: number) => {
    setData(prev => ({
      ...prev,
      deadlines: prev.deadlines.map(d =>
        d.id === id ? { ...d, progressPercentage: Math.max(0, Math.min(100, progress)) } : d
      ),
    }));
  };

  // Study Logs
  const logStudySession = (trackId: TrackId, durationMinutes: number, topic?: string, notes?: string) => {
    const newLog: StudySessionLog = {
      id: `log-${Date.now()}`,
      trackId,
      durationMinutes,
      date: new Date().toISOString(),
      topic,
      notes,
    };
    setData(prev => ({
      ...prev,
      logs: [newLog, ...prev.logs],
    }));
  };

  const setDailyGoal = (minutes: number) => {
    setData(prev => ({
      ...prev,
      dailyGoalMinutes: minutes,
    }));
  };

  // Import / Export
  const exportDataJson = (): string => {
    return JSON.stringify(data, null, 2);
  };

  const importDataJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && Array.isArray(parsed.snippets) && Array.isArray(parsed.tasks)) {
        setData(parsed);
        return true;
      }
    } catch (e) {
      console.error('Import failed', e);
    }
    return false;
  };

  const resetToDefaults = () => {
    setData(INITIAL_DATA);
  };

  return (
    <StudyContext.Provider
      value={{
        data,
        activeTrackId,
        setActiveTrackId,
        activeTab,
        setActiveTab,
        searchTerm,
        setSearchTerm,
        isSearchOpen,
        setIsSearchOpen,
        addSnippet,
        updateSnippet,
        deleteSnippet,
        toggleFavoriteSnippet,
        addResource,
        updateResource,
        deleteResource,
        toggleFavoriteResource,
        addBook,
        updateBook,
        deleteBook,
        updateBookProgress,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompleted,
        addNote,
        updateNote,
        deleteNote,
        togglePinNote,
        addScheduleBlock,
        updateScheduleBlock,
        deleteScheduleBlock,
        toggleScheduleBlockCompleted,
        addDeadline,
        updateDeadline,
        deleteDeadline,
        updateDeadlineProgress,
        logStudySession,
        setDailyGoal,
        exportDataJson,
        importDataJson,
        resetToDefaults,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
};
