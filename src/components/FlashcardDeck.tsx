import React, { useState, useEffect } from 'react';
import { FlashcardItem } from '../types/lecture';
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Shuffle,
  CheckCircle,
  HelpCircle,
  Award,
  Download,
  Eye,
  Grid,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FlashcardDeckProps {
  initialCards: FlashcardItem[];
  lectureTitle: string;
  courseCode: string;
  onExportAnki?: () => void;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
  initialCards,
  lectureTitle,
  courseCode,
  onExportAnki,
}) => {
  const [cards, setCards] = useState<FlashcardItem[]>(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewMode, setViewMode] = useState<'study' | 'grid'>('study');
  const [filterDifficulty, setFilterDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Sync state if initialCards changes
  useEffect(() => {
    setCards(initialCards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionCompleted(false);
  }, [initialCards]);

  // Filtered cards based on difficulty
  const activeCards = cards.filter((c) => {
    if (filterDifficulty === 'All') return true;
    return c.difficulty === filterDifficulty;
  });

  const currentCard = activeCards[currentIndex] || activeCards[0];

  // Flip card
  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  // Next card
  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < activeCards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setSessionCompleted(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  // Previous card
  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Shuffle cards
  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionCompleted(false);
  };

  // Mark mastery status (spaced repetition feedback)
  const handleRateCard = (status: 'unlearned' | 'learning' | 'mastered') => {
    if (!currentCard) return;
    setCards((prev) =>
      prev.map((c) => (c.id === currentCard.id ? { ...c, masteryStatus: status } : c))
    );
    handleNext();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'study' || sessionCompleted) return;
      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, currentIndex, activeCards.length, sessionCompleted]);

  // Statistics
  const masteredCount = cards.filter((c) => c.masteryStatus === 'mastered').length;
  const learningCount = cards.filter((c) => c.masteryStatus === 'learning').length;
  const unlearnedCount = cards.filter((c) => !c.masteryStatus || c.masteryStatus === 'unlearned').length;

  if (activeCards.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs text-slate-500">No flashcards found for filter "{filterDifficulty}".</p>
        <button
          onClick={() => setFilterDifficulty('All')}
          className="mt-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Reset Filter to All
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Controls & Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            Tailored Flashcards
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Active recall flashcards extracted directly from the lecture material
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Difficulty Filter Tabs */}
          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => {
                  setFilterDifficulty(diff);
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  filterDifficulty === diff
                    ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 p-1 dark:border-slate-800">
            <button
              onClick={() => setViewMode('study')}
              title="Study Carousel"
              className={`p-1 rounded ${viewMode === 'study' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400' : 'text-slate-500'}`}
            >
              <Maximize2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              title="Grid View"
              className={`p-1 rounded ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400' : 'text-slate-500'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
          </div>

          {/* Shuffle button */}
          <button
            onClick={handleShuffle}
            title="Shuffle deck"
            className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            <Shuffle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Shuffle</span>
          </button>

          {/* Export Anki */}
          {onExportAnki && (
            <button
              onClick={onExportAnki}
              title="Export Anki TSV file"
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Anki TSV</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress & Mastery Metrics */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <span className="font-mono tabular-nums">
            Card {currentIndex + 1} of {activeCards.length}
          </span>
          <span aria-hidden="true">·</span>
          <span>
            <strong className="text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
              {masteredCount}
            </strong>{' '}
            Mastered
          </span>
          <span aria-hidden="true">·</span>
          <span>
            <strong className="text-amber-600 dark:text-amber-400 font-mono tabular-nums">
              {learningCount}
            </strong>{' '}
            Reviewing
          </span>
          <span aria-hidden="true">·</span>
          <span>
            <strong className="text-slate-600 dark:text-slate-300 font-mono tabular-nums">
              {unlearnedCount}
            </strong>{' '}
            Remaining
          </span>
        </div>

        <div className="text-[11px] text-slate-400 hidden sm:block">
          Keyboard: <kbd className="rounded border px-1 py-0.5 bg-slate-50 dark:bg-slate-800">Space</kbd> Flip · <kbd className="rounded border px-1 py-0.5 bg-slate-50 dark:bg-slate-800">←</kbd> <kbd className="rounded border px-1 py-0.5 bg-slate-50 dark:bg-slate-800">→</kbd> Navigate
        </div>
      </div>

      {/* VIEW MODE 1: Study Carousel */}
      {viewMode === 'study' && (
        <div className="max-w-2xl mx-auto space-y-5">
          {sessionCompleted ? (
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-8 text-center dark:border-indigo-900/40 dark:bg-indigo-950/20">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white mb-3">
                <Award className="h-6 w-6" />
              </div>
              <h4 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                Deck Session Complete!
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-md mx-auto">
                You reviewed all {activeCards.length} cards in this set. Regular repetition strengthens retention for exams.
              </p>

              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setCurrentIndex(0);
                    setIsFlipped(false);
                    setSessionCompleted(false);
                  }}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
                >
                  Restart Deck
                </button>
                <button
                  onClick={handleShuffle}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors"
                >
                  Shuffle & Re-test
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Progress bar */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className="h-full bg-indigo-600 transition-all duration-300 dark:bg-indigo-500"
                  style={{ width: `${((currentIndex + 1) / activeCards.length) * 100}%` }}
                />
              </div>

              {/* 3D Flippable Card Container */}
              <div
                onClick={handleFlip}
                className="perspective-1000 relative h-72 sm:h-80 w-full cursor-pointer select-none"
              >
                <div
                  className={`relative h-full w-full rounded-2xl border shadow-md transition-transform duration-500 transform-style-3d ${
                    isFlipped ? 'rotate-y-180' : ''
                  } ${
                    isFlipped
                      ? 'border-indigo-200 bg-indigo-50/30 dark:border-indigo-900/50 dark:bg-slate-900'
                      : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                  }`}
                >
                  {/* FRONT FACE */}
                  <div className="backface-hidden absolute inset-0 flex flex-col justify-between p-6 sm:p-8">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-medium text-indigo-600 dark:text-indigo-400">
                        {currentCard.topic}
                      </span>
                      <span className="text-[11px] font-mono">
                        {currentCard.difficulty}
                      </span>
                    </div>

                    <div className="flex flex-1 items-center justify-center text-center px-4">
                      <p className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                        {currentCard.front}
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                      <RotateCw className="h-3 w-3" />
                      <span>Click or press Space to reveal answer</span>
                    </div>
                  </div>

                  {/* BACK FACE */}
                  <div className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col justify-between p-6 sm:p-8 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-950/20 dark:to-purple-950/20">
                    <div className="flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400">
                      <span className="font-medium">ANSWER & EXPLANATION</span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {currentCard.topic}
                      </span>
                    </div>

                    <div className="flex flex-1 items-center justify-center text-center px-4">
                      <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-relaxed font-medium whitespace-pre-line">
                        {currentCard.back}
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                      <RotateCw className="h-3 w-3" />
                      <span>Click to flip back</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Spaced Repetition Grading & Navigation Bar */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Prev</span>
                </button>

                {/* Spaced Repetition Rating Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRateCard('unlearned')}
                    className="rounded-lg border border-red-200 bg-red-50/70 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300 transition-colors"
                  >
                    Need Review
                  </button>
                  <button
                    onClick={() => handleRateCard('learning')}
                    className="rounded-lg border border-amber-200 bg-amber-50/70 px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-100 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300 transition-colors"
                  >
                    Good
                  </button>
                  <button
                    onClick={() => handleRateCard('mastered')}
                    className="rounded-lg border border-emerald-200 bg-emerald-50/70 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300 transition-colors"
                  >
                    Mastered
                  </button>
                </div>

                <button
                  onClick={handleNext}
                  className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* VIEW MODE 2: Card Grid */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeCards.map((card, idx) => (
            <div
              key={card.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                  <span className="font-mono">CARD {idx + 1}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                    {card.topic}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                  {card.front}
                </h4>
              </div>

              <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-700 dark:bg-slate-950/50 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                <span className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                  Answer
                </span>
                <p className="leading-relaxed whitespace-pre-line">{card.back}</p>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                <span>Difficulty: {card.difficulty}</span>
                <span className="capitalize font-medium">
                  {card.masteryStatus || 'Unlearned'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
