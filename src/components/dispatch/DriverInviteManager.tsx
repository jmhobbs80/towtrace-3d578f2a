
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export function DriverInviteManager() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const generateInvite = async () => {
    try {
      setLoading(true);
      
      if (!email && !phone) {
        throw new Error("Please provide either an email or phone number");
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No active session");

      const response = await supabase.functions.invoke('driver-invites', {
        method: 'POST',
        body: {
          email,
          phone,
          organization_id: session.user.user_metadata.organization_id,
        },
      });

      if (response.error) throw response.error;

      const inviteUrl = response.data.inviteUrl;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(inviteUrl);
      
      toast.success("Invite link generated and copied to clipboard!", {
        description: "Share this link with your driver to get them started.",
      });

      setEmail("");
      setPhone("");

    } catch (error) {
      console.error("Error generating invite:", error);
      toast.error("Failed to generate invite link", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite New Driver</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Driver's email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="tel"
            placeholder="Driver's phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <Button 
          onClick={generateInvite} 
          disabled={loading || (!email && !phone)}
          className="w-full"
        >
          {loading ? "Generating..." : "Generate Invite Link"}
        </Button>
      </CardContent>
    </Card>
  );
}
