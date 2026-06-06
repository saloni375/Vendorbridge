# VendorBridge Frontend

VendorBridge is a procurement and vendor management ERP frontend built with React, Vite, React Router, Tailwind CSS, Axios, React Hook Form, and Context API authentication.

## Setup

```bash
npm install
npm run dev
```

The app uses mock authentication by default so the frontend is usable without a backend. Set `VITE_USE_MOCK_AUTH=false` and `VITE_API_BASE_URL` to connect to real API endpoints.

## PostgreSQL Backend Integration

React should not connect to PostgreSQL directly. Keep PostgreSQL access in the backend and expose REST APIs for the frontend.

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

For real backend mode:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_USE_MOCK_AUTH=false
```

The service layer for your PostgreSQL tables is in `src/services/procurementService.js`.
The suggested endpoint contract is documented in `docs/api-contract.md`.

This repository now includes an Express/PostgreSQL backend in `../backend`. Start it with:

```bash
cd ../backend
npm install
cp .env.example .env
npm run dev
```
