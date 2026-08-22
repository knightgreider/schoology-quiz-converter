import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Upload, ImageIcon, Shuffle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import FormatHelp from './FormatHelp';

interface QuizFormProps {
  title: string;
  setTitle: (title: string) => void;
  rawInput: string;
  setRawInput: (input: string) => void;
  error: string;
  onSubmit: () => void;
  onImagesUpdate?: (images: Record<string, string>) => void; // Changed to handle multiple images
  randomizeAllMC?: boolean;
  setRandomizeAllMC?: (randomize: boolean) => void;
}

export default function QuizForm({ 
  title, 
  setTitle, 
  rawInput, 
  setRawInput, 
  error, 
  onSubmit,
  onImagesUpdate,
  randomizeAllMC = false,
  setRandomizeAllMC
}: QuizFormProps) {
  const [showFormatHelp, setShowFormatHelp] = useState(false);
  const [showImageLibrary, setShowImageLibrary] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<Record<string, string>>({}); // imageId -> base64Data
  const [newImageId, setNewImageId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 1MB)
    if (file.size > 1024 * 1024) {
      alert('Image size should be less than 1MB.');
      return;
    }

    const trimmedId = newImageId.trim();
    if (!trimmedId) {
      alert('Please enter an Image ID first (e.g., "photo1", "diagram2")');
      return;
    }

    // Sanitize imageId - only allow alphanumeric, underscore, hyphen (max 50 chars)
    const sanitizedId = trimmedId.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 50);
    if (sanitizedId !== trimmedId) {
      alert('Image ID can only contain letters, numbers, underscores, and hyphens (max 50 characters). Invalid characters will be removed.');
      setNewImageId(sanitizedId);
      return;
    }

    if (sanitizedId.length === 0) {
      alert('Image ID must contain at least one valid character (letters, numbers, _, -).');
      return;
    }

    if (uploadedImages[sanitizedId]) {
      alert(`Image ID "${sanitizedId}" already exists. Choose a different ID.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      const updatedImages = { ...uploadedImages, [sanitizedId]: imageData };
      setUploadedImages(updatedImages);
      setNewImageId(''); // Clear the input
      if (onImagesUpdate) {
        onImagesUpdate(updatedImages);
      }
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageClick = () => {
    const trimmedId = newImageId.trim();
    if (!trimmedId) {
      alert('Please enter an Image ID first (e.g., "photo1", "diagram2")');
      return;
    }

    // Sanitize imageId - only allow alphanumeric, underscore, hyphen (max 50 chars)
    const sanitizedId = trimmedId.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 50);
    if (sanitizedId !== trimmedId) {
      alert('Image ID can only contain letters, numbers, underscores, and hyphens (max 50 characters).');
      setNewImageId(sanitizedId);
      return;
    }

    if (sanitizedId.length === 0) {
      alert('Image ID must contain at least one valid character (letters, numbers, _, -).');
      return;
    }

    fileInputRef.current?.click();
  };

  const deleteImage = (imageId: string) => {
    const updatedImages = { ...uploadedImages };
    delete updatedImages[imageId];
    setUploadedImages(updatedImages);
    if (onImagesUpdate) {
      onImagesUpdate(updatedImages);
    }
  };

  const imageCount = Object.keys(uploadedImages).length;

  return (
    <div className="mt-4 sm:mt-8">
      <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="quiz-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quiz Title</label>
          <div className="mt-1">
            <Input
              id="quiz-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter quiz title"
              className="w-full"
            />
          </div>
          
          {/* Randomization option */}
          {setRandomizeAllMC && (
            <div className="flex items-center space-x-2 mt-2">
              <Switch 
                id="randomize-mc" 
                checked={randomizeAllMC}
                onCheckedChange={setRandomizeAllMC}
              />
              <Label htmlFor="randomize-mc" className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <Shuffle className="h-4 w-4 mr-1 text-primary" />
                Randomize multiple choice answers in Schoology
              </Label>
            </div>
          )}
        </div>
        
        <div>
          <div className="flex justify-between items-center">
            <label htmlFor="question-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Questions (Aiken Format)</label>
            <div className="flex space-x-4">
              <button 
                type="button" 
                className="text-sm text-primary hover:text-primary/90"
                onClick={() => setShowFormatHelp(!showFormatHelp)}
              >
                Format Help
              </button>
              <button 
                type="button" 
                className="flex items-center text-sm text-primary hover:text-primary/90"
                onClick={() => setShowImageLibrary(!showImageLibrary)}
              >
                <ImageIcon className="h-4 w-4 mr-1" />
                Image Library ({imageCount})
              </button>
              <input 
                type="file" 
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>
          <div className="mt-1">
            <Textarea
              id="question-input"
              rows={10}
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="Paste your Aiken format questions here..."
              className="w-full min-h-[200px] sm:min-h-[300px] break-words resize-y font-mono"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Each question block should be separated by a blank line. Use MC:: for multiple choice, TF:: for true/false, MT:: for matching, and ESSAY:: or ES:: for essay questions. Add [IMG] after the question type to include an image.
          </p>
        </div>
        
        {/* Image Library Interface */}
        {showImageLibrary && (
          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Image Library</h3>
            
            {/* Add New Image Section */}
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              <h4 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">Add New Image:</h4>
              <div className="flex gap-2">
                <Input
                  value={newImageId}
                  onChange={(e) => setNewImageId(e.target.value)}
                  placeholder="Enter image ID (e.g., photo1, diagram2)"
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={handleImageClick}
                  size="sm"
                  disabled={!newImageId.trim()}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Upload
                </Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Use descriptive IDs like "photo1", "diagram2", "chart3" - then reference them as MC[IMG:photo1]::
              </p>
            </div>
            
            {/* Existing Images */}
            {imageCount > 0 && (
              <div>
                <h4 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">Uploaded Images ({imageCount}):</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(uploadedImages).map(([imageId, imageData]) => (
                    <div key={imageId} className="relative border border-gray-200 dark:border-gray-600 rounded-md p-2">
                      <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">ID: {imageId}</div>
                      <div className="relative">
                        <img 
                          src={imageData} 
                          alt={`Image ${imageId}`} 
                          className="max-h-24 max-w-full object-contain rounded-md"
                        />
                        <button 
                          type="button"
                          onClick={() => deleteImage(imageId)}
                          className="absolute -top-1 -right-1 bg-red-50 hover:bg-red-100 text-red-500 p-1 rounded-full shadow-sm"
                          title="Delete image"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Use: MC[IMG:{imageId}]::
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {imageCount === 0 && (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No images uploaded yet</p>
              </div>
            )}
          </div>
        )}
        
        {showFormatHelp && <FormatHelp />}
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex justify-end">
          <Button type="submit" className="w-full sm:w-auto inline-flex items-center justify-center">
            Preview Questions
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </form>
    </div>
  );
}
