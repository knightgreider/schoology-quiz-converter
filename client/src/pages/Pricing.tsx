import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Download } from "lucide-react";
import { Link } from "wouter";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" size="sm" className="mr-4" data-testid="button-back">
                  ← Back to Home
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Pricing Plans</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Choose from our IMSCC converter for manual questions, or unlock AI-powered question generation with our premium plans.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {/* IMSCC Converter Plan */}
          <Card className="relative bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">IMSCC Converter</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                One-time purchase for quiz conversion
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">$20</span>
                <span className="text-gray-500 dark:text-gray-400">/one-time</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">IMSCC file conversion</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Support for all question types</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Manual question entry</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Image support</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Unlimited conversions</span>
              </div>
              <div className="pt-6">
                <Link href="/checkout-converter">
                  <Button className="w-full" data-testid="button-buy-converter">
                    Buy Converter
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* AI Generator Plan */}
          <Card className="relative bg-white dark:bg-gray-800 border-2 border-blue-500 dark:border-blue-400 hover:border-blue-600 dark:hover:border-blue-300 transition-all duration-200 shadow-lg">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-blue-500 text-white px-4 py-1 text-sm font-medium">
                <Star className="h-4 w-4 mr-1" />
                Most Popular
              </Badge>
            </div>
            <CardHeader className="text-center pb-8 pt-8">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center">
                <Zap className="h-6 w-6 mr-2 text-blue-500" />
                AI Generator
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                AI-powered question generation from PDFs
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">$20</span>
                <span className="text-gray-500 dark:text-gray-400">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Everything in IMSCC Converter</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">AI question generation from PDFs</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Multiple question types</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Difficulty level control</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Subject customization</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Unlimited AI generations</span>
              </div>
              <div className="pt-6">
                <Link href="/subscribe">
                  <Button className="w-full bg-blue-500 hover:bg-blue-600" data-testid="button-subscribe">
                    Subscribe Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Lifetime Plan */}
          <Card className="relative bg-white dark:bg-gray-800 border-2 border-purple-500 dark:border-purple-400 hover:border-purple-600 dark:hover:border-purple-300 transition-all duration-200">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-purple-500 text-white px-4 py-1 text-sm font-medium">
                <Download className="h-4 w-4 mr-1" />
                Best Value
              </Badge>
            </div>
            <CardHeader className="text-center pb-8 pt-8">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center">
                <Download className="h-6 w-6 mr-2 text-purple-500" />
                Lifetime Access
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                One-time payment for permanent AI access
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">$99</span>
                <span className="text-gray-500 dark:text-gray-400">/lifetime</span>
              </div>
              <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                Save $141 vs yearly subscription
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Everything in AI Generator</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Includes IMSCC Converter</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Lifetime access</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">No monthly fees</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Future updates included</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Priority support</span>
              </div>
              <div className="pt-6">
                <Link href="/checkout">
                  <Button className="w-full bg-purple-500 hover:bg-purple-600" data-testid="button-buy-lifetime">
                    Buy Lifetime Access
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                What file formats are supported?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We support PDF files for AI generation and manual text entry for quiz creation. Output is in IMSCC format for Schoology.
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Is the lifetime plan really lifetime?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes! One payment gives you permanent access to all AI generation features, including future updates and improvements.
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                How accurate is the AI generation?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our AI creates high-quality questions based on your PDF content. You can always review and edit questions before generating your quiz file.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}