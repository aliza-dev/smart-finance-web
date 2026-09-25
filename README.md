# 💰 Smart Finance (SmartSpend)

A comprehensive, enterprise-grade financial management platform designed to track expenses, set financial goals, and provide AI-powered insights for smarter budgeting.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-ORM-1B222D?style=for-the-badge&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

---

## 🚀 Features

### Core Functionality
* **Intuitive Dashboard:** A centralized hub to view daily, weekly, and monthly spending summaries.
* **Expense Tracking:** Easily log, edit, and categorize daily expenses in real-time.
* **Goal Management:** Set specific financial targets (e.g., "Save for Vacation") and monitor your progress visually.
* **Smart Categorization:** Expenses are automatically grouped into predefined and custom categories for better tracking.

### User Management & Security
* **Secure Authentication:** Robust login system powered by NextAuth.js.
* **OAuth Integration:** One-click seamless login using **Google** and **GitHub** accounts.
* **Session Handling:** Secure credential management and persistent user sessions.
* **Protected Routes:** Unauthorized users are automatically redirected to the secure login portal.

### AI & Analytics (Premium Features)
* **Smart Insights:** Leverage AI to identify unusual spending patterns and financial anomalies.
* **Actionable Advice:** Get personalized, AI-driven recommendations to cut costs and optimize your budget.
* **Visual Reports:** Interactive charts and graphs to visualize cash flow trends over time.

---

## 🛠 Tech Stack

**Frontend:**
* Framework: Next.js 14 (App Router)
* Language: TypeScript
* Styling: Tailwind CSS
* UI Components: Radix UI / Shadcn (if applicable)

**Backend:**
* API: Next.js Server Actions & Route Handlers
* Authentication: NextAuth.js (Auth.js) v4
* ORM: Prisma

**Database:**
* Engine: Neon PostgreSQL (Serverless Database)

**Additional Tools:**
* Containerization: Docker (Optional for local development)
* Version Control: Git & GitHub

---

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed:
* Node.js (v18 or higher)
* npm, yarn, or pnpm
* Git
* A Neon PostgreSQL database connection string
* Docker & Docker Compose (Optional)

---

## ⚙️ Installation

Follow these steps to set up the project locally:

**1. Clone the repository:**
```bash
git clone [https://github.com/yourusername/smart-finance.git](https://github.com/yourusername/smart-finance.git)
cd smart-finance
```

**2. Install dependencies:**
```bash
npm install
```

**3. Generate Prisma Client:**
```bash
npx prisma generate
```

**4. Sync the database schema:**
```bash
npx prisma db push
```

---

## 🔐 Environment Variables

Create a `.env` file in the root of your project. Use the provided `.env.example` as a reference. Never commit your actual `.env` file.

```env
# Database Configuration
DATABASE_URL="postgresql://user:password@hostname/database?sslmode=require"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate_a_random_secret_string_here"

# OAuth Providers
GOOGLE_CLIENT_ID="your_google_client_id_here"
GOOGLE_CLIENT_SECRET="your_google_client_secret_here"
GITHUB_ID="your_github_client_id_here"
GITHUB_SECRET="your_github_client_secret_here"
```

---

## 🏃‍♂️ Running the App

To start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🐳 Docker Setup (Optional)

If you prefer using Docker for an isolated local environment, you can spin up the application using Docker Compose:

1. Ensure your `.env` file is properly configured.
2. Build and start the containers:
   ```bash
   docker-compose up -d --build
   ```
3. The app will be available at `http://localhost:3000`.
4. To stop the containers, run:
   ```bash
   docker-compose down
   ```

---

## 🧪 Demo Accounts / Testing

To quickly explore the application without using your personal Google or GitHub account, you can use the following test credentials (if email/password login is enabled in the future):

| Role | Email | Password |
| :--- | :--- | :--- |
| **Test User** | testuser@smartfinance.com | `TestUser123!` |
| **Admin** | admin@smartfinance.com | `AdminPass2026#` |

*(Note: Currently, authentication is handled securely via Google/GitHub OAuth. To test, simply log in with any standard Google or GitHub account.)*

---

## 📂 Project Structure

```text
smart-finance/
├── app/                  # Next.js App Router (Pages, Layouts, API routes)
├── components/           # Reusable UI components (Buttons, Inputs, Modals)
├── lib/                  # Utility functions, Prisma client, and Auth configuration
├── prisma/               # Prisma schema and database migrations
├── public/               # Static assets (images, fonts, icons)
├── .env.example          # Environment variables template
├── docker-compose.yml    # Docker container orchestration
├── Dockerfile            # Docker image instructions
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
   * **Build Command:** `npx prisma generate && next build`
5. Click **Deploy**.

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🙌 Acknowledgements

* [Next.js Documentation](https://nextjs.org/docs)
* [Prisma Database ORM](https://www.prisma.io/)
* [NextAuth.js for Authentication](https://next-auth.js.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Neon Serverless Postgres](https://neon.tech/)