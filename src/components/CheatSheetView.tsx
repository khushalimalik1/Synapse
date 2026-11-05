import React, { useState } from 'react';
import { CheatSheet, GlossaryTerm } from '../types/lecture';
import { Sparkles, AlertTriangle, Lightbulb, Calculator, BookOpen, Search, Printer } from 'lucide-react';

interface CheatSheetViewProps {
  cheatSheet: CheatSheet;
  glossary: GlossaryTerm[];
  lectureTitle: string;
  courseCode: string;
}

export const CheatSheetView: React.FC<CheatSheetViewProps> = ({
  cheatSheet,
  glossary,
  lectureTitle,
  courseCode,
}) => {
  const [glossarySearch, setGlossarySearch] = useState('');

  const filteredGlossary = glossary.filter((g) => {
    if (!glossarySearch) return true;
    const q = glossarySearch.toLowerCase();
    return g.term.toLowerCase().includes(q) || g.definition.toLowerCase().includes(q) || g.context.toLowerCase().includes(q);
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            Exam Cheatsheet & Technical Glossary
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            One-page high-density exam revision guide and searchable terminology database
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
        >
          <Printer className="h-3.5 w-3.5" />
          <span>Print Cheatsheet</span>
        </button>
      </div>

      {/* Grid of Cheatsheet Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* High-Yield Points */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>High-Yield Core Principles</span>
          </div>
          <ul className="space-y-2">
            {cheatSheet.highYieldPoints.map((point, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed"
              >
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
                  {idx + 1}.
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Common Pitfalls & Traps */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-5 shadow-sm dark:border-amber-900/40 dark:bg-amber-950/20 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-950 dark:text-amber-200 uppercase tracking-wider">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span>Exam Traps & Student Misconceptions</span>
          </div>
          <ul className="space-y-2">
            {cheatSheet.commonPitfalls.map((pitfall, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200 leading-relaxed"
              >
                <span className="text-amber-600 dark:text-amber-400 shrink-0 font-bold">⚠️</span>
                <span>{pitfall}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Exam Tips & Heuristics */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            <Lightbulb className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>Testing Strategies & Mnemonics</span>
          </div>
          <ul className="space-y-2">
            {cheatSheet.examTips.map((tip, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed"
              >
                <span className="text-indigo-500 shrink-0">💡</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Core Formulas & Legal Rules */}
        {cheatSheet.coreFormulas && cheatSheet.coreFormulas.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              <Calculator className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>Core Equations & Standard Tests</span>
            </div>
            <div className="space-y-2">
              {cheatSheet.coreFormulas.map((formula, idx) => (
                <div
                  key={idx}
                  className="rounded-lg bg-slate-100 p-2.5 font-mono text-xs text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                >
                  {formula}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Technical Glossary Section */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h4 className="font-display text-base font-bold text-slate-900 dark:text-white">
              Course Terminology Glossary ({glossary.length} terms)
            </h4>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={glossarySearch}
              onChange={(e) => setGlossarySearch(e.target.value)}
              placeholder="Search terms or definitions..."
              className="w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredGlossary.map((g) => (
            <div
              key={g.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-1.5"
            >
              <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {g.term}
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {g.definition}
              </p>
              {g.context && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span className="not-italic font-semibold text-slate-600 dark:text-slate-300">
                    Lecture Application:
                  </span>{' '}
                  {g.context}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
