
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  vehicleId: z.string().uuid(),
  facilityId: z.string().uuid(),
  estimatedCompletionDate: z.string(),
  notes: z.string().optional(),
});

interface RepairOrderFormProps {
  vehicleId: string;
  onSubmit: (data: z.infer<typeof formSchema>) => Promise<void>;
  onCancel?: () => void;
}

export function RepairOrderForm({ vehicleId, onSubmit, onCancel }: RepairOrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: facilities } = useQuery({
    queryKey: ['repair-facilities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('repair_facilities')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleId,
      notes: '',
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      await onSubmit(values);
    } catch (error) {
      console.error('Error creating repair order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField 
          control={form.control}
          name="facilityId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repair Facility</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select facility" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {facilities?.map(facility => (
                    <SelectItem key={facility.id} value={facility.id}>
                      {facility.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="estimatedCompletionDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated Completion Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            Create Repair Order
          </Button>
        </div>
      </form>
    </Form>
  );
}
