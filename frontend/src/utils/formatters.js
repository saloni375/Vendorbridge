export function formatCurrency(amount, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function calculateGstAmount(amount, gstRate = 18) {
  return Math.round((amount * gstRate) / 100);
}

export function calculateInvoiceTotal(amount, gstRate = 18) {
  return amount + calculateGstAmount(amount, gstRate);
}
