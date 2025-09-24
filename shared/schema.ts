// Shared schema types for the payslip generator

export interface EarningDeduction {
  type: string;
  amount: number;
}

export interface PayslipData {
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
