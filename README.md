# Smart Finance (SmartSpend) 💰

> An intelligent enterprise-grade platform for managing expenses, setting financial goals, and gaining AI-powered insights.

![Deployment Status](https://img.shields.io/badge/deployment-live%20on%20Vercel-success?style=for-the-badge&logo=vercel)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript)

---

## ✨ Features

### 🔐 Authentication
* **Secure Login:** Seamless and secure user authentication powered by NextAuth.js.
* **OAuth Integrations:** One-click login using **Google** and **GitHub** providers.
* **Account Management:** Robust session handling and secure credential management.

### 📊 Expense Management
* **Intuitive Dashboard:** A clean, responsive interface to track daily, weekly, and monthly spending.
* **Goal Setting:** Define personalized financial goals and monitor progress in real-time.
* **Categorization:** Automatically organize expenses into customizable categories.

### 🧠 AI Insights
* **Smart Analytics:** Leverage AI to identify spending patterns and anomalies.
* **Actionable Advice:** Receive personalized recommendations on how to save money and budget better.

---

## 🛠 Tech Stack

### Frontend
* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS

### Backend
* **API:** Next.js Server Actions & Route Handlers
* **Authentication:** NextAuth.js (Auth.js)
* **ORM:** Prisma

### Database
* **Database Engine:** Neon PostgreSQL (Serverless)

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
* **Node.js** (v18 or higher)
* **npm** (or yarn/pnpm)
* A **Neon PostgreSQL** database instance

---

## 🚀 Installation

Follow these steps to set up the project locally:

1. **Clone the repository**
   ```bash
   git clone [https://github.com/yourusername/smart-finance.git](https://github.com/yourusername/smart-finance.git)
   cd smart-finance
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

4. **Sync the database schema**
   ```bash
   npx prisma db push
   ```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory and add the following keys. Do not commit this file to version control.

```env
# Database
DATABASE_URL="postgresql://user:password@hostname/database?sslmode=require"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_generated_secret_key"

# Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# GitHub OAuth
GITHUB_ID="your_github_client_id"
GITHUB_SECRET="your_github_client_secret"
```

---

## 🏃‍♂️ Running the App

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application in action.

---

## 📂 Project Structure

```text
smart-finance/
├── app/                  # Next.js App Router (Pages, Layouts, API routes)
├── components/           # Reusable UI components
├── lib/                  # Utility functions, Prisma client, and Auth configuration
├── prisma/               # Prisma schema and database migrations
├── public/               # Static assets (images, fonts, etc.)
├── .env.example          # Environment variables template
├── package.json          # Project dependencies and scripts
└── tailwind.config.ts    # Tailwind CSS configuration
```

---

## 🌐 Deployment

This project is optimized for deployment on Vercel.

1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. Add all the required Environment Variables in the Vercel dashboard.
4. **Crucial Step:** Override the default Build Command in Vercel settings to ensure the Prisma Client is generated before building:
   * **Build Command:**
     ```bash
     npx prisma generate && next build
     ```
5. Click **Deploy**.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License.