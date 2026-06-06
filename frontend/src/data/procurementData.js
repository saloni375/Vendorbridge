import {
  BarChart3,
  Bell,
  ClipboardCheck,
  FileCheck2,
  FileText,
  Receipt,
  ShoppingCart,
  Store,
} from "lucide-react";

export const vendors = [
  {
    id: "VEN-001",
    name: "Infra Supplies Pvt Ltd",
    category: "Construction",
    contact: "XYZ Number",
    gstin: "27AABCS1429BZ0",
    rating: 4.5,
    compliance: "Active",
    risk: "Low",
    annualSpend: 87000,
  },
  {
    id: "VEN-002",
    name: "TechCore LTD",
    category: "IT",
    contact: "XYZ Number",
    gstin: "27AABCS1429BZ0",
    rating: 4.2,
    compliance: "Active",
    risk: "Medium",
    annualSpend: 140000,
  },
  {
    id: "VEN-003",
    name: "FastLog Transport",
    category: "Logistics",
    contact: "XYZ Number",
    gstin: "27AABCS1429BZ0",
    rating: 3.8,
    compliance: "Blocked",
    risk: "High",
    annualSpend: 34900,
  },
  {
    id: "VEN-004",
    name: "Office Need Co.",
    category: "Furniture",
    contact: "procurement@officeneed.example",
    gstin: "24AAFCO9182L1Z3",
    rating: 3.8,
    compliance: "Pending",
    risk: "Medium",
    annualSpend: 214800,
  },
];

export const rfqs = [
  {
    id: "RFQ-2025-0068",
    title: "Office Furniture procurement Q2",
    category: "Furniture",
    status: "Active",
    createdBy: "Procurement Officer",
    budget: 230000,
    dueDate: "2025-06-15",
    invitedVendors: ["Infra Supplies Pvt Ltd", "TechCore LTD", "Office Need Co."],
    quoteCount: 3,
    lineItems: "Ergonomic chair x 25, Standing desks x 10",
  },
  {
    id: "RFQ-2025-0062",
    title: "IT hardware refresh",
    category: "IT",
    status: "Pending",
    createdBy: "Procurement Officer",
    budget: 140000,
    dueDate: "2025-06-20",
    invitedVendors: ["TechCore LTD"],
    quoteCount: 1,
    lineItems: "Docking stations, monitors",
  },
  {
    id: "RFQ-2025-0058",
    title: "Logistics partner verification",
    category: "Logistics",
    status: "Blocked",
    createdBy: "Procurement Officer",
    budget: 34900,
    dueDate: "2025-06-08",
    invitedVendors: ["FastLog Transport"],
    quoteCount: 0,
    lineItems: "Route validation and GST document check",
  },
];

export const quotations = [
  {
    id: "QTN-2025-041",
    rfqId: "RFQ-2025-0068",
    vendorName: "Infra Supplies Pvt Ltd",
    price: 185400,
    deliveryDays: 10,
    gstRate: 18,
    score: 96,
    status: "Selected",
    submittedAt: "2025-05-20",
    comments: "Lowest grand total with 30 day payment terms.",
  },
  {
    id: "QTN-2025-042",
    rfqId: "RFQ-2025-0068",
    vendorName: "TechCore LTD",
    price: 200010,
    deliveryDays: 14,
    gstRate: 18,
    score: 88,
    status: "Submitted",
    submittedAt: "2025-05-20",
    comments: "Includes installation support.",
  },
  {
    id: "QTN-2025-043",
    rfqId: "RFQ-2025-0068",
    vendorName: "Office Need Co.",
    price: 214800,
    deliveryDays: 7,
    gstRate: 18,
    score: 84,
    status: "Submitted",
    submittedAt: "2025-05-20",
    comments: "Fastest delivery, 15 day payment terms.",
  },
];

export const approvals = [
  {
    id: "APR-2025-018",
    reference: "RFQ-2025-0068",
    type: "Vendor Selection",
    vendorName: "Infra Supplies Pvt Ltd",
    requestedBy: "Procurement Team",
    amount: 185400,
    priority: "High",
    status: "Pending",
    manager: "Priya Shah",
    submittedOn: "2025-05-21",
  },
  {
    id: "APR-2025-017",
    reference: "RFQ-2025-0068",
    type: "L1 Review",
    vendorName: "Infra Supplies Pvt Ltd",
    requestedBy: "Rahul Mehta",
    amount: 185400,
    priority: "Medium",
    status: "Approved",
    manager: "Rahul Mehta",
    submittedOn: "2025-05-20",
  },
  {
    id: "APR-2025-016",
    reference: "VEN-003",
    type: "Vendor Verification",
    vendorName: "FastLog Transport",
    requestedBy: "Procurement Team",
    amount: 0,
    priority: "Low",
    status: "Rejected",
    manager: "Procurement Head",
    submittedOn: "2025-05-18",
  },
];

export const purchaseOrders = [
  {
    id: "PO-2025-0068",
    rfqId: "RFQ-2025-0068",
    vendorName: "Infra Supplies Pvt Ltd",
    status: "Pending Payment",
    poDate: "2025-05-21",
    deliveryDate: "2025-06-21",
    taxableAmount: 169500,
    gstRate: 18,
    owner: "Procurement Officer",
    items: [
      { name: "Ergonomic chair", quantity: 25, unitPrice: 3500 },
      { name: "Standing desks", quantity: 10, unitPrice: 8200 },
    ],
  },
];

export const invoices = [
  {
    id: "INV-2025-0068",
    poId: "PO-2025-0068",
    vendorName: "Infra Supplies Pvt Ltd",
    taxableAmount: 169500,
    gstRate: 18,
    invoiceDate: "2025-05-22",
    dueDate: "2025-06-21",
    status: "Pending Payment",
  },
  {
    id: "INV-2025-0062",
    poId: "PO-2025-0062",
    vendorName: "TechCore LTD",
    taxableAmount: 140000,
    gstRate: 18,
    invoiceDate: "2025-05-22",
    dueDate: "2025-06-21",
    status: "Review",
  },
  {
    id: "INV-2025-0058",
    poId: "PO-2025-0058",
    vendorName: "FastLog Transport",
    taxableAmount: 34900,
    gstRate: 18,
    invoiceDate: "2025-05-18",
    dueDate: "2025-06-17",
    status: "Overdue",
  },
];

export const notifications = [
  {
    id: "NTF-01",
    title: "L2 approval pending",
    message: "PO-2025-0068 is awaiting review by Priya Shah.",
    type: "Approval",
    time: "2025-05-22T09:15:00.000Z",
  },
  {
    id: "NTF-02",
    title: "RFQ published",
    message: "Office Furniture procurement Q2 was sent to 3 vendors.",
    type: "RFQ",
    time: "2025-05-19T10:20:00.000Z",
  },
  {
    id: "NTF-03",
    title: "Invoice due soon",
    message: "INV-2025-0068 is due on 21 June 2025.",
    type: "Invoice",
    time: "2025-05-22T14:40:00.000Z",
  },
];

export const activityLogs = [
  {
    id: "ACT-01",
    actor: "Procurement Officer",
    action: "Quotation selected - Infra Supplies Pvt Ltd selected for Office Furniture Q2",
    module: "Approvals",
    time: "23 May 2025, 9:15 PM",
  },
  {
    id: "ACT-02",
    actor: "Priya Shah",
    action: "Approval pending - PO-2025-0068 awaiting L2 approval",
    module: "Approvals",
    time: "22 May 2025, 09:15 AM",
  },
  {
    id: "ACT-03",
    actor: "Procurement Officer",
    action: "RFQ published - Office Furniture Q2 sent to 3 vendors",
    module: "RFQ",
    time: "19 May 2025",
  },
  {
    id: "ACT-04",
    actor: "Vendor Admin",
    action: "Vendor added - FastLog Transport registered and pending verification",
    module: "Vendors",
    time: "18 May 2025, 3:20 PM",
  },
];

export const spendByCategory = [
  { category: "Furniture", amount: 1240000, share: 46 },
  { category: "IT", amount: 480000, share: 18 },
  { category: "Construction", amount: 320000, share: 12 },
  { category: "Logistics", amount: 220000, share: 8 },
];

export const workflowSteps = [
  { label: "RFQ Created", description: "Office furniture requirement" },
  { label: "Vendors Quote", description: "3 quotations received" },
  { label: "Compare", description: "Lowest offer highlighted" },
  { label: "Approval", description: "L1/L2 manager chain" },
  { label: "PO + Invoice", description: "Generate PO and GST invoice" },
];

export const dashboardKpis = [
  { label: "Active RFQs", value: 12, change: "Office Furniture Q2 in progress", trend: "up", icon: FileText },
  { label: "Pending Approvals", value: 5, change: "L2 review waiting", trend: "down", icon: ClipboardCheck },
  { label: "POs This Month", value: "2.3L INR", change: "May 2025", trend: "up", icon: ShoppingCart },
  { label: "Overdue Invoices", value: 3, change: "Needs finance follow-up", trend: "down", icon: Receipt },
];

export const moduleCards = [
  { label: "RFQ Pipeline", value: "3 active RFQs", icon: FileText },
  { label: "Quotation Value", value: "6.0L INR", icon: FileCheck2 },
  { label: "PO Committed", value: "2.3L INR", icon: ShoppingCart },
  { label: "Reports", value: "May 2025", icon: BarChart3 },
  { label: "Notifications", value: notifications.length, icon: Bell },
  { label: "Vendors", value: vendors.length, icon: Store },
];
