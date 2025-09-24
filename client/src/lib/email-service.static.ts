// Static version for GitHub Pages deployment - PDF download only

interface EmailData {
  from: string;
  to: string;
  cc?: string;
  subject: string;
  message?: string;
}

export async function sendEmailWithAttachment(emailData: EmailData, pdfBlob: Blob): Promise<any> {
  // For static deployment, just download the PDF
  console.log('Downloading PDF for static deployment');
  console.log('PDF blob size:', pdfBlob.size);
  
  // Create a download link for the PDF
  const url = URL.createObjectURL(pdfBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'payslip.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  return {
    success: true,
    message: 'PDF has been downloaded successfully!'
  };
}
