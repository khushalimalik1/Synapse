export interface TranscriptSegment {
  id: string;
  timestamp: string; // e.g., "02:15"
  seconds: number;
  speaker: string;
  text: string;
  topicTag?: string;
}

export interface CornellSection {
  id: string;
  topic: string;
  cue: string; // Cornell Left Column: Question / Trigger / Cue
  notes: string[]; // Cornell Right Column: Explanations & key bullets
  formulasOrRules?: string[];
  timestampRef?: string;
}

export interface FlashcardItem {
  id: string;
  front: string;
  back: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  masteryStatus?: 'unlearned' | 'learning' | 'mastered';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  topic: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  context: string;
}

export interface CheatSheet {
  highYieldPoints: string[];
  commonPitfalls: string[];
  examTips: string[];
  coreFormulas?: string[];
}

export interface LectureItem {
  id: string;
  title: string;
  subject: string;
  courseCode: string;
  instructor?: string;
  date: string;
  duration: string;
  audioUrl?: string;
  youtubeUrl?: string;
  youtubeId?: string;
  coverImage?: string;
  status: 'ready' | 'transcribing' | 'generating' | 'error';
  errorMessage?: string;
  overview: {
    summary: string;
    keyTakeaways: string[];
    estimatedStudyTime: string;
    difficulty: 'Introductory' | 'Intermediate' | 'Advanced';
    topics: string[];
  };
  transcript: TranscriptSegment[];
  rawTranscriptText: string;
  cornellNotes: CornellSection[];
  lectureSummary: string;
  flashcards: FlashcardItem[];
  quiz: QuizQuestion[];
  glossary: GlossaryTerm[];
  cheatSheet: CheatSheet;
}
