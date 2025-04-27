
import React, { useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Image, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploadProps {
  bucketName: string;
  onImageUploaded: (url: string) => void;
  className?: string;
  currentImageUrl?: string | null;
}

const ImageUpload = ({ bucketName, onImageUploaded, className, currentImageUrl }: ImageUploadProps) => {
  const handleUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Generate unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload the file to Supabase storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      onImageUploaded(publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }, [bucketName, onImageUploaded]);

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {currentImageUrl ? (
        <div className="relative w-32 h-32">
          <img 
            src={currentImageUrl} 
            alt="Uploaded image"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      ) : (
        <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted">
          <Image className="w-8 h-8 text-muted-foreground" />
        </div>
      )}
      
      <Button variant="outline" className="w-full" asChild>
        <label>
          <Upload className="w-4 h-4 mr-2" />
          Upload Image
          <input
            type="file"
            onChange={handleUpload}
            className="hidden"
            accept="image/*"
          />
        </label>
      </Button>
    </div>
  );
};

export default ImageUpload;
