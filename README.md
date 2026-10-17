# DavaBharat: Your Online Pharmacy (demo)

A full-stack demo online pharmacy for generic medicines. Learning project; all
medicines and prices are sample data.

## Features
- Browse medicines with search, category filter, sorting and pagination
- Register and login (JWT)
- Cart and checkout (Cash on Delivery)
- My orders with cancel

## Tech stack
React (Vite), Tailwind CSS, React Router, Axios, Node.js, Express, MongoDB (Mongoose)

## Run locally
1. Clone the repo
2. Backend:
```
   cd server
   npm install
   copy .env.example .env      (then fill in the values)
   npm run seed
   npm run dev
```
3. Frontend (new terminal):
```
   cd client
   npm install
   copy .env.example .env
   npm run dev
```
4. Open http://localhost:5173

## API overview
| Method | Route | Auth |
|--------|-------|------|
| POST | /api/auth/register | no |
| POST | /api/auth/login | no |
| GET | /api/auth/me | yes |
| GET | /api/medicines | no |
| GET | /api/medicines/:id | no |
| POST | /api/orders | yes |
| GET | /api/orders | yes |
| PUT | /api/orders/:id/cancel | yes |