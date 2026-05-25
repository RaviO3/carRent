# carRent Deployment Guide

## Local Run

Backend:

```bash
cd backend
npm install
npm start
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Backend Environment

Create `backend/.env` using `backend/.env.example`.

Required for deployment:

```env
NODE_ENV=production
PORT=5000
MONGO_URI=your_mongodb_atlas_url
JWT_SECRET=use_a_long_random_secret
FRONTEND_URL=https://your-frontend-domain.com
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## Frontend Environment

Create `frontend/.env` using `frontend/.env.example`.

```env
VITE_API_URL=https://your-backend-domain.com/api
```

## Build Commands

Frontend build:

```bash
cd frontend
npm run build
```

Backend start command:

```bash
cd backend
npm start
```

## Demo Data

After setting `MONGO_URI`, run:

```bash
cd backend
npm run seed
npm run seed:bookings
```

Demo customer account:

```txt
Customer: customer@carrent.com / customer123
```

The seed script also creates an internal owner account for demo car data:

```txt
Owner: owner@gmail.com / owner123
```

The public website is customer-only.

## Important Production Notes

- Use MongoDB Atlas for the database.
- Use real Razorpay keys for live checkout.
- Local `backend/uploads` is fine for demo hosting, but use Cloudinary or S3 for reliable production image storage.
- Set `FRONTEND_URL` exactly to the deployed frontend URL, otherwise cookies/CORS may fail.
- Set `NODE_ENV=production` on the backend host so session cookies use secure production settings.
