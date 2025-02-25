
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhotoPreview } from "./PhotoPreview";
import { createDamageReport, uploadVehiclePhotos } from "@/lib/api/vehicles";
import type { VehicleDamageSeverity } from "@/lib/types/vehicles";

const formSchema = z.object({
  severity: z.enum(['none', 'minor', 'moderate', 'severe'] as const),
  description: z.string().min(1, "Description is required"),
  repair_estimate: z.number().min(0).optional(),
  damage_locations: z.record(z.any()),
});

interface DamageReportFormProps {
  vehicleId: string;
  onSuccess: () => void;
}

export function DamageReportForm({ vehicleId, onSuccess }: DamageReportFormProps) {
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      severity: 'none',
      description: '',
      damage_locations: {},
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      // Upload photos first
      const photoUrls = photos.length > 0 
        ? await uploadVehiclePhotos(vehicleId, photos)
        : [];

      // Create damage report
      await createDamageReport(vehicleId, {
        severity: values.severity as VehicleDamageSeverity,
        description: values.description,
        repair_estimate: values.repair_estimate,
        damage_locations: values.damage_locations,
        photos: photoUrls,
      });

      onSuccess();
    } catch (error) {
      console.error('Error creating damage report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setPhotos(prev => [...prev, ...files]);
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="severity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Damage Severity</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="minor">Minor</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="severe">Severe</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="repair_estimate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repair Estimate ($)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={e => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Photos</FormLabel>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoUpload}
            className="mt-1"
          />
          <PhotoPreview
            urls={photos.map(file => URL.createObjectURL(file))}
            itemName="damage"
            onRemove={removePhoto}
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          Submit Report
        </Button>
      </form>
    </Form>
  );
}
