import { useState } from 'react';
import JSZip from 'jszip';
import { Question, MatchingQuestion, ChoiceQuestion, EssayQuestion } from '@shared/schema';
import { parseRawInput } from '@shared/parse';
import QuizForm from './QuizForm';
import QuestionPreview from './QuestionPreview';
import QuizDownload from './QuizDownload';
import { Card, CardContent } from '@/components/ui/card';

export default function QTIQuizGenerator() {
  const [title, setTitle] = useState('');
  const [rawInput, setRawInput] = useState('');
  const [zipUrl, setZipUrl] = useState('');
  const [parsedQuestions, setParsedQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<Record<string, string>>({});
  const [randomizeAllMC, setRandomizeAllMC] = useState(false);

  // Compute safe filename based on title
  const safeTitle = title ? title.replace(/[^\w-]/g, '_') : 'quiz';


  const validateQuizData = (): boolean => {
    if (!title.trim()) {
      setError('Please provide a quiz title.');
      return false;
    }
    if (!rawInput.trim()) {
      setError('Please paste quiz questions.');
      return false;
    }
    
    // Parse questions from the input text
    const questions = parseRawInput(rawInput);
    if (!questions.length) {
      setError('No valid questions parsed. Please check the format.');
      return false;
    }
    
    // Process questions - handle images and randomization
    let processedQuestions = [...questions];
    
    // Apply global randomization setting if turned on
    if (randomizeAllMC) {
      processedQuestions = processedQuestions.map(q => {
        // Only apply to multiple choice questions
        if (q.type === 'MC') {
          return {
            ...q,
            randomize: true
          };
        }
        return q;
      });
    }
    
    // Find questions that need images and add the appropriate image data
    const imageIds = Object.keys(uploadedImages);
    
    // Check for questions with [IMG] but no imageId first (legacy format)
    const invalidImageQuestions = processedQuestions.filter(q => q.hasImage && !q.imageId);
    if (invalidImageQuestions.length > 0) {
      const questionTitles = invalidImageQuestions.map(q => `"${q.question}"`).join(', ');
      setError(`Questions ${questionTitles} use [IMG] but no specific image ID. Use [IMG:imageId] format, e.g., MC[IMG:photo1]::`);
      return false;
    }
    
    if (imageIds.length > 0) {
      let imageAdded = false;
      
      // Add image data to questions that have hasImage flag and imageId
      processedQuestions = processedQuestions.map(q => {
        if (q.hasImage && q.imageId && uploadedImages[q.imageId]) {
          imageAdded = true;
          return {
            ...q,
            imageData: uploadedImages[q.imageId]
          };
        }
        return q;
      });
      
      // Check if any uploaded images are not being used - warn but don't fail
      const usedImageIds = processedQuestions
        .filter(q => q.hasImage && q.imageId)
        .map(q => q.imageId);
      const unusedImages = imageIds.filter(id => !usedImageIds.includes(id));
      
      if (unusedImages.length > 0) {
        console.warn(`Uploaded images not used: ${unusedImages.join(', ')}`);
        // Don't fail validation - just warn in console
      }
      
      // If no questions use any images, warn but don't fail
      if (!imageAdded) {
        console.warn('Images uploaded but no questions reference them.');
        // Don't fail validation - user might want to add image references later
      }
    } else {
      // Check if any questions expect images but none were uploaded
      const questionsNeedingImages = processedQuestions.filter(q => q.hasImage);
      if (questionsNeedingImages.length > 0) {
        const questionTitles = questionsNeedingImages.map(q => `"${q.question}"`).join(', ');
        setError(`Questions ${questionTitles} are marked with [IMG] tags but no images were uploaded. Please upload images or remove the [IMG] tags.`);
        return false;
      }
    }
    
    setParsedQuestions(processedQuestions);
    setError('');
    return true;
  };

  const handlePreview = () => {
    if (validateQuizData()) {
      setCurrentStep(2);
    }
  };

  const generateIMSCC = async () => {
    try {
      setIsProcessing(true);
      setError('');
      
      if (!parsedQuestions.length) {
        throw new Error('No questions to process');
      }

      const zip = new JSZip();
      const resourceId = 'ccres' + Math.random().toString(36).substring(2, 10);

      // Create folder and QTI XML
      const folder = zip.folder(resourceId);
      if (!folder) throw new Error('Failed to create folder in zip');
      
      // Track image IDs for embedding in questions - use the actual imageId from questions
      const imageMap = new Map(); // maps question index to imageId
      const usedImages = new Set(); // tracks which imageIds are actually used
      let imageCounter = 0;
      
      // Add images if needed - only add images that are actually used by questions
      parsedQuestions.forEach((q, i) => {
        if (q.hasImage && q.imageData && q.imageId) {
          const imageId = q.imageId;
          imageMap.set(i, imageId);
          
          // Only add each unique image once (in case multiple questions use the same image)
          if (!usedImages.has(imageId)) {
            usedImages.add(imageId);
            
            // Extract base64 data - assumes format is data:image/jpeg;base64,XXXXX
            const matches = q.imageData.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
              const imageType = matches[1];
              const imageData = matches[2];
              folder.file(`${imageId}.${imageType}`, imageData, { base64: true });
              imageCounter++;
            }
          }
        }
      });
      
      const itemsXML = parsedQuestions.map((q, i) => {
        const id = i + 1;
        
        // Generate metadata section with proper Schoology-compatible fields
        // Include shuffle_answers metadata for LMS compatibility
        const shuffleMetadata = (q.type === 'MC' && q.randomize) ? `
            <qtimetadatafield>
              <fieldlabel>shuffle_answers</fieldlabel>
              <fieldentry>true</fieldentry>
            </qtimetadatafield>` : '';
        
        let metaFields = '';
        if (q.type === 'MT') {
          metaFields = `
            <qtimetadatafield>
              <fieldlabel>question_type</fieldlabel>
              <fieldentry>matching_question</fieldentry>
            </qtimetadatafield>
            <qtimetadatafield>
              <fieldlabel>points_possible</fieldlabel>
              <fieldentry>1</fieldentry>
            </qtimetadatafield>`;
        } else {
          const ccProfile = q.type === 'ES' ? 'cc.essay.v0p1' : q.type === 'TF' ? 'cc.true_false.v0p1' : 'cc.multiple_choice.v0p1';
          const questionType = q.type === 'ES' ? 'essay_question' : q.type === 'TF' ? 'true_false_question' : 'multiple_choice_question';
          metaFields = `
            <qtimetadatafield>
              <fieldlabel>cc_profile</fieldlabel>
              <fieldentry>${ccProfile}</fieldentry>
            </qtimetadatafield>
            <qtimetadatafield>
              <fieldlabel>question_type</fieldlabel>
              <fieldentry>${questionType}</fieldentry>
            </qtimetadatafield>
            <qtimetadatafield>
              <fieldlabel>points_possible</fieldlabel>
              <fieldentry>1</fieldentry>
            </qtimetadatafield>${shuffleMetadata}
            ${q.type==='ES'?'<qtimetadatafield><fieldlabel>qmd_computerscored</fieldlabel><fieldentry>No</fieldentry></qtimetadatafield>':''}`;
        }
        const meta = `<itemmetadata>
          <qtimetadata>${metaFields}
          </qtimetadata>
        </itemmetadata>`;
        
        // Begin presentation section
        let questionText = q.question;
        
        // Add image reference if this question has an image
        if (q.hasImage && q.imageData && q.imageId && imageMap.has(i)) {
          const imageId = imageMap.get(i);
          const imageExt = q.imageData.match(/^data:image\/([a-zA-Z]+);base64,/)?.[1] || 'jpeg';
          questionText += `<br/><img src="${imageId}.${imageExt}" alt="Question Image"/>`;
        }
        
        let pres = `<presentation><material><mattext texttype="text/html">${questionText}</mattext></material>`;
        
        // Handle different question types
        if (q.type === 'MT') {
          const matchingQuestion = q as MatchingQuestion;
          
          // Collect all unique right-side items (match targets + fillers)
          const allRightSideItems = [...(matchingQuestion.matchItems || [])];
          if (matchingQuestion.fillerItems && matchingQuestion.fillerItems.length > 0) {
            allRightSideItems.push(...matchingQuestion.fillerItems);
          }
          
          // Each left-side premise gets its own response_lid with ALL right-side options
          matchingQuestion.choices.forEach((premise, j) => {
            pres += `<response_lid ident="response_${j}" rcardinality="Single">`;
            pres += `<material><mattext texttype="text/plain">${premise}</mattext></material>`;
            pres += `<render_choice>`;
            allRightSideItems.forEach((response, k) => {
              pres += `<response_label ident="choice_${k}"><material><mattext texttype="text/plain">${response}</mattext></material></response_label>`;
            });
            pres += `</render_choice></response_lid>`;
          });
        } else if (q.choices.length) {
          // Multiple choice and True/False questions
          // If randomization is enabled, shuffle the choices and update the correct answer index
          let choices = [...q.choices];
          let correctAnswerIndex = q.answer;
          
          if (q.randomize && q.type === 'MC') {
            // Create array of indices and shuffle them
            const indices = choices.map((_, idx) => idx);
            for (let k = indices.length - 1; k > 0; k--) {
              const j = Math.floor(Math.random() * (k + 1));
              [indices[k], indices[j]] = [indices[j], indices[k]];
            }
            // Reorder choices based on shuffled indices
            choices = indices.map(idx => q.choices[idx]);
            // Find new position of the correct answer
            correctAnswerIndex = indices.indexOf(q.answer);
          }
          
          // Store the shuffled correct answer index for use in response processing
          (q as any)._shuffledAnswer = correctAnswerIndex;
          
          pres += `<response_lid ident="response1" rcardinality="Single"><render_choice>` +
            choices.map((c, j) => `<response_label ident="choice${j}"><material><mattext texttype="text/plain">${c}</mattext></material></response_label>`).join('') +
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
          const matchingQuestion = q as MatchingQuestion;
          const count = matchingQuestion.choices.length;
          const basePoints = Math.floor(100 / count);
          const remainder = 100 - (basePoints * count);
          
          // Each left-side item (response_lid) maps to its correct right-side choice
          matchingQuestion.choices.forEach((_, idx) => {
            const correctChoiceIdx = matchingQuestion.answer[idx];
            const points = idx === count - 1 ? basePoints + remainder : basePoints;
            proc += `
            <respcondition>
              <conditionvar>
                <varequal respident="response_${idx}">choice_${correctChoiceIdx}</varequal>
              </conditionvar>
              <setvar action="Add" varname="SCORE">${points}</setvar>
            </respcondition>`;
          });
        } else if (q.choices.length) {
          // Single answer questions - use shuffled answer index if available
          const answerIndex = (q as any)._shuffledAnswer !== undefined ? (q as any)._shuffledAnswer : q.answer;
          proc += `
          <respcondition continue="No">
            <conditionvar>
              <varequal respident="response1">choice${answerIndex}</varequal>
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
        
        return `<item ident="item_${id}" title="${cleanTitle}">${meta}${pres}${proc}</item>`;
      }).join('');

      const qti = `<?xml version="1.0" encoding="UTF-8"?>
<questestinterop xmlns="http://www.imsglobal.org/xsd/ims_qtiasiv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/ims_qtiasiv1p2 http://www.imsglobal.org/xsd/ims_qtiasiv1p2p1.xsd">
  <assessment ident="${resourceId}" title="${title}">
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
      
      // If we have images, add them to the manifest - only add each unique image once
      if (imageCounter > 0) {
        usedImages.forEach(imageId => {
          // Find a question that uses this image to get the image type
          const questionWithImage = parsedQuestions.find(q => 
            q.hasImage && q.imageData && q.imageId === imageId
          );
          if (questionWithImage && questionWithImage.imageData) {
            const imageExt = questionWithImage.imageData.match(/^data:image\/([a-zA-Z]+);base64,/)?.[1] || 'jpeg';
            imageFileEntries += `\n      <file href="${resourceId}/${imageId}.${imageExt}"/>`;
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
          <lom:string>${title}</lom:string>
        </lom:title>
      </lom:general>
    </lom:lom>
  </metadata>
  <organizations>
    <organization identifier="org_1" structure="rooted-hierarchy">
      <item identifier="LearningModules">
        <title>Learning Modules</title>
        <item identifier="m_${resourceId}" identifierref="res_${resourceId}">
          <title>${title}</title>
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
      setCurrentStep(3);
    } catch (err) {
      console.error(err);
      setError(`Error generating quiz file: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      handlePreview();
    } else if (currentStep === 2) {
      generateIMSCC();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    if (zipUrl) {
      URL.revokeObjectURL(zipUrl);
    }
    setTitle('');
    setRawInput('');
    setZipUrl('');
    setParsedQuestions([]);
    setCurrentStep(1);
    setError('');
  };

  return (
    <Card className="bg-white shadow-sm rounded-lg overflow-hidden">
      <CardContent className="px-4 py-5 sm:p-6">
        <h2 className="text-lg font-medium text-gray-900">Convert Aiken Format Questions to IMS Common Cartridge (.imscc)</h2>
        <p className="mt-1 text-sm text-gray-500">
          Create Schoology-compatible quiz files from simple text-based question formats.
        </p>
        
        {/* Step Indicator */}
        <div className="mt-6">
          <nav aria-label="Progress">
            <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
              <li className="md:flex-1">
                <button 
                  onClick={() => setCurrentStep(1)}
                  className={`group pl-4 py-2 flex flex-col border-l-4 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4 
                    ${currentStep === 1 ? 'border-primary hover:border-primary/90' : 'border-gray-200 hover:border-gray-300'} 
                    md:w-full`}
                >
                  <span className={`text-xs ${currentStep === 1 ? 'text-primary' : 'text-gray-500'} font-semibold tracking-wide uppercase group-hover:text-primary`}>
                    Step 1
                  </span>
                  <span className="text-sm font-medium">Quiz Information</span>
                </button>
              </li>
              <li className="md:flex-1">
                <button 
                  onClick={() => currentStep > 1 && setCurrentStep(2)}
                  className={`group pl-4 py-2 flex flex-col border-l-4 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4 
                    ${currentStep === 2 ? 'border-primary hover:border-primary/90' : 'border-gray-200 hover:border-gray-300'} 
                    md:w-full ${currentStep < 2 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={currentStep < 2}
                >
                  <span className={`text-xs ${currentStep === 2 ? 'text-primary' : 'text-gray-500'} font-semibold tracking-wide uppercase group-hover:text-primary`}>
                    Step 2
                  </span>
                  <span className="text-sm font-medium">Preview Questions</span>
                </button>
              </li>
              <li className="md:flex-1">
                <button 
                  onClick={() => currentStep > 2 && setCurrentStep(3)}
                  className={`group pl-4 py-2 flex flex-col border-l-4 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4 
                    ${currentStep === 3 ? 'border-primary hover:border-primary/90' : 'border-gray-200 hover:border-gray-300'} 
                    md:w-full ${currentStep < 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={currentStep < 3}
                >
                  <span className={`text-xs ${currentStep === 3 ? 'text-primary' : 'text-gray-500'} font-semibold tracking-wide uppercase group-hover:text-primary`}>
                    Step 3
                  </span>
                  <span className="text-sm font-medium">Generate & Download</span>
                </button>
              </li>
            </ol>
          </nav>
        </div>
        
        {/* Form Content based on current step */}
        {currentStep === 1 && (
          <QuizForm 
            title={title}
            setTitle={setTitle}
            rawInput={rawInput}
            setRawInput={setRawInput}
            error={error}
            onSubmit={handleNext}
            onImagesUpdate={(images: Record<string, string>) => setUploadedImages(images)}
            randomizeAllMC={randomizeAllMC}
            setRandomizeAllMC={setRandomizeAllMC}
          />
        )}
        
        {currentStep === 2 && (
          <QuestionPreview 
            title={title}
            questions={parsedQuestions}
            onBack={handleBack}
            onNext={handleNext}
          />
        )}
        
        {currentStep === 3 && (
          <QuizDownload 
            isProcessing={isProcessing}
            zipUrl={zipUrl}
            fileName={`${safeTitle}.imscc`}
            error={error}
            onReset={handleReset}
            title={title}
            questions={parsedQuestions}
            randomizeAllMC={randomizeAllMC}
          />
        )}
      </CardContent>
    </Card>
  );
}
