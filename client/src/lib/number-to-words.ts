export function numberToWords(num: number): string {
  if (num === 0) return 'Zero Only';
  
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertHundreds(n: number): string {
    let result = '';
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    } else if (n >= 10) {
      result += teens[n - 10] + ' ';
      return result;
    }
    if (n > 0) {
      result += ones[n] + ' ';
    }
    return result;
  }

  if (num >= 10000000) { // Crores
    const crores = Math.floor(num / 10000000);
    const remainder = num % 10000000;
    return convertHundreds(crores).trim() + ' Crore ' + (remainder > 0 ? numberToWords(remainder).replace(' Only', '') : '') + ' Only';
  }
  if (num >= 100000) { // Lakhs
    const lakhs = Math.floor(num / 100000);
    const remainder = num % 100000;
    return convertHundreds(lakhs).trim() + ' Lakh ' + (remainder > 0 ? numberToWords(remainder).replace(' Only', '') : '') + ' Only';
  }
  if (num >= 1000) { // Thousands
    const thousands = Math.floor(num / 1000);
    const remainder = num % 1000;
    return convertHundreds(thousands).trim() + ' Thousand ' + (remainder > 0 ? numberToWords(remainder).replace(' Only', '') : '') + ' Only';
  }
  return convertHundreds(num).trim() + ' Only';
}
