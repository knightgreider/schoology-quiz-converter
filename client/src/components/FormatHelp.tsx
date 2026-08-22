import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export default function FormatHelp() {
  return (
    <Alert className="bg-blue-50 p-4 rounded-md" variant="default">
      <InfoIcon className="h-5 w-5 text-blue-400" />
      <AlertTitle className="text-sm font-medium text-blue-800">Question Format Examples</AlertTitle>
      <AlertDescription>
        <div className="mt-2 text-sm text-blue-700 font-mono">
          <p className="font-semibold mt-2">Multiple Choice:</p>
          <pre className="bg-blue-100/50 p-2 rounded">
{`MC:: What is the capital of France?
~Berlin
~Madrid
*~Paris
~Rome`}
          </pre>
          
          <p className="font-semibold mt-2">Multiple Choice with Randomization:</p>
          <pre className="bg-blue-100/50 p-2 rounded">
{`MC[RAND]:: Which of these is a mammal?
~Shark
~Lizard
*~Dolphin
~Turtle`}
          </pre>
          
          <p className="font-semibold mt-2">True/False:</p>
          <pre className="bg-blue-100/50 p-2 rounded">
{`TF:: The Earth is flat.
~True
*~False`}
          </pre>
          
          <p className="font-semibold mt-2">Essay:</p>
          <pre className="bg-blue-100/50 p-2 rounded">
{`ESSAY:: Explain the water cycle.
or
ES:: Describe photosynthesis.`}
          </pre>
          
          <p className="font-semibold mt-2">Matching:</p>
          <pre className="bg-blue-100/50 p-2 rounded">
{`MT:: Match the countries with their capitals.
~France => Paris
~Germany => Berlin
~Spain => Madrid
~Italy => Rome`}
          </pre>
          
          <p className="font-semibold mt-2">Including Images:</p>
          <pre className="bg-blue-100/50 p-2 rounded">
{`MC[IMG]:: What animal is shown in this image?
~Elephant
~Lion
*~Tiger
~Bear`}
          </pre>
          
          <p className="mt-2 text-xs">
            <strong>Notes:</strong><br/>
            • Use * to mark correct answers for multiple choice.<br/>
            • For matching questions, use =&gt; to connect items.<br/>
            • Include [IMG] after the question type to indicate an image.<br/>
            • Add [RAND] after question type to randomize multiple choice answers.<br/>
            • Separate questions with blank lines.
          </p>
        </div>
      </AlertDescription>
    </Alert>
  );
}
