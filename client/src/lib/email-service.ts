interface EmailData {
  from: string;
  to: string;
  cc?: string;
  subject: string;
  message?: string;
}

export async function sendEmailWithAttachment(emailData: EmailData, pdfBlob: Blob): Promise<void> {
  const formData = new FormData();
  
  // Add email data as JSON string
  formData.append('emailData', JSON.stringify(emailData));
  
  // Add PDF file
  formData.append('payslip', pdfBlob, 'payslip.pdf');

  const response = await fetch('/api/send-email', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to send email');
  }

  return response.json();
}