import React, { useState } from 'react';
import { CornellSection } from '../types/lecture';
import { HelpCircle, Clock, BookOpen, Search, Copy, Check, Sparkles } from 'lucide-react';

interface CornellNotesViewProps {
  notes: CornellSection[];
  summary: string;
  onJumpToTimestamp?: (timestamp: string) => void;
}

export const CornellNotesView: React.FC<CornellNotesViewProps> = ({
  notes,
  summary,
  onJumpToTimestamp,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredNotes = notes.filter((n) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      n.topic.toLowerCase().includes(q) ||
      n.cue.toLowerCase().includes(q) ||
      n.notes.some((bullet) => bullet.toLowerCase().includes(q))
    );
  });

  const handleCopySection = (section: CornellSection) => {
    const text = `Topic: ${section.topic}\nCue: ${section.cue}\n\nNotes:\n${section.notes.map((b) => `- ${b}`).join('\n')}\n${
      section.formulasOrRules?.length ? `Formulas/Rules:\n${section.formulasOrRules.join('\n')}` : ''
    }`;
    navigator.clipboard.writeText(text);
    setCopiedId(section.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            Cornell Note-Taking System
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Structured cue questions on the left for active recall, comprehensive synthesis on the right
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes or cues..."
            className="w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Main Cornell Table / Layout */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {/* Table Header Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/80 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <div className="md:col-span-4 p-3.5 border-r border-slate-200 dark:border-slate-800 flex items-center gap-1.5">
            <HelpCircle className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>RECALL CUES & PROMPTS (Left Column)</span>
          </div>
          <div className="md:col-span-8 p-3.5 flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>LECTURE NOTES & MECHANISMS (Right Column)</span>
          </div>
        </div>

        {/* Section Rows */}
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {filteredNotes.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              No notes match your search query "{searchQuery}".
            </div>
          ) : (
            filteredNotes.map((section, idx) => (
              <div
                key={section.id}
                className="grid grid-cols-1 md:grid-cols-12 group hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
              >
                {/* Left Column: Cue / Question (30%) */}
                <div className="md:col-span-4 p-4 md:p-5 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/20 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-mono font-medium text-indigo-600 dark:text-indigo-400">
                        {String(idx + 1).padStart(2, '0')}. {section.topic}
                      </span>
                      {section.timestampRef && onJumpToTimestamp && (
                        <button
                          onClick={() => onJumpToTimestamp(section.timestampRef!)}
                          title="Jump to audio timestamp"
                          className="flex items-center gap-1 text-[11px] font-mono text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                          <Clock className="h-3 w-3" />
                          <span>{section.timestampRef}</span>
                        </button>
                      )}
                    </div>

                    <div className="rounded-lg bg-indigo-50/60 p-3 border border-indigo-100 dark:bg-indigo-950/40 dark:border-indigo-900/40">
                      <p className="text-xs font-semibold leading-relaxed text-indigo-950 dark:text-indigo-200">
                        {section.cue}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Self-Test Recall Prompt</span>
                    <button
                      onClick={() => handleCopySection(section)}
                      className="opacity-0 group-hover:opacity-100 flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200 transition-all"
                    >
                      {copiedId === section.id ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-500" />
                          <span className="text-emerald-500">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Right Column: Detailed Notes & Rules (70%) */}
                <div className="md:col-span-8 p-4 md:p-5 space-y-3">
                  <ul className="space-y-2">
                    {section.notes.map((bullet, bIdx) => (
                      <li
                        key={bIdx}
                        className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {section.formulasOrRules && section.formulasOrRules.length > 0 && (
                    <div className="mt-3.5 space-y-1.5">
                      <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                        Key Formulas / Principles:
                      </div>
                      <div className="space-y-1">
                        {section.formulasOrRules.map((rule, rIdx) => (
                          <div
                            key={rIdx}
                            className="rounded-lg bg-slate-100 px-3 py-1.5 font-mono text-xs text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                          >
                            {rule}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Cornell Summary Box */}
        <div className="border-t-2 border-slate-200 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-950/70">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>Cornell Executive Summary (Bottom Block)</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
            {summary}
          </p>
        </div>
      </div>
    </div>
  );
};
