
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

export default function ScheduleDemo() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send this to your backend
    console.log({ name, email, company, date });
    
    toast({
      title: "Demo Scheduled!",
      description: "We'll be in touch shortly to confirm your demo time.",
    });

    // Redirect to homepage after successful submission
    setTimeout(() => navigate("/"), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md mx-auto p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Schedule a Demo</h1>
          <p className="mt-2 text-gray-600">
            See how TowTrace can transform your towing operations
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              type="text"
              placeholder="Company Name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>
          <div className="border rounded-md p-4">
            <p className="text-sm text-gray-600 mb-2">Select Preferred Date:</p>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 2))}
              className="rounded-md border"
            />
          </div>
          <Button type="submit" className="w-full">
            Schedule Demo
          </Button>
        </form>
      </Card>
    </div>
  );
}
