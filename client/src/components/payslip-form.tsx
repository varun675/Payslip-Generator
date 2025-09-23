import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { EarningDeduction } from "../../../shared/schema";

const payslipFormSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  payPeriod: z.string().min(1, "Pay period is required"),
  employeeName: z.string().min(1, "Employee name is required"),
  employeeNo: z.string().min(1, "Employee number is required"),
  designation: z.string().min(1, "Designation is required"),
  bankAccount: z.string().min(1, "Bank account is required"),
  dateOfJoining: z.string().min(1, "Date of joining is required"),
  totalWorkingDays: z.number().min(0, "Total working days must be non-negative"),
  paidDays: z.number().min(0, "Paid days must be non-negative"),
  lopDays: z.number().min(0, "LOP days must be non-negative"),
});

type PayslipFormData = z.infer<typeof payslipFormSchema>;

interface PayslipFormProps {
  onDataChange: (data: PayslipFormData & {
    earnings: EarningDeduction[];
    deductions: EarningDeduction[];
    perDaySalary: number;
  }) => void;
  onGeneratePDF: () => void;
}

export function PayslipForm({ onDataChange, onGeneratePDF }: PayslipFormProps) {
  const [perDaySalary, setPerDaySalary] = useState(0);
  const [earnings, setEarnings] = useState<EarningDeduction[]>([
    { type: "Professional Fee", amount: 45000 }
  ]);
  const [deductions, setDeductions] = useState<EarningDeduction[]>([
    { type: "LOP", amount: 0 },
    { type: "Taxes", amount: 0 }
  ]);
  const [overrides, setOverrides] = useState({
    perDaySalary: false,
    lopAmount: false,
    taxesAmount: false
  });

  const form = useForm<PayslipFormData>({
    resolver: zodResolver(payslipFormSchema),
    defaultValues: {
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
    },
  });

  // Watch for changes in form values
  const totalWorkingDays = form.watch("totalWorkingDays") || 0;
  const paidDays = form.watch("paidDays") || 0;
  const lopDays = form.watch("lopDays") || 0;

  // Calculate totals
  const calculateTotalEarnings = useCallback(() => {
    return Math.round(
      earnings.reduce((sum, earning) => sum + (earning.amount || 0), 0)
    );
  }, [earnings]);

  const calculateTotalDeductions = useCallback(() => {
    return Math.round(
      deductions.reduce((sum, deduction) => sum + (deduction.amount || 0), 0)
    );
  }, [deductions]);

  // Handle manual per day salary updates
  const handlePerDaySalaryChange = useCallback((value: number) => {
    const newValue = Math.round(value);
    setPerDaySalary(newValue);
    setOverrides(prev => ({ ...prev, perDaySalary: true }));

    // Update Professional Fee
    setEarnings(prev => {
      const updated = [...prev];
      const profFeeIndex = updated.findIndex(e => e.type === "Professional Fee");
      if (profFeeIndex !== -1) {
        const newAmount = Math.round(newValue * paidDays);
        if (newAmount > 0 || value === 0) { // Only update if result is positive or explicitly set to 0
          updated[profFeeIndex] = {
            ...updated[profFeeIndex],
            amount: newAmount
          };
        }
      }
      return updated;
    });    // Update LOP and Taxes
    setDeductions(prev => {
      const updated = [...prev];
      const lopIndex = updated.findIndex(d => d.type === "LOP");
      const taxIndex = updated.findIndex(d => d.type === "Taxes");

      if (lopIndex !== -1 && !overrides.lopAmount) {
        updated[lopIndex] = {
          ...updated[lopIndex],
          amount: Math.round(newValue * lopDays)
        };
      }

      if (taxIndex !== -1 && !overrides.taxesAmount) {
        const monthlyEarnings = Math.round(newValue * paidDays);
        updated[taxIndex] = {
          ...updated[taxIndex],
          amount: Math.round(monthlyEarnings * 0.1)
        };
      }

      return updated;
    });
  }, [paidDays, lopDays, overrides]);

  // Calculate values when form changes
  const updateCalculations = useCallback(() => {
    const profFee = earnings.find(e => e.type === "Professional Fee")?.amount || 0;
    
    // Always calculate per day salary from Professional Fee
    if (totalWorkingDays > 0) {
      const calculatedPerDaySalary = Math.round(profFee / totalWorkingDays);
      setPerDaySalary(calculatedPerDaySalary);
    }

    // Update deductions
    setDeductions(prev => {
      const updated = [...prev];
      const lopIndex = updated.findIndex(d => d.type === "LOP");
      const taxIndex = updated.findIndex(d => d.type === "Taxes");

      if (lopIndex !== -1 && !overrides.lopAmount) {
        const lopAmount = Math.round(perDaySalary * lopDays);
        updated[lopIndex] = { ...updated[lopIndex], amount: lopAmount };
      }

      if (taxIndex !== -1 && !overrides.taxesAmount) {
        const monthlyEarnings = Math.round(perDaySalary * paidDays);
        updated[taxIndex] = { ...updated[taxIndex], amount: Math.round(monthlyEarnings * 0.1) };
      }

      return updated;
    });
  }, [earnings, perDaySalary, totalWorkingDays, paidDays, lopDays, overrides]);

  // Update calculations when dependencies change
  useEffect(() => {
    updateCalculations();
  }, [updateCalculations]);

  // Update deductions when working days or LOP days change
  useEffect(() => {
    const profFee = earnings.find(e => e.type === "Professional Fee")?.amount || 0;
    if (totalWorkingDays > 0) {
      const newPerDaySalary = Math.round(profFee / totalWorkingDays);
      setDeductions(prev => {
        const updated = [...prev];
        const lopIndex = updated.findIndex(d => d.type === "LOP");
        const taxIndex = updated.findIndex(d => d.type === "Taxes");

        if (lopIndex !== -1 && !overrides.lopAmount) {
          updated[lopIndex] = {
            ...updated[lopIndex],
            amount: Math.round(newPerDaySalary * lopDays)
          };
        }

        if (taxIndex !== -1 && !overrides.taxesAmount) {
          const lopAmount = updated[lopIndex]?.amount || 0;
          updated[taxIndex] = {
            ...updated[taxIndex],
            amount: Math.round((profFee - lopAmount) * 0.1)
          };
        }

        return updated;
      });
    }
  }, [totalWorkingDays, lopDays, earnings, overrides.lopAmount, overrides.taxesAmount]);

  // Notify parent of changes
  useEffect(() => {
    const formData = form.getValues();
    onDataChange({
      ...formData,
      earnings,
      deductions,
      perDaySalary
    });
  }, [form, earnings, deductions, perDaySalary, onDataChange]);

  const addEarning = () => {
    setEarnings(prev => [...prev, { type: "", amount: 0 }]);
  };

  const removeEarning = (index: number) => {
    setEarnings(prev => prev.filter((_, i) => i !== index));
  };

  const handleProfessionalFeeChange = useCallback((amount: number) => {
    const profFeeIndex = earnings.findIndex(e => e.type === "Professional Fee");
    if (profFeeIndex !== -1) {
      setEarnings(prev => {
        const updated = [...prev];
        updated[profFeeIndex] = {
          ...updated[profFeeIndex],
          amount: amount
        };
        return updated;
      });

      if (totalWorkingDays > 0) {
        const newPerDaySalary = Math.round(amount / totalWorkingDays);
        setPerDaySalary(newPerDaySalary);
        setOverrides(prev => ({ ...prev, perDaySalary: true }));
      }
    }
  }, [earnings, totalWorkingDays]);

  const updateEarning = (index: number, field: keyof EarningDeduction, value: string | number) => {
    setEarnings(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addDeduction = () => {
    setDeductions((prev: EarningDeduction[]) => [...prev, { type: "", amount: 0 }]);
  };

  const removeDeduction = (index: number) => {
    setDeductions((prev: EarningDeduction[]) => prev.filter((_, i: number) => i !== index));
  };

  const updateDeduction = (index: number, field: keyof EarningDeduction, value: string | number) => {
    setDeductions((prev: EarningDeduction[]) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Employee Information</CardTitle>
        <Button onClick={onGeneratePDF} data-testid="button-generate-pdf">
          Generate PDF
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Company Information */}
        <div className="space-y-4 p-4 bg-muted/50 rounded-md">
          <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Company Information
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                {...form.register("companyName")}
                data-testid="input-company-name"
              />
            </div>
            <div>
              <Label htmlFor="payPeriod">Pay Period</Label>
              <Input
                id="payPeriod"
                {...form.register("payPeriod")}
                data-testid="input-pay-period"
              />
            </div>
          </div>
        </div>

        {/* Employee Details */}
        <div className="space-y-4 p-4 bg-muted/50 rounded-md">
          <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Employee Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="employeeName">Employee Name</Label>
              <Input
                id="employeeName"
                {...form.register("employeeName")}
                data-testid="input-employee-name"
              />
            </div>
            <div>
              <Label htmlFor="employeeNo">Employee No</Label>
              <Input
                id="employeeNo"
                {...form.register("employeeNo")}
                data-testid="input-employee-no"
              />
            </div>
            <div>
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                {...form.register("designation")}
                data-testid="input-designation"
              />
            </div>
            <div>
              <Label htmlFor="bankAccount">Bank Account</Label>
              <Input
                id="bankAccount"
                {...form.register("bankAccount")}
                data-testid="input-bank-account"
              />
            </div>
            <div>
              <Label htmlFor="dateOfJoining">Date of Joining</Label>
              <Input
                id="dateOfJoining"
                type="date"
                {...form.register("dateOfJoining")}
                data-testid="input-date-of-joining"
              />
            </div>
          </div>
        </div>

        {/* Attendance Information */}
        <div className="space-y-4 p-4 bg-muted/50 rounded-md">
          <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Attendance Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="totalWorkingDays">Total Working Days</Label>
              <Input
                id="totalWorkingDays"
                type="number"
                {...form.register("totalWorkingDays", { valueAsNumber: true })}
                data-testid="input-total-working-days"
              />
            </div>
            <div>
              <Label htmlFor="paidDays">Paid Days</Label>
              <Input
                id="paidDays"
                type="number"
                {...form.register("paidDays", { valueAsNumber: true })}
                data-testid="input-paid-days"
              />
            </div>
            <div>
              <Label htmlFor="lopDays">LOP Days</Label>
              <Input
                id="lopDays"
                type="number"
                {...form.register("lopDays", { valueAsNumber: true })}
                data-testid="input-lop-days"
              />
            </div>
          </div>
        </div>

        {/* Salary Information */}
        <div className="space-y-4 p-4 bg-muted/50 rounded-md">
          <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Salary Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Per Day Salary</Label>
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={perDaySalary ? Math.round(perDaySalary).toString() : ""}
                readOnly
                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-muted"
                data-testid="input-per-day-salary"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Earnings */}
        <div className="space-y-4 p-4 bg-muted/50 rounded-md">
          <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Earnings
          </h3>
          <div className="space-y-3">
            {earnings.map((earning, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Earning Type"
                  value={earning.type}
                  onChange={(e) => updateEarning(index, "type", e.target.value)}
                  className="flex-1"
                  data-testid={`input-earning-type-${index}`}
                  disabled={earning.type === "Professional Fee"}
                />
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Amount"
                  value={earning.amount ? Math.round(earning.amount).toString() : ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    const amount = value === "" ? earning.amount : parseInt(value);
                    
                    if (earning.type === "Professional Fee") {
                      const newAmount = amount || 0;
                      setEarnings(prev => {
                        const updated = [...prev];
                        const index = updated.findIndex(e => e.type === "Professional Fee");
                        if (index !== -1) {
                          updated[index] = { ...updated[index], amount: newAmount };
                        }
                        return updated;
                      });

                      // Calculate per day salary from Professional Fee
                      if (totalWorkingDays > 0) {
                        const newPerDaySalary = Math.round(newAmount / totalWorkingDays);
                        setPerDaySalary(newPerDaySalary);
                      }

                      // Update LOP and Taxes based on new Professional Fee
                      setDeductions(prev => {
                        const updated = [...prev];
                        const lopIndex = updated.findIndex(d => d.type === "LOP");
                        const taxIndex = updated.findIndex(d => d.type === "Taxes");

                        if (lopIndex !== -1 && totalWorkingDays > 0 && !overrides.lopAmount) {
                          const newPerDaySalary = Math.round(newAmount / totalWorkingDays);
                          updated[lopIndex] = {
                            ...updated[lopIndex],
                            amount: Math.round(newPerDaySalary * lopDays)
                          };
                        }

                        if (taxIndex !== -1 && !overrides.taxesAmount) {
                          const lopAmount = updated[lopIndex]?.amount || 0;
                          updated[taxIndex] = {
                            ...updated[taxIndex],
                            amount: Math.round((newAmount - lopAmount) * 0.1)
                          };
                        }

                        return updated;
                      });
                    } else {
                      updateEarning(index, "amount", amount);
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value === "") {
                      updateEarning(index, "amount", 0);
                    }
                  }}
                  className="w-32 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  data-testid={`input-earning-amount-${index}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEarning(index)}
                  className="text-destructive hover:text-destructive"
                  data-testid={`button-remove-earning-${index}`}
                  disabled={earning.type === "Professional Fee"}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full border-dashed"
            onClick={addEarning}
            data-testid="button-add-earning"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Earning
          </Button>
        </div>

        {/* Deductions */}
        <div className="space-y-4 p-4 bg-muted/50 rounded-md">
          <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Deductions
          </h3>
          <div className="space-y-3">
            {deductions.map((deduction, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Deduction Type"
                  value={deduction.type}
                  onChange={(e) => updateDeduction(index, "type", e.target.value)}
                  className="flex-1"
                  data-testid={`input-deduction-type-${index}`}
                  disabled={deduction.type === "LOP" || deduction.type === "Taxes"}
                />
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Amount"
                  value={deduction.amount ? Math.round(deduction.amount).toString() : ""}
                  className="w-32 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  data-testid={`input-deduction-amount-${index}`}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    const amount = value === "" ? 0 : parseInt(value);
                    updateDeduction(index, "amount", amount);
                    if (deduction.type === "LOP") {
                      setOverrides(prev => ({ ...prev, lopAmount: true }));
                    } else if (deduction.type === "Taxes") {
                      setOverrides(prev => ({ ...prev, taxesAmount: true }));
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value === "") {
                      updateDeduction(index, "amount", 0);
                      if (deduction.type === "LOP" || deduction.type === "Taxes") {
                        const profFee = earnings.find(e => e.type === "Professional Fee")?.amount || 0;
                        const lopIndex = deductions.findIndex(d => d.type === "LOP");
                        const lopAmount = deductions[lopIndex]?.amount || 0;
                        
                        if (deduction.type === "LOP" && totalWorkingDays > 0) {
                          // Reset LOP to calculated amount
                          const perDaySalaryAmount = Math.round(profFee / totalWorkingDays);
                          updateDeduction(index, "amount", Math.round(perDaySalaryAmount * lopDays));
                          setOverrides(prev => ({ ...prev, lopAmount: false }));
                        } else if (deduction.type === "Taxes") {
                          // Reset Taxes to calculated amount
                          updateDeduction(index, "amount", Math.round((profFee - lopAmount) * 0.1));
                          setOverrides(prev => ({ ...prev, taxesAmount: false }));
                        }
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDeduction(index)}
                  className="text-destructive hover:text-destructive"
                  data-testid={`button-remove-deduction-${index}`}
                  disabled={deduction.type === "LOP" || deduction.type === "Taxes"}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full border-dashed"
            onClick={addDeduction}
            data-testid="button-add-deduction"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Deduction
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}