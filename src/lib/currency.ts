export function formatCurrency(amount: number, currencyCode: string = "PKR"): string {
  if (currencyCode === "PKR") {
    // Custom formatting for PKR to use "Rs" instead of the standard "PKR" output from Intl
    return `Rs ${amount.toLocaleString("en-PK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
