import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, BookOpen, Bot, Download, ArrowLeft, Home } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function FormatGuide() {
  const { toast } = useToast();

  const copyToClipboard = (text: string, description: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${description} copied successfully`,
    });
  };

  const aiPromptTemplate = `Create quiz questions using Aiken format for [SUBJECT/TOPIC]. Use this exact structure:

MC:: [Question text]?
~[Wrong option]
~[Wrong option]
*~[Correct option]
~[Wrong option]

TF:: [True/false statement].
~True
*~False

MT:: [Matching question prompt]
~[Left item 1] => [Right match 1]
~[Left item 2] => [Right match 2]
~[Left item 3] => [Right match 3]
~[Left item 4] => [Right match 4]
~[Distractor/filler word 1]
~[Distractor/filler word 2]

ESSAY:: [Open-ended question requiring explanation].

CRITICAL FORMATTING RULES:
- Output ONLY plain text. Do NOT use any rich formatting, markdown, bold (**), italics, headers (#), bullet points, numbered lists, or code blocks.
- Each question must start on its own line with the type prefix (MC::, TF::, MT::, ESSAY::)
- Each answer choice must start on its own line with ~ or *~
- Separate questions with exactly one blank line
- Do NOT add any extra text, explanations, labels, or commentary between questions
- Do NOT wrap output in code fences or markdown formatting
- 4 answer choices for MC questions
- Mark correct answers with *~
- For matching questions, use ~ before each pair and => between left and right items
- For matching questions, add 2-3 extra filler/distractor words (lines with ~ but no =>) to make matching harder
- Make content appropriate for [GRADE LEVEL]
- Focus on [SPECIFIC LEARNING OBJECTIVES]
- Do NOT include [RAND] or [IMG] modifiers - these can be added manually later if needed

Generate [NUMBER] questions total with a mix of MC, TF, MT, and ESSAY types.`;

  const exampleOutput = `MC:: What is the capital of France?
~Berlin
~Madrid
*~Paris
~Rome

MC:: Which of these is a prime number?
~4
~6
*~7
~9

TF:: The Earth is flat.
~True
*~False

MT:: Match each country with its capital city.
~France => Paris
~Germany => Berlin
~Spain => Madrid
~Italy => Rome
~Tokyo
~Buenos Aires

ESSAY:: Explain the process of photosynthesis and its importance to life on Earth.`;

  const giftMatchingExample = `Match the following countries with their corresponding capitals. {
=Canada -> Ottawa
=Italy -> Rome
=Japan -> Tokyo
=India -> New Delhi
}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Converter
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">AI Generation Guide</h1>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <p className="text-lg text-gray-600">
            Learn how to use AI to generate properly formatted quiz questions for import into this converter.
          </p>
        </div>

      <div className="space-y-6">
        {/* Quick Start */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Quick Start with AI
            </CardTitle>
            <CardDescription>
              Copy this prompt template to ChatGPT, Claude, or any AI assistant to generate quiz questions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-md relative">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                {aiPromptTemplate}
              </pre>
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(aiPromptTemplate, "AI prompt template")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Replace the bracketed placeholders with your specific requirements before sending to AI.
            </p>
          </CardContent>
        </Card>

        {/* Format Reference */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Aiken Format Reference
            </CardTitle>
            <CardDescription>
              Complete specification of supported question types and modifiers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Question Types</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Badge variant="outline">MC::</Badge>
                  <p className="text-sm text-gray-600">Multiple Choice (4 options)</p>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline">TF::</Badge>
                  <p className="text-sm text-gray-600">True/False</p>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline">ESSAY::</Badge>
                  <p className="text-sm text-gray-600">Essay/Open Response</p>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline">MT::</Badge>
                  <p className="text-sm text-gray-600">Matching Questions</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Special Modifiers</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Badge variant="secondary">[IMG]</Badge>
                  <p className="text-sm text-gray-600">Question includes an image</p>
                </div>
                <div className="space-y-2">
                  <Badge variant="secondary">[RAND]</Badge>
                  <p className="text-sm text-gray-600">Randomize answer order</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Formatting Rules</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Mark correct answers with <code className="bg-gray-100 px-1 rounded">*~</code></li>
                <li>• Mark wrong answers with <code className="bg-gray-100 px-1 rounded">~</code></li>
                <li>• Use <code className="bg-gray-100 px-1 rounded">=&gt;</code> for matching pairs</li>
                <li>• Add filler/distractor words with <code className="bg-gray-100 px-1 rounded">~Word</code> (no =&gt;) in matching questions</li>
                <li>• Matching questions support partial credit (points per correct match)</li>
                <li>• Separate questions with blank lines</li>
                <li>• No special characters in question text</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Example Output */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Example AI Output
            </CardTitle>
            <CardDescription>
              Sample of properly formatted questions ready for import.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-md relative">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                {exampleOutput}
              </pre>
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(exampleOutput, "Example questions")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Copy this output directly into the quiz converter to generate your .imscc file.
            </p>
          </CardContent>
        </Card>

        {/* GIFT Format Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              GIFT Format Matching Questions
            </CardTitle>
            <CardDescription>
              Alternative syntax for matching questions using GIFT format style.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">GIFT Syntax</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Use curly braces and arrow notation for matching questions:
                </p>
                <div className="bg-gray-50 p-4 rounded-md relative">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                    {giftMatchingExample}
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(giftMatchingExample, "GIFT matching example")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Schoology Compatibility Note
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        GIFT format matching questions are converted to QTI format for Schoology import. 
                        We've tested this with smaller sets, but larger matching questions may need verification 
                        in your specific Schoology environment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Pro Tips for Better AI Generation</CardTitle>
          </CardHeader>
          <CardContent>

            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">
                    Important: Plain Text Only
                  </h3>
                  <div className="mt-2 text-sm text-amber-700">
                    <p>
                      When copying AI output, make sure it's <strong>plain text only</strong>. AI tools like Claude and ChatGPT 
                      often add rich formatting (bold, headers, numbered lists) that will cause all questions to merge into one. 
                      If this happens, ask the AI to "reformat as plain text with no markdown" or manually remove any formatting 
                      before pasting.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <ul className="space-y-2 text-sm text-gray-700">
              <li>• <strong>Plain text is key:</strong> If questions show up as one big block, the AI added hidden formatting. Ask it to output plain text only.</li>
              <li>• <strong>Be specific:</strong> Include grade level, subject area, and learning objectives</li>
              <li>• <strong>Request variety:</strong> Ask for different question difficulties and types</li>
              <li>• <strong>Add context:</strong> Mention if questions are for review, assessment, or practice</li>
              <li>• <strong>Keep it simple:</strong> Let AI generate basic questions, then add [RAND] or [IMG] tags manually if needed</li>
              <li>• <strong>Review output:</strong> Always check AI-generated questions for accuracy</li>
              <li>• <strong>Iterate:</strong> Refine your prompt based on the quality of generated questions</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}