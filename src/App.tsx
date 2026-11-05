import React, { useState, useEffect } from 'react';
import { SAMPLE_LECTURES } from './data/sampleLectures';
import { LectureItem } from './types/lecture';
import { IMAGES } from './assets/images';
import { Navbar } from './components/Navbar';
import { LectureCard } from './components/LectureCard';
import { LectureDetailView } from './components/LectureDetailView';
import { RecordModal } from './components/RecordModal';
import { FlashcardDeck } from './components/FlashcardDeck';
import { QuizView } from './components/QuizView';
import {
  Sparkles,
  Mic,
  Upload,
  BookOpen,
  Layers,
  CheckSquare,
  Search,
  Filter,
  ArrowRight,
  Plus,
  Compass,
  GraduationCap
} from 'lucide-react';

const STORAGE_KEY = 'synapse_lectures_store_v7';
const THEME_KEY = 'synapse_theme_preference';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Lectures store with image asset synchronization
  const [lectures, setLectures] = useState<LectureItem[]>(() => {
    try {
      const saved =
        localStorage.getItem(STORAGE_KEY) ||
        localStorage.getItem('synapse_lectures_store_v6') ||
        localStorage.getItem('synapse_lectures_store_v5') ||
        localStorage.getItem('synapse_lectures_store_v4') ||
        localStorage.getItem('synapse_lectures_store_v2') ||
        localStorage.getItem('synapse_lectures_store_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Synchronize fresh sample cover images from SAMPLE_LECTURES
          return parsed.map((item: LectureItem) => {
            if (item.id === 'lecture-neuro-101' || item.courseCode === 'NEURO 101') {
              return { ...item, coverImage: IMAGES.neuroscience };
            }
            if (item.id === 'lecture-cs-229' || item.courseCode === 'CS 229') {
              return { ...item, coverImage: IMAGES.machineLearning };
            }
            if (item.id === 'lecture-law-204' || item.courseCode === 'LAW 204') {
              return { ...item, coverImage: IMAGES.constitutionalLaw };
            }
            if (item.youtubeId) {
              return { ...item, coverImage: `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg` };
            }
            const match = SAMPLE_LECTURES.find((s) => s.id === item.id);
            if (match && match.coverImage) {
              return { ...item, coverImage: match.coverImage };
            }
            return item;
          });
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved lectures:', e);
    }
    return SAMPLE_LECTURES;
  });

  // Navigation states
  const [currentView, setCurrentView] = useState<'lectures' | 'record' | 'flashcards' | 'quiz' | 'detail'>('lectures');
  const [selectedLectureId, setSelectedLectureId] = useState<string | null>(null);
  const [selectedLectureTab, setSelectedLectureTab] = useState<'notes' | 'flashcards' | 'quiz' | 'transcript' | 'cheatsheet'>('notes');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  // Search & Filter in library
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');

  // Sync dark class on <html>
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [isDark]);

  // Persist lectures
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lectures));
    } catch (e) {
      console.warn('Failed to persist lectures:', e);
    }
  }, [lectures]);

  const handleToggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleSelectLecture = (
    lecture: LectureItem,
    tab: 'notes' | 'flashcards' | 'quiz' | 'transcript' | 'cheatsheet' = 'notes'
  ) => {
    setSelectedLectureId(lecture.id);
    setSelectedLectureTab(tab);
    setCurrentView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLectureCreated = (newLecture: LectureItem) => {
    setLectures((prev) => [newLecture, ...prev]);
    handleSelectLecture(newLecture, 'notes');
  };

  const activeLecture = lectures.find((l) => l.id === selectedLectureId) || lectures[0];

  // Subject list for filter tabs
  const subjects = ['All', ...Array.from(new Set(lectures.map((l) => l.subject)))];

  // Filtered lectures for library
  const filteredLectures = lectures.filter((l) => {
    const matchesSubject = selectedSubject === 'All' || l.subject === selectedSubject;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      l.title.toLowerCase().includes(q) ||
      l.courseCode.toLowerCase().includes(q) ||
      l.overview.summary.toLowerCase().includes(q) ||
      l.overview.topics.some((t) => t.toLowerCase().includes(q));
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          if (view === 'record') setIsRecordModalOpen(true);
        }}
        onOpenRecordModal={() => setIsRecordModalOpen(true)}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        lectureCount={lectures.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full">
        {/* VIEW 1: Detail View for Selected Lecture */}
        {currentView === 'detail' && activeLecture && (
          <LectureDetailView
            lecture={activeLecture}
            initialTab={selectedLectureTab}
            onBack={() => setCurrentView('lectures')}
          />
        )}

        {/* VIEW 2: Flashcard Hub View */}
        {currentView === 'flashcards' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Flashcard Mastery Hub
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select a lecture deck to start active recall with spaced-repetition feedback
                </p>
              </div>

              {/* Lecture Selector for Deck */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Selected Deck:</span>
                <select
                  value={activeLecture?.id}
                  onChange={(e) => setSelectedLectureId(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {lectures.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.courseCode}: {l.title} ({l.flashcards.length} cards)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {activeLecture && (
              <FlashcardDeck
                initialCards={activeLecture.flashcards}
                lectureTitle={activeLecture.title}
                courseCode={activeLecture.courseCode}
              />
            )}
          </div>
        )}

        {/* VIEW 3: Practice Quiz Hub View */}
        {currentView === 'quiz' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Practice Knowledge Checks
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Exam-level conceptual questions generated directly from lecture discussions
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Selected Quiz:</span>
                <select
                  value={activeLecture?.id}
                  onChange={(e) => setSelectedLectureId(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {lectures.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.courseCode}: {l.title} ({l.quiz.length} Qs)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {activeLecture && (
              <QuizView
                questions={activeLecture.quiz}
                lectureTitle={activeLecture.title}
              />
            )}
          </div>
        )}

        {/* VIEW 4: Main Lecture Library View */}
        {(currentView === 'lectures' || currentView === 'record') && (
          <div className="space-y-8">
            {/* Hero Welcome & Feature Banner */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                {/* Left Text Zone */}
                <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    {/* Unboxed editorial category */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      <GraduationCap className="h-4 w-4" />
                      <span>Autonomous Student Note-Taking & Revision Suite</span>
                    </div>

                    <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                      Never take manual notes in class again.
                    </h1>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                      Paste any YouTube video link, record live classroom audio, or upload audio files.
                      Synapse creates timestamped transcripts, structures them into rigorous Cornell study notes,
                      and synthesizes tailored flashcards and practice quizzes in seconds.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => setIsRecordModalOpen(true)}
                      className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 transition-all"
                    >
                      <Mic className="h-4 w-4" />
                      <span>Ingest (YouTube, Mic, Audio)</span>
                    </button>

                    <button
                      onClick={() => {
                        const ytSample = lectures.find((l) => l.youtubeId) || lectures[0];
                        if (ytSample) handleSelectLecture(ytSample, 'notes');
                      }}
                      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <BookOpen className="h-4 w-4 text-indigo-500" />
                      <span>Explore MIT YouTube Sample</span>
                    </button>
                  </div>

                  {/* Anti-slop social proof / mechanism chain */}
                  <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-4 dark:border-slate-800 text-xs">
                    <div>
                      <div className="font-mono text-base font-bold text-slate-900 dark:text-white tabular-nums">
                        Cornell Notes
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Cues & summaries
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-base font-bold text-slate-900 dark:text-white tabular-nums">
                        Active Recall
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        3D flip flashcards
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-base font-bold text-slate-900 dark:text-white tabular-nums">
                        Grounded AI
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Zero hallucination Q&A
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Hero Image */}
                <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={IMAGES.hero}
                    alt="University student lecture workspace"
                    loading="eager"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-slate-950/40 lg:to-transparent" />
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Subject Filter Tabs (Interactive buttons with active states) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
                {subjects.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubject(sub)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                      selectedSubject === sub
                        ? 'bg-indigo-600 text-white shadow-sm dark:bg-indigo-500'
                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search course, title, or topic..."
                  className="w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Lectures Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>
                  Showing{' '}
                  <strong className="text-slate-900 dark:text-white font-mono tabular-nums">
                    {filteredLectures.length}
                  </strong>{' '}
                  curated lecture study packs
                </span>
                <span className="hidden sm:inline">Click any card to open the interactive study suite</span>
              </div>

              {filteredLectures.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900 space-y-3">
                  <BookOpen className="mx-auto h-8 w-8 text-slate-400" />
                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                    No lectures match your filters
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Try clearing your search query or ingest a new lecture using your microphone.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedSubject('All');
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredLectures.map((lecture) => (
                    <LectureCard
                      key={lecture.id}
                      lecture={lecture}
                      onSelect={(l, tab) => handleSelectLecture(l, tab)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Record & Ingest Modal */}
      <RecordModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        onLectureCreated={handleLectureCreated}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 transition-colors">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-slate-900 dark:text-white">Synapse</span>
            <span aria-hidden="true">·</span>
            <span>Lecture Transcriber & Autonomous Study Suite</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Powered by Gemini Multimodal Speech & Reasoning</span>
            <span aria-hidden="true">·</span>
            <span>Offline-Ready Local Storage</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
