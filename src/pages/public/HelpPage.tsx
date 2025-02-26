
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      question: "How do I get started with TowTrace?",
      answer: "Sign up for an account, choose your subscription plan, and follow our quick setup guide to start managing your fleet."
    },
    {
      question: "What types of vehicles can I track?",
      answer: "TowTrace supports all types of vehicles including tow trucks, transport vehicles, and customer vehicles being transported."
    },
    {
      question: "How does the dispatch system work?",
      answer: "Our AI-powered dispatch system automatically assigns jobs to the nearest available driver and optimizes routes for efficiency."
    },
    {
      question: "Can I integrate TowTrace with my existing systems?",
      answer: "Yes, TowTrace offers API access and custom integrations for Enterprise customers."
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Help Center</h1>

      <div className="max-w-xl mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {filteredFaqs.map((faq, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{faq.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{faq.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-12">
        <CardHeader>
          <CardTitle>Still need help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Our support team is available 24/7 to assist you.</p>
          <Button>Contact Support</Button>
        </CardContent>
      </Card>
    </div>
  );
}
