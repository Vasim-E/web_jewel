# Jewel - Luxury E-Commerce Platform

A production-ready, scalable MERN stack e-commerce website for the luxury women's jewelry brand "Jewel".

## Features

-   **Luxury Aesthetic**: Premium UI with Tailwind CSS and Framer Motion.
-   **Full E-Commerce Flow**: Home -> Shop -> Product -> Cart -> Checkout.
-   **Packaging Customization**: Users can select custom packaging options (Box, Cloth, Ribbon) with dynamic pricing.
-   **Authentication**: Secure JWT-based auth with Role-Based Access Control (Admin/User).
-   **Admin Dashboard**: Manage products, orders, and view analytics.
-   **Tech Stack**: Next.js (App Router), TypeScript, Node.js, Express, MongoDB.

## Project Structure

```
/
├── backend/          # Node.js/Express Server
│   ├── config/       # DB, Env config
│   ├── controllers/  # Route logic
│   ├── models/       # Mongoose Schemas
│   ├── routes/       # API Routes
│   ├── middleware/   # Auth, Error handling
│   ├── utils/        # Helpers
│   └── data/         # Seed data
├── frontend/         # Next.js Application
│   ├── src/
│   │   ├── app/      # Pages (App Router)
│   │   ├── components/# Reusable UI
│   │   ├── lib/      # API clients, utils
│   │   ├── store/    # Zustand state
│   │   └── types/    # TypeScript interfaces
└── README.md
```

## Setup Instructions

### Prerequisites
-   Node.js (v18+)
-   MongoDB (Running locally or Atlas)

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment Variables:
    -   Create a `.env` file in the root of `backend/`.
    -   Add the following (adjust as needed):
        ```env
        NODE_ENV=development
        PORT=5000
        MONGO_URI=mongodb://localhost:27017/jewel_db
        JWT_SECRET=your_jwt_secret
        ```
4.  Seed Database (Optional):
    ```bash
    npm run data:import
    ```
    *(Note: Add `"data:import": "node seeder.js"` to `package.json` scripts if not present)*
5.  Start the Server:
    ```bash
    npm run dev
    ```

### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment Variables:
    -   Create `.env.local` in `frontend/`.
    -   Add:
        ```env
        NEXT_PUBLIC_API_URL=http://localhost:5000/api
        ```
4.  Start the Development Server:
    ```bash
    npm run dev
    ```
5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Access
-   Login with the seeded admin account (check `backend/data/users.js` for credentials).
-   Go to `/admin` to access the dashboard.
