import React, { useState } from 'react';
import { TranscriptSegment } from '../types/lecture';
import { Search, Clock, Copy, Check, Download, User } from 'lucide-react';

interface TranscriptViewProps {
  segments: TranscriptSegment[];
  rawText: string;
  onJumpToTimestamp?: (timestamp: string, seconds?: number) => void;
  currentPlaybackSeconds?: number;
}

export const TranscriptView: React.FC<TranscriptViewProps> = ({
  segments,
  rawText,
  onJumpToTimestamp,
  currentPlaybackSeconds,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const filteredSegments = segments.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.text.toLowerCase().includes(q) ||
      s.speaker.toLowerCase().includes(q) ||
      (s.topicTag && s.topicTag.toLowerCase().includes(q))
    );
  });

  const handleCopyTranscript = () => {
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTranscript = () => {
    const textContent = segments
      .map((s) => `[${s.timestamp}] ${s.speaker}: ${s.text}`)
      .join('\n\n');
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Lecture_Transcript_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            Timestamped Lecture Transcript
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click any timestamp to navigate the recording; search for specific spoken keywords
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search spoken transcript..."
              className="w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <button
            onClick={handleCopyTranscript}
            className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-emerald-500">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadTranscript}
            className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>

      {/* Segments List */}
      <div className="space-y-3.5">
        {filteredSegments.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900">
            No spoken segments match "{searchQuery}".
          </div>
        ) : (
          filteredSegments.map((segment) => {
            const isHighlighted =
              currentPlaybackSeconds !== undefined &&
              Math.abs(currentPlaybackSeconds - segment.seconds) < 15;

            return (
              <div
                key={segment.id}
                className={`rounded-xl border p-4 transition-all ${
                  isHighlighted
                    ? 'border-indigo-500 bg-indigo-50/40 dark:border-indigo-500 dark:bg-indigo-950/30 ring-1 ring-indigo-500'
                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-3 text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        onJumpToTimestamp && onJumpToTimestamp(segment.timestamp, segment.seconds)
                      }
                      className="flex items-center gap-1 rounded font-mono font-bold text-indigo-600 hover:bg-indigo-50 px-1.5 py-0.5 dark:text-indigo-400 dark:hover:bg-indigo-950/60 transition-colors"
                      title="Seek audio to this timestamp"
                    >
                      <Clock className="h-3 w-3" />
                      <span>{segment.timestamp}</span>
                    </button>
                    <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                      <User className="h-3 w-3 text-slate-400" />
                      {segment.speaker}
                    </span>
                  </div>

                  {segment.topicTag && (
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      {segment.topicTag}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {segment.text}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
