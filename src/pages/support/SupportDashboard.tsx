
import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SupportDashboard = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Support Dashboard</h1>
      
      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active Tickets</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Active Support Tickets</h2>
            <div className="text-muted-foreground">No active tickets found.</div>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Pending Support Tickets</h2>
            <div className="text-muted-foreground">No pending tickets found.</div>
          </Card>
        </TabsContent>

        <TabsContent value="resolved">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Resolved Support Tickets</h2>
            <div className="text-muted-foreground">No resolved tickets found.</div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupportDashboard;
