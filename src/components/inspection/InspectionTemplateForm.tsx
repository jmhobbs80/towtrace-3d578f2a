
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { CreateInspectionTemplateInput } from '@/lib/types/inspection';

const templateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  description: z.string().optional(),
  category: z.enum(['general', 'mechanical', 'body', 'safety']),
  checklist_items: z.array(z.object({
    item_name: z.string(),
    category: z.string(),
    required: z.boolean(),
  })).default([]),
  organization_id: z.string().uuid(),
});

type FormData = z.infer<typeof templateSchema>;

export function InspectionTemplateForm() {
  const queryClient = useQueryClient();

  // Get user's organization ID
  const { data: orgData } = useQuery({
    queryKey: ['userOrganization'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: '',
      description: '',
      category: 'general',
      checklist_items: [],
      organization_id: orgData?.organization_id || '',
    },
  });

  const { mutate: createTemplate, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      const { data: result, error } = await supabase
        .from('inspection_templates')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspectionTemplates'] });
      toast({
        title: "Success",
        description: "Inspection template created successfully",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create template. Please try again.",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    if (!orgData?.organization_id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Organization ID is required",
      });
      return;
    }

    createTemplate({
      ...data,
      organization_id: orgData.organization_id,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter template name..." {...field} />
              </FormControl>
              <FormMessage />
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
                <Textarea 
                  placeholder="Enter template description..." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="general">General Inspection</SelectItem>
                  <SelectItem value="mechanical">Mechanical</SelectItem>
                  <SelectItem value="body">Body & Interior</SelectItem>
                  <SelectItem value="safety">Safety & Emissions</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create Template"}
        </Button>
      </form>
    </Form>
  );
}
