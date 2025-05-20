
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EmailVerificationAlertProps {
  email?: string | null;
}

const EmailVerificationAlert = ({ email }: EmailVerificationAlertProps) => {
  const { toast } = useToast();
  
  const handleResendEmail = async () => {
    if (!email) return;
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) throw error;
      
      toast({
        title: "Verification email sent",
        description: "Please check your inbox for the verification link.",
      });
    } catch (error) {
      console.error("Error sending verification email:", error);
      toast({
        title: "Failed to send verification email",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Alert variant="destructive" className="mb-6 flex items-center justify-between">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 mt-0.5" />
        <div>
          <AlertTitle>Email verification required</AlertTitle>
          <AlertDescription className="mt-2">
            Please verify your email address to access all features. 
            {email && ` We've sent a verification link to ${email}.`}
          </AlertDescription>
        </div>
      </div>
      <Button 
        variant="outline"
        size="sm"
        onClick={handleResendEmail}
        className="whitespace-nowrap flex gap-2 bg-white"
      >
        <Mail className="h-4 w-4" />
        Resend Email
      </Button>
    </Alert>
  );
};

export default EmailVerificationAlert;
