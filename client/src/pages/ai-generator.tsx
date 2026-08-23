import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, Bot, Download, Loader2, FileText, CheckCircle, Lock, Star } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { parseRawInput } from '@shared/parse';
import { Question, AIGenerateResult } from '@shared/schema';
import QuestionPreview from '@/components/QuestionPreview';
import JSZip from 'jszip';

// Access Control Component for AI Features
function AccessGate({ children }: { children: React.ReactNode }) {
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking subscription status
    // In a real app, this would check user authentication and subscription status
    const checkAccess = async () => {
      try {
        // For demo purposes, we'll check if the user has clicked "I have subscription" 
        // In production, this would be a proper auth/subscription check
        const hasSubscription = localStorage.getItem('ai_access') === 'true';
        setHasAccess(hasSubscription);
      } catch (error) {
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-300">Checking access...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link href="/">
                  <Button variant="ghost" size="sm" className="mr-4" data-testid="button-back">
                    ← Back to Home
                  </Button>
                </Link>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">AI Question Generator</h1>
              </div>
            </div>
          </div>
        </header>

        {/* Access Denied Content */}
        <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12">
            <div className="mx-auto mb-6 p-4 bg-blue-100 dark:bg-blue-900 rounded-full w-fit">
              <Lock className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              AI Generation Requires Subscription
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Upload PDF files and let our AI automatically generate quiz questions. 
              Choose from subscription or lifetime access options.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-2xl mx-auto">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                <Star className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Monthly Subscription</h3>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">$20/month</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Cancel anytime</p>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
                <CheckCircle className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Lifetime Access</h3>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">$99</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">One-time payment</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mb-8">
              <Link href="/pricing">
                <Button size="lg" className="w-full sm:w-auto" data-testid="button-view-pricing">
                  View All Plans
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto" 
                onClick={() => {
                  localStorage.setItem('ai_access', 'true');
                  window.location.reload();
                }}
                data-testid="button-demo-access"
              >
                Demo Access (Testing Only)
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Need just the converter? Available for $20 one-time.
              </p>
              <Link href="/pricing">
                <Button variant="ghost" data-testid="button-converter-only">
                  Buy Converter Only - $20 →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function AIGeneratorContent() {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [questionCount, setQuestionCount] = useState(10);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['MC', 'TF']);
  const [difficulty, setDifficulty] = useState('medium');
  const [subject, setSubject] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [aiResult, setAiResult] = useState<AIGenerateResult | null>(null);
  const [parsedQuestions, setParsedQuestions] = useState<Question[]>([]);
  const [editableAiken, setEditableAiken] = useState('');
  const [zipUrl, setZipUrl] = useState('');

  const questionTypes = [
    { id: 'MC', label: 'Multiple Choice', description: '4-option questions' },
    { id: 'TF', label: 'True/False', description: 'Binary choice questions' },
    { id: 'ES', label: 'Essay', description: 'Open-ended responses' },
    { id: 'MT', label: 'Matching', description: 'Connect related items' }
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF file.",
          variant: "destructive"
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a PDF smaller than 10MB.",
          variant: "destructive"
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleTypeToggle = (typeId: string, checked: boolean) => {
    if (checked) {
      setSelectedTypes(prev => [...prev, typeId]);
    } else {
      setSelectedTypes(prev => prev.filter(id => id !== typeId));
    }
  };

  const generateMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/ai/generate-from-pdf', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate questions');
      }
      
      return response.json() as Promise<AIGenerateResult>;
    },
    onSuccess: (result) => {
      setAiResult(result);
      setEditableAiken(result.aikenText);
      setParsedQuestions(result.questions);
      setCurrentStep(2);
      
      toast({
        title: "Questions generated successfully!",
        description: `Generated ${result.questions.length} questions in ${(result.processingTime / 1000).toFixed(1)}s`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Generation failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleGenerate = () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file to upload.",
        variant: "destructive"
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: "Missing title",
        description: "Please enter a quiz title.",
        variant: "destructive"
      });
      return;
    }

    if (selectedTypes.length === 0) {
      toast({
        title: "No question types selected",
        description: "Please select at least one question type.",
        variant: "destructive"
      });
      return;
    }

    const formData = new FormData();
    formData.append('pdf', selectedFile);
    formData.append('questionCount', questionCount.toString());
    formData.append('questionTypes', JSON.stringify(selectedTypes));
    formData.append('difficulty', difficulty);
    if (subject.trim()) {
      formData.append('subject', subject.trim());
    }

    generateMutation.mutate(formData);
  };

  const handleUpdateAiken = () => {
    try {
      const newQuestions = parseRawInput(editableAiken);
      if (newQuestions.length === 0) {
        toast({
          title: "No valid questions found",
          description: "Please check the Aiken format syntax.",
          variant: "destructive"
        });
        return;
      }
      
      setParsedQuestions(newQuestions);
      toast({
        title: "Questions updated",
        description: `Parsed ${newQuestions.length} questions successfully.`,
      });
    } catch (error) {
      toast({
        title: "Parsing error",
        description: "There was an error parsing the question format.",
        variant: "destructive"
      });
    }
  };

  const handlePreview = () => {
    setCurrentStep(3);
  };

  const handleUseInConverter = () => {
    // This could redirect to the main converter with the questions pre-filled
    // For now, we'll just move to the download step
    setCurrentStep(3);
  };

  const escapeXML = (str: string): string => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  const generateIMSCC = async () => {
    try {
      const zip = new JSZip();
      const resourceId = 'ccres' + Math.random().toString(36).substring(2, 10);

      // Create folder and QTI XML
      const folder = zip.folder(resourceId);
      if (!folder) throw new Error('Failed to create folder in zip');
      
      // Track image IDs for embedding in questions
      const imageMap = new Map();
      let imageCounter = 0;
      
      // Add images if needed
      parsedQuestions.forEach((q, i) => {
        if (q.hasImage && q.imageData) {
          const imgId = `img${i}`;
          imageMap.set(i, imgId);
          
          // Extract base64 data - assumes format is data:image/jpeg;base64,XXXXX
          const matches = q.imageData.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
          if (matches && matches.length === 3) {
            const imageType = matches[1];
            const imageData = matches[2];
            folder.file(`${imgId}.${imageType}`, imageData, { base64: true });
            imageCounter++;
          }
        }
      });
      
      const itemsXML = parsedQuestions.map((q, i) => {
        const id = i + 1;
        
        // Generate metadata section with proper Schoology-compatible fields
        const meta = `<itemmetadata>
          <qtimetadata>
            <qtimetadatafield>
              <fieldlabel>question_type</fieldlabel>
              <fieldentry>${q.type === 'ES' ? 'essay_question' : q.type === 'MT' ? 'matching_question' : 'multiple_choice_question'}</fieldentry>
            </qtimetadatafield>
            <qtimetadatafield>
              <fieldlabel>points_possible</fieldlabel>
              <fieldentry>1</fieldentry>
            </qtimetadatafield>
            <qtimetadatafield>
              <fieldlabel>original_answer_ids</fieldlabel>
              <fieldentry>${q.choices ? q.choices.map((_, idx) => `choice${idx}`).join(',') : ''}</fieldentry>
            </qtimetadatafield>
            ${q.type==='ES'?'<qtimetadatafield><fieldlabel>qmd_computerscored</fieldlabel><fieldentry>No</fieldentry></qtimetadatafield>':''}
          </qtimetadata>
        </itemmetadata>`;
        
        // Begin presentation section
        let questionText = escapeXML(q.question);
        
        // Add image reference if this question has an image
        if (q.hasImage && q.imageData && imageMap.has(i)) {
          const imgId = imageMap.get(i);
          const imageExt = q.imageData.match(/^data:image\/([a-zA-Z]+);base64,/)?.[1] || 'jpeg';
          questionText += `<br/><img src="${imgId}.${imageExt}" alt="Question Image"/>`;
        }
        
        let pres = `<presentation><material><mattext texttype="text/html">${questionText}</mattext></material>`;
        
        // Handle different question types
        if (q.type === 'MT') {
          // Matching questions have a different structure
          const matchingQuestion = q as any;
          
          // Create response_lid for the match items with proper identifier
          pres += `<response_lid ident="response1" rcardinality="Multiple"><render_choice>`;
          
          // Add each response_label (the right-side items to match)
          matchingQuestion.matchItems?.forEach((response: string, j: number) => {
            pres += `<response_label ident="choice${j}"><material><mattext texttype="text/plain">${escapeXML(response)}</mattext></material></response_label>`;
          });
          
          pres += `</render_choice></response_lid>`;
          
          // Add matching items (the left-side premises)
          matchingQuestion.choices.forEach((premise: string) => {
            pres += `<material><mattext texttype="text/plain">${escapeXML(premise)}</mattext></material>`;
          });
        } else if (q.choices.length) {
          // Multiple choice and True/False questions
          // Add shuffle attribute if randomization is enabled
          const shuffleAttr = q.randomize ? ' shuffle="Yes"' : ' shuffle="No"';
          
          pres += `<response_lid ident="response1" rcardinality="Single"><render_choice${shuffleAttr}>` +
            q.choices.map((c: string, j: number) => `<response_label ident="choice${j}"><material><mattext texttype="text/plain">${escapeXML(c)}</mattext></material></response_label>`).join('') +
            `</render_choice></response_lid>`;
        } else {
          // Essay questions
          pres += `<response_str ident="response1" rcardinality="Single"><render_fib>
            <response_label ident="answer">
              <material>
                <mattext texttype="text/plain"></mattext>
              </material>
            </response_label>
          </render_fib></response_str>`;
        }
        
        pres += `</presentation>`;
        
        // Generate response processing section with proper Schoology format
        let proc = `<resprocessing>
          <outcomes>
            <decvar varname="SCORE" vartype="Decimal" defaultval="0" minvalue="0" maxvalue="100"/>
          </outcomes>`;
        
        if (q.type === 'MT') {
          // For matching questions, we need to set up multiple response conditions
          const matchingQuestion = q as any;
          
          matchingQuestion.answer.forEach((answerIdx: number, idx: number) => {
            proc += `
            <respcondition continue="Yes">
              <conditionvar>
                <varequal respident="response1">choice${answerIdx}</varequal>
              </conditionvar>
              <setvar action="Add" varname="SCORE">${Math.floor(100 / matchingQuestion.answer.length)}</setvar>
            </respcondition>`;
          });
        } else if (q.choices.length) {
          // Single answer questions
          proc += `
          <respcondition continue="No">
            <conditionvar>
              <varequal respident="response1">choice${q.answer}</varequal>
            </conditionvar>
            <setvar action="Set" varname="SCORE">100</setvar>
          </respcondition>`;
        } else {
          // Essay questions
          proc += `
          <respcondition continue="No">
            <conditionvar>
              <other/>
            </conditionvar>
            <setvar action="Set" varname="SCORE">0</setvar>
          </respcondition>`;
        }
        
        proc += `
        </resprocessing>`;
        
        // Clean the question text for use as title attribute
        const cleanTitle = q.question.replace(/<[^>]*>/g, '').replace(/"/g, '&quot;').substring(0, 100);
        
        return `<item ident="item_${id}" title="${escapeXML(cleanTitle)}">${meta}${pres}${proc}</item>`;
      }).join('');

      const qti = `<?xml version="1.0" encoding="UTF-8"?>
<questestinterop xmlns="http://www.imsglobal.org/xsd/ims_qtiasiv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/ims_qtiasiv1p2 http://www.imsglobal.org/xsd/ims_qtiasiv1p2p1.xsd">
  <assessment ident="${resourceId}" title="${escapeXML(title)}">
    <qtimetadata>
      <qtimetadatafield>
        <fieldlabel>cc_maxattempts</fieldlabel>
        <fieldentry>1</fieldentry>
      </qtimetadatafield>
      <qtimetadatafield>
        <fieldlabel>qmd_timelimit</fieldlabel>
        <fieldentry></fieldentry>
      </qtimetadatafield>
    </qtimetadata>
    <section ident="root_section" title="Quiz Questions">
      ${itemsXML}
    </section>
  </assessment>
</questestinterop>`;

      folder.file(`${resourceId}.xml`, qti);

      // Complete the IMS manifest with correct resource identifier and dependencies
      // Include image files in the manifest if present
      let imageFileEntries = '';
      
      // If we have images, add them to the manifest
      if (imageCounter > 0) {
        parsedQuestions.forEach((q, i) => {
          if (q.hasImage && q.imageData && imageMap.has(i)) {
            const imgId = imageMap.get(i);
            const imageExt = q.imageData.match(/^data:image\/([a-zA-Z]+);base64,/)?.[1] || 'jpeg';
            imageFileEntries += `\n      <file href="${resourceId}/${imgId}.${imageExt}"/>`;
          }
        });
      }
      
      const manifest = `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="man00001" version="1.1" 
  xmlns="http://www.imsglobal.org/xsd/imsccv1p1/imscp_v1p1"
  xmlns:lom="http://ltsc.ieee.org/xsd/imsccv1p1/LOM/resource"
  xmlns:imsmd="http://www.imsglobal.org/xsd/imsmd_v1p2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsglobal.org/xsd/imsccv1p1/imscp_v1p1 http://www.imsglobal.org/xsd/imscp_v1p1.xsd http://ltsc.ieee.org/xsd/imsccv1p1/LOM/resource http://www.imsglobal.org/profile/cc/ccv1p1/LOM/ccv1p1_lomresource_v1p0.xsd http://www.imsglobal.org/xsd/imsmd_v1p2 http://www.imsglobal.org/xsd/imsmd_v1p2p2.xsd">
  <metadata>
    <schema>IMS Common Cartridge</schema>
    <schemaversion>1.1.0</schemaversion>
    <lom:lom>
      <lom:general>
        <lom:title>
          <lom:string>${escapeXML(title)}</lom:string>
        </lom:title>
      </lom:general>
    </lom:lom>
  </metadata>
  <organizations>
    <organization identifier="org_1" structure="rooted-hierarchy">
      <item identifier="LearningModules">
        <title>Learning Modules</title>
        <item identifier="m_${resourceId}" identifierref="res_${resourceId}">
          <title>${escapeXML(title)}</title>
        </item>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="res_${resourceId}" type="imsqti_xmlv1p2/imscc_xmlv1p1/assessment" href="${resourceId}/${resourceId}.xml">
      <file href="${resourceId}/${resourceId}.xml"/>${imageFileEntries}
    </resource>
  </resources>
</manifest>`;

      zip.file("imsmanifest.xml", manifest);
      
      // Add the required empty directory for WebCT schema compatibility
      zip.folder("WebCT");

      // Generate the ZIP file as a blob
      const blob = await zip.generateAsync({ type: "blob" });
      
      // Create a download link
      const url = URL.createObjectURL(blob);
      setZipUrl(url);
      
      toast({
        title: "IMSCC file generated!",
        description: "Your quiz is ready to download and import into Schoology.",
      });
    } catch (error) {
      console.error('Error generating IMSCC:', error);
      toast({
        title: "Generation failed",
        description: "There was an error creating the quiz file.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" size="sm" className="mr-4" data-testid="button-back">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Converter
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">AI Quiz Generator</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>1</div>
              <span className="font-medium">Upload & Configure</span>
            </div>
            <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>2</div>
              <span className="font-medium">Review & Edit</span>
            </div>
            <div className={`flex items-center space-x-2 ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>3</div>
              <span className="font-medium">Preview & Download</span>
            </div>
          </div>
        </div>

        {/* Step 1: Upload & Configure */}
        {currentStep === 1 && (
          <div className="space-y-6">
            {/* File Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload PDF Presentation
                </CardTitle>
                <CardDescription>
                  Upload a PDF presentation to automatically generate quiz questions from its content.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="pdf-upload">PDF File (max 10MB)</Label>
                    <Input
                      id="pdf-upload"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileSelect}
                      className="cursor-pointer"
                      data-testid="input-pdf-upload"
                    />
                  </div>
                  {selectedFile && (
                    <div className="flex items-center space-x-2 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span data-testid="text-selected-file">{selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(1)} MB)</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quiz Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Quiz Configuration
                </CardTitle>
                <CardDescription>
                  Configure how AI should generate questions from your PDF content.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quiz-title">Quiz Title</Label>
                    <Input
                      id="quiz-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter quiz title..."
                      data-testid="input-quiz-title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="question-count">Number of Questions</Label>
                    <Input
                      id="question-count"
                      type="number"
                      min="1"
                      max="200"
                      value={questionCount}
                      onChange={(e) => setQuestionCount(parseInt(e.target.value) || 10)}
                      data-testid="input-question-count"
                    />
                  </div>
                </div>

                <div>
                  <Label>Question Types</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {questionTypes.map((type) => (
                      <div key={type.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type.id}`}
                          checked={selectedTypes.includes(type.id)}
                          onCheckedChange={(checked) => handleTypeToggle(type.id, !!checked)}
                          data-testid={`checkbox-type-${type.id}`}
                        />
                        <div className="flex flex-col">
                          <Label htmlFor={`type-${type.id}`} className="text-sm font-medium">{type.label}</Label>
                          <span className="text-xs text-gray-500">{type.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger data-testid="select-difficulty">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject (Optional)</Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g., Biology, History..."
                      data-testid="input-subject"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleGenerate}
                  disabled={generateMutation.isPending || !selectedFile || !title.trim()}
                  className="w-full"
                  data-testid="button-generate"
                >
                  {generateMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating Questions...
                    </>
                  ) : (
                    <>
                      <Bot className="h-4 w-4 mr-2" />
                      Generate Questions
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Review & Edit */}
        {currentStep === 2 && aiResult && (
          <div className="space-y-6">
            {/* Generation Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Generation Complete
                </CardTitle>
                <CardDescription>
                  Generated {parsedQuestions.length} questions in {(aiResult.processingTime / 1000).toFixed(1)} seconds.
                  You can edit the questions below before proceeding.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Editable Aiken Text */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Generated Questions (Aiken Format)
                </CardTitle>
                <CardDescription>
                  Edit the questions directly in Aiken format. Click "Update Questions" to re-parse after making changes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={editableAiken}
                  onChange={(e) => setEditableAiken(e.target.value)}
                  rows={15}
                  className="font-mono text-sm"
                  data-testid="textarea-aiken-text"
                />
                <div className="flex gap-2">
                  <Button onClick={handleUpdateAiken} variant="outline" data-testid="button-update-questions">
                    Update Questions
                  </Button>
                  <Button onClick={handlePreview} data-testid="button-preview">
                    Preview & Download
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Question Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Question Preview ({parsedQuestions.length} questions)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <QuestionPreview 
                    title={title}
                    questions={parsedQuestions}
                    onBack={() => setCurrentStep(1)}
                    onNext={() => setCurrentStep(3)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Preview & Download */}
        {currentStep === 3 && (
          <div className="space-y-6">
            {/* Generate IMSCC Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Generate IMSCC File
                </CardTitle>
                <CardDescription>
                  Create a .imscc file that can be imported directly into Schoology.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="font-medium text-gray-900 mb-2">Quiz Summary</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div><strong>Title:</strong> {title}</div>
                      <div><strong>Questions:</strong> {parsedQuestions.length}</div>
                      <div><strong>Types:</strong> {Array.from(new Set(parsedQuestions.map(q => q.type))).join(', ')}</div>
                    </div>
                  </div>
                  
                  {!zipUrl ? (
                    <Button onClick={generateIMSCC} className="w-full" data-testid="button-generate-imscc">
                      <Download className="h-4 w-4 mr-2" />
                      Generate IMSCC File
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span>IMSCC file generated successfully!</span>
                      </div>
                      <Button asChild className="w-full" data-testid="button-download-imscc">
                        <a href={zipUrl} download={`${title.replace(/[^\w-]/g, '_')}.imscc`}>
                          <Download className="h-4 w-4 mr-2" />
                          Download .imscc File for Schoology
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Import Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>How to Import into Schoology</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
                  <li>Log in to your Schoology account</li>
                  <li>Go to the course where you want to add the quiz</li>
                  <li>Click on "Add Materials" then "Import From Resources"</li>
                  <li>Select "Import from Common Cartridge File"</li>
                  <li>Choose the .imscc file you just downloaded</li>
                  <li>Follow the prompts to complete the import</li>
                </ol>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(2)} data-testid="button-back-to-edit">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Edit
              </Button>
              <Button variant="outline" onClick={() => setCurrentStep(1)} data-testid="button-start-over">
                Start Over
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AIGenerator() {
  return (
    <AccessGate>
      <AIGeneratorContent />
    </AccessGate>
  );
}