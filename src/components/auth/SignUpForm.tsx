
import { Button } from "@/components/ui/button";
import { NotificationPreferences } from "./NotificationPreferences";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { useSignUpForm } from "@/hooks/use-signup-form";

export function SignUpForm() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phoneNumber,
    setPhoneNumber,
    role,
    setRole,
    loading,
    preferPush,
    setPreferPush,
    preferSMS,
    setPreferSMS,
    companyName,
    setCompanyName,
    handleSubmit
  } = useSignUpForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <NotificationPreferences
        preferPush={preferPush}
        setPreferPush={setPreferPush}
        preferSMS={preferSMS}
        setPreferSMS={setPreferSMS}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
      />

      <Button
        type="submit"
        className="w-full"
        disabled={loading || (!preferPush && !preferSMS)}
      >
        {loading ? "Loading..." : "Create Account"}
      </Button>
    </form>
  );
}
