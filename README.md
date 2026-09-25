<div align="center">
  <h1>💰 Smart Finance (SmartSpend)</h1>
  
  <br />

  > **Vision**: *To democratize enterprise-grade financial management, enabling individuals to harness AI-driven insights for smarter budgeting, goal setting, and robust wealth tracking within a seamless, secure, and beautiful interface.*

  <p>
    <strong>An intelligent, scalable platform for modern expense management and financial clarity.</strong>
  </p>

  <img src="assets/landing-page.jpg" alt="Smart Finance Landing Page" width="100%">

</div>

---

<div align="center">
  <h3>Built With</h3>
  <img src="https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Neon_Postgres-00E599?style=for-the-badge&logo=postgresql&logoColor=black" alt="Neon" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</div>

---

## 📑 Table of Contents

- [✨ Features](#-features)
- [🏗️ System Architecture](#️-system-architecture)
- [🛠 Tech Stack](#-tech-stack)
- [⚙️ Getting Started (Local Development)](#️-getting-started-local-development)
- [🐳 Docker Setup](#-docker-setup)
- [🌐 Deployment](#-deployment)
- [📂 Project Structure](#-project-structure)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### 🔐 Secure Authentication & Session Management
* **Enterprise Security:** Stateless, highly secure session management powered by NextAuth.js.
* **Frictionless Onboarding:** Single-click OAuth integrations mapping to secure Google and GitHub identity providers.
* **Route Protection:** Middleware-driven route protection ensuring strictly authorized access to financial data.

### 📊 Comprehensive Expense Management
* **Real-time Dashboard:** A dynamic, centralized hub providing immediate visibility into daily, weekly, and monthly cash flow.
* **Goal-Oriented Planning:** Robust mechanisms to define, track, and visualize progress against specific financial targets.
* **Intelligent Categorization:** Dynamic tagging and categorization for granular expense tracking and auditing.

### 🧠 AI-Powered Analytics
* **Pattern Recognition:** Machine learning algorithms to detect spending anomalies and highlight trends.
* **Actionable Insights:** Personalized, AI-driven recommendations designed to optimize budgeting and accelerate wealth generation.

---

## 🏗️ System Architecture

Smart Finance is architected for maximum scalability, performance, and developer velocity. 

**Data Flow:**
1. **Client (Browser):** React Server Components (RSC) and highly interactive Client Components built with Next.js App Router render the UI instantly.
2. **Server Actions (Next.js):** Secure, server-side mutations handle form submissions and data processing without the need for traditional API routes.
3. **ORM Layer (Prisma):** Type-safe database queries are executed via Prisma Client, ensuring absolute data integrity.
4. **Database (Neon PostgreSQL):** A globally distributed, serverless PostgreSQL database handles persistent storage, capable of scaling to zero and spinning up instantly.

---

## 🛠 Tech Stack

| Technology | Role | Why I used it |
| :--- | :--- | :--- |
| **Next.js 14** | Frontend & API Framework | For unmatched performance via Server Components, simplified routing (App Router), and integrated Server Actions. |
| **TypeScript** | Programming Language | To enforce end-to-end type safety, significantly reducing runtime errors and improving developer experience. |
| **Tailwind CSS** | Styling | For rapid, utility-first UI development resulting in highly responsive and maintainable design systems. |
| **Prisma** | ORM | To guarantee type-safe database interactions and streamline schema migrations. |
| **Neon** | Database | Serverless PostgreSQL provides effortless scalability, branching features for dev environments, and zero-maintenance overhead. |
| **NextAuth.js** | Authentication | The industry standard for secure, flexible, and robust authentication within the Next.js ecosystem. |

---

## ⚙️ Getting Started (Local Development)

<details>
<summary><b>Click here to view step-by-step installation instructions</b></summary>
<br>

**1. Prerequisites**
* Node.js (v18 or higher)
* A Neon PostgreSQL database instance (or any standard Postgres DB)

**2. Clone the repository**
```bash
git clone https://github.com/yourusername/smart-finance.git
cd smart-finance
```

**3. Install dependencies**
```bash
npm install
```

**4. Configure Environment Variables**
Create a `.env` file in the root directory:
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

**5. Initialize Database**
```bash
npx prisma generate
npx prisma db push
```

**6. Run Development Server**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.
</details>

---

## 🐳 Docker Setup

<details>
<summary><b>Click here to view Docker Compose instructions</b></summary>
<br>

For a completely isolated and reproducible local environment, you can use Docker.

**1. Build and start the containers:**
```bash
docker-compose up -d --build
```

**2. Access the application:**
Navigate to `http://localhost:3000` in your browser. The PostgreSQL database will be running concurrently on port 5432.

**3. Stop the containers:**
```bash
docker-compose down
```
</details>

---

## 🌐 Deployment

This application is engineered for highly available, edge-optimized deployment on **Vercel**.

1. Connect your GitHub repository to Vercel.
2. Inject all required **Environment Variables** in the project settings.
3. **Override the Build Command** to ensure the Prisma Client is instantiated prior to the Next.js build step:
   ```bash
   npx prisma generate && next build
   ```
4. Deploy.

---

## 📂 Project Structure

```text
smart-finance/
├── app/                  # Next.js App Router (Pages, Layouts, API routes, Server Actions)
├── components/           # Reusable, modular UI components (Radix UI / Shadcn)
├── lib/                  # Utility functions, Prisma singleton, and NextAuth config
├── prisma/               # Prisma schema definition (.prisma)
├── public/               # Static assets
├── .env.example          # Environment variables template
├── docker-compose.yml    # Docker container orchestration
├── Dockerfile            # Multi-stage Docker build instructions
└── package.json          # Project metadata and dependency tree
```

---

## 🤝 Contributing

We believe in the power of open-source collaboration. If you have an idea to improve this enterprise platform, we welcome your pull requests.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AdvancedAnalytics`)
3. Commit your Changes (`git commit -m 'feat: implement advanced analytics dashboard'`)
4. Push to the Branch (`git push origin feature/AdvancedAnalytics`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👤 Author & Contact

**Aliza Tariq**

* 📧 Email: [alizait1192@gmail.com](mailto:alizait1192@gmail.com)
* 💻 GitHub: [@aliza-dev](https://github.com/aliza-dev)
* 🚀 Repository: [aliza-dev/smart-finance-web](https://github.com/aliza-dev/smart-finance-web)

---

<div align="center">

⭐ Star this repository if you found it helpful!

Made with ❤️ By [Aliza Tariq]

</div>