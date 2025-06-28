# Loopr - Personal Finance Dashboard

A modern, full-stack personal finance dashboard built with React (Vite), Material UI, Node.js/Express, and MongoDB.

---

## 🚀 Setup Instructions

### 1. Clone the repository
```bash
# Clone the repo
git clone <your-repo-url>
cd Loopr
```

### 2. Install dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

### 3. Configure Environment Variables
- Copy `.env.example` to `.env` in the `backend/` folder and set your MongoDB URI and JWT secret.

### 4. Seed the Database (Optional)
```bash
# From backend/
npm run seed
```

### 5. Start the Development Servers
```bash
# In project root (runs both frontend and backend)
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

---

## 🔄 Changing the Backend API URL

To test with a different backend (e.g., via Postman or a deployed API):
- Open `src/services/api.js` and change the `API_BASE_URL` at the top of the file:
  ```js
  const API_BASE_URL = 'http://localhost:5000/api'; // Change this to your backend URL
  ```
- Save and restart the frontend server.

---

## 🛠️ Usage Examples

### Login/Register
- Visit `/login` or `/register` to create an account and log in.

### Dashboard
- View analytics, charts, recent transactions, and breakdowns.

### Transactions
- Filter, search, and export transactions as CSV.

### Analytics
- See category and status breakdowns as charts.

---

## 📚 API Documentation

### Authentication
- `POST /api/auth/login` — Login with email and password
- `POST /api/auth/register` — Register a new user

### Transactions
- `GET /api/transactions` — List transactions (supports filters, pagination)
- `GET /api/transactions/analytics` — Get analytics (summary, breakdowns)
- `GET /api/transactions/filters` — Get filter options
- `POST /api/transactions` — Create a new transaction

### Export
- `POST /api/export/csv` — Export filtered transactions as CSV

#### Example CSV Format
```
id,date,amount,category,status,user_id,user_profile
1,2024-01-15T08:34:12Z,1500.00,Revenue,Paid,user_001,https://thispersondoesnotexist.com/
2,2024-02-21T11:14:38Z,1200.50,Expense,Paid,user_002,https://thispersondoesnotexist.com/
...etc
```
- The first row is always the header.
- All fields are comma-separated.

---

## 🧑‍💻 API URL for Postman

To test endpoints with Postman, set the base URL to your backend (e.g. `http://localhost:5000/api` or your deployed API).

You can change the backend URL in `src/services/api.js` as described above for local testing.

---

## 📄 License
MIT
