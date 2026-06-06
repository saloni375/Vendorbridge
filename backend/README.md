# VendorBridge Backend

Express API for connecting the VendorBridge React frontend to PostgreSQL.

## Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Update `.env` with your PostgreSQL database:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/vendorbridge
JWT_SECRET=replace_with_a_long_random_secret
```

The frontend already points to this API when these values are set in `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_USE_MOCK_AUTH=false
```

## Notes

- React never connects to PostgreSQL directly. It calls this backend through Axios.
- The routes match `frontend/src/services/procurementService.js`.
- Your database must include the tables listed in the project description.
- The backend assumes common columns such as `id`, `created_at`, `status`, and auth fields like `users.email`, `users.password_hash`, `users.role`.
