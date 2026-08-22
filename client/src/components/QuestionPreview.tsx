import { Button } from '@/components/ui/button';
import { Question, MatchingQuestion } from '@shared/schema';
import { ImageIcon, Shuffle } from 'lucide-react';

interface QuestionPreviewProps {
  title: string;
  questions: Question[];
  onBack: () => void;
  onNext: () => void;
}

export default function QuestionPreview({ 
  title, 
  questions, 
  onBack, 
  onNext 
}: QuestionPreviewProps) {
  // Helper function to get badge variant based on question type
  const getQuestionTypeBadge = (type: string, hasImage?: boolean, imageId?: string, randomize?: boolean) => {
    let badge;
    
    switch(type) {
      case 'MC':
        badge = <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Multiple Choice</span>;
        break;
      case 'TF':
        badge = <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">True/False</span>;
        break;
      case 'MT':
        badge = <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Matching</span>;
        break;
      case 'ES':
        badge = <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Essay</span>;
        break;
      default:
        badge = <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>;
    }
    
    return (
      <div className="flex items-center">
        {badge}
        {hasImage && (
          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <ImageIcon className="h-3 w-3 mr-1" />
            {imageId ? `Image: ${imageId}` : 'Has Image'}
          </span>
        )}
        {randomize && type === 'MC' && (
          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
            <Shuffle className="h-3 w-3 mr-1" />
            Randomized
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="mt-4 sm:mt-8">
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <div className="border-b border-gray-200 dark:border-gray-600 px-4 py-4 sm:px-6 bg-gray-50 dark:bg-gray-700">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            Quiz Preview: <span className="break-words">{title}</span>
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {questions.length} questions parsed successfully
          </p>
        </div>
        <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-600">
          {questions.map((question, index) => (
            <li key={index} className="px-4 py-4 sm:px-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {index + 1}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white break-words">{question.question}</h4>
                    {getQuestionTypeBadge(question.type, question.hasImage, question.imageId, question.randomize)}
                  </div>
                  
                  {/* Display image if present */}
                  {question.hasImage && question.imageData && (
                    <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
                      <img 
                        src={question.imageData} 
                        alt="Question image" 
                        className="max-h-40 mx-auto object-contain rounded"
                      />
                    </div>
                  )}
                  
                  <div className="mt-2">
                    {question.type === 'ES' ? (
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md border border-gray-200 dark:border-gray-600">
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">Essay Question - Manually graded</p>
                      </div>
                    ) : question.type === 'MT' ? (
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md border border-gray-200 dark:border-gray-600">
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Match the following:</h5>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">ITEMS</p>
                            {(question as MatchingQuestion).choices.map((premise, idx) => (
                              <div key={`premise-${idx}`} className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white break-words">
                                {premise}
                              </div>
                            ))}
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">MATCHES</p>
                            {(question as MatchingQuestion).matchItems?.map((response, idx) => (
                              <div key={`response-${idx}`} className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white break-words">
                                {response}
                              </div>
                            ))}
                            {(question as MatchingQuestion).fillerItems?.map((filler, idx) => (
                              <div key={`filler-${idx}`} className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-700 text-gray-900 dark:text-white break-words">
                                {filler} <span className="text-xs text-red-500">(distractor)</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {question.choices.map((choice, choiceIndex) => (
                          <div key={choiceIndex} className="flex items-center">
                            <div className="flex items-center h-5">
                              <input
                                id={`option-${index}-${choiceIndex}`}
                                name={`question-${index}`}
                                type="radio"
                                className="focus:ring-primary h-4 w-4 text-primary border-gray-300"
                                checked={choiceIndex === question.answer}
                                readOnly
                                disabled
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label
                                htmlFor={`option-${index}-${choiceIndex}`}
                                className={`font-medium break-words ${choiceIndex === question.answer ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}
                              >
                                {choice} {choiceIndex === question.answer && '✓'}
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-6 flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="inline-flex items-center w-full sm:w-auto justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Button>
        <Button 
          onClick={onNext}
          className="inline-flex items-center w-full sm:w-auto justify-center"
        >
          Generate Quiz File
          <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
