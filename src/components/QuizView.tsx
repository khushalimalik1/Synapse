import React, { useState } from 'react';
import { QuizQuestion } from '../types/lecture';
import { CheckCircle2, XCircle, RotateCcw, Award, ChevronRight, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizViewProps {
  questions: QuizQuestion[];
  lectureTitle: string;
}

export const QuizView: React.FC<QuizViewProps> = ({ questions, lectureTitle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const [isFinished, setIsFinished] = useState(false);

  if (!questions || questions.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs text-slate-500">No practice quiz questions generated for this lecture yet.</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const selectedOption = selectedAnswers[currentIndex];
  const hasAnswered = selectedOption !== undefined;
  const isCorrect = hasAnswered && selectedOption === currentQ.answerIndex;

  const handleSelectOption = (index: number) => {
    if (hasAnswered) return; // Prevent changing after submission
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: index }));
    setShowExplanation((prev) => ({ ...prev, [currentIndex]: true }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
      // Calculate score and fire confetti if good!
      const correctCount = questions.filter(
        (q, idx) => selectedAnswers[idx] === q.answerIndex
      ).length;
      if (correctCount / questions.length >= 0.7) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setShowExplanation({});
    setCurrentIndex(0);
    setIsFinished(false);
  };

  // Calculate score
  const correctTotal = questions.filter(
    (q, idx) => selectedAnswers[idx] === q.answerIndex
  ).length;
  const scorePercentage = Math.round((correctTotal / questions.length) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            Practice Knowledge Check
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Exam-style multiple-choice questions with comprehensive concept rationales
          </p>
        </div>

        {!isFinished && (
          <div className="text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400 tabular-nums">
            Question {currentIndex + 1} of {questions.length}
          </div>
        )}
      </div>

      {!isFinished ? (
        <div className="space-y-6">
          {/* Question Box */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-5">
            <div>
              <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider block mb-1">
                Topic: {currentQ.topic || 'General Lecture'}
              </span>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                {currentQ.question}
              </h4>
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = selectedOption === optIdx;
                const isTheCorrectAnswer = currentQ.answerIndex === optIdx;

                let btnStyles =
                  'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 dark:border-slate-800 dark:hover:border-indigo-600 dark:hover:bg-slate-800/50';

                if (hasAnswered) {
                  if (isTheCorrectAnswer) {
                    btnStyles =
                      'border-emerald-500 bg-emerald-50 text-emerald-950 dark:border-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-100 font-medium';
                  } else if (isSelected && !isTheCorrectAnswer) {
                    btnStyles =
                      'border-red-400 bg-red-50 text-red-950 dark:border-red-600 dark:bg-red-950/40 dark:text-red-100';
                  } else {
                    btnStyles = 'border-slate-200 opacity-50 dark:border-slate-800';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    disabled={hasAnswered}
                    className={`w-full text-left rounded-xl border p-3.5 text-xs transition-all flex items-start gap-3 ${btnStyles}`}
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-300 font-mono text-[11px] font-semibold dark:border-slate-700">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="flex-1 leading-relaxed">{option}</span>
                    {hasAnswered && isTheCorrectAnswer && (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    )}
                    {hasAnswered && isSelected && !isTheCorrectAnswer && (
                      <XCircle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation rationale when answered */}
            {hasAnswered && (
              <div
                className={`rounded-xl border p-4 text-xs leading-relaxed space-y-1 ${
                  isCorrect
                    ? 'border-emerald-200 bg-emerald-50/70 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200'
                    : 'border-amber-200 bg-amber-50/70 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200'
                }`}
              >
                <div className="font-semibold flex items-center gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>{isCorrect ? 'Correct!' : 'Incorrect — Concept Review:'}</span>
                </div>
                <p className="pt-0.5">{currentQ.explanation}</p>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {hasAnswered ? 'Select Next to continue' : 'Choose an option to reveal explanation'}
            </span>

            <button
              onClick={handleNext}
              disabled={!hasAnswered}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-indigo-400 transition-colors"
            >
              <span>{currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Quiz Finished Summary */
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Award className="h-7 w-7" />
            </div>

            <div>
              <h4 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                {scorePercentage}% Mastery Score
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono tabular-nums">
                You correctly answered {correctTotal} out of {questions.length} questions.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={handleRetake}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 dark:bg-indigo-500 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Retake Quiz</span>
              </button>
            </div>
          </div>

          {/* Question Review Breakdown */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Question by Question Breakdown
            </h5>
            <div className="space-y-3">
              {questions.map((q, idx) => {
                const userChoice = selectedAnswers[idx];
                const wasCorrect = userChoice === q.answerIndex;
                return (
                  <div
                    key={q.id || idx}
                    className="rounded-xl border border-slate-200 bg-white p-4 text-xs dark:border-slate-800 dark:bg-slate-900 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-medium text-slate-900 dark:text-white">
                        {idx + 1}. {q.question}
                      </span>
                      {wasCorrect ? (
                        <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Correct
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 font-semibold text-red-600 dark:text-red-400 shrink-0">
                          <XCircle className="h-3.5 w-3.5" /> Missed
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                      <strong>Correct Answer:</strong> {q.options[q.answerIndex]}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed italic">
                      {q.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
