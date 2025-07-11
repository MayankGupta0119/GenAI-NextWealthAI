# 🚀 NextWealthAI

![NextWealthAI Logo](./public/logo1.png)

> **AI-powered financial assistant** to track, analyze & optimize your money.

[![Next.js](https://img.shields.io/badge/Next.js-15-blue?logo=nextdotjs)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.3-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql)](https://www.postgresql.org/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-3D4CE8?logo=clerk)](https://clerk.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Gemini-ff6b81?logo=google)](https://deepmind.google/technologies/gemini/)

---

## ✨ Overview

**NextWealthAI** is a full-stack Next.js application designed to manage your finances smartly.  
It enables you to:

✅ Track multiple accounts & transactions  
✅ Visualize spending trends with interactive charts  
✅ Scan receipts with Google Gemini AI  
✅ Manage budgets & set up recurring expenses  
✅ Receive personalized insights & email notifications

---

## 📚 Table of Contents

- [🚀 Overview](#-overview)
- [🔥 Features](#-features)
- [🛠️ Tech Stack](#-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [☁️ Deployment](#️-deployment)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)

---

## 🔥 Features

### 🏦 Account & Transaction Management
- Create, edit & delete accounts (`/app/(main)/account`)
- Log, filter & sort transactions in [`TransactionTable.jsx`](app/(main)/account/_components/TransactionTable.jsx)
- Set a default account with the toggle in [`AccountCard.jsx`](app/(main)/dashboard/_components/AccountCard.jsx)

### 📊 Dashboard & Analytics
- Recent transaction overview in [`DashOverview.jsx`](app/(main)/dashboard/_components/DashOverview.jsx)
- Monthly expense pie chart powered by **Recharts**
- Budget progress bar charts in [`BudgetProgress.tsx`](app/(main)/budget/_components/BudgetProgress.tsx)

### 🤖 AI Tools
- **Receipt Scanner:** Upload receipts; [`scanReceipt`](actions/transaction.js) extracts amount, date, merchant & category.
- **Auto-Categorization:** Maps AI-suggested categories to your IDs in [`TransactionForm.jsx`](app/(main)/transaction/_components/TransactionForm.jsx)

### 🔄 Recurring Transactions
- Schedule daily, weekly, monthly or yearly payments with [`transactionSchema`](app/lib/schema.js)
- Compute next recurrence via [`calculateNextRecurringDate`](lib/utils.ts)

### 🔔 Notifications & Emails
- Email confirmations with Resend in [`emails/template.jsx`](emails/template.jsx)
- In-app toasts using **Sonner**

### 🔒 Security & Rate Limiting
- Auth & user management via **Clerk**
- Simple in-memory rate limiter in [`lib/inngest/arcjet.js`] (max 10 transactions/day)

---

## 🛠️ Tech Stack

| Layer        | Tech Stack                                           |
| ------------ | ---------------------------------------------------- |
| **Framework**| Next.js 15 (App Router)                              |
| **UI**       | Tailwind CSS, Radix-UI, Lucide Icons                 |
| **Database** | PostgreSQL, Prisma ORM [`schema.prisma`](prisma/schema.prisma) |
| **Auth**     | Clerk                                                |
| **AI**       | Google Generative AI (Gemini)                        |
| **Email**    | React Email, Resend                                  |
| **Jobs**     | Inngest                                              |
| **Charts**   | Recharts                                             |
| **Utils**    | `clsx`, `tailwind-merge`                             |

---

## 📁 Project Structure

```
.
├── app/
│   ├── (main)/
│   │   ├── account/
│   │   ├── dashboard/
│   │   ├── budget/
│   │   └── transaction/
│   └── layout.tsx
├── components/
├── emails/
├── lib/
├── prisma/
│   └── schema.prisma
├── public/
├── actions/
├── package.json
└── next.config.js
```

---

## 🚀 Getting Started

### 1️⃣ Clone & Install

```bash
git clone https://github.com/MayankGupta0119/GenAI-NextWealthAI.git
cd GenAI-NextWealthAI/wealth_ai
npm install
```

---

### 2️⃣ Setup Environment

Create a `.env` file and update:

```bash
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
GEMINI_API_KEY=...
RESEND_API_KEY=...
```

---

### 3️⃣ Database

```bash
npx prisma migrate dev
npx prisma generate
```

---

### 4️⃣ Run Locally

```bash
npm run dev
```

---

## ☁️ Deployment (Vercel)

- Add your environment variables in the Vercel dashboard.

- Ensure your `package.json` contains:

```json
"scripts": {
  "build": "prisma generate && next build",
  "postinstall": "prisma generate"
}
```

---

## 🤝 Contributing

1. Fork & clone this repo.
2. Create a feature branch:

```bash
git checkout -b feature/your-feature
```

3. Commit & push your code.
4. Open a **Pull Request**.

✅ Please follow existing code style & run `npm run lint` before submitting.

---
