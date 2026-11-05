import React from 'react';
import { Sparkles, Mic, Sun, Moon, BookOpen, Layers, CheckSquare } from 'lucide-react';

interface NavbarProps {
  currentView: 'lectures' | 'record' | 'flashcards' | 'quiz' | 'detail';
  onNavigate: (view: 'lectures' | 'record' | 'flashcards' | 'quiz') => void;
  onOpenRecordModal: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  lectureCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenRecordModal,
  isDark,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/90 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark (Single text element in display face) */}
        <button
          onClick={() => onNavigate('lectures')}
          className="group flex items-center gap-2.5 text-left text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 transition-opacity hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm dark:bg-indigo-500">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="font-display text-xl">Synapse</span>
        </button>

        {/* Zone 2: 4-5 Clean Single-Line Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onNavigate('lectures')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentView === 'lectures' || currentView === 'detail'
                ? 'text-indigo-600 font-semibold dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Lecture Library
          </button>
          <button
            onClick={() => onNavigate('record')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentView === 'record'
                ? 'text-indigo-600 font-semibold dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Record & Ingest
          </button>
          <button
            onClick={() => onNavigate('flashcards')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentView === 'flashcards'
                ? 'text-indigo-600 font-semibold dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Flashcard Decks
          </button>
          <button
            onClick={() => onNavigate('quiz')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentView === 'quiz'
                ? 'text-indigo-600 font-semibold dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Practice Quizzes
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Theme Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleTheme}
            aria-label="Toggle color theme"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 transition-colors"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            onClick={onOpenRecordModal}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 whitespace-nowrap shrink-0 transition-colors"
          >
            <Mic className="h-4 w-4" />
            <span>New Lecture</span>
          </button>
        </div>
      </div>
    </header>
  );
};
