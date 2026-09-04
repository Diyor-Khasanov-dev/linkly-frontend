# ⚡ Linkly — Modern Link Shortening & Management Platform

**Linkly** is a high-performance, developer-friendly, full-featured link shortening, URL management, and QR code generation platform. Engineered with **Vue 3 (Composition API)**, **TypeScript**, **Vite**, and **Tailwind CSS v4**, Linkly offers an ultra-fast, dark-first UI with responsive dashboards, custom aliases, analytics, and authentication.

---

## 📸 Overview & Value Proposition

Linkly simplifies link management for creators, developers, and enterprises. Key capabilities include:

- **Instant URL Shortening**: Convert long URLs into concise, branded short links with custom slug aliases.
- **Usage Limits & Analytics**: Set maximum click thresholds (`maxClicks`) and monitor real-time click counts.
- **Dynamic QR Code Generation**: Generate, customize (colors, size), preview, and download QR codes on the fly.
- **Link Vault / Saver**: Organize, view, copy, and delete saved links in an intuitive dashboard.
- **Authentication & Workspaces**: Full JWT session lifecycle with local storage persistence and workspace customization.
- **Dark-First Design System**: Sleek, modern interface with smooth transitions and glassmorphism accents.

---

## 🛠️ Tech Stack & Dependencies

### **Core Stack**
- **Framework**: [Vue 3.5](https://vuejs.org/) (Composition API, `<script setup>`)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict type checking with `vue-tsc`)
- **Build Tool**: [Vite 8](https://vitejs.dev/) with `@vitejs/plugin-vue`
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) via `@tailwindcss/vite`
- **Routing**: [Vue Router 4](https://router.vuejs.org/) (HTML5 History mode & route guards)

### **Key Dependencies**
- **Iconography**: [lucide-vue-next](https://lucide.dev/)
- **QR Code Engine**: [qrcode](https://www.npmjs.com/package/qrcode) & `@types/qrcode`

---

## 📐 Project Architecture & Directory Structure

Linkly follows a modular, composable-driven architecture separating UI views, reusable design components, composable state management, and API abstractions.

```
linkly-frontend/
├── public/                     # Static assets (favicons, icons)
├── src/
│   ├── assets/                 # Global assets & branding graphics
│   ├── components/             # Atomic & Domain UI Components
│   │   ├── BaseSelect.vue      # Styled custom select dropdown component
│   │   ├── FaqSection.vue      # FAQ section with accordion interactions
│   │   ├── Features.vue        # Platform feature cards grid
│   │   ├── Footer.vue          # Public page footer
│   │   ├── LinkShortenerWidget.vue # Interactive hero URL shortener widget
│   │   ├── LoadingIndicator.vue# Top route navigation progress bar
│   │   ├── Navbar.vue          # Public navigation bar with auth status
│   │   └── Sidebar.vue         # Dashboard sidebar navigation with responsive drawer
│   ├── composables/            # State Management & REST API Layer
│   │   ├── useAuth.ts          # Authentication state, login, register, profile
│   │   └── useLinks.ts         # Short links CRUD & QR code generation
│   ├── router/
│   │   └── index.ts            # Vue Router config with navigation guards
│   ├── views/                  # Page Views
│   │   ├── dashboard/          # Dashboard Protected Sub-routes
│   │   │   ├── ProfileView.vue # Workspace profile management
│   │   │   ├── QrGeneratorView.vue # QR code creator with color/size picker
│   │   │   ├── UrlSaverView.vue# Saved links management vault
│   │   │   └── UrlShortenerView.vue # URL Shortener management view
│   │   ├── DashboardView.vue   # Shell layout wrapper for dashboard pages
│   │   ├── HomeView.vue        # Public landing homepage
│   │   ├── LoginView.vue       # User authentication / sign-in page
│   │   ├── NotFoundView.vue    # Custom 404 page
│   │   └── RegisterView.vue    # Workspace sign-up page
│   ├── App.vue                 # Root layout & route view container
│   ├── main.ts                 # Application entry point & plugin initialization
│   └── style.css               # Tailwind CSS v4 directives & design tokens
├── index.html                  # HTML template entry point
├── package.json                # Project dependencies and script declarations
├── tsconfig.json               # TypeScript base configuration
├── tsconfig.app.json           # Application TypeScript compiler options
├── tsconfig.node.json          # Node Vite config TypeScript setup
└── vite.config.ts              # Vite build configuration & alias mappings
```

---

## 🎨 Design System & UI/UX Guidelines

Linkly incorporates a dark-first aesthetic design system inspired by modern developer platforms (e.g., Vercel, Linear, Supabase).

### **Design Tokens (CSS Custom Properties)**
Defined in `src/style.css`:

```css
:root {
  --bg-primary: #09090b;     /* Main background (Zinc 950) */
  --bg-secondary: #121215;   /* Card & container background */
  --input-bg: #18181b;       /* Form input field background (Zinc 900) */
  --text-primary: #f4f4f6;   /* Primary text color (Zinc 100) */
  --text-secondary: #a1a1aa; /* Muted text color (Zinc 400) */
  --border-color: #27272a;   /* Subtle borders (Zinc 800) */
  --accent: #fafafa;         /* High-contrast accent (Zinc 50) */
  --accent-hover: #e4e4e7;   /* Hover accent state */
  --accent-blue: #3b82f6;    /* Primary brand action blue (Blue 500) */
  --card-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.5), 0 4px 12px -2px rgba(0, 0, 0, 0.3);
}
```

### **Design Principles**
1. **Typography**: Clean, sans-serif system font stack (`system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`).
2. **Elevated Cards & Glassmorphism**: Cards use `--bg-secondary` background with `--border-color` 1px borders and smooth hover transitions (`transition-all duration-200`).
3. **Interactive Feedback**: All action elements include focus rings (`focus:ring-2 focus:ring-blue-500/50 focus:outline-none`), loading spinners, and instant copy-to-clipboard feedback.
4. **Custom Scrollbar**: Minimalist semi-transparent webkit scrollbar styled for dark mode consistency.

---

## 🔌 API Reference & Composables

Linkly communicates with an external REST API backend hosted at `https://linkly-backend-8vcp.onrender.com`.

### 1. `useAuth` (`src/composables/useAuth.ts`)

Manages user session, JWT authentication tokens, and profile updates. Persists credentials in `localStorage` under keys `linkly_access_token` and `linkly_auth_user`.

#### **Exported State**
- `accessToken: Ref<string>` — Active JWT bearer token.
- `currentUser: Ref<User | null>` — Current authenticated user object.
- `isAuthenticated: ComputedRef<boolean>` — Computed boolean for auth status.
- `isLoading: Ref<boolean>` — Reactive loading flag for auth operations.

#### **Methods**
| Method | Parameters | Description |
| :--- | :--- | :--- |
| `register` | `(workspaceName: string, email: string, password?: string)` | Registers a new workspace user account. |
| `login` | `(email: string, password?: string)` | Authenticates user and stores JWT session token. |
| `fetchUser` | `()` | Fetches current user details (`/api/auth/getme`). Clears session if 401 Unauthorized. |
| `updateProfile` | `(payload: { workspaceName?: string; password?: string })` | Updates workspace name or account password (`PATCH /api/auth/getme`). |
| `logout` | `()` | Clears local session and calls backend logout endpoint. |

---

### 2. `useLinks` (`src/composables/useLinks.ts`)

Handles short link creation, fetching user-saved links, link deletion, and QR code endpoint construction.

#### **Data Models**
```typescript
export interface ShortLink {
  id: string
  shortCode: string
  shortUrl: string
  destinationUrl: string
  userId?: string
  isEssential?: boolean
  clicks: number
  maxClicks?: number | null
  lastAccessedAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateLinkOptions {
  customAlias?: string
  maxClicks?: number
}
```

#### **Methods**
| Method | Parameters | Description |
| :--- | :--- | :--- |
| `createShortLink` | `(url: string, options?: string \| CreateLinkOptions)` | Creates a short link with optional custom alias and click limits (`POST /api/links`). |
| `fetchUserLinks` | `()` | Retrieves all links created by the current authenticated user (`GET /api/links`). |
| `deleteShortLink` | `(shortCode: string)` | Permanently deletes a link by short code (`DELETE /api/links/:shortCode`). |
| `getBackendQrCodeUrl` | `(url: string, options?: { size?: number; dark?: string; light?: string })` | Constructs backend QR code endpoint URL for server-side generation. |

---

## 🚦 Router & Navigation Guards

The Vue Router configuration (`src/router/index.ts`) enforces protected route access and top navigation loading progress:

- **Public Routes**: `/` (Home), `/register`, `/login`, `/:pathMatch(.*)*` (404 Not Found)
- **Protected Routes**: `/dashboard` and children (`/dashboard/shortener`, `/dashboard/saver`, `/dashboard/qr-generator`, `/dashboard/profile`) with `meta: { requiresAuth: true }`.
- **Navigation Guard**:
  ```typescript
  router.beforeEach((to, _from, next) => {
    const { isAuthenticated } = useAuth()
    if (to.meta.requiresAuth && !isAuthenticated.value) {
      next({ path: '/login', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  })
  ```
- **Loading Progress Bar**: `App.vue` listens to `beforeEach` and `afterEach` router events to trigger `LoadingIndicator.vue`.

---

## 💻 Developer Getting Started Guide

### **Prerequisites**
- **Node.js**: `^18.0.0` or `>= 20.0.0`
- **Package Manager**: `npm` (v9+ recommended), `pnpm`, or `yarn`

### **1. Clone the Repository**
```bash
git clone https://github.com/your-org/linkly-frontend.git
cd linkly-frontend
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Start Local Development Server**
```bash
npm run dev
```
The local development server will start at `http://localhost:5173` with Hot Module Replacement (HMR).

### **4. Build for Production**
Run type-checking (`vue-tsc`) and bundle the project with Vite:
```bash
npm run build
```
Output artifacts are compiled into the `dist/` directory.

### **5. Preview Production Build**
Locally preview the production bundle:
```bash
npm run preview
```

---

## 📜 Available NPM Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Launches Vite local development server with HMR. |
| `npm run build` | Runs TypeScript compilation (`vue-tsc -b`) and Vite production build. |
| `npm run preview` | Spins up a local static web server to preview the built `dist/` folder. |

---

## 🤝 Contributing & Code Conventions

- **Single File Components (SFC)**: Use `<script setup lang="ts">` for concise, type-safe Vue components.
- **State Management**: Prefer Vue 3 Composables (`useAuth`, `useLinks`) for shared reactive state over heavy external state stores.
- **Styling**: Utilize Tailwind v4 utility classes and CSS variables in `style.css` for consistent theme tokens.
- **TypeScript**: Ensure strict typing for all API request payloads, response interfaces, and component props.
