import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, FileText, Zap, Download, Star, CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Schoology Quiz Converter
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <Link href="/pricing">
                <Button variant="outline" size="sm" data-testid="button-pricing">
                  View Pricing
                </Button>
              </Link>
              <Link href="/format-guide">
                <Button variant="ghost" size="sm" data-testid="button-guide">
                  Format Guide
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-16 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
            Create Schoology Quizzes
            <span className="block text-blue-600 dark:text-blue-400">Fast & Easy</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Convert your quiz questions to Schoology-compatible format with our converter, 
            or use AI to automatically generate questions from PDF presentations.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
          {/* IMSCC Converter */}
          <Card className="relative bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 h-full">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-full w-fit">
                <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                IMSCC Converter
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                Convert manually written quiz questions to Schoology format
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">Support for all question types (MC, TF, Essay, Matching)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">Image support with [IMG] tags</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">Answer randomization options</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">Unlimited quiz conversions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">One-time purchase - $20</span>
                </div>
              </div>
              <div className="pt-6 space-y-3">
                <Link href="/converter">
                  <Button className="w-full group" size="lg" data-testid="button-try-converter">
                    Try Converter
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline" className="w-full" size="lg" data-testid="button-buy-converter">
                    Buy Full Access - $20
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* AI Question Generator */}
          <Card className="relative bg-white dark:bg-gray-800 border-2 border-blue-500 dark:border-blue-400 hover:border-blue-600 dark:hover:border-blue-300 transition-all duration-200 shadow-lg h-full">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                <Star className="h-4 w-4 mr-1" />
                AI Powered
              </div>
            </div>
            <CardHeader className="text-center pb-6 pt-8">
              <div className="mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-full w-fit">
                <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                AI Question Generator
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                Upload PDFs and let AI create quiz questions automatically
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">AI-powered question generation from PDFs</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">Customizable difficulty levels</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">Multiple question types supported</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">Subject-specific focus options</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">Review and edit before download</span>
                </div>
              </div>
              <div className="pt-6 space-y-3">
                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Starting at $20/month or $99 lifetime
                </div>
                <Link href="/ai-generator">
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 group" size="lg" data-testid="button-try-ai">
                    Try AI Generator
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline" className="w-full" size="lg" data-testid="button-view-ai-pricing">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 mb-12 md:mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">100%</div>
              <div className="text-gray-600 dark:text-gray-300">Schoology Compatible</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mb-2">4</div>
              <div className="text-gray-600 dark:text-gray-300">Question Types Supported</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">3</div>
              <div className="text-gray-600 dark:text-gray-300">Purchase Options</div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 md:mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center">
              <div className="mx-auto mb-4 p-4 bg-blue-100 dark:bg-blue-900 rounded-full w-fit">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Choose Your Method
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Choose our converter for manual entry or AI generator for PDF uploads
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 p-4 bg-green-100 dark:bg-green-900 rounded-full w-fit">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">2</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Create & Review
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Enter questions manually or let AI generate them, then review and edit
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 p-4 bg-purple-100 dark:bg-purple-900 rounded-full w-fit">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Download & Import
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get your IMSCC file and import directly into Schoology
              </p>
            </div>
          </div>
        </div>

        {/* Schoology Import Demo Section */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Never Create Tests in Schoology Again
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-12">
            Stop the painstaking process of manually creating quizzes question by question in Schoology. 
            Generate your complete quiz file and import it instantly.
          </p>
          
          {/* Import Animation Demo */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-8">
                Simple 3-Click Import into Schoology
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                {/* Step 1 */}
                <div className="text-center">
                  <div className="relative mb-4">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-xl mx-auto flex items-center justify-center animate-pulse">
                      <Download className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Download IMSCC</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get your quiz file from our generator</p>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex justify-center">
                  <ArrowRight className="h-6 w-6 text-gray-400 animate-bounce" style={{animationDirection: 'alternate'}} />
                </div>

                {/* Step 2 */}
                <div className="text-center">
                  <div className="relative mb-4">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-xl mx-auto flex items-center justify-center" 
                         style={{animation: 'pulse 2s infinite 0.5s'}}>
                      <FileText className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Go to Resources</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Navigate to your course Resources section</p>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex justify-center">
                  <ArrowRight className="h-6 w-6 text-gray-400 animate-bounce" style={{animationDirection: 'alternate', animationDelay: '0.5s'}} />
                </div>

                {/* Step 3 */}
                <div className="text-center md:col-start-2">
                  <div className="relative mb-4">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-xl mx-auto flex items-center justify-center"
                         style={{animation: 'pulse 2s infinite 1s'}}>
                      <CheckCircle className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Import & Done!</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Click "Import from Common Cartridge" and upload</p>
                </div>
              </div>

              {/* Visual Steps */}
              <div className="mt-12 bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <div className="text-left space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <span className="text-gray-700 dark:text-gray-300">In Schoology, go to your course → <strong>Resources</strong></span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <span className="text-gray-700 dark:text-gray-300">Click <strong>"Add Materials"</strong> → <strong>"Import from Resources"</strong></span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <span className="text-gray-700 dark:text-gray-300">Select <strong>"Import from Common Cartridge File"</strong> and upload your .imscc file</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-lg border border-green-200 dark:border-green-700">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      Your complete quiz with all questions, images, and settings imports instantly!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 md:p-8 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Create Better Quizzes?
          </h2>
          <p className="text-lg md:text-xl mb-6 opacity-90">
            Start with our converter or unlock AI-powered generation
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link href="/pricing">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto" data-testid="button-buy-converter">
                Buy Converter - $20
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white hover:text-gray-900" data-testid="button-see-ai-plans">
                See AI Plans
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}