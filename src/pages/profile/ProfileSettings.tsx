
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { PersonalInfoSection } from "@/components/auth/PersonalInfoSection";
import { TwoFactorManager } from "@/components/auth/TwoFactorManager";
import type { UserRole } from "@/lib/types/auth";

export default function ProfileSettings() {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("provider");
  const [companyName, setCompanyName] = useState("");

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Profile Settings</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <PersonalInfoSection
              firstName={firstName}
              setFirstName={setFirstName}
              lastName={lastName}
              setLastName={setLastName}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              role={role}
              setRole={setRole}
              companyName={companyName}
              setCompanyName={setCompanyName}
            />
          </CardContent>
        </Card>

        <TwoFactorManager />
      </div>
    </div>
  );
}
