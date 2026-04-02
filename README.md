# ShopMind AI (Shop Connect)

ShopMind AI is a premium SaaS platform that allows Shopify and WooCommerce store owners to embed a smart, conversion-optimized AI sales agent directly into their storefronts. This widget acts as a 24/7 sales representative, answering customer questions, upselling products, and recovering abandoned carts.

## 🚀 Features

- **Store-Aware AI Widget:** Provide a dynamic, live chat experience directly on your e-commerce storefront.
- **Conversion Optimization:** Intelligently identifies purchasing intent to recommend and upsell items.
- **Real-Time Analytics:** Track revenue generated, carts recovered, and conversations inside a premium dashboard.
- **Customizable Appearance:** Control the widget's branding, greeting messages, and personality traits via the dashboard.
- **Supabase Authentication:** Secure, robust user flow with Email/Password and Google OAuth.
- **Domain-Driven Architecture:** Highly modular Next.js App Router setup separated into Frontend, Backend, Database, and Auth modules.

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Authentication:** Supabase Auth
- **Database:** PostgreSQL (via Supabase) with Row Level Security (RLS)
- **Styling:** Tailwind CSS & Framer Motion for animations
- **Icons:** Lucide React
- **Data Fetching:** Server actions and secure server-side fetching

## 📂 Project Structure

```
shopmind-ai/
├── src/
│   ├── app/                      # Next.js Routes and API Endpoints
│   ├── modules/
│   │   ├── frontend/             # Reusable UI Components
│   │   ├── backend/              # Core utility and AI lib functions 
│   │   └── database/             # Supabase clients
│   └── middleware.ts             # Auth routing and state guards
├── public/                       # Static Assets
└── supabase-schema.sql           # Database table definitions
```

## 💻 Getting Started

### 1. Configuration
Create a `.env.local` file in the root directory and add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. Database Setup
Run the SQL definitions located in `supabase-schema.sql` inside your Supabase project's SQL Editor to set up the necessary tables (`widget_configs`, `store_metrics`, `conversations`) and policies.

### 3. Installation
Install the required dependencies:

```bash
npm install
```

### 4. Running the App
Start the development server:

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
