import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Shield } from "lucide-react";

// Whitelist of allowed email addresses
const ALLOWED_EMAILS = [
  "rahul.sharma@codesmotech.com",
  "shreya.g@codesmotech.com",
];

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already authenticated (stored in localStorage)
  useEffect(() => {
    const savedAuth = localStorage.getItem('payslip-auth');
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      if (ALLOWED_EMAILS.includes(authData.email)) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('payslip-auth');
      }
    }
    setIsLoading(false);
  }, []);

  const handleAuth = () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!ALLOWED_EMAILS.includes(email.toLowerCase())) {
      setError("Access denied. This email address is not authorized to use this application.");
      return;
    }

    // Save authentication state
    localStorage.setItem('payslip-auth', JSON.stringify({ email: email.toLowerCase() }));
    setIsAuthenticated(true);
    setError("");
  };

  const handleLogout = () => {
    localStorage.removeItem('payslip-auth');
    setIsAuthenticated(false);
    setEmail("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Payslip Generator</CardTitle>
            <p className="text-muted-foreground">
              This application is restricted to authorized personnel only
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="auth-email">Email Address</Label>
              <Input
                id="auth-email"
                type="email"
                placeholder="Enter your authorized email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
                data-testid="input-auth-email"
              />
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handleAuth} 
              className="w-full"
              data-testid="button-authenticate"
            >
              Access Application
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <p>Contact IT support if you need access</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* Logout button in header */}
      <div className="absolute top-4 right-4 no-print">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          data-testid="button-logout"
        >
          Logout
        </Button>
      </div>
      {children}
    </div>
  );
}