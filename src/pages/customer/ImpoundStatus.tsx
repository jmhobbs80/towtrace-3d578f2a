
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function ImpoundStatus() {
  const [vin, setVin] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchPerformed(true);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Check Impound Status</h1>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Vehicle Search</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="vin" className="text-sm font-medium">
                Enter VIN Number
              </label>
              <Input
                id="vin"
                placeholder="Enter VIN number"
                value={vin}
                onChange={(e) => setVin(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {searchPerformed && (
        <Card className="max-w-md mx-auto mt-6">
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No vehicle found with the provided VIN number.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
