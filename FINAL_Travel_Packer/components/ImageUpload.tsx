"use client";

import { useState } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  onUpload: (image: File) => Promise<void>;
  packingList: Array<{
    item: string;
    category: string;
    essential: boolean;
    quantity: number;
    reason: string;
  }>;
  detectedObjects: Array<{
    label: string;
    score: number;
  }>;
}

export default function ImageUpload({ onUpload, packingList, detectedObjects }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(file));
      setIsLoading(true);
      try {
        await onUpload(file);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreview(URL.createObjectURL(file));
      setIsLoading(true);
      try {
        await onUpload(file);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer block"
        >
          <div className="text-gray-500 mb-2">
            {isLoading ? 'Analyzing...' : 'Drag and drop an image here, or click to select'}
          </div>
        </label>
      </div>

      {preview && (
        <div className="space-y-4">
          <div className="relative w-full aspect-video">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-contain rounded-lg"
            />
          </div>
          
          {detectedObjects.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Detected Objects
              </h3>
              <div className="space-y-2">
                {detectedObjects.map((obj, index) => (
                  <div 
                    key={index}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-gray-700 dark:text-gray-300">{obj.label}</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {(obj.score * 100).toFixed(1)}% confidence
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 