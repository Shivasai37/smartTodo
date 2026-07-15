# SmartTodo 📝

A production-ready full-stack MERN (Express, React, JSON Server) Todo application featuring a modern, premium, responsive UI with glassmorphism effects, dark mode support, animated charts, statistics updates, quick actions, history tracking, and complete user authentication.

## 🚀 Features

- **Authentication System**:
  - Secure Login & Register using Email validation & Cryptographic hashing (bcrypt).
  - Session state persistence using JWT-like UUID tokens stored in LocalStorage.
  - Full route protection preventing unauthorized layout/data access.
- **Interactive Dashboard**:
  - Greeting card dynamic greeting according to local time.
  - Completion progress circle showing percentage.
  - Pie and Bar charts using Recharts for Category & Priority distributions.
  - Quick Todo addition.
- **Complete Todo Management**:
  - Create, Update, Delete, Complete, and Toggle Favorites.
  - Inline editing and rich category/priority options.
  - Client-side search and multi-filtering (Priority, Category, Status, Favorites).
  - Advanced pagination and sorting options.
- **Delete System & History Page**:
  - Soft-delete moving todos from active lists to the History layout.
  - Dedicated History page displaying completed/deleted items via Table or Card views.
  - Instant Restoring or permanent deletion with confirm modals.

---

## 🛠️ Project Structure

```
smarttodo/
├── client/          # Vite + React Frontend
├── server/          # Node + Express Backend
├── database/        # JSON Server database (db.json)
├── .env             # Global configuration file
├── render.yaml      # Render blueprint file
└── README.md        # Documentation
```

---

## ⚙️ Installation & Usage

1. Clone or copy this repository to your local directory.
2. Initialize and install dependencies for the root and client apps:
   ```bash
   npm run install:all
   ```
3. Create your `.env` configuration file in the root directory:
   ```env
   PORT=5000
   DB_PORT=3001
   DB_URL=http://localhost:3001
   ```
4. Start both backend, database, and client apps concurrently:
   ```bash
   npm run dev
   ```

- Front-end will be running on: `http://localhost:5173`
- Backend API will be running on: `http://localhost:5000`
- JSON DB Server will be running on: `http://localhost:3001`
