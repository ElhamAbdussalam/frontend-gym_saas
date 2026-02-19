# 🏋️ GymFlow - Frontend

Modern, full-featured gym management dashboard built with Next.js 15, TypeScript, and Tailwind CSS.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Available Pages](#available-pages)
- [Configuration](#configuration)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

### 🔐 Authentication

- User registration (gym owner signup)
- Login/logout with JWT tokens
- Protected routes with authentication guard
- Persistent session with Zustand

### 👥 Member Management

- Complete CRUD operations
- Search and filter members
- Member profile with QR code
- Membership purchase and renewal
- Status tracking (active, expired, frozen, suspended)

### 💳 Membership Plans

- Create and manage pricing plans
- Monthly, quarterly, and yearly billing
- Class credits and personal training options
- Active/inactive plan management

### ✅ Attendance Tracking

- Manual check-in by member search
- QR code scanning for quick check-in
- Check-out functionality
- Real-time attendance statistics
- Daily attendance reports

### 🏋️ Class Scheduling

- Create and schedule classes
- Trainer assignment
- Capacity management with visual indicators
- Class type categorization (yoga, pilates, HIIT, etc.)
- Status tracking (scheduled, ongoing, completed, canceled)

### 👨‍💼 Staff & Trainer Management

- Invite new team members
- Role-based access control (owner, staff, trainer)
- Activate/deactivate users
- Temporary password generation

### 📊 Dashboard & Analytics

- Real-time statistics overview
- Member growth tracking
- Revenue metrics
- Attendance trends
- Quick action shortcuts

### ⚙️ Settings & Profile

- User profile management
- Password change
- Subscription information
- Plan upgrade options

---

## 🛠️ Tech Stack

### Core

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling

### UI Components

- **Shadcn UI** - Beautifully designed components
- **Lucide Icons** - Icon library

### State & Data

- **Zustand** - Lightweight state management
- **TanStack Query (React Query)** - Data fetching & caching
- **Axios** - HTTP client

### Form & Validation

- **React Hook Form** - Form management
- **Zod** - Schema validation

### Utilities

- **date-fns** - Date formatting

---

## 📦 Prerequisites

Before you begin, ensure you have:

- **Node.js** 20.x or higher
- **npm** or **yarn**
- **Backend API** running on `http://localhost:8000`

Check versions:

```bash
node -v   # Should be v20.x.x or higher
npm -v    # Should be 10.x.x or higher
```

---

## 🚀 Installation

### Step 1: Clone or Navigate to Project

```bash
cd gym-saas/frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:

- Next.js and React
- TypeScript
- Tailwind CSS
- All required libraries

### Step 3: Install Shadcn UI

```bash
npx shadcn@latest init
```

Select the following options:

```
✔ Which style would you like to use? › New York
✔ Which color would you like to use as base color? › Zinc
✔ Would you like to use CSS variables for colors? › yes
```

### Step 4: Install Shadcn Components

```bash
# Install all required components
npx shadcn@latest add button input card table label
npx shadcn@latest add dialog select tabs badge avatar
npx shadcn@latest add dropdown-menu toast alert separator
```

Or install individually as needed.

### Step 5: Setup Environment Variables

Create `.env.local` in the root directory:

```bash
cat > .env.local << 'EOF'
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Frontend URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# App Name
NEXT_PUBLIC_APP_NAME=GymFlow
EOF
```

---

## 📁 Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout
│   ├── providers.tsx            # React Query provider
│   ├── globals.css              # Global styles
│   │
│   ├── auth/                    # Authentication pages
│   │   ├── login/page.tsx      # Login page
│   │   └── register/page.tsx   # Registration page
│   │
│   └── dashboard/               # Dashboard pages
│       ├── layout.tsx           # Dashboard layout (sidebar)
│       ├── page.tsx             # Dashboard home
│       ├── members/page.tsx            # Members CRUD
│       ├── membership-plans/page.tsx   # Plans CRUD
│       ├── attendance/page.tsx         # Check-in/out
│       ├── classes/page.tsx            # Classes schedule
│       ├── users/page.tsx              # Staff management
│       └── settings/page.tsx           # Settings
│
├── components/
│   └── ui/                      # Shadcn UI components
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       └── ... (auto-generated)
│
├── lib/
│   ├── api.ts                   # Axios HTTP client
│   ├── services.ts              # API service functions
│   └── utils.ts                 # Utility functions
│
├── store/
│   └── authStore.ts             # Zustand auth state
│
├── hooks/
│   └── useAuth.ts               # Custom auth hook
│
├── types/
│   └── index.ts                 # TypeScript interfaces
│
├── public/                      # Static assets
├── .env.local                   # Environment variables
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── tailwind.config.ts           # Tailwind config
└── next.config.ts               # Next.js config
```

---

## 📄 Available Pages

### Public Pages

| Route            | Description                          |
| ---------------- | ------------------------------------ |
| `/`              | Landing page with features & pricing |
| `/auth/login`    | Login page                           |
| `/auth/register` | Registration page                    |

### Protected Pages (Requires Authentication)

| Route                         | Description                         | Access     |
| ----------------------------- | ----------------------------------- | ---------- |
| `/dashboard`                  | Dashboard overview with stats       | All        |
| `/dashboard/members`          | Member management (CRUD + purchase) | All        |
| `/dashboard/membership-plans` | Plan management                     | Owner only |
| `/dashboard/attendance`       | Check-in/out tracking               | All        |
| `/dashboard/classes`          | Class scheduling                    | All        |
| `/dashboard/users`            | Staff & trainer management          | Owner only |
| `/dashboard/settings`         | Profile & settings                  | All        |

---

## ⚙️ Configuration

### Environment Variables

| Variable               | Description          | Default                     |
| ---------------------- | -------------------- | --------------------------- |
| `NEXT_PUBLIC_API_URL`  | Backend API base URL | `http://localhost:8000/api` |
| `NEXT_PUBLIC_APP_URL`  | Frontend URL         | `http://localhost:3000`     |
| `NEXT_PUBLIC_APP_NAME` | Application name     | `GymFlow`                   |

### API Configuration

API client is configured in `lib/api.ts`:

```typescript
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
```

**Features:**

- Automatic token injection from localStorage
- Auto-redirect to login on 401 errors
- Request/response interceptors

### Authentication Flow

1. User logs in → Token stored in localStorage
2. Token auto-added to all API requests
3. Protected routes check authentication
4. Invalid/expired token → Redirect to login

---

## 🔧 Development

### Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Verify Backend Connection

Before running frontend, ensure backend is running:

```bash
# In backend terminal
cd gym-saas/backend
php artisan serve

# Should show: Server running on [http://127.0.0.1:8000]
```

Test API connection:

```bash
curl http://localhost:8000/api/dashboard/stats
# Should return 401 (Unauthorized) - this is correct, means API is working
```

### Development Workflow

1. **Start backend:**

   ```bash
   cd backend && php artisan serve
   ```

2. **Start frontend:**

   ```bash
   cd frontend && npm run dev
   ```

3. **Open browser:**

   ```
   http://localhost:3000
   ```

4. **Register new gym:**
   - Navigate to `/auth/register`
   - Fill in gym details
   - Submit → Auto-login → Redirect to dashboard

---

## 🏗️ Building for Production

### Build Command

```bash
npm run build
```

This will:

1. Type check with TypeScript
2. Compile Next.js application
3. Optimize assets
4. Generate production bundle

Output in `.next/` directory.

### Start Production Server

```bash
npm start
```

### Production Checklist

- [ ] Update `.env.local` with production API URL
- [ ] Test all pages and features
- [ ] Check console for errors
- [ ] Verify API calls work
- [ ] Test authentication flow
- [ ] Check responsive design
- [ ] Run build without errors
- [ ] Test production build locally

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Cannot find module '@/...'"

**Problem:** TypeScript can't resolve path aliases.

**Solution:**
Check `tsconfig.json` has:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

#### 2. "localStorage is not defined"

**Problem:** Using localStorage in server component.

**Solution:**
Add `'use client'` directive at top of file:

```tsx
"use client";

import { useState } from "react";
// ... rest of component
```

#### 3. API calls return CORS errors

**Problem:** Backend not allowing frontend origin.

**Solution:**
Update `backend/config/cors.php`:

```php
'allowed_origins' => [
    'http://localhost:3000',
    env('FRONTEND_URL'),
],
'supports_credentials' => true,
```

Restart backend server after changes.

#### 4. "Module not found: Can't resolve 'zustand'"

**Problem:** Dependencies not installed.

**Solution:**

```bash
npm install zustand @tanstack/react-query axios date-fns
```

#### 5. Shadcn components not found

**Problem:** UI components not installed.

**Solution:**

```bash
npx shadcn@latest init
npx shadcn@latest add button input card
```

#### 6. Login redirects to login page again

**Problem:** Token not being saved or sent.

**Solution:**

1. Check browser console for errors
2. Verify localStorage has token:
   ```javascript
   localStorage.getItem("token");
   ```
3. Check Network tab for Authorization header
4. Clear localStorage and try again:
   ```javascript
   localStorage.clear();
   ```

#### 7. "Error: Hydration failed"

**Problem:** Server/client HTML mismatch.

**Solution:**

- Ensure all interactive components use `'use client'`
- Don't use browser APIs in server components
- Check for conditional rendering issues

---

## 📚 Additional Resources

### Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn UI](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://docs.pmnd.rs/zustand)

### Project Documentation

- **FRONTEND_SETUP_TUTORIAL.md** - Complete setup guide
- **QUICK_START.md** - Quick start guide
- **FILE_LIST_LENGKAP.md** - Complete file listing

### Backend Documentation

- See `../backend/README.md` for backend setup
- See `../backend/POSTMAN_GUIDE.md` for API testing

---

## 🧪 Testing

### Manual Testing Checklist

```
Authentication:
☐ Can register new gym
☐ Can login with credentials
☐ Token persists on page refresh
☐ Can logout
☐ Protected routes redirect to login when not authenticated

Members:
☐ Can create new member
☐ Can search members
☐ Can filter by status
☐ Can purchase membership for member
☐ Can delete member

Membership Plans:
☐ Can create plan
☐ Can edit plan
☐ Can delete plan
☐ Inactive plans show correctly

Attendance:
☐ Can check-in member manually
☐ Can check-out member
☐ Daily stats update correctly
☐ Attendance list shows today's records

Classes:
☐ Can schedule class
☐ Can edit class
☐ Can delete class
☐ Capacity indicator works
☐ Trainers list loads

Users (Owner only):
☐ Can invite user
☐ Temp password shown after invite
☐ Can activate/deactivate user
☐ Can delete user

Settings:
☐ Can update profile
☐ Can change password
☐ Subscription info shows correctly

Dashboard:
☐ Stats load correctly
☐ All cards show data
☐ Navigation works
☐ Quick actions redirect properly
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   ```
4. Deploy

### Other Platforms

- **Netlify:** Similar to Vercel
- **Railway:** Supports Next.js
- **DigitalOcean App Platform:** Node.js support
- **AWS Amplify:** Full Next.js support

### Environment Variables for Production

Remember to update:

- `NEXT_PUBLIC_API_URL` → Your production API URL
- `NEXT_PUBLIC_APP_URL` → Your production domain

---

## 🔐 Security Notes

- Tokens stored in localStorage (consider httpOnly cookies for production)
- API calls require authentication
- Protected routes check auth state
- CORS configured for allowed origins only
- Input validation on all forms
- XSS protection via React
- CSRF token not needed (API-only, no cookies)

---

## 📝 License

MIT License - See LICENSE file for details

---

## 🙏 Support

For issues or questions:

1. Check [Troubleshooting](#troubleshooting) section
2. Review documentation files
3. Check browser console for errors
4. Verify backend is running and accessible

---

## 📊 Stats

- **Total Pages:** 11 pages
- **Total Components:** 40+ components (including Shadcn UI)
- **Lines of Code:** ~5,000 LOC
- **Bundle Size:** ~500KB (production, gzipped)
- **Build Time:** ~30 seconds

---

**Built with ❤️ for gym owners worldwide**

🏋️ **GymFlow - Manage Your Gym Like a Pro**
