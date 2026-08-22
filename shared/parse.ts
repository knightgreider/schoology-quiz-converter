import { Question, MatchingQuestion, ChoiceQuestion, EssayQuestion } from './schema';

// Parse GIFT format matching questions
export const parseGIFTMatchingQuestion = (block: string): MatchingQuestion | null => {
  try {
    // Extract the question text (everything before the opening brace)
    const questionMatch = block.match(/^([\s\S]*?)\s*\{/);
    if (!questionMatch) return null;
    
    let questionText = questionMatch[1].trim();
    
    // Check for optional title in GIFT format (::Title::)
    const titleMatch = questionText.match(/^::(.*?)::\s*([\s\S]*)$/);
    if (titleMatch) {
      questionText = titleMatch[2].trim();
    }
    
    // Extract the matching pairs from within the braces
    const bracesMatch = block.match(/\{([\s\S]*?)\}/);
    if (!bracesMatch) return null;
    
    const pairsText = bracesMatch[1].trim();
    const lines = pairsText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    
    const choices: string[] = [];
    const matchItems: string[] = [];
    const answer: number[] = [];
    
    lines.forEach((line, idx) => {
      // Match GIFT format: =Item -> Match
      const pairMatch = line.match(/^=\s*(.*?)\s*->\s*(.*)$/);
      if (pairMatch) {
        choices.push(pairMatch[1].trim());
        matchItems.push(pairMatch[2].trim());
        answer.push(idx); // Direct index mapping
      }
    });
    
    if (choices.length === 0) return null;
    
    return {
      type: 'MT' as const,
      question: questionText,
      choices,
      matchItems,
      answer,
      hasImage: false
    };
  } catch (error) {
    console.error('Error parsing GIFT matching question:', error);
    return null;
  }
};

// Parse raw Aiken/GIFT-style input with MC::, TF::, ES::, ESSAY::, MT::
export const parseRawInput = (input: string): Question[] =>
  input
    .split(/\r?\n\r?\n+/)
    .map((b) => b.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      
      // Check for GIFT format matching question first
      if (block.includes('{') && block.includes('}') && block.includes('->')) {
        return parseGIFTMatchingQuestion(block);
      }
      
      // Check for question type and extract modifiers (more flexible pattern)
      const headerMatch = lines[0].match(/^(MC|TF|ES|ESSAY|MT)(\[.*?\])*::\s*(.+)$/i);
      if (!headerMatch) return null;
      
      let type = headerMatch[1].toUpperCase() as "MC" | "TF" | "ES" | "ESSAY" | "MT";
      if (type === "ESSAY") type = "ES";
      
      // Extract modifiers from the question line
      const imageMatch = lines[0].match(/\[IMG(?::([^\]]+))?\]/);
      const hasImage = !!imageMatch;
      const imageId = imageMatch?.[1] || undefined; // Extract image ID if present (e.g., "photo1" from [IMG:photo1])
      const randomize = lines[0].includes('[RAND]');
      const question = headerMatch[3].trim();
      
      // Parse matching questions
      if (type === 'MT') {
        const choices: string[] = []; // Premises (left side)
        const matchItems: string[] = []; // Responses (right side)
        const answer: number[] = []; // Index mapping: answer[i] = index in matchItems for choices[i]
        const fillerItems: string[] = []; // Extra right-side distractors
        
        lines.slice(1).forEach((ln) => {
          const cleanLine = ln.replace(/^\*?~/, '').trim();
          if (cleanLine.includes('=>')) {
            // Matching pair: Left => Right
            const parts = cleanLine.split('=>').map(p => p.trim());
            if (parts.length === 2 && parts[0] && parts[1]) {
              choices.push(parts[0]);
              matchItems.push(parts[1]);
              // Each premise maps to its corresponding match item by index
              answer.push(matchItems.length - 1);
            }
          } else if (cleanLine) {
            // Line without => is a filler/distractor word
            fillerItems.push(cleanLine);
          }
        });
        
        return { type, question, choices, matchItems, answer, hasImage, imageId, fillerItems } as MatchingQuestion;
      }
      
      // Parse multiple choice and true/false questions
      if (type === 'MC' || type === 'TF') {
        const choices: string[] = [];
        let answer = 0;
        
        lines.slice(1).forEach((ln, idx) => {
          const correct = ln.startsWith('*~');
          const text = ln.replace(/^[*]?~/, '').trim();
          choices.push(text);
          if (correct) answer = idx;
        });
        
        return { type, question, choices, answer, hasImage, imageId, randomize } as ChoiceQuestion;
      }
      
      // Essay questions
      return { type, question, choices: [], answer: 0, hasImage, imageId, randomize } as EssayQuestion;
    })
    .filter(Boolean) as Question[];