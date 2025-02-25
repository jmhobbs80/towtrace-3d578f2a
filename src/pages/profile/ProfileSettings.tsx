
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth/AuthProvider";
import { PersonalInfoSection } from "@/components/auth/PersonalInfoSection";

export default function ProfileSettings() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Profile Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <PersonalInfoSection />
        </CardContent>
      </Card>
    </div>
  );
}
