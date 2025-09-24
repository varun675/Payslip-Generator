import { useState, useEffect } from "react";
import { PayslipForm } from "@/components/payslip-form";
import { PayslipPreview } from "@/components/payslip-preview";
import { EmailForm } from "@/components/email-form";
import { generatePayslipPDF, generatePayslipPDFBlob } from "@/lib/pdf-generator";
// Import will be handled dynamically in the function
import { useToast } from "@/hooks/use-toast";
import { EarningDeduction } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PayslipData {
  companyName: string;
  payPeriod: string;
  employeeName: string;
  employeeNo: string;
  designation: string;
  bankAccount: string;
  dateOfJoining: string;
  totalWorkingDays: number;
  paidDays: number;
  lopDays: number;
  earnings: EarningDeduction[];
  deductions: EarningDeduction[];
}

export default function PayslipGenerator() {
  const { toast } = useToast();
  const [payslipData, setPayslipData] = useState<PayslipData>({
    companyName: "CodesmoTech Technology Consulting Private Limited, Gurugram",
    payPeriod: "July 2025",
    employeeName: "Wasim Hussain",
    employeeNo: "1130",
    designation: "UX Developer",
    bankAccount: "031101003210",
    dateOfJoining: "2025-04-15",
    totalWorkingDays: 31,
    paidDays: 11,
    lopDays: 0,
    earnings: [{ type: "Professional Fee", amount: 45000 }],
    deductions: [
      { type: "LOP days", amount: 0 },
      { type: "Taxes", amount: 4500 }
    ]
  });

  const handleDataChange = (newData: PayslipData) => {
    setPayslipData(newData);
  };

  const handleGeneratePDF = async () => {
    try {
  const fileName = `${payslipData.employeeName.replace(/\s+/g, '_')}_${payslipData.payPeriod.replace(/\s+/g, '_')}_Payslip.pdf`;
      await generatePayslipPDF('payslipPreview', fileName);
      toast({
        title: "PDF Generated",
        description: "Payslip PDF has been downloaded successfully.",
      });
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast({
        title: "PDF Generation Failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGeneratePDFBlob = async (): Promise<Blob> => {
    return await generatePayslipPDFBlob('payslipPreview');
  };

  const handleSendEmail = async (emailData: any, pdfBlob: Blob) => {
    // Dynamically import the appropriate email service based on environment
    const env = (import.meta as any).env;
    const isStaticBuild = env?.VITE_STATIC_BUILD === 'true' || env?.PROD;
    
    if (isStaticBuild) {
      const { sendEmailWithAttachment } = await import("@/lib/email-service.static");
      await sendEmailWithAttachment(emailData, pdfBlob);
    } else {
      const { sendEmailWithAttachment } = await import("@/lib/email-service");
      await sendEmailWithAttachment(emailData, pdfBlob);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="no-print mb-8">
        <h1 className="text-3xl font-bold text-payslip-header mb-2" data-testid="text-page-title">
          Payslip Generator
        </h1>
        <p className="text-muted-foreground" data-testid="text-page-description">
          Professional payslip generation tool for design teams and clients
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Panel */}
        <div className="no-print space-y-6">
          <Tabs defaultValue="form" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="form" data-testid="tab-form">Form</TabsTrigger>
              <TabsTrigger value="email" data-testid="tab-email">Email</TabsTrigger>
            </TabsList>
            <TabsContent value="form" className="mt-6">
              <PayslipForm onDataChange={handleDataChange} onGeneratePDF={handleGeneratePDF} />
            </TabsContent>
            <TabsContent value="email" className="mt-6">
              <EmailForm 
                onSendEmail={handleSendEmail}
                onGeneratePDFBlob={handleGeneratePDFBlob}
                employeeName={payslipData.employeeName}
                payPeriod={payslipData.payPeriod}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className="lg:sticky lg:top-6 h-fit">
          <PayslipPreview data={payslipData} />
        </div>
      </div>
    </div>
  );
}
