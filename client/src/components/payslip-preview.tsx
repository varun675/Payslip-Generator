import { EarningDeduction } from "@shared/schema";
import { numberToWords } from "@/lib/number-to-words";

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

interface PayslipPreviewProps {
  data: PayslipData;
}

export function PayslipPreview({ data }: PayslipPreviewProps) {
  const totalEarnings = data.earnings.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalDeductions = data.deductions.reduce((sum, item) => sum + (item.amount || 0), 0);
  const netPayable = totalEarnings - totalDeductions;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const maxRows = Math.max(data.earnings.length, data.deductions.length);

  return (
    <div id="payslipPreview" className="payslip-preview rounded-lg overflow-hidden">
      <div className="p-8 bg-white">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-payslip-header mb-2" data-testid="text-company-name">
            {data.companyName}
          </h1>
        </div>

        {/* Payslip Title */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold" data-testid="text-payslip-title">
            Payslip for the month of {data.payPeriod}
          </h2>
        </div>

        {/* Employee Pay Summary */}
        <div className="mb-6">
          <h3 className="font-semibold text-sm mb-4 text-gray-700">EMPLOYEE PAY SUMMARY</h3>
          
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <div className="flex">
              <span className="font-medium w-32">Employee Name</span>
              <span className="mr-2">:</span>
              <span data-testid="text-employee-name">{data.employeeName}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-32">Employee No</span>
              <span className="mr-2">:</span>
              <span data-testid="text-employee-no">{data.employeeNo}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-32">Designation</span>
              <span className="mr-2">:</span>
              <span data-testid="text-designation">{data.designation}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-32">Bank Account No</span>
              <span className="mr-2">:</span>
              <span data-testid="text-bank-account">{data.bankAccount}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-32">Date of Joining</span>
              <span className="mr-2">:</span>
              <span data-testid="text-date-joining">{formatDate(data.dateOfJoining)}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-32">Total Working Days</span>
              <span className="mr-2">:</span>
              <span data-testid="text-total-working-days">{data.totalWorkingDays}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-32">Paid Days</span>
              <span className="mr-2">:</span>
              <span data-testid="text-paid-days">{data.paidDays}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-32">LOP Days</span>
              <span className="mr-2">:</span>
              <span data-testid="text-lop-days">{data.lopDays}</span>
            </div>
          </div>
        </div>

        {/* Earnings and Deductions Table */}
        <div className="mb-6">
          <table className="w-full earnings-table text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left font-semibold text-gray-700 py-2">EARNINGS</th>
                <th className="text-right font-semibold text-gray-700 py-2">AMOUNT (INR)</th>
                <th className="text-left font-semibold text-gray-700 py-2">DEDUCTIONS</th>
                <th className="text-right font-semibold text-gray-700 py-2">AMOUNT (INR)</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: maxRows }, (_, i) => {
                const earning = data.earnings[i];
                const deduction = data.deductions[i];
                return (
                  <tr key={i}>
                    <td data-testid={`text-earning-type-${i}`}>
                      {earning?.type || ''}
                    </td>
                    <td className="text-right" data-testid={`text-earning-amount-${i}`}>
                      {earning?.amount ? formatAmount(earning.amount) : ''}
                    </td>
                    <td data-testid={`text-deduction-type-${i}`}>
                      {deduction?.type || ''}
                    </td>
                    <td className="text-right" data-testid={`text-deduction-amount-${i}`}>
                        {(deduction?.type === 'LOP days' && data.lopDays === 0)
                          ? formatAmount(0)
                          : deduction?.amount ? formatAmount(deduction.amount) : ''}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-300 font-semibold">
                <td className="py-2">Total Earnings</td>
                <td className="text-right py-2" data-testid="text-total-earnings">
                  INR {formatAmount(totalEarnings)}
                </td>
                <td className="py-2">Total Deductions</td>
                <td className="text-right py-2" data-testid="text-total-deductions">
                  INR {formatAmount(totalDeductions)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Net Payable */}
        <div className="net-payable-box">
          <div className="text-xl font-bold">
            Total Net Payable : <span data-testid="text-net-payable">{formatAmount(netPayable)}</span>
            <span className="text-base font-normal ml-4">
              (<span data-testid="text-net-payable-words">{numberToWords(netPayable)}</span>)
            </span>
          </div>
          <div className="text-xs text-gray-600 mt-2">
            **Total Net Payable = Total Earnings - Total Deductions
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 mt-6">
          -- This is system generated payslip. --
        </div>
      </div>
    </div>
  );
}
