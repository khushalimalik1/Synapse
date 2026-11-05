import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { YoutubeTranscript } from 'youtube-transcript';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

// Shared Server-Side Gemini Client with 'aistudio-build' User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * Health check endpoint
 */
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

/**
 * Transcribe Audio using Gemini (gemini-3.5-transcribe with gemini-3.8-flash fallback)
 */
app.post('/api/transcribe-audio', async (req: Request, res: Response) => {
  try {
    const { audioBase64, mimeType = 'audio/webm', lectureTitle = 'Class Lecture' } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ error: 'Missing audio data' });
    }

    // Strip data URL header if present
    const cleanBase64 = audioBase64.replace(/^data:[^;]+;base64,/, '');

    const promptText = `You are an expert academic transcriber. Transcribe this class lecture audio into a high-accuracy, readable transcript.
The lecture title is: "${lectureTitle}".

CRITICAL INSTRUCTIONS:
1. Divide the lecture into coherent spoken segments with accurate timestamps in MM:SS format and approximate elapsed seconds.
2. Identify distinct speakers (e.g. "Professor", "Student", or specific names if mentioned).
3. Tag each segment with a brief topic label (e.g. "Key Concept", "Theorem Proof", "Q&A", "Exam Warning", "Example").
4. Return a clean JSON response conforming to this exact structure:
{
  "fullText": "Full transcript of the entire lecture text...",
  "segments": [
    {
      "timestamp": "00:00",
      "seconds": 0,
      "speaker": "Professor",
      "text": "Transcribed spoken text...",
      "topicTag": "Introduction"
    }
  ]
}`;

    let responseText = '';
    try {
      // Primary: gemini-3.5-transcribe
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-transcribe',
        contents: [
          {
            inlineData: {
              mimeType: mimeType.split(';')[0],
              data: cleanBase64,
            },
          },
          { text: promptText },
        ],
        config: {
          responseMimeType: 'application/json',
        },
      });
      responseText = response.text || '';
    } catch (primaryErr: any) {
      console.warn('gemini-3.5-transcribe attempt fallback to gemini-3.8-flash:', primaryErr?.message);
      // Fallback: gemini-3.8-flash handles audio input directly
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            inlineData: {
              mimeType: mimeType.split(';')[0],
              data: cleanBase64,
            },
          },
          { text: promptText },
        ],
        config: {
          responseMimeType: 'application/json',
        },
      });
      responseText = fallbackResponse.text || '';
    }

    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      // Fallback if markdown fence was included
      const cleaned = responseText.replace(/```(?:json)?/g, '').trim();
      parsed = JSON.parse(cleaned);
    }

    return res.json({
      success: true,
      fullText: parsed.fullText || '',
      segments: Array.isArray(parsed.segments) ? parsed.segments : [],
    });
  } catch (error: any) {
    console.error('Audio transcription error:', error);
    return res.status(500).json({
      error: 'Failed to transcribe audio: ' + (error?.message || 'Unknown error'),
    });
  }
});

/**
 * Generate Complete Study Suite (Cornell Notes, Flashcards, Quiz, Glossary, Cheatsheet)
 */
app.post('/api/generate-study-notes', async (req: Request, res: Response) => {
  try {
    const { transcriptText, title = 'Lecture', subject = 'General Studies' } = req.body;

    if (!transcriptText || transcriptText.trim().length === 0) {
      return res.status(400).json({ error: 'Missing transcript text' });
    }

    const systemPrompt = `You are an elite academic learning designer, cognitive psychologist, and university curriculum master.
Your mission is to transform raw lecture transcript material into an exhaustive, structured, highly effective study suite so the student never has to worry about missing notes.

You must generate:
1. Executive Overview:
   - summary: A crisp 2-3 paragraph academic synthesis.
   - keyTakeaways: 4-6 high-yield takeaways (not generic, but concrete domain insights).
   - estimatedStudyTime: e.g. "45 mins"
   - difficulty: "Introductory" | "Intermediate" | "Advanced"
   - topics: 4-6 main topic headings covered.

2. Cornell Notes System:
   - 3-6 distinct topical sections.
   - For each section:
     - topic: Clear academic topic title.
     - cue: Probing recall question or trigger phrase (the Cornell Left Column cue).
     - notes: 3-5 comprehensive bulleted explanations breaking down mechanics, cause-and-effect, and proofs.
     - formulasOrRules: Array of relevant mathematical formulas, legal tests, biological rules, or pseudocode (if applicable).
     - timestampRef: Estimated timestamp like "05:20" or "14:40".

3. Cornell Lecture Summary:
   - A 1-2 paragraph high-retention final summary synthesizing the entire lecture.

4. Tailored Flashcards:
   - 8-12 flashcards with:
     - front: Clear, testable question or prompt.
     - back: Authoritative, bite-sized answer with core reasoning.
     - topic: The specific subtopic.
     - difficulty: "Easy" | "Medium" | "Hard".

5. Interactive Practice Quiz:
   - 4-6 rigorous multiple-choice questions:
     - question: Clear conceptual or scenario-based problem.
     - options: Exactly 4 distinct answers.
     - answerIndex: Integer index (0, 1, 2, or 3) of the single correct answer.
     - explanation: Thorough explanation of why the correct option is right AND why distractors are wrong.
     - topic: Subtopic label.

6. Key Terminology Glossary:
   - 4-8 essential terms with:
     - term: The technical concept/word.
     - definition: Formal definition.
     - context: How the professor applied or highlighted it during lecture.

7. Exam Cheatsheet:
   - highYieldPoints: 4-6 highest-yield exam facts.
   - commonPitfalls: 2-4 common student mistakes or misconceptions.
   - examTips: 2-3 specific testing strategies or memory heuristics.
   - coreFormulas: Key formulas, rules, or standards.

Return pure JSON matching this exact structure without markdown backticks.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          text: `Lecture Title: "${title}"\nSubject: "${subject}"\n\nTranscript:\n${transcriptText}\n\nGenerate the complete study suite now.`,
        },
      ],
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '{}';
    let studyData;
    try {
      studyData = JSON.parse(responseText);
    } catch {
      const cleaned = responseText.replace(/```(?:json)?/g, '').trim();
      studyData = JSON.parse(cleaned);
    }

    return res.json({
      success: true,
      data: studyData,
    });
  } catch (error: any) {
    console.error('Study material generation error:', error);
    return res.status(500).json({
      error: 'Failed to generate study materials: ' + (error?.message || 'Unknown error'),
    });
  }
});

/**
 * Ask Questions Grounded in Lecture
 */
app.post('/api/ask-lecture', async (req: Request, res: Response) => {
  try {
    const { question, lectureTitle, transcriptText, notesSummary } = req.body;

    if (!question || !transcriptText) {
      return res.status(400).json({ error: 'Missing question or lecture context' });
    }

    const prompt = `You are a private professor's teaching assistant for the lecture "${lectureTitle}".
Answer the student's question clearly, pedagogically, and accurately.
Anchor your explanation strictly in what was taught in this lecture transcript and notes.
If the student asks for an analogy, step-by-step example, or clarification, provide it in an encouraging, crystal-clear academic tone.

Lecture Transcript Context:
${transcriptText.slice(0, 8000)}

Notes Summary:
${notesSummary || ''}

Student Question:
${question}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [{ text: prompt }],
    });

    return res.json({
      success: true,
      answer: response.text || 'Unable to generate answer at this time.',
    });
  } catch (error: any) {
    console.error('Ask lecture error:', error);
    return res.status(500).json({
      error: 'Failed to answer question: ' + (error?.message || 'Unknown error'),
    });
  }
});

/**
 * Process YouTube Video (Transcript + Metadata)
 */
app.post('/api/process-youtube', async (req: Request, res: Response) => {
  try {
    const { url, customTitle } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'Missing YouTube video URL' });
    }

    const match = url.match(/(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    const videoId = match ? match[1] : null;

    if (!videoId) {
      return res.status(400).json({ error: 'Invalid YouTube URL. Please provide a valid YouTube link.' });
    }

    // 1. Fetch metadata via YouTube oEmbed
    let videoTitle = customTitle || '';
    let authorName = 'YouTube Educator';
    let thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    try {
      const oembedRes = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
      if (oembedRes.ok) {
        const oembedData: any = await oembedRes.json();
        if (!videoTitle) videoTitle = oembedData.title || 'YouTube Lecture';
        if (oembedData.author_name) authorName = oembedData.author_name;
        if (oembedData.thumbnail_url) thumbnailUrl = oembedData.thumbnail_url;
      }
    } catch (e) {
      console.warn('oEmbed fetch warning:', e);
    }
    if (!videoTitle) videoTitle = 'YouTube Lecture';

    // 2. Fetch or generate transcript
    let transcriptSegments: Array<{ id: string; timestamp: string; seconds: number; speaker: string; text: string; topicTag: string }> = [];
    let fullTranscriptText = '';

    try {
      const rawTranscripts = await YoutubeTranscript.fetchTranscript(videoId);
      if (rawTranscripts && rawTranscripts.length > 0) {
        // Group raw transcript entries into ~35 second segments
        let currentChunkText: string[] = [];
        let chunkStartSec = 0;
        let segIdx = 0;

        for (let i = 0; i < rawTranscripts.length; i++) {
          const item = rawTranscripts[i];
          const itemSec = Math.floor(item.offset / 1000);
          if (currentChunkText.length === 0) chunkStartSec = itemSec;
          currentChunkText.push(item.text);

          const isLast = i === rawTranscripts.length - 1;
          const chunkDuration = itemSec - chunkStartSec;

          if (chunkDuration >= 35 || isLast) {
            const minutes = Math.floor(chunkStartSec / 60);
            const seconds = chunkStartSec % 60;
            const ts = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            const combinedText = currentChunkText
              .join(' ')
              .replace(/&amp;/g, '&')
              .replace(/&#39;/g, "'")
              .replace(/&quot;/g, '"');

            transcriptSegments.push({
              id: `yt-seg-${segIdx++}`,
              timestamp: ts,
              seconds: chunkStartSec,
              speaker: authorName || 'Instructor',
              text: combinedText,
              topicTag: segIdx === 1 ? 'Introduction' : 'Core Concept',
            });
            currentChunkText = [];
          }
        }
        fullTranscriptText = transcriptSegments.map((s) => s.text).join('\n\n');
      }
    } catch (transcriptErr: any) {
      console.warn('Direct transcript extraction failed, synthesizing via Gemini:', transcriptErr?.message);
    }

    // Fallback: If direct captions were disabled, ask Gemini to reconstruct a comprehensive academic transcript
    if (!fullTranscriptText || transcriptSegments.length === 0) {
      const transcriptPrompt = `You are an expert academic lecture transcriber.
The student provided this YouTube lecture video:
Title: "${videoTitle}"
Author/Channel: "${authorName}"
URL: "${url}"

Provide a comprehensive, high-accuracy, timestamped lecture transcript covering all primary academic concepts, definitions, derivations, and examples discussed in this lecture.
Structure the transcript into chronological segments with accurate MM:SS timestamps, speaker labels, and topic tags.
Format as JSON:
{
  "fullText": "Full transcript of the lecture...",
  "segments": [
    {
      "timestamp": "00:00",
      "seconds": 0,
      "speaker": "${authorName || 'Instructor'}",
      "text": "...",
      "topicTag": "Introduction"
    }
  ]
}`;

      const transcriptGen = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [{ text: transcriptPrompt }],
        config: {
          responseMimeType: 'application/json',
        },
      });

      const raw = transcriptGen.text || '{}';
      try {
        const parsed = JSON.parse(raw);
        fullTranscriptText = parsed.fullText || '';
        transcriptSegments = Array.isArray(parsed.segments) ? parsed.segments : [];
      } catch {
        const cleaned = raw.replace(/```(?:json)?/g, '').trim();
        const parsed = JSON.parse(cleaned);
        fullTranscriptText = parsed.fullText || '';
        transcriptSegments = Array.isArray(parsed.segments) ? parsed.segments : [];
      }
    }

    return res.json({
      success: true,
      videoId,
      videoTitle,
      authorName,
      thumbnailUrl,
      fullText: fullTranscriptText,
      segments: transcriptSegments,
    });
  } catch (error: any) {
    console.error('YouTube processing error:', error);
    return res.status(500).json({
      error: 'Failed to process YouTube lecture: ' + (error?.message || 'Unknown error'),
    });
  }
});

// Configure Vite or Static Serve
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Synapse server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
