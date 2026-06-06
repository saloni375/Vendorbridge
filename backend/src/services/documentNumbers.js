function suffix() {
  return `${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

export function makePoNumber() {
  return `PO-${suffix()}`;
}

export function makeInvoiceNumber() {
  return `INV-${suffix()}`;
}
