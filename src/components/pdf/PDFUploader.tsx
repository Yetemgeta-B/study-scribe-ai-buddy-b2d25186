import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, File, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner'; 
import PDFViewer from './PDFViewer';

const ALLOWED_TYPES = ['application/pdf'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface PDFUploaderProps {
  onUploadComplete?: (file: File) => void;
}

const PDFUploader: React.FC<PDFUploaderProps> = ({ onUploadComplete }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Please upload a PDF file');
      toast.error('Please upload a PDF file');
      return;
    }
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size exceeds maximum limit (${MAX_FILE_SIZE / (1024 * 1024)}MB)`);
      toast.error(`File size exceeds maximum limit (${MAX_FILE_SIZE / (1024 * 1024)}MB)`);
      return;
    }
    
    // Clear any previous errors
    setError(null);
    
    // Set the uploaded file and create a URL for it
    setUploadedFile(file);
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    
    // Notify parent component if callback exists
    if (onUploadComplete) {
      onUploadComplete(file);
      toast.success('PDF uploaded successfully');
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };
  
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleRemoveFile = () => {
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }
    setUploadedFile(null);
    setFileUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence>
        {!uploadedFile ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card 
              className={`border-2 border-dashed p-6 ${
                isDragging ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClick}
            >
              <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                <div className="rounded-full bg-primary/10 p-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-1">Upload PDF Document</h3>
                  <p className="text-muted-foreground text-sm max-w-md">
                    Drag and drop your PDF here, or click to browse your files
                  </p>
                  <p className="text-muted-foreground text-xs mt-2">
                    Maximum file size: {MAX_FILE_SIZE / (1024 * 1024)}MB
                  </p>
                </div>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e.target.files)}
                />
                
                <Button variant="outline" className="gap-2">
                  <File className="h-4 w-4" />
                  Browse Files
                </Button>
                
                {error && (
                  <div className="flex items-center text-destructive gap-2 mt-2 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <File className="h-5 w-5 text-primary" />
                <span className="font-medium truncate max-w-md">
                  {uploadedFile.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({(uploadedFile.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRemoveFile}
              >
                Change File
              </Button>
            </div>
            
            {fileUrl && (
              <PDFViewer file={fileUrl} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PDFUploader;
