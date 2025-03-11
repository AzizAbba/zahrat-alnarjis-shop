
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { toast } from 'sonner';

interface FileUploaderProps {
  onFileUploaded: (url: string) => void;
}

export const FileUploader = forwardRef<{ openFilePicker: () => void }, FileUploaderProps>(
  ({ onFileUploaded }, ref) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      openFilePicker: () => {
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
      }
    }));

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        // Since we're simulating a file upload in a SPA without a backend,
        // we'll use the data URL directly for demonstration
        // In a real app, this would upload to a server or cloud storage
        onFileUploaded(result);

        // Reset the input so the same file can be selected again
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };
      reader.readAsDataURL(file);
    };

    return (
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
    );
  }
);

FileUploader.displayName = 'FileUploader';
