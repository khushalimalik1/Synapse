import React, { useState, useRef, useEffect } from 'react';
import { LectureItem } from '../types/lecture';
import { CornellNotesView } from './CornellNotesView';
import { FlashcardDeck } from './FlashcardDeck';
import { QuizView } from './QuizView';
import { TranscriptView } from './TranscriptView';
import { CheatSheetView } from './CheatSheetView';
import { AskLectureDrawer } from './AskLectureDrawer';
import { exportToMarkdown, exportToAnkiTSV } from '../utils/exportUtils';
import {
  ArrowLeft,
  BookOpen,
  Layers,
  CheckSquare,
  FileText,
  Bookmark,
  Sparkles,
  Download,
  Share2,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Clock,
  User,
  MessageSquare,
  ListOrdered,
  Youtube,
  ExternalLink
} from 'lucide-react';

interface LectureDetailViewProps {
  lecture: LectureItem;
  initialTab?: 'notes' | 'flashcards' | 'quiz' | 'transcript' | 'cheatsheet';
  onBack: () => void;
}

export const LectureDetailView: React.FC<LectureDetailViewProps> = ({
  lecture,
  initialTab = 'notes',
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'flashcards' | 'quiz' | 'transcript' | 'cheatsheet'>(
    initialTab
  );
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // YouTube player state
  const [youtubeStartTime, setYoutubeStartTime] = useState<number>(0);
  const [showVideo, setShowVideo] = useState(true);

  // Handle timestamp seek from Transcript or Cornell notes
  const handleJumpToTimestamp = (timestamp: string, seconds?: number) => {
    let targetSec = seconds;
    if (targetSec === undefined) {
      const parts = timestamp.split(':').map(Number);
      if (parts.length === 2) targetSec = parts[0] * 60 + parts[1];
      else if (parts.length === 3) targetSec = parts[0] * 3600 + parts[1] * 60 + parts[2];
      else targetSec = 0;
    }

    if (lecture.youtubeId) {
      setYoutubeStartTime(targetSec);
      setShowVideo(true);
    }

    if (audioRef.current) {
      audioRef.current.currentTime = targetSec;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
    setCurrentSeconds(targetSec);
  };

  const togglePlayAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Breadcrumb Navigation & Action Strip */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Library</span>
          </button>
          <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">/</span>
          <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
            {lecture.courseCode}
          </span>
          <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">/</span>
          <span className="text-xs font-medium text-slate-900 dark:text-white truncate max-w-xs">
            {lecture.title}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAssistantOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900/60 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Ask Lecture AI</span>
          </button>

          <button
            onClick={() => exportToMarkdown(lecture)}
            title="Download Notes & Study Guide as Markdown"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export Notes</span>
          </button>

          <button
            onClick={() => exportToAnkiTSV(lecture)}
            title="Export Flashcards for Anki"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            <Layers className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Anki TSV</span>
          </button>
        </div>
      </div>

      {/* Hero Overview Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
          <div className="space-y-3 flex-1">
            {/* Metadata: Clean unboxed text with typographic separators */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                {lecture.courseCode}
              </span>
              <span aria-hidden="true">·</span>
              <span>{lecture.subject}</span>
              <span aria-hidden="true">·</span>
              <span>{lecture.date}</span>
              <span aria-hidden="true">·</span>
              <span>{lecture.duration}</span>
              <span aria-hidden="true">·</span>
              <span>Level: {lecture.overview.difficulty}</span>
              {lecture.instructor && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {lecture.instructor}
                  </span>
                </>
              )}
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {lecture.title}
            </h1>

            <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 max-w-3xl">
              {lecture.overview.summary}
            </p>

            {/* Key Takeaways preview strip */}
            <div className="pt-2">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                Core Takeaways:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {lecture.overview.keyTakeaways.slice(0, 4).map((takeaway, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-800 dark:bg-slate-800/60 dark:text-slate-200"
                  >
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono text-[11px] shrink-0 mt-0.5">
                      {idx + 1}.
                    </span>
                    <span className="leading-snug">{takeaway}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Metrics Badge Card */}
          <div className="w-full lg:w-64 rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/50 space-y-3 shrink-0">
            <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Study Pack Details
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Estimated Study Time:</span>
                <strong className="font-mono tabular-nums text-slate-900 dark:text-white">
                  {lecture.overview.estimatedStudyTime}
                </strong>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Cornell Sections:</span>
                <strong className="font-mono tabular-nums text-slate-900 dark:text-white">
                  {lecture.cornellNotes.length}
                </strong>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Flashcards:</span>
                <strong className="font-mono tabular-nums text-slate-900 dark:text-white">
                  {lecture.flashcards.length}
                </strong>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Quiz Questions:</span>
                <strong className="font-mono tabular-nums text-slate-900 dark:text-white">
                  {lecture.quiz.length}
                </strong>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Glossary Terms:</span>
                <strong className="font-mono tabular-nums text-slate-900 dark:text-white">
                  {lecture.glossary.length}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Embedded YouTube Video Player (Synchronized with transcript timestamps) */}
        {lecture.youtubeId && (
          <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Youtube className="h-4 w-4 text-red-500" />
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  YouTube Lecture Video
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">
                  (Click any transcript timestamp to seek video)
                </span>
              </div>
              <div className="flex items-center gap-3">
                {lecture.youtubeUrl && (
                  <a
                    href={lecture.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    <span>Open in YouTube</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                <button
                  onClick={() => setShowVideo((prev) => !prev)}
                  className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  {showVideo ? 'Collapse Player' : 'Expand Player'}
                </button>
              </div>
            </div>

            {showVideo && (
              <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-black aspect-video max-h-[460px] w-full shadow-md">
                <iframe
                  key={`${lecture.youtubeId}-${youtubeStartTime}`}
                  src={`https://www.youtube-nocookie.com/embed/${lecture.youtubeId}?start=${youtubeStartTime}&autoplay=${
                    youtubeStartTime > 0 ? 1 : 0
                  }&rel=0`}
                  title={lecture.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            )}
          </div>
        )}

        {/* Audio Player Strip (if audio is provided or simulated) */}
        {lecture.audioUrl && (
          <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-100/70 dark:bg-slate-800/60 rounded-xl p-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlayAudio}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 transition-colors"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                </button>
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">
                    Lecture Audio Recording
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                    {Math.floor(currentSeconds / 60)}:
                    {(currentSeconds % 60).toString().padStart(2, '0')} / {lecture.duration}
                  </div>
                </div>
              </div>

              {/* Playback speed buttons */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 text-[11px]">Speed:</span>
                {[1, 1.25, 1.5, 2].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => handleSpeedChange(spd)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium transition-colors ${
                      playbackSpeed === spd
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>

              {/* Hidden HTML audio element */}
              <audio
                ref={audioRef}
                src={lecture.audioUrl}
                onTimeUpdate={() => {
                  if (audioRef.current) {
                    setCurrentSeconds(Math.floor(audioRef.current.currentTime));
                  }
                }}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Segmented Workspace Tabs (interactive buttons §1.A) */}
      <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-100/60 p-1.5 rounded-xl dark:border-slate-800 dark:bg-slate-900/60 overflow-x-auto">
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'notes'
              ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>Cornell Notes ({lecture.cornellNotes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('flashcards')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'flashcards'
              ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Tailored Flashcards ({lecture.flashcards.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'quiz'
              ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <CheckSquare className="h-3.5 w-3.5" />
          <span>Practice Quiz ({lecture.quiz.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('cheatsheet')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'cheatsheet'
              ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Bookmark className="h-3.5 w-3.5" />
          <span>Exam Cheatsheet & Glossary</span>
        </button>

        <button
          onClick={() => setActiveTab('transcript')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'transcript'
              ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          <span>Full Transcript</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'notes' && (
          <CornellNotesView
            notes={lecture.cornellNotes}
            summary={lecture.lectureSummary}
            onJumpToTimestamp={handleJumpToTimestamp}
          />
        )}

        {activeTab === 'flashcards' && (
          <FlashcardDeck
            initialCards={lecture.flashcards}
            lectureTitle={lecture.title}
            courseCode={lecture.courseCode}
            onExportAnki={() => exportToAnkiTSV(lecture)}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizView
            questions={lecture.quiz}
            lectureTitle={lecture.title}
          />
        )}

        {activeTab === 'cheatsheet' && (
          <CheatSheetView
            cheatSheet={lecture.cheatSheet}
            glossary={lecture.glossary}
            lectureTitle={lecture.title}
            courseCode={lecture.courseCode}
          />
        )}

        {activeTab === 'transcript' && (
          <TranscriptView
            segments={lecture.transcript}
            rawText={lecture.rawTranscriptText}
            onJumpToTimestamp={handleJumpToTimestamp}
            currentPlaybackSeconds={currentSeconds}
          />
        )}
      </div>

      {/* Grounded AI Assistant Drawer */}
      <AskLectureDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        lecture={lecture}
      />
    </div>
  );
};
