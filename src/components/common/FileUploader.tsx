
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploaderProps {
  onFileUploaded: (url: string) => void;
  showUploadButton?: boolean;
  className?: string;
}

export interface FileUploaderRef {
  openFilePicker: () => void;
}

export const FileUploader = forwardRef<FileUploaderRef, FileUploaderProps>(
  ({ onFileUploaded, showUploadButton = false, className = '' }, ref) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

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

      setUploading(true);
      toast.info('Processing image...');

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        // Since we're simulating a file upload in a SPA without a backend,
        // we'll use the data URL directly for demonstration
        // In a real app, this would upload to a server or cloud storage
        onFileUploaded(result);
        toast.success('Image uploaded successfully');
        setUploading(false);

        // Reset the input so the same file can be selected again
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };
      reader.onerror = () => {
        toast.error('Error reading file');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    };

    return (
      <div className={className}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
        
        {showUploadButton && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2"
          >
            {uploading ? 'Uploading...' : (
              <>
                <Upload size={16} />
                <span className="arabic">اختر صورة</span>
              </>
            )}
          </Button>
        )}
      </div>
    );
  }
);

FileUploader.displayName = 'FileUploader';

// Create a reusable ImageUploader component that combines an image preview with the uploader
export const ImageUploader: React.FC<{
  imageUrl: string;
  onImageUploaded: (url: string) => void;
  placeholder?: string;
  className?: string;
}> = ({ imageUrl, onImageUploaded, placeholder = '/placeholder.svg', className = '' }) => {
  const fileUploaderRef = useRef<FileUploaderRef>(null);

  return (
    <div className={`relative border rounded-md overflow-hidden ${className}`}>
      <img 
        src={imageUrl || placeholder} 
        alt="Preview" 
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = placeholder;
        }}
      />
      
      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-white/90 hover:bg-white"
          onClick={() => fileUploaderRef.current?.openFilePicker()}
        >
          <ImageIcon size={16} className="mr-2" />
          <span className="arabic">تغيير الصورة</span>
        </Button>
      </div>
      
      <FileUploader 
        ref={fileUploaderRef}
        onFileUploaded={onImageUploaded}
      />
    </div>
  );
};
