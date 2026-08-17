export type TrackId = 'html' | 'css' | 'javascript' | 'tailwind' | 'react' | 'python' | string;

export interface TrackTheme {
  id: TrackId;
  name: string;
  shortName: string;
  tagline: string;
  iconName: string; // Lucide icon identifier
  color: string; // Primary hex or tailwind name
  accentBg: string; // Tailwind class
  accentText: string;
  accentBorder: string;
  badgeBg: string;
  badgeText: string;
  gradient: string;
  codeLang: string;
  docUrl: string;
}

export interface CodeSnippet {
  id: string;
  trackId: TrackId;
  title: string;
  description: string;
  code: string;
  language: string;
  tags: string[];
  outputPreview?: string;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ResourceType = 'doc' | 'tutorial' | 'video' | 'cheatsheet' | 'article' | 'tool';

export interface ReferenceResource {
  id: string;
  trackId: TrackId;
  title: string;
  url: string;
  type: ResourceType;
  description?: string;
  rating?: number; // 1 to 5
  isFavorite?: boolean;
  tags?: string[];
  createdAt: string;
}

export type BookStatus = 'to_read' | 'reading' | 'completed';

export interface ReferenceBook {
  id: string;
  trackId: TrackId;
  title: string;
  author: string;
  coverImage?: string;
  status: BookStatus;
  currentPage: number;
  totalPages: number;
  rating?: number; // 1 to 5
  keyTakeaways?: string;
  notes?: string;
  linkUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskDifficulty = 'base' | 'intermedio' | 'avanzato';
export type TaskPriority = 'alta' | 'media' | 'bassa';

export interface StudyTask {
  id: string;
  trackId: TrackId;
  title: string;
  category: string;
  description?: string;
  difficulty: TaskDifficulty;
  priority: TaskPriority;
  completed: boolean;
  completedAt?: string;
  dueDate?: string;
  estimatedMinutes?: number;
  actualMinutes?: number;
  notes?: string;
  createdAt: string;
}

export interface StudyNote {
  id: string;
  trackId: TrackId;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudySessionLog {
  id: string;
  trackId: TrackId;
  durationMinutes: number;
  date: string; // ISO date string
  topic?: string;
  notes?: string;
}

export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface ScheduleBlock {
  id: string;
  day: DayOfWeek;
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "11:00"
  trackId: TrackId;
  subjectTitle: string;
  topic: string;
  completed?: boolean;
  notes?: string;
}

export interface ExamDeadline {
  id: string;
  title: string;
  trackId: TrackId;
  dueDate: string; // "YYYY-MM-DD"
  type: 'esame' | 'progetto' | 'certificazione' | 'ripasso';
  priority: 'alta' | 'media' | 'bassa';
  progressPercentage: number; // 0 to 100
  topicsToReview: string[];
  notes?: string;
}

export interface AppStorageData {
  version: number;
  snippets: CodeSnippet[];
  resources: ReferenceResource[];
  books: ReferenceBook[];
  tasks: StudyTask[];
  notes: StudyNote[];
  logs: StudySessionLog[];
  scheduleBlocks: ScheduleBlock[];
  deadlines: ExamDeadline[];
  dailyGoalMinutes: number;
}
