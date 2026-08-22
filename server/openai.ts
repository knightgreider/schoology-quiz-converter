import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateQuestionsFromText(
  extractedText: string,
  options: {
    questionCount: number;
    questionTypes: string[];
    difficulty: string;
    subject?: string;
  }
): Promise<string> {
  const { questionCount, questionTypes, difficulty, subject } = options;
  
  // Create a comprehensive prompt for question generation
  const typeDescriptions = {
    MC: "Multiple Choice questions with 4 options (mark correct with *~)",
    TF: "True/False questions",
    ES: "Essay questions requiring written responses", 
    MT: "Matching questions using => format"
  };
  
  const selectedTypes = questionTypes.map(type => typeDescriptions[type as keyof typeof typeDescriptions]).join(", ");
  
  const prompt = `You are an expert educator creating quiz questions from presentation content. 

Source Material:
${extractedText}

Instructions:
- Generate exactly ${questionCount} questions total
- Use these question types: ${selectedTypes}
- Difficulty level: ${difficulty}
${subject ? `- Subject focus: ${subject}` : ""}
- Format in Aiken style exactly as shown below
- Distribute question types evenly
- Base questions on the actual content provided
- Make questions test understanding, not just memorization

Required Aiken Format:
MC:: [Question text]?
~[Wrong option]
~[Wrong option] 
*~[Correct option]
~[Wrong option]

TF:: [Statement].
~True
*~False

ES:: [Open-ended question].

MT:: [Matching prompt].
~[Item 1] => [Match 1]
~[Item 2] => [Match 2]
~[Item 3] => [Match 3]

CRITICAL: 
- Separate each question with a blank line
- Mark correct answers with *~
- Use exactly 4 options for MC questions
- Base all questions on the provided content
- Output ONLY the formatted questions, no explanations

Generate the questions now:`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 3000,
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate questions using AI");
  }
}