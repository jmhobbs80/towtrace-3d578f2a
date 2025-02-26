
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useVehiclePhotos = (vehicleId: string) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadPhoto = async (file: File) => {
    try {
      setIsUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${vehicleId}/${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('vehicle-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('vehicle-photos')
        .getPublicUrl(fileName);

      // Get current photos array first
      const { data: currentVehicle } = await supabase
        .from('inventory_vehicles')
        .select('photos')
        .eq('id', vehicleId)
        .single();

      const updatedPhotos = [...(currentVehicle?.photos || []), data.publicUrl];

      // Update vehicle photos array
      const { error: updateError } = await supabase
        .from('inventory_vehicles')
        .update({
          photos: updatedPhotos
        })
        .eq('id', vehicleId);

      if (updateError) throw updateError;

      toast({
        title: "Photo uploaded",
        description: "Vehicle photo has been successfully uploaded.",
      });

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading the photo.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const deletePhoto = async (photoUrl: string) => {
    try {
      const fileName = photoUrl.split('/').pop();
      if (!fileName) throw new Error('Invalid photo URL');

      await supabase.storage
        .from('vehicle-photos')
        .remove([`${vehicleId}/${fileName}`]);

      // Get current photos array
      const { data: currentVehicle } = await supabase
        .from('inventory_vehicles')
        .select('photos')
        .eq('id', vehicleId)
        .single();

      const updatedPhotos = (currentVehicle?.photos || []).filter(url => url !== photoUrl);

      // Update vehicle photos array
      await supabase
        .from('inventory_vehicles')
        .update({
          photos: updatedPhotos
        })
        .eq('id', vehicleId);

      toast({
        title: "Photo deleted",
        description: "Vehicle photo has been removed.",
      });
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast({
        variant: "destructive",
        title: "Deletion failed",
        description: "There was an error deleting the photo.",
      });
    }
  };

  return {
    isUploading,
    uploadPhoto,
    deletePhoto
  };
};
