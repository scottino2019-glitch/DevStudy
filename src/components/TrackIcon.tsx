import React from 'react';
import {
  FileCode2,
  Palette,
  Flame,
  Wind,
  Atom,
  Terminal,
  Code,
  Layers,
  BookOpen,
  CheckCircle2,
  Clock,
  ExternalLink,
  Search,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Copy,
  Check,
  Play,
  Pause,
  RotateCcw,
  Star,
  Bookmark,
  FileText,
  Pin,
  TrendingUp,
  Download,
  Upload,
  RefreshCw,
  FolderCode,
  Tag,
  Eye,
  Settings,
  X,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface TrackIconProps {
  name: string;
  className?: string;
}

export const TrackIcon: React.FC<TrackIconProps> = ({ name, className = 'w-5 h-5' }) => {
  switch (name) {
    case 'FileCode2':
      return <FileCode2 className={className} />;
    case 'Palette':
      return <Palette className={className} />;
    case 'Flame':
      return <Flame className={className} />;
    case 'Wind':
      return <Wind className={className} />;
    case 'Atom':
      return <Atom className={className} />;
    case 'Terminal':
      return <Terminal className={className} />;
    case 'Layers':
      return <Layers className={className} />;
    default:
      return <Code className={className} />;
  }
};

export {
  FileCode2,
  Palette,
  Flame,
  Wind,
  Atom,
  Terminal,
  Code,
  Layers,
  BookOpen,
  CheckCircle2,
  Clock,
  ExternalLink,
  Search,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Copy,
  Check,
  Play,
  Pause,
  RotateCcw,
  Star,
  Bookmark,
  FileText,
  Pin,
  TrendingUp,
  Download,
  Upload,
  RefreshCw,
  FolderCode,
  Tag,
  Eye,
  Settings,
  X,
  Calendar,
  AlertCircle
};
