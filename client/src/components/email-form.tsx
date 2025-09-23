import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const emailFormSchema = z.object({
  from: z.string().email("Please enter a valid email address"),
  to: z.string().email("Please enter a valid email address"),
  cc: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().optional(),
});

type EmailFormData = z.infer<typeof emailFormSchema>;

interface EmailFormProps {
  onSendEmail: (emailData: EmailFormData, pdfBlob: Blob) => Promise<void>;
  employeeName: string;
  payPeriod: string;
  onGeneratePDFBlob: () => Promise<Blob>;
}

export function EmailForm({ onSendEmail, employeeName, payPeriod, onGeneratePDFBlob }: EmailFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      from: "",
      to: "",
      cc: "",
      subject: `Payslip for ${employeeName} - ${payPeriod}`,
      message: `Dear ${employeeName},

Please find attached your payslip for ${payPeriod}.

Best regards,
HR Department`,
    },
  });

  // Update subject when employee name or pay period changes
  const currentSubject = form.watch("subject");
  useEffect(() => {
    if (employeeName && payPeriod) {
      const newSubject = `Payslip for ${employeeName} - ${payPeriod}`;
      if (currentSubject !== newSubject) {
        form.setValue("subject", newSubject);
      }
    }
  }, [employeeName, payPeriod, form, currentSubject]);

  const handleSendEmail = async (data: EmailFormData) => {
    setIsLoading(true);
    try {
      // Generate PDF blob
      const pdfBlob = await onGeneratePDFBlob();
      
      // Send email with attachment
      await onSendEmail(data, pdfBlob);
      
      toast({
        title: "Email Sent Successfully",
        description: `Payslip has been sent to ${data.to}`,
      });
      
      form.reset();
    } catch (error) {
      console.error('Email sending failed:', error);
      toast({
        title: "Email Failed",
        description: "There was an error sending the email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Send Payslip via Email
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSendEmail)} className="space-y-4">
          {/* From Email */}
          <div>
            <Label htmlFor="from">From Email</Label>
            <Input
              id="from"
              type="email"
              placeholder="sender@company.com"
              {...form.register("from")}
              data-testid="input-email-from"
            />
            {form.formState.errors.from && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.from.message}</p>
            )}
          </div>

          {/* To Email */}
          <div>
            <Label htmlFor="to">To Email</Label>
            <Input
              id="to"
              type="email"
              placeholder="employee@example.com"
              {...form.register("to")}
              data-testid="input-email-to"
            />
            {form.formState.errors.to && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.to.message}</p>
            )}
          </div>

          {/* CC Email */}
          <div>
            <Label htmlFor="cc">CC (Optional)</Label>
            <Input
              id="cc"
              type="email"
              placeholder="hr@company.com"
              {...form.register("cc")}
              data-testid="input-email-cc"
            />
            {form.formState.errors.cc && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.cc.message}</p>
            )}
          </div>

          {/* Subject */}
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              {...form.register("subject")}
              data-testid="input-email-subject"
            />
            {form.formState.errors.subject && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.subject.message}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              rows={6}
              placeholder="Add a personal message..."
              {...form.register("message")}
              data-testid="textarea-email-message"
            />
          </div>

          {/* Send Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
            data-testid="button-send-email"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending Email...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Payslip via Email
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}