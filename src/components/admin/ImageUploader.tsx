import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxFiles?: number;
}

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  preview: string;
  status: 'uploading' | 'completed' | 'error';
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ images, onChange, maxFiles = 5 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (images.length + validFiles.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} images.`);
      return;
    }

    validFiles.forEach(file => {
      const id = Math.random().toString(36).substr(2, 9);
      const preview = URL.createObjectURL(file);
      
      const newFile: UploadingFile = {
        id,
        file,
        progress: 0,
        preview,
        status: 'uploading'
      };

      setUploadingFiles(prev => [...prev, newFile]);

      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploadingFiles(prev => 
            prev.map(f => f.id === id ? { ...f, progress: 100, status: 'completed' } : f)
          );
          
          // After a short delay, move to the main images array
          setTimeout(() => {
            onChange([...images, preview]);
            setUploadingFiles(prev => prev.filter(f => f.id !== id));
          }, 800);
        } else {
          setUploadingFiles(prev => 
            prev.map(f => f.id === id ? { ...f, progress } : f)
          );
        }
      }, 400);
    });
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer flex flex-col items-center justify-center gap-3",
          isDragging 
            ? "border-amber-500 bg-amber-50/50 scale-[1.01]" 
            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          accept="image/*"
          className="hidden"
        />
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
          <Upload className="w-6 h-6" />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-slate-900">Click or drag images here</p>
          <p className="text-xs text-slate-500 mt-1">Supports JPG, PNG, WEBP (Max {maxFiles} images)</p>
        </div>
      </div>

      {/* Progress Section */}
      <AnimatePresence>
        {uploadingFiles.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {uploadingFiles.map((file) => (
              <div key={file.id} className="bg-white border border-slate-100 rounded-xl p-3 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                  <img src={file.preview} alt="preview" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-medium text-slate-700 truncate">{file.file.name}</p>
                    <span className="text-[10px] font-bold text-slate-400">{Math.round(file.progress)}%</span>
                  </div>
                  <Progress value={file.progress} className="h-1.5" />
                </div>
                <div className="w-8 flex items-center justify-center">
                  {file.status === 'uploading' ? (
                    <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Section */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((img, index) => (
          <motion.div
            layout
            key={img}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm"
          >
            <img src={img} alt={`Room ${index}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                variant="destructive"
                size="icon-sm"
                className="rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;