
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  onFileUploaded: (url: string) => void;
  showUploadButton?: boolean;
  className?: string;
  accept?: string;
  maxSize?: number; // size in MB
}

export interface FileUploaderRef {
  openFilePicker: () => void;
}

export const FileUploader = forwardRef<FileUploaderRef, FileUploaderProps>(
  ({ 
    onFileUploaded, 
    showUploadButton = false, 
    className = '', 
    accept = 'image/*',
    maxSize = 5 // 5MB default
  }, ref) => {
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

      // Check if file type is accepted
      if (accept !== '*' && !file.type.match(accept.replace('*', '.*'))) {
        toast.error(`يرجى اختيار ملف ${accept.includes('image') ? 'صورة' : 'مدعوم'}`);
        return;
      }

      // Validate file size (maxSize in MB)
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`حجم الملف يجب أن يكون أقل من ${maxSize} ميجابايت`);
        return;
      }

      setUploading(true);
      toast.info('جاري معالجة الملف...');

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        // Since we're simulating a file upload in a SPA without a backend,
        // we'll use the data URL directly for demonstration
        // In a real app, this would upload to a server or cloud storage
        onFileUploaded(result);
        toast.success('تم تحميل الملف بنجاح');
        setUploading(false);

        // Reset the input so the same file can be selected again
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };
      reader.onerror = () => {
        toast.error('حدث خطأ أثناء قراءة الملف');
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
          accept={accept}
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
            {uploading ? 'جاري التحميل...' : (
              <>
                <Upload size={16} />
                <span className="arabic">اختر ملفاً</span>
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
  const [previewUrl, setPreviewUrl] = useState(imageUrl || placeholder);
  const [loading, setLoading] = useState(false);

  // Update preview when imageUrl changes
  React.useEffect(() => {
    setPreviewUrl(imageUrl || placeholder);
  }, [imageUrl, placeholder]);

  const handleImageUploaded = (url: string) => {
    setPreviewUrl(url);
    onImageUploaded(url);
    setLoading(false);
  };

  return (
    <div className={cn("relative border rounded-md overflow-hidden", className)}>
      <img 
        src={previewUrl} 
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
          onClick={() => {
            setLoading(true);
            fileUploaderRef.current?.openFilePicker();
          }}
          disabled={loading}
        >
          {loading ? (
            <span className="arabic">جاري التحميل...</span>
          ) : (
            <>
              <ImageIcon size={16} className="mr-2" />
              <span className="arabic">تغيير الصورة</span>
            </>
          )}
        </Button>
      </div>
      
      <FileUploader 
        ref={fileUploaderRef}
        onFileUploaded={handleImageUploaded}
        accept="image/*"
        maxSize={2} // 2MB max
      />
    </div>
  );
};
