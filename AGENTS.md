# AGENTS.md — IVIS Admin Panel (Frontend)

> Cross-tool rules compatible with Google Antigravity, Cursor, and Claude Code

---

## Project Overview

**IVIS Admin Panel** (`ivis-opal`) — Production React SPA for the Vehicle Inspection Management System admin UI.

**Tech Stack:**
- React 19 + TypeScript (strict)
- Vite 8 (dev server & build)
- React Router DOM v7
- TanStack React Query v5 (`QueryClientProvider` in `App.tsx`; feature hooks may use local state until migrated)
- Axios (shared instance + interceptors)
- Tailwind CSS v4 (`@tailwindcss/vite`)
- `clsx` + `tailwind-merge` via `cn()` utility

**Backend contract:** REST API with global envelope from IVIS-Backend `ResponseInterceptor` — see `src/types/api.types.ts`.

---

## Project Structure
src/
├── main.tsx                         # React root, global CSS imports
├── App.tsx                          # QueryClientProvider, cross-tab auth sync
│
├── api/
│   ├── axios.instance.ts            # Axios client, JWT + silent refresh
│   ├── endpoints.ts                 # Centralized path constants
│   ├── apiResponse.ts               # unwrapData, unwrapPaginated, getApiErrorMessage
│   └── services/                    # Thin API modules (user.service.ts, auth.service.ts, …)
│
├── features/                        # Domain logic per feature
│   └── <feature>/
│       ├── hooks/                   # useUsers, useRoles — data fetching & mutations
│       ├── mappers.ts               # API DTO ↔ UI view models
│       └── types.ts                 # Feature-specific UI types
│
├── pages/                           # Route-level screens (compose hooks + layout)
│   ├── auth/
│   ├── dashboard/
│   ├── users/
│   ├── master-management/
│   └── …
│
├── components/
│   └── layout/                      # MainLayout, Sidebar, Topbar
│
├── router/
│   ├── index.tsx                    # Route tree
│   ├── routes.ts                    # ROUTES path constants
│   ├── PrivateRoute.tsx             # Auth guard (token in localStorage)
│   ├── PublicRoute.tsx
│   └── RoleRoute.tsx                # Role-based guard
│
├── hooks/                           # Shared hooks (useDebounce, usePagination, usePermissions)
├── constants/                       # config, permissions, roles, rolePermissions
├── utils/                           # storage, validators, format, cn
├── store/                           # Lightweight UI state (ui.store, notification.store)
├── types/                           # api.types, common.types, env.d.ts
├── styles/                          # globals.css, tailwind.css
└── assets/                          # images, icons (import as modules in Vite)

---

## Core Architecture Rules

### Layer Separation

| Layer | Responsibility |
|-------|----------------|
| **Pages** | Route UI, forms, tables, modals — call feature hooks |
| **Feature hooks** | State, pagination, search debounce, CRUD orchestration |
| **API services** | HTTP only — use `axiosInstance`, `ENDPOINTS`, unwrap helpers |
| **Mappers** | Transform API shapes to UI list/form models |
| **Components** | Reusable layout and presentational pieces |

### Data Flow (users example)
- Do **not** call `axios` directly from pages — go through `api/services/*`.
- Do **not** put API types in pages — keep API interfaces in services, UI types in `features/*/types.ts`.

### Routing

- All paths defined in `router/routes.ts` as `ROUTES` — never hardcode path strings in pages.
- Register new routes in `router/index.tsx`.
- Protected routes wrap `MainLayout` inside `PrivateRoute`.
- Nested masters use parent `MasterManagementPage` + child routes under `/master-management/*`.

---

## Code Quality Standards

### TypeScript

- Strict compiler options (`noUnusedLocals`, `noUnusedParameters`).
- `verbatimModuleSyntax` — use `import type` for type-only imports.
- Prefer `interface` for object contracts; `type` for unions and mapped types.
- Avoid `any`; use `unknown` and narrow in error handlers.
- Path alias: `@/` → `src/` (configured in `vite.config.ts` and `tsconfig.app.json`).

### React

- Functional components only; use hooks for state and side effects.
- Colocate feature logic in `features/<name>/`, not in `pages/` when reusable.
- Keep components focused; extract subcomponents when a file grows past ~300 lines.
- Prefer controlled inputs for forms.
- Use `cn()` from `@/utils/cn` for conditional Tailwind classes.

### Naming Conventions

- Pages: `UsersPage.tsx`, `LoginPage.tsx`
- Hooks: `useUsers`, `usePermissions`, `useDebounce`
- Services: `userService`, `authService` (object export with methods)
- API types: `ApiUser`, `CreateUserPayload` in service files
- UI types: `UserListItem`, `UserFormData` in `features/*/types.ts`

---

## API Integration Rules

### Response Envelope

Backend returns:

```typescript
{
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: PaginationMeta;  // on paginated lists
}
```

- Use `unwrapData<T>()` for single resources.
- Use `unwrapPaginated<T>()` for list endpoints.
- Use `getApiErrorMessage(error, fallback)` in catch blocks.

### Endpoints

- Add paths to `api/endpoints.ts` under grouped keys (`AUTH`, `USERS`, `ROLES`, …).
- Service methods reference `ENDPOINTS` only — no inline URL strings.

### Auth

- Tokens and user session in `localStorage` via `utils/storage.ts`.
- `axios.instance.ts` attaches `Authorization: Bearer` and handles 401 refresh queue.
- Login/logout through `auth.service.ts`; permissions resolved via `constants/rolePermissions.ts`.
- Cross-tab logout/login sync in `App.tsx` via `storage` event on `auth_token`.

### Environment

- `VITE_API_BASE_URL`, `VITE_APP_NAME` — read through `ENV_CONFIG` in `constants/config.ts`.
- Never commit `.env`; document variables in `.env.example`.

---

## Security Requirements

- Never store secrets in source code.
- Never log tokens, passwords, or refresh tokens.
- Validate forms client-side (`utils/validators.ts`) before submit.
- Gate UI actions with `usePermissions()` / `PERMISSIONS` constants.
- Rely on backend authorization; frontend guards are UX only.

---

## Styling Rules

- Tailwind CSS v4 — utility-first in JSX `className`.
- Global tokens and base styles in `styles/globals.css` and `styles/tailwind.css`.
- Use design-consistent spacing, neutrals, and semantic colors already used on login/dashboard pages.
- Import SVG assets as URLs/modules from `src/assets/`.

---

## State Management

- **Server state:** Feature hooks (`useState` + `useEffect` + `useCallback`) today; prefer TanStack Query (`useQuery` / `useMutation`) for new features when caching/refetch adds value — `QueryClient` is already configured.
- **Auth session:** `localStorage` helpers in `utils/storage.ts`.
- **UI chrome:** `store/ui.store.ts`, `store/notification.store.ts` (lightweight; no Redux/Zustand yet).
- **Permissions:** `hooks/usePermissions.ts` reads stored permissions.

---

## Error Handling

- Catch errors in hooks or page handlers; surface `getApiErrorMessage` to UI state.
- Do not swallow errors silently.
- Login page maps 401 to user-friendly copy; reuse pattern elsewhere.
- Let axios interceptor handle token refresh; pages should not duplicate refresh logic.

---

## Performance Guidelines

- Debounce search inputs (`useDebounce`, default 300ms) before API calls.
- Paginate list views; pass `page` and `limit` to services.
- `QueryClient` defaults: `refetchOnWindowFocus: false`, `retry: false`.
- Lazy-load heavy routes with `React.lazy` when bundle size warrants it.

---

## Testing Requirements

- No test runner configured yet — when added, focus on hooks, mappers, and validators.
- Keep mappers pure and easy to unit test.

---

## Safety Guardrails

### Anti-Hallucination
- Never assume file contents, component signatures, or API shapes — `view` first, code second
- Never assume a component, hook, or util exists — verify with `ls` or `view` before importing
- Never invent endpoint names, field names, or response shapes — read `api/endpoints.ts` and service files first
- Never assume hook/util signatures — check source before using
- If you cannot view a file, stop and ask — do not guess
- State uncertainty explicitly; prefix with `"Assuming..."` and flag it

### Rogue File Prevention
- Never create `.js` / `.cjs` / `.mjs` patch, migration, or fix scripts at project root
- Never use `fs.readFileSync` + `fs.writeFileSync` to mutate source files via `node`
- Never `git checkout` files without user confirmation
- Never create files outside `src/` unless explicitly instructed
- All edits via `str_replace` on the target file directly
- Never chain edits across multiple files silently — list all intended changes and confirm first
- Never self-execute scripts that modify the working tree

---

## Git Conventions

- Conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`
- Keep commits focused and atomic
- PR reviews required for agent rule changes

---

## Development Workflow

### Before Coding

1. Inspect existing feature (`features/users` is the reference implementation).
2. Reuse `api/services`, `mappers`, hook, and page patterns.
3. Confirm backend endpoint exists and envelope shape matches `api.types.ts`.
4. **Never assume file contents, component signatures, or API shapes — `view` first, code second.**
5. **If uncertain about any file or pattern, stop and ask — never guess or invent.**

### New Feature Template
src/api/endpoints.ts                    # add ENDPOINTS.<FEATURE>
src/api/services/<feature>.service.ts   # CRUD + unwrap helpers
src/features/<feature>/types.ts
src/features/<feature>/mappers.ts
src/features/<feature>/hooks/use<Feature>.ts
src/pages/<feature>/<Feature>Page.tsx
src/router/routes.ts                    # ROUTES.<FEATURE>
src/router/index.tsx                    # Route + PrivateRoute


### Scripts

```bash
npm run dev      # Vite dev server
npm run build    # tsc -b && vite build
npm run lint     # ESLint
npm run preview  # Preview production build
```

---

## Response Style

- Be concise and implementation-focused
- Skip basic React/TypeScript tutorials
- Minimal comments — prefer self-documenting code
- Modify only requested sections
- No boilerplate unless explicitly requested
- State uncertainty clearly; ask one focused question instead of guessing

---

## Deployment Readiness

- No TODOs in production code paths
- Environment variables documented in `.env.example`
- Production build via `npm run build` → `dist/`
- API base URL configurable per environment

---

**Summary:** Build production-ready, type-safe React UI for IVIS. Pages compose feature hooks; hooks call API services; services use the shared Axios client and backend envelope helpers. Keep routing, endpoints, and permissions centralized. Match existing Tailwind and folder conventions. Never assume — always verify before coding.