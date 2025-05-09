# Stock Crew - Setup Guide

## Overview

This guide will walk you through the process of setting up the **Stock Crew** project, including the **NestJS backend** and **Next.js frontend**. Follow the steps below to install dependencies, configure the database, and run the project locally.

---

## Clone the Repository

```sh
git clone https://github.com/mafzalbro/stock-crew.git
cd stock-crew
```

---

## Backend Setup (NestJS + Prisma)

### 1️⃣ Navigate to Backend Directory

```sh
cd backend
```

### 2️⃣ Install Dependencies

```sh
npm install
```

### 3️⃣ Set Up Environment Variables

Create a `.env` file in the `backend` directory and add the following:

```env
DATABASE_URL="postgresql://example:example@ep-royal-sky-a5my35rl-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### 4️⃣ Apply Prisma Migrations

```sh
npx prisma migrate dev
```

### 5️⃣ Seed Dummy Data in Database

```sh
npm run seed
```

### 6️⃣ Start the Backend Server

```sh
npm run start:dev
```

The backend will now be running at: **[http://localhost:3001](http://localhost:3001)**

---

## Frontend Setup (Next.js)

### 1️⃣ Navigate to Frontend Directory

```sh
cd ../frontend
```

### 2️⃣ Install Dependencies

```sh
npm install
```

### 3️⃣ Start the Frontend Server

```sh
npm run dev
```

The frontend will now be running at: **[http://localhost:3000](http://localhost:3000)**

---

## 🎉 You're All Set!

Now you can start building and testing your Stock Crew application. Happy coding! 🚀
