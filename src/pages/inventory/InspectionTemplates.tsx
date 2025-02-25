
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { InspectionTemplateForm } from '@/components/inspection/InspectionTemplateForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { InspectionTemplate } from '@/lib/types/inspection';

export default function InspectionTemplates() {
  const [isOpen, setIsOpen] = useState(false);
  
  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['inspectionTemplates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inspection_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as InspectionTemplate[];
    },
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Inspection Templates</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Inspection Template</DialogTitle>
              <DialogDescription>
                Create a new template for vehicle inspections. Define checklist items and requirements.
              </DialogDescription>
            </DialogHeader>
            <InspectionTemplateForm />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div>Loading templates...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <CardTitle>{template.name}</CardTitle>
                <CardDescription>{template.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  {template.description || 'No description provided'}
                </p>
                <div className="mt-4">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
