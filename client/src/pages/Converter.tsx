import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { BookOpen, Zap } from "lucide-react";
import QTIQuizGenerator from "@/components/QTIQuizGenerator";

export default function Converter() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>Quiz Converter - Schoology IMSCC Format</title>
        <meta name="description" content="Professional tool to convert Aiken style quiz questions to IMS Common Cartridge (.imscc) format for Schoology LMS import." />
        <meta property="og:title" content="Schoology Quiz Converter" />
        <meta property="og:description" content="Convert your quiz questions to Schoology format - one-time purchase" />
        <meta property="og:type" content="website" />
      </Helmet>
      
      {/* Header Section */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" size="sm" className="mr-4" data-testid="button-back">
                  ← Back to Home
                </Button>
              </Link>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h1 className="ml-2 text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Quiz Converter</h1>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Link href="/ai-generator">
                <Button size="sm" className="inline-flex items-center w-full sm:w-auto" data-testid="button-ai-generator">
                  <Zap className="h-4 w-4 mr-2" />
                  Try AI Generator
                </Button>
              </Link>
              <Link href="/format-guide">
                <Button variant="outline" size="sm" className="inline-flex items-center w-full sm:w-auto" data-testid="button-format-guide">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Format Guide
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <QTIQuizGenerator />
        
        {/* Technical Documentation */}
        <div className="mt-8 bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">How to Use This Tool</h2>
            <div className="mt-4 prose prose-sm text-gray-500 dark:text-gray-400 max-w-none">
              <p>
                This professional tool creates IMS Common Cartridge (.imscc) files compatible with Schoology's import format. Simply:
              </p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Enter your quiz questions using the Aiken format</li>
                <li>Preview your questions to ensure they're correctly formatted</li>
                <li>Download the .imscc file</li>
                <li>Import directly into Schoology</li>
              </ol>
              
              <div className="mt-6">
                <h3 className="text-base font-medium text-gray-900 dark:text-white">Supported Question Types</h3>
                <ul className="mt-2 space-y-1">
                  <li><strong>MC:</strong> Multiple Choice questions with one correct answer</li>
                  <li><strong>TF:</strong> True/False questions</li>
                  <li><strong>MT:</strong> Matching questions (pair left and right items)</li>
                  <li><strong>ESSAY/ES:</strong> Essay questions (manually graded)</li>
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="text-base font-medium text-gray-900 dark:text-white">Special Features</h3>
                <ul className="mt-2 space-y-1">
                  <li><strong>[IMG] tag:</strong> Add images to questions (e.g., MC[IMG]::)</li>
                  <li><strong>[RAND] tag:</strong> Randomize answer order for MC questions</li>
                  <li><strong>Unlimited conversions:</strong> No limits after one-time purchase</li>
                </ul>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="text-base font-medium text-blue-900 dark:text-blue-100">Want AI to Create Questions for You?</h3>
                <p className="mt-1 text-sm text-blue-700 dark:text-blue-200">
                  Upload PDF files and let our AI automatically generate quiz questions. 
                  <Link href="/ai-generator" className="font-medium underline hover:no-underline">
                    Try our AI Generator →
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-8">
        <div className="max-w-7xl mx-auto py-6 px-4 overflow-hidden sm:px-6 lg:px-8">
          <p className="text-center text-sm sm:text-base text-gray-500 dark:text-gray-400">
            Schoology Quiz Converter | $20 One-Time Purchase
          </p>
        </div>
      </footer>
    </div>
  );
}