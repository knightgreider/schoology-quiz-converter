import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Download, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


interface QuizDownloadProps {
  isProcessing: boolean;
  zipUrl: string;
  fileName: string;
  error: string;
  onReset: () => void;
  title: string;
  questions: any[]; // Using any type for simplicity, this should be Question[]
  randomizeAllMC?: boolean;
  debugXML?: string; // For debugging QTI output
}

export default function QuizDownload({ 
  isProcessing, 
  zipUrl, 
  fileName, 
  error, 
  onReset,
  title,
  questions,
  randomizeAllMC = false,
  debugXML
}: QuizDownloadProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const { toast } = useToast();
  
  // Function to save quiz to the database
  const saveQuizToAccount = async () => {
    try {
      setIsSaving(true);
      
      const response = await fetch("/api/quizzes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          questions,
          randomizeAllMC
        })
      });
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Quiz saved to your account successfully!",
          variant: "default"
        });
      } else {
        const data = await response.json();
        toast({
          title: "Error saving quiz",
          description: data.error || "Failed to save quiz to your account",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error('Error saving quiz:', err);
      toast({
        title: "Error",
        description: "Failed to save quiz. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <div className="mt-4 sm:mt-8 text-center py-4 sm:py-6 px-4">
      {isProcessing && (
        <div>
          <svg className="animate-spin h-10 w-10 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Generating IMS CC Package...</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">This may take a few moments</p>
        </div>
      )}
      
      {!isProcessing && zipUrl && (
        <div>
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Quiz file generated successfully!</h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Your .imscc file is ready to be imported into Schoology</p>
          
          <div className="mt-6">
            <a 
              href={zipUrl} 
              download={fileName}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary w-full sm:w-auto justify-center"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Quiz (.imscc)
            </a>
          </div>
        </div>
      )}
      
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="mt-8 border-t border-gray-200 dark:border-gray-600 pt-6">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white">How to import into Schoology</h4>
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
          <ol className="list-decimal list-inside text-left space-y-2">
            <li>Log in to your Schoology account</li>
            <li>Go to the course where you want to add the quiz</li>
            <li>Click on "Add Materials" then "Import From Resources"</li>
            <li>Select "Import from Common Cartridge File"</li>
            <li>Choose the .imscc file you just downloaded</li>
            <li>Follow the prompts to complete the import</li>
          </ol>
        </div>
        
        {/* Debug section for troubleshooting */}
        {questions.length > 0 && (
          <div className="mt-6 border-t border-gray-200 pt-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowDebug(!showDebug)}
              className="text-xs text-gray-500"
            >
              {showDebug ? 'Hide' : 'Show'} Quiz Debug Info
            </Button>
            
            {showDebug && (
              <div className="mt-4 bg-gray-50 rounded-md p-4 text-left">
                <div className="text-xs text-gray-700 space-y-2">
                  <div><strong>Quiz Title:</strong> {title}</div>
                  <div><strong>Total Questions:</strong> {questions.length}</div>
                  <div><strong>Question Types:</strong></div>
                  <ul className="ml-4 space-y-1">
                    {['MC', 'TF', 'ES', 'MT'].map(type => {
                      const count = questions.filter(q => q.type === type).length;
                      return count > 0 ? <li key={type}>{type}: {count} questions</li> : null;
                    })}
                  </ul>
                  <div><strong>Randomized Questions:</strong> {questions.filter(q => q.randomize).length}</div>
                  <div><strong>Questions with Images:</strong> {questions.filter(q => q.hasImage).length}</div>
                  
                  {questions.length > 25 && (
                    <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded text-yellow-800">
                      <strong>⚠️ Large Quiz Notice:</strong> You have {questions.length} questions. Based on testing, quizzes up to 25 questions work well. If you experience import issues with larger quizzes, consider splitting them into smaller sets.
                    </div>
                  )}
                  
                  {debugXML && (
                    <details className="mt-3">
                      <summary className="cursor-pointer text-blue-600 hover:text-blue-800">View QTI XML Structure</summary>
                      <pre className="mt-2 text-xs bg-white border rounded p-2 overflow-x-auto max-h-40">
                        {debugXML.substring(0, 1000)}...
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-6 flex justify-center space-x-4">
        <Button 
          variant="outline"
          onClick={onReset}
          className="inline-flex items-center"
        >
          Create Another Quiz
        </Button>
        
        {zipUrl && (
          <Button 
            variant="secondary"
            onClick={saveQuizToAccount}
            disabled={isSaving}
            className="inline-flex items-center"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving Quiz...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Save Quiz to Account
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
