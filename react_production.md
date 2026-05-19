# Admin Panel

A modern, scalable admin panel built with React 19, Vite 8, TypeScript, and Zustand ,TanStack Query



---I

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| UI Framework | React | 19.2 |
| Build Tool | Vite | 8.x |
| Language | TypeScript | Latest |
| State Management | Zustand | 2.x |
| API Calls | Fetch API | Native |
| Styling | Tailwind CSS | Latest |
| Routing | React Router | Latest |

---

## Project Structure

```
admin-panel/
├── public/
│   └── favicon.ico
│
├── src/
│   ├── api/                          # All API logic
│   │   ├── axios.instance.ts         # Base config + interceptors
│   │   ├── endpoints.ts              # API endpoint constants
│   │   └── services/
│   │       ├── auth.service.ts
│   │       ├── user.service.ts
│   │       └── dashboard.service.ts
│   │
│   ├── assets/                       # Static assets
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── components/                   # Reusable UI components
│   │   ├── ui/                       # Primitives (Button, Input, Modal)
│   │   ├── layout/                   # Sidebar, Header, Footer, AdminLayout
│   │   └── shared/                   # Cross-feature components
│   │
│   ├── features/                     # Feature-based modules (CORE)
│   │   ├── auth/                     # Login, ForgotPassword, auth store
│   │   ├── users/                    # UserTable, UserForm, users store
│   │   └── dashboard/                # StatsCard, RevenueChart
│   │
│   ├── hooks/                        # Global custom hooks
│   │   ├── useDebounce.ts
│   │   ├── usePagination.ts
│   │   └── usePermissions.ts
│   │
│   ├── pages/                        # Route-level page components
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── users/
│   │   ├── NotFoundPage.tsx
│   │   └── UnauthorizedPage.tsx
│   │
│   ├── router/                       # Routing config
│   │   ├── index.tsx                 # Root router
│   │   ├── PrivateRoute.tsx          # Auth guard
│   │   ├── RoleRoute.tsx             # Role-based guard
│   │   └── routes.ts                 # Route path constants
│   │
│   ├── store/                        # Global Redux stores
│   │   ├── ui.store.ts               # Theme, sidebar state
│   │   └── notification.store.ts     # Toast / alerts
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   └── tailwind.css
│   │
│   ├── types/                        # Global TypeScript types
│   │   ├── api.types.ts
│   │   ├── common.types.ts
│   │   └── env.d.ts
│   │
│   ├── utils/                        # Pure utility functions
│   │   ├── format.ts                 # Date, currency formatters
│   │   ├── storage.ts                # localStorage helpers
│   │   ├── validators.ts
│   │   └── cn.ts                     # clsx + twMerge helper
│   │
│   ├── constants/                    # App-wide constants
│   │   ├── roles.ts                  # USER_ROLES enum
│   │   ├── permissions.ts
│   │   └── config.ts                 # Env var config
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── .env
├── .env.development
├── .env.production
├── .env.example
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tailwind.config.ts
├── eslint.config.ts
├── .prettierrc
├── .gitignore
└── package.json
```

---

## Architecture Decisions

### Feature-based Structure
Each feature (`auth`, `users`, `dashboard`) is self-contained with its own components, hooks, store slice, and types. This keeps related code co-located and makes features easy to add, remove, or scale independently.

### State Management — Redux Toolkit 2.x
Redux Toolkit is used for global, scalable state. Feature-level slices live inside `features/<name>/store/`, while truly global state (UI theme, notifications) lives in `src/store/`.

### API Layer — Fetch API
All server communication uses the native Fetch API. API logic is centralized in `src/api/services/` with endpoint constants in `endpoints.ts`. This keeps components clean and API calls easy to mock or replace.

### Routing & Guards
`PrivateRoute` handles authentication checks. `RoleRoute` handles role-based access control using the roles defined in `constants/roles.ts`.

---

## Environment Variables

```bash
# Copy the example file and fill in your values
cp .env.example .env.development
```

All environment variables are typed in `src/types/env.d.ts` and accessed through `src/constants/config.ts`.

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

---

## Naming Conventions

| Type | Convention | Example |
|---|---|---|
| Components | PascalCase | `UserTable.tsx` |
| Hooks | camelCase with `use` prefix | `useAuth.ts` |
| Stores | camelCase with `.store` suffix | `auth.store.ts` |
| Types | camelCase with `.types` suffix | `auth.types.ts` |
| Services | camelCase with `.service` suffix | `auth.service.ts` |
| Constants | camelCase | `roles.ts` |
| Utilities | camelCase | `format.ts` |

---

## Key Patterns

- **Barrel exports** — each feature and `ui/` folder has an `index.ts` for clean imports
- **Co-located types** — each feature owns its types; global types live in `src/types/`
- **Separation of concerns** — API calls live in services, not components or hooks directly
- **Role-based access** — permissions defined centrally in `constants/permissions.ts`
