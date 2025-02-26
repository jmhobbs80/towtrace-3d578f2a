
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function ServerError() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">500 - Server Error</h1>
        <p className="mb-8 text-muted-foreground">
          Something went wrong on our end. Please try again later.
        </p>
        <Button onClick={() => navigate("/")}>Return Home</Button>
      </div>
    </div>
  );
}
