# VendorBridge API Contract

The frontend must not connect directly to PostgreSQL. PostgreSQL should be accessed by the backend, and the React app should call authenticated REST APIs through Axios.

## Environment

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_USE_MOCK_AUTH=false
```

## Authentication

| Method | Endpoint | Tables |
| --- | --- | --- |
| POST | `/auth/login` | `users` |
| POST | `/auth/signup` | `users`, `vendors` when role is Vendor |
| POST | `/auth/forgot-password` | `users` |

Expected auth response:

```json
{
  "token": "jwt-token",
  "user": {
    "id": "uuid",
    "name": "Admin User",
    "email": "admin@vendorbridge.com",
    "role": "admin",
    "vendorId": null
  }
}
```

## Procurement Workflow

| Step | Method | Endpoint | Tables |
| --- | --- | --- | --- |
| Vendor master | GET/POST/PATCH | `/vendors` | `vendors` |
| Create RFQ | POST | `/rfqs` | `rfqs`, `rfq_items`, `vendor_rfqs` |
| List RFQs | GET | `/rfqs` | `rfqs`, `rfq_items`, `vendor_rfqs` |
| Submit quotation | POST | `/quotations` | `quotations`, `quotation_items` |
| Compare quotations | GET | `/quotations?rfqId=:id` | `quotations`, `quotation_items`, `vendors` |
| Select best vendor | POST | `/quotations/:id/select` | `quotations`, `approvals`, `activity_logs`, `notifications` |
| Manager approve | POST | `/approvals/:id/approve` | `approvals`, `purchase_orders`, `purchase_order_items`, `activity_logs`, `notifications` |
| Manager reject | POST | `/approvals/:id/reject` | `approvals`, `activity_logs`, `notifications` |
| List POs | GET | `/purchase-orders` | `purchase_orders`, `purchase_order_items` |
| Create invoice | POST | `/invoices` | `invoices`, `invoice_items` |
| Invoice PDF | GET | `/invoices/:id/pdf` | `invoices`, `invoice_items`, `vendors` |
| Email invoice | POST | `/invoices/:id/email` | `invoices`, `notifications`, `activity_logs` |
| Notifications | GET/PATCH | `/notifications` | `notifications` |
| Activity logs | GET | `/activity-logs` | `activity_logs` |
| Dashboard | GET | `/dashboard/summary` | all workflow tables |

## Important Frontend Paths

- API client: `src/services/api.js`
- Auth service: `src/services/authService.js`
- PostgreSQL-backed service methods: `src/services/procurementService.js`

If your backend route names differ, update only `src/services/procurementService.js` and `src/services/authService.js`.
