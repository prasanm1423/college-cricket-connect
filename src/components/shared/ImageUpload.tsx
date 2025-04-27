
import React, { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Image, Upload, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ImageUploadProps {
  bucketName: string;
  onImageUploaded: (url: string) => void;
  onImageRemoved?: () => void;
  className?: string;
  currentImageUrl?: string | null;
}

const ImageUpload = ({ 
  bucketName, 
  onImageUploaded, 
  onImageRemoved, 
  className, 
  currentImageUrl 
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  const handleUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;
      
      setIsUploading(true);
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      // Generate unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
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
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [bucketName, onImageUploaded, toast]);

  const handleRemove = useCallback(async () => {
    if (!currentImageUrl || !onImageRemoved) return;
    
    try {
      // Extract filename from URL
      const urlParts = currentImageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      // Delete file from storage
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([fileName]);
        
      if (error) throw error;
      
      onImageRemoved();
      
      toast({
        title: "Success",
        description: "Image removed successfully",
      });
    } catch (error) {
      console.error('Error removing image:', error);
      toast({
        title: "Error",
        description: "Failed to remove image",
        variant: "destructive",
      });
    }
  }, [bucketName, currentImageUrl, onImageRemoved, toast]);

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {currentImageUrl ? (
        <div className="relative w-32 h-32 group">
          <img 
            src={currentImageUrl} 
            alt="Uploaded image"
            className="w-full h-full object-cover rounded-lg"
          />
          {onImageRemoved && (
            <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleRemove}
                type="button"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Remove
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted">
          <Image className="w-8 h-8 text-muted-foreground" />
        </div>
      )}
      
      <Button variant="outline" className="w-full" asChild disabled={isUploading}>
        <label className="cursor-pointer">
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? "Uploading..." : "Upload Image"}
          <input
            type="file"
            onChange={handleUpload}
            className="hidden"
            accept="image/*"
            disabled={isUploading}
          />
        </label>
      </Button>
    </div>
  );
};

export default ImageUpload;
