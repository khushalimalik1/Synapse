import { LectureItem } from '../types/lecture';

/**
 * Exports lecture notes and study guide as a clean Markdown file
 */
export function exportToMarkdown(lecture: LectureItem): void {
  const md = `# ${lecture.title}
**Course:** ${lecture.courseCode} — ${lecture.subject}
**Instructor:** ${lecture.instructor || 'Instructor'}
**Date:** ${lecture.date} | **Duration:** ${lecture.duration} | **Difficulty:** ${lecture.overview.difficulty}

---

## Executive Overview
${lecture.overview.summary}

### Key Takeaways
${lecture.overview.keyTakeaways.map(t => `- ${t}`).join('\n')}

---

## Cornell Study Notes

${lecture.cornellNotes
  .map(
    (section, idx) => `### ${idx + 1}. ${section.topic} ${section.timestampRef ? `[${section.timestampRef}]` : ''}

**Recall Cue / Question:**
> ${section.cue}

**Notes & Key Principles:**
${section.notes.map(n => `- ${n}`).join('\n')}
${
  section.formulasOrRules && section.formulasOrRules.length > 0
    ? `\n**Key Formulas / Rules:**\n` + section.formulasOrRules.map(f => `\`\`\`\n${f}\n\`\`\``).join('\n')
    : ''
}
`
  )
  .join('\n---\n\n')}

### Lecture Summary
${lecture.lectureSummary}

---

## High-Yield Exam Cheatsheet
### Core Points
${lecture.cheatSheet.highYieldPoints.map(p => `- ${p}`).join('\n')}

### Common Pitfalls to Avoid
${lecture.cheatSheet.commonPitfalls.map(p => `- ⚠️ ${p}`).join('\n')}

### Exam Strategies
${lecture.cheatSheet.examTips.map(t => `- 💡 ${t}`).join('\n')}

---

## Flashcards (${lecture.flashcards.length} cards)
${lecture.flashcards
  .map(
    (card, idx) => `**Card ${idx + 1}:** ${card.front}
*Answer:* ${card.back}
*Topic:* ${card.topic} | *Difficulty:* ${card.difficulty}
`
  )
  .join('\n')}

---

## Full Lecture Transcript
${lecture.transcript
  .map(seg => `**[${seg.timestamp}] ${seg.speaker}:** ${seg.text}`)
  .join('\n\n')}
`;

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${lecture.courseCode.replace(/\s+/g, '_')}_${lecture.title.replace(/[^a-zA-Z0-9]/g, '_')}_StudyNotes.md`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Exports flashcards in Anki-compatible TSV format (Front \t Back \t Tags)
 */
export function exportToAnkiTSV(lecture: LectureItem): void {
  const tsvLines = lecture.flashcards.map(c => {
    const cleanFront = c.front.replace(/\t/g, ' ').replace(/\n/g, '<br>');
    const cleanBack = c.back.replace(/\t/g, ' ').replace(/\n/g, '<br>');
    const tag = `${lecture.courseCode.replace(/\s+/g, '')} ${c.topic.replace(/\s+/g, '')}`;
    return `${cleanFront}\t${cleanBack}\t${tag}`;
  });

  const content = `#separator:tab\n#html:true\n#tags column:3\n` + tsvLines.join('\n');
  const blob = new Blob([content], { type: 'text/tab-separated-values;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${lecture.courseCode.replace(/\s+/g, '_')}_Flashcards_Anki.txt`;
  link.click();
  URL.revokeObjectURL(url);
}
