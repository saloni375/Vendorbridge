import { apiClient } from "./api.js";

function unwrap(response) {
  return response.data;
}

export const usersApi = {
  list(params) {
    return apiClient.get("/users", { params }).then(unwrap);
  },
  get(id) {
    return apiClient.get(`/users/${id}`).then(unwrap);
  },
  update(id, payload) {
    return apiClient.patch(`/users/${id}`, payload).then(unwrap);
  },
};

export const vendorsApi = {
  list(params) {
    return apiClient.get("/vendors", { params }).then(unwrap);
  },
  get(id) {
    return apiClient.get(`/vendors/${id}`).then(unwrap);
  },
  create(payload) {
    return apiClient.post("/vendors", payload).then(unwrap);
  },
  update(id, payload) {
    return apiClient.patch(`/vendors/${id}`, payload).then(unwrap);
  },
};

export const rfqsApi = {
  list(params) {
    return apiClient.get("/rfqs", { params }).then(unwrap);
  },
  get(id) {
    return apiClient.get(`/rfqs/${id}`).then(unwrap);
  },
  create(payload) {
    return apiClient.post("/rfqs", payload).then(unwrap);
  },
  sendToVendors(id, vendorIds) {
    return apiClient.post(`/rfqs/${id}/vendors`, { vendorIds }).then(unwrap);
  },
  listItems(id) {
    return apiClient.get(`/rfqs/${id}/items`).then(unwrap);
  },
  addItem(id, payload) {
    return apiClient.post(`/rfqs/${id}/items`, payload).then(unwrap);
  },
};

export const quotationsApi = {
  list(params) {
    return apiClient.get("/quotations", { params }).then(unwrap);
  },
  get(id) {
    return apiClient.get(`/quotations/${id}`).then(unwrap);
  },
  create(payload) {
    return apiClient.post("/quotations", payload).then(unwrap);
  },
  listItems(id) {
    return apiClient.get(`/quotations/${id}/items`).then(unwrap);
  },
  addItem(id, payload) {
    return apiClient.post(`/quotations/${id}/items`, payload).then(unwrap);
  },
  selectBestVendor(id) {
    return apiClient.post(`/quotations/${id}/select`).then(unwrap);
  },
};

export const approvalsApi = {
  list(params) {
    return apiClient.get("/approvals", { params }).then(unwrap);
  },
  approve(id, payload = {}) {
    return apiClient.post(`/approvals/${id}/approve`, payload).then(unwrap);
  },
  reject(id, payload = {}) {
    return apiClient.post(`/approvals/${id}/reject`, payload).then(unwrap);
  },
};

export const purchaseOrdersApi = {
  list(params) {
    return apiClient.get("/purchase-orders", { params }).then(unwrap);
  },
  get(id) {
    return apiClient.get(`/purchase-orders/${id}`).then(unwrap);
  },
  createFromApproval(approvalId) {
    return apiClient.post("/purchase-orders", { approvalId }).then(unwrap);
  },
  listItems(id) {
    return apiClient.get(`/purchase-orders/${id}/items`).then(unwrap);
  },
};

export const invoicesApi = {
  list(params) {
    return apiClient.get("/invoices", { params }).then(unwrap);
  },
  get(id) {
    return apiClient.get(`/invoices/${id}`).then(unwrap);
  },
  createFromPurchaseOrder(purchaseOrderId) {
    return apiClient.post("/invoices", { purchaseOrderId }).then(unwrap);
  },
  listItems(id) {
    return apiClient.get(`/invoices/${id}/items`).then(unwrap);
  },
  downloadPdf(id) {
    return apiClient.get(`/invoices/${id}/pdf`, { responseType: "blob" });
  },
  email(id, payload = {}) {
    return apiClient.post(`/invoices/${id}/email`, payload).then(unwrap);
  },
};

export const notificationsApi = {
  list(params) {
    return apiClient.get("/notifications", { params }).then(unwrap);
  },
  markRead(id) {
    return apiClient.patch(`/notifications/${id}/read`).then(unwrap);
  },
};

export const activityLogsApi = {
  list(params) {
    return apiClient.get("/activity-logs", { params }).then(unwrap);
  },
};

export const dashboardApi = {
  summary() {
    return apiClient.get("/dashboard/summary").then(unwrap);
  },
};
