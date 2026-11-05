import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Square,
  Pause,
  Play,
  Upload,
  FileText,
  X,
  Sparkles,
  AlertCircle,
  Clock,
  BookOpen,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Video,
  Link,
  Youtube,
  ExternalLink
} from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';
import { LectureItem } from '../types/lecture';

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLectureCreated: (lecture: LectureItem) => void;
}

const SAMPLE_YOUTUBE_VIDEOS = [
  {
    title: 'MIT 6.006: Introduction to Algorithms & Computational Thinking',
    url: 'https://www.youtube.com/watch?v=ZA-tUyM_y7s',
    courseCode: 'MIT 6.006',
    subject: 'Computer Science',
    instructor: 'Prof. Erik Demaine',
  },
  {
    title: 'Stanford CS229: Machine Learning & Gradient Optimization',
    url: 'https://www.youtube.com/watch?v=jGwO_UgTS7I',
    courseCode: 'CS 229',
    subject: 'Artificial Intelligence',
    instructor: 'Prof. Andrew Ng',
  },
  {
    title: 'Harvard CS50: Computational Memory, Pointers & Dynamic Allocation',
    url: 'https://www.youtube.com/watch?v=FzpA_r4yD4w',
    courseCode: 'CS 50',
    subject: 'Systems Programming',
    instructor: 'Prof. David J. Malan',
  },
];

export const RecordModal: React.FC<RecordModalProps> = ({
  isOpen,
  onClose,
  onLectureCreated,
}) => {
  const [activeTab, setActiveTab] = useState<'record' | 'upload' | 'youtube' | 'text'>('record');

  // Metadata form
  const [title, setTitle] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [subject, setSubject] = useState('');
  const [instructor, setInstructor] = useState('');

  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);

  // Upload states
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState<string | null>(null);

  // YouTube states
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubePreview, setYoutubePreview] = useState<{
    title?: string;
    author?: string;
    thumbnail?: string;
    videoId?: string;
  } | null>(null);
  const [isLoadingYtPreview, setIsLoadingYtPreview] = useState(false);

  // Raw text state
  const [rawText, setRawText] = useState('');

  // Processing pipeline states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Web Audio & MediaRecorder refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
      if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
      if (uploadedAudioUrl) URL.revokeObjectURL(uploadedAudioUrl);
    };
  }, []);

  // When YouTube URL changes, optionally resolve video preview
  useEffect(() => {
    const trimmed = youtubeUrl.trim();
    if (!trimmed) {
      setYoutubePreview(null);
      return;
    }

    const match = trimmed.match(
      /(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    const videoId = match ? match[1] : null;

    if (!videoId) {
      setYoutubePreview(null);
      return;
    }

    let isMounted = true;
    setIsLoadingYtPreview(true);

    fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!isMounted) return;
        if (data) {
          setYoutubePreview({
            title: data.title,
            author: data.author_name,
            thumbnail: data.thumbnail_url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            videoId,
          });
          if (!title) setTitle(data.title || '');
          if (!instructor && data.author_name) setInstructor(data.author_name);
        } else {
          setYoutubePreview({
            videoId,
            thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          });
        }
      })
      .catch(() => {
        if (isMounted) {
          setYoutubePreview({
            videoId,
            thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          });
        }
      })
      .finally(() => {
        if (isMounted) setIsLoadingYtPreview(false);
      });

    return () => {
      isMounted = false;
    };
  }, [youtubeUrl]);

  if (!isOpen) return null;

  // Format seconds to MM:SS
  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start live microphone recording
  const startRecording = async () => {
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      source.connect(analyser);
      analyserRef.current = analyser;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : 'audio/webm';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        setRecordedAudioBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setIsPaused(false);
      setRecordSeconds(0);

      timerIntervalRef.current = window.setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone access failed:', err);
      setErrorMsg(
        'Unable to access your microphone. Please check browser microphone permissions or upload an audio file.'
      );
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerIntervalRef.current = window.setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setUploadedAudioUrl(url);
      if (!title) {
        const cleanName = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());
        setTitle(cleanName);
      }
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleSelectSampleYoutube = (sample: typeof SAMPLE_YOUTUBE_VIDEOS[0]) => {
    setYoutubeUrl(sample.url);
    setTitle(sample.title);
    setCourseCode(sample.courseCode);
    setSubject(sample.subject);
    setInstructor(sample.instructor);
  };

  // Run the full AI transcription and study generation pipeline
  const handleProcess = async () => {
    setErrorMsg(null);
    let finalTitle = title.trim() || 'Untitled Class Lecture';
    let finalCourse = courseCode.trim() || 'ACAD 101';
    let finalSubject = subject.trim() || 'General Studies';
    let finalInstructor = instructor.trim() || 'Professor';

    setIsProcessing(true);

    try {
      let transcriptText = '';
      let segments: any[] = [];
      let finalAudioUrl = '';
      let finalYoutubeUrl = '';
      let finalYoutubeId = '';
      let finalCoverImage = '';

      if (activeTab === 'record') {
        if (!recordedAudioBlob) {
          throw new Error('Please record lecture audio first or switch to another tab.');
        }
        setProcessingStage('Transcribing recorded audio with Gemini speech models...');
        finalAudioUrl = recordedAudioUrl || '';
        const base64Data = await blobToBase64(recordedAudioBlob);

        const transcribeRes = await fetch('/api/transcribe-audio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioBase64: base64Data,
            mimeType: recordedAudioBlob.type || 'audio/webm',
            lectureTitle: finalTitle,
          }),
        });

        if (!transcribeRes.ok) {
          const errData = await transcribeRes.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed during audio transcription.');
        }

        const transcribeData = await transcribeRes.json();
        transcriptText = transcribeData.fullText;
        segments = transcribeData.segments;
      } else if (activeTab === 'upload') {
        if (!uploadedFile) {
          throw new Error('Please select an audio file to upload.');
        }
        setProcessingStage('Analyzing audio file and generating transcript...');
        finalAudioUrl = uploadedAudioUrl || '';
        const base64Data = await blobToBase64(uploadedFile);

        const transcribeRes = await fetch('/api/transcribe-audio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioBase64: base64Data,
            mimeType: uploadedFile.type || 'audio/mp3',
            lectureTitle: finalTitle,
          }),
        });

        if (!transcribeRes.ok) {
          const errData = await transcribeRes.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed during audio transcription.');
        }

        const transcribeData = await transcribeRes.json();
        transcriptText = transcribeData.fullText;
        segments = transcribeData.segments;
      } else if (activeTab === 'youtube') {
        if (!youtubeUrl.trim()) {
          throw new Error('Please enter a valid YouTube video URL.');
        }
        setProcessingStage('Fetching YouTube video metadata and extracting transcript...');

        const ytRes = await fetch('/api/process-youtube', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: youtubeUrl.trim(),
            customTitle: title.trim(),
          }),
        });

        if (!ytRes.ok) {
          const errData = await ytRes.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to process YouTube lecture.');
        }

        const ytData = await ytRes.json();
        transcriptText = ytData.fullText;
        segments = ytData.segments;
        finalYoutubeUrl = youtubeUrl.trim();
        finalYoutubeId = ytData.videoId;
        finalCoverImage = ytData.thumbnailUrl;

        if (!title.trim() && ytData.videoTitle) {
          finalTitle = ytData.videoTitle;
        }
        if (!instructor.trim() && ytData.authorName) {
          finalInstructor = ytData.authorName;
        }
        if (finalCourse === 'ACAD 101') {
          finalCourse = 'YT 101';
        }
      } else {
        // Plain text import
        if (!rawText.trim()) {
          throw new Error('Please enter or paste your lecture transcript text.');
        }
        transcriptText = rawText.trim();
        const paragraphs = transcriptText.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
        segments = paragraphs.map((p, idx) => {
          const minutes = Math.floor(idx * 3);
          return {
            id: `seg-${idx}`,
            timestamp: `${minutes.toString().padStart(2, '0')}:00`,
            seconds: minutes * 60,
            speaker: idx % 2 === 0 ? finalInstructor : 'Student / Speaker',
            text: p.trim(),
            topicTag: 'Discussion Point',
          };
        });
      }

      setProcessingStage('Synthesizing Cornell notes, flashcards, quizzes & cheatsheet...');

      const studyRes = await fetch('/api/generate-study-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcriptText,
          title: finalTitle,
          subject: finalSubject,
        }),
      });

      if (!studyRes.ok) {
        const errData = await studyRes.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to synthesize study materials.');
      }

      const { data } = await studyRes.json();

      const newLecture: LectureItem = {
        id: `lecture-${Date.now()}`,
        title: finalTitle,
        subject: finalSubject,
        courseCode: finalCourse,
        instructor: finalInstructor,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        duration:
          activeTab === 'record'
            ? `${Math.max(1, Math.ceil(recordSeconds / 60))} min`
            : activeTab === 'youtube'
            ? 'Video Lecture'
            : '45 min',
        audioUrl: finalAudioUrl || undefined,
        youtubeUrl: finalYoutubeUrl || undefined,
        youtubeId: finalYoutubeId || undefined,
        coverImage: finalCoverImage || undefined,
        status: 'ready',
        overview: {
          summary: data.overview?.summary || 'Comprehensive lecture breakdown.',
          keyTakeaways: Array.isArray(data.overview?.keyTakeaways) ? data.overview.keyTakeaways : [],
          estimatedStudyTime: data.overview?.estimatedStudyTime || '35 mins',
          difficulty: data.overview?.difficulty || 'Intermediate',
          topics: Array.isArray(data.overview?.topics) ? data.overview.topics : [],
        },
        transcript:
          segments.length > 0
            ? segments
            : [
                {
                  id: 't-1',
                  timestamp: '00:00',
                  seconds: 0,
                  speaker: finalInstructor,
                  text: transcriptText,
                  topicTag: 'Overview',
                },
              ],
        rawTranscriptText: transcriptText,
        cornellNotes: Array.isArray(data.cornellNotes)
          ? data.cornellNotes.map((cn: any, i: number) => ({
              id: `cn-${Date.now()}-${i}`,
              topic: cn.topic || `Topic ${i + 1}`,
              cue: cn.cue || 'Key concept question?',
              notes: Array.isArray(cn.notes) ? cn.notes : [cn.notes || ''],
              formulasOrRules: Array.isArray(cn.formulasOrRules) ? cn.formulasOrRules : [],
              timestampRef: cn.timestampRef || '00:00',
            }))
          : [],
        lectureSummary: data.lectureSummary || 'Summary of core principles.',
        flashcards: Array.isArray(data.flashcards)
          ? data.flashcards.map((fc: any, i: number) => ({
              id: `fc-${Date.now()}-${i}`,
              front: fc.front || 'Concept Prompt',
              back: fc.back || 'Concept Explanation',
              topic: fc.topic || 'General',
              difficulty: fc.difficulty || 'Medium',
              masteryStatus: 'unlearned',
            }))
          : [],
        quiz: Array.isArray(data.quiz)
          ? data.quiz.map((q: any, i: number) => ({
              id: `q-${Date.now()}-${i}`,
              question: q.question || 'Quiz question',
              options: Array.isArray(q.options) ? q.options : ['A', 'B', 'C', 'D'],
              answerIndex: typeof q.answerIndex === 'number' ? q.answerIndex : 0,
              explanation: q.explanation || 'Detailed rationale.',
              topic: q.topic || 'Review',
            }))
          : [],
        glossary: Array.isArray(data.glossary)
          ? data.glossary.map((g: any, i: number) => ({
              id: `g-${Date.now()}-${i}`,
              term: g.term || 'Term',
              definition: g.definition || 'Definition',
              context: g.context || 'Context',
            }))
          : [],
        cheatSheet: {
          highYieldPoints: Array.isArray(data.cheatSheet?.highYieldPoints) ? data.cheatSheet.highYieldPoints : [],
          commonPitfalls: Array.isArray(data.cheatSheet?.commonPitfalls) ? data.cheatSheet.commonPitfalls : [],
          examTips: Array.isArray(data.cheatSheet?.examTips) ? data.cheatSheet.examTips : [],
          coreFormulas: Array.isArray(data.cheatSheet?.coreFormulas) ? data.cheatSheet.coreFormulas : [],
        },
      };

      onLectureCreated(newLecture);
      onClose();
    } catch (err: any) {
      console.error('Pipeline error:', err);
      setErrorMsg(err.message || 'An unexpected error occurred during processing.');
    } finally {
      setIsProcessing(false);
      setProcessingStage('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Ingest Lecture Material
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transform live audio, files, YouTube links or transcripts into Cornell notes & flashcards
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 4 Ingest Tab Controls (Functional buttons with active states) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-slate-200 bg-slate-50/50 p-1 dark:border-slate-800 dark:bg-slate-950/50">
          <button
            onClick={() => setActiveTab('record')}
            disabled={isProcessing || isRecording}
            className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'record'
                ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Mic className="h-3.5 w-3.5" />
            <span>Record Mic</span>
          </button>
          <button
            onClick={() => setActiveTab('youtube')}
            disabled={isProcessing || isRecording}
            className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'youtube'
                ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Youtube className="h-3.5 w-3.5 text-red-500" />
            <span>YouTube Link</span>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            disabled={isProcessing || isRecording}
            className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'upload'
                ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload Audio</span>
          </button>
          <button
            onClick={() => setActiveTab('text')}
            disabled={isProcessing || isRecording}
            className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'text'
                ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Transcript</span>
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {errorMsg && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/80 p-3.5 text-xs text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
              <div className="flex-1">{errorMsg}</div>
            </div>
          )}

          {/* Lecture Metadata Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Lecture Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  activeTab === 'youtube'
                    ? 'Auto-filled from YouTube or enter custom'
                    : 'e.g. Molecular Mechanisms of Synapses'
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Course Code
              </label>
              <input
                type="text"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                placeholder="e.g. CS 106B or BIO 101"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Subject Area
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Computer Science, Law, Biology"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Instructor / Channel
              </label>
              <input
                type="text"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                placeholder="e.g. Prof. Demaine, 3Blue1Brown"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* TAB: YouTube Video Link */}
          {activeTab === 'youtube' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  YouTube Lecture URL
                </label>
                <div className="relative">
                  <Youtube className="absolute left-3 top-2.5 h-4 w-4 text-red-500" />
                  <input
                    type="url"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                    className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Synapse fetches the video transcript, synchronizes timestamps, and builds Cornell notes and flashcards.
                </p>
              </div>

              {/* YouTube Video Preview Card */}
              {youtubePreview && (
                <div className="flex items-center gap-3 rounded-xl border border-indigo-200 bg-indigo-50/50 p-3 dark:border-indigo-900/50 dark:bg-indigo-950/30">
                  {youtubePreview.thumbnail && (
                    <img
                      src={youtubePreview.thumbnail}
                      alt="YouTube video thumbnail"
                      referrerPolicy="no-referrer"
                      className="h-16 w-28 rounded-lg object-cover shrink-0 shadow-sm"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="flex items-center gap-1 text-[10px] font-mono font-semibold uppercase text-indigo-600 dark:text-indigo-400">
                      <CheckCircle2 className="h-3 w-3" /> Valid YouTube Link Detected
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {youtubePreview.title || 'YouTube Lecture'}
                    </h4>
                    {youtubePreview.author && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {youtubePreview.author}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Sample Academic YouTube Videos */}
              <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Or Test with Sample University Lecture:
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  {SAMPLE_YOUTUBE_VIDEOS.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSampleYoutube(sample)}
                      className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs hover:border-indigo-400 hover:bg-indigo-50/40 dark:border-slate-800 dark:bg-slate-800/60 dark:hover:border-indigo-500 transition-colors"
                    >
                      <div className="truncate">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {sample.courseCode}:
                        </span>{' '}
                        <span className="text-slate-600 dark:text-slate-300">
                          {sample.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 shrink-0">
                        Select
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: Live Recording */}
          {activeTab === 'record' && (
            <div className="space-y-4">
              <AudioVisualizer
                analyser={analyserRef.current}
                isRecording={isRecording}
                isPaused={isPaused}
              />

              <div className="flex flex-col items-center justify-center gap-3 py-2">
                <div className="flex items-center gap-2 font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
                  <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <span>{formatTimer(recordSeconds)}</span>
                </div>

                <div className="flex items-center gap-3">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      disabled={isProcessing}
                      className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-red-500 active:scale-95 transition-all"
                    >
                      <Mic className="h-4 w-4" />
                      <span>Start Class Recording</span>
                    </button>
                  ) : (
                    <>
                      {isPaused ? (
                        <button
                          onClick={resumeRecording}
                          className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors"
                        >
                          <Play className="h-3.5 w-3.5" />
                          <span>Resume</span>
                        </button>
                      ) : (
                        <button
                          onClick={pauseRecording}
                          className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors"
                        >
                          <Pause className="h-3.5 w-3.5" />
                          <span>Pause</span>
                        </button>
                      )}

                      <button
                        onClick={stopRecording}
                        className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white transition-colors"
                      >
                        <Square className="h-3.5 w-3.5 fill-current" />
                        <span>Finish Recording</span>
                      </button>
                    </>
                  )}
                </div>

                {recordedAudioUrl && !isRecording && (
                  <div className="w-full mt-2 p-3 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-xl border border-indigo-200 dark:border-indigo-900/50">
                    <div className="flex items-center justify-between text-xs font-medium text-indigo-900 dark:text-indigo-200 mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        Audio Capture Ready ({formatTimer(recordSeconds)})
                      </span>
                    </div>
                    <audio src={recordedAudioUrl} controls className="w-full h-8" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: Upload Audio File */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-8 hover:border-indigo-500 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-950/50 cursor-pointer transition-colors group">
                <Upload className="h-8 w-8 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {uploadedFile ? uploadedFile.name : 'Click to select or drag lecture audio'}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Supports MP3, WAV, M4A, WebM, OGG (up to 50MB)
                </span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {uploadedAudioUrl && (
                <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-xl border border-indigo-200 dark:border-indigo-900/50">
                  <div className="text-xs font-medium text-indigo-900 dark:text-indigo-200 mb-1.5">
                    Audio Preview
                  </div>
                  <audio src={uploadedAudioUrl} controls className="w-full h-8" />
                </div>
              )}
            </div>
          )}

          {/* TAB: Paste Transcript Text */}
          {activeTab === 'text' && (
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Paste Raw Transcript or Lecture Notes
              </label>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste speech transcript, professor slides outline, or lecture notes here..."
                rows={7}
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <div className="text-right text-[11px] text-slate-400 font-mono">
                {rawText.trim().split(/\s+/).filter(Boolean).length} words
              </div>
            </div>
          )}

          {/* Processing Status Indicator */}
          {isProcessing && (
            <div className="rounded-xl border border-indigo-200 bg-indigo-50/90 p-4 dark:border-indigo-900/60 dark:bg-indigo-950/60">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-indigo-600 dark:text-indigo-400 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-indigo-950 dark:text-indigo-100">
                    Transforming Lecture with Gemini AI
                  </div>
                  <div className="text-[11px] text-indigo-700 dark:text-indigo-300">
                    {processingStage}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-950">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="rounded-lg px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleProcess}
            disabled={
              isProcessing ||
              isRecording ||
              (activeTab === 'record' && !recordedAudioBlob) ||
              (activeTab === 'upload' && !uploadedFile) ||
              (activeTab === 'youtube' && !youtubeUrl.trim()) ||
              (activeTab === 'text' && !rawText.trim())
            }
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-indigo-400 transition-all"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing Lecture...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate Study Suite</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
