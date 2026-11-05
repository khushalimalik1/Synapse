import React from 'react';
import { LectureItem } from '../types/lecture';
import { IMAGES } from '../assets/images';
import { Clock, BookOpen, Layers, CheckSquare, Sparkles, ArrowRight, Youtube } from 'lucide-react';

interface LectureCardProps {
  lecture: LectureItem;
  onSelect: (lecture: LectureItem, defaultTab?: 'notes' | 'flashcards' | 'quiz' | 'transcript') => void;
}

export const LectureCard: React.FC<LectureCardProps> = ({ lecture, onSelect }) => {
  const [imgError, setImgError] = React.useState(false);

  const resolvedCover = React.useMemo(() => {
    // Guarantee fresh, high-res Unsplash CDN photos for the sample decks
    if (lecture.id === 'lecture-neuro-101' || lecture.courseCode === 'NEURO 101') {
      return IMAGES.neuroscience;
    }
    if (lecture.id === 'lecture-cs-229' || lecture.courseCode === 'CS 229') {
      return IMAGES.machineLearning;
    }
    if (lecture.id === 'lecture-law-204' || lecture.courseCode === 'LAW 204') {
      return IMAGES.constitutionalLaw;
    }
    if (lecture.youtubeId) {
      return `https://img.youtube.com/vi/${lecture.youtubeId}/hqdefault.jpg`;
    }
    if (!lecture.coverImage) return undefined;
    if (lecture.coverImage.startsWith('http')) {
      return lecture.coverImage;
    }
    if (lecture.coverImage.includes('neuroscience')) return IMAGES.neuroscience;
    if (lecture.coverImage.includes('machine_learning') || lecture.coverImage.includes('machineLearning')) return IMAGES.machineLearning;
    if (lecture.coverImage.includes('constitutional_law') || lecture.coverImage.includes('constitutionalLaw')) return IMAGES.constitutionalLaw;
    if (lecture.coverImage.includes('hero')) return IMAGES.hero;
    return undefined;
  }, [lecture.id, lecture.courseCode, lecture.coverImage, lecture.youtubeId]);

  React.useEffect(() => {
    setImgError(false);
  }, [resolvedCover]);

  return (
    <div
      onClick={() => onSelect(lecture, 'notes')}
      className="group cursor-pointer rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-indigo-400 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-600 transition-all flex flex-col justify-between"
    >
      <div>
        {/* Cover Image or Fallback container */}
        <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          {resolvedCover && !imgError ? (
            <img
              src={resolvedCover}
              alt={lecture.title}
              loading="eager"
              onError={() => setImgError(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-slate-800/10 p-4 text-center">
              <BookOpen className="h-8 w-8 text-indigo-500 mb-2" />
              <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-200">
                {lecture.courseCode}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                {lecture.subject}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

          {/* Overlay Course Info */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
            <span className="font-mono text-xs font-bold tracking-wide flex items-center gap-1.5">
              {lecture.youtubeId && <Youtube className="h-3.5 w-3.5 text-red-500" />}
              <span>{lecture.courseCode}</span>
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-200 font-mono">
              <Clock className="h-3 w-3" />
              <span>{lecture.duration}</span>
            </div>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-5 space-y-3">
          {/* Metadata: Clean unboxed text with typographic separators (anti-slop rule §1.A) */}
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>{lecture.subject}</span>
            <span aria-hidden="true">·</span>
            <span>{lecture.date}</span>
            <span aria-hidden="true">·</span>
            <span className="font-medium text-indigo-600 dark:text-indigo-400">
              {lecture.overview.difficulty}
            </span>
          </div>

          <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
            {lecture.title}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {lecture.overview.summary}
          </p>

          {/* Quick topic items */}
          <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-slate-400 dark:text-slate-500">
            {lecture.overview.topics.slice(0, 3).map((topic, idx) => (
              <span key={idx}>#{topic.replace(/\s+/g, '')}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer Strips */}
      <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-3 dark:border-slate-800/80 dark:bg-slate-950/40 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Layers className="h-3.5 w-3.5 text-indigo-500" />
            <strong className="font-mono tabular-nums text-slate-700 dark:text-slate-200">
              {lecture.flashcards.length}
            </strong>{' '}
            cards
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <CheckSquare className="h-3.5 w-3.5 text-emerald-500" />
            <strong className="font-mono tabular-nums text-slate-700 dark:text-slate-200">
              {lecture.quiz.length}
            </strong>{' '}
            quiz
          </span>
        </div>

        <div className="flex items-center gap-1 font-semibold text-indigo-600 group-hover:translate-x-0.5 dark:text-indigo-400 transition-transform">
          <span>Study</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
};
