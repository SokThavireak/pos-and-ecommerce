# Unified POS & E-Commerce Web Application

A production-ready, white-label E-Commerce & Point of Sale (POS) system built with **Nuxt 3**, **NestJS**, **TypeORM**, and **PostgreSQL**.

---

## Architecture Overview

```
POS and E-C/
├── docker-compose.yml          # PostgreSQL 16 container setup
├── backend/                    # NestJS REST & WebSocket Backend
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   ├── .env.example
│   └── src/
│       ├── main.ts             # Port 3001 with CORS enabled
│       ├── app.module.ts       # TypeORM synchronize: true
│       ├── database/
│       │   ├── entities/       # User, Product, Category, Order, OrderItem, StoreSettings
│       │   └── seeder.service.ts # Auto-seeds Admin, Cashier, Products, and Settings
│       └── modules/
│           ├── settings/       # Dynamic white-label engine
│           ├── catalog/        # Products & categories CRUD
│           └── events/         # WebSocket AppGateway (Socket.io)
└── frontend/                   # Nuxt 3 Client Application
    ├── package.json
    ├── nuxt.config.ts          # Pinia, VueUse, Tailwind & Icons
    ├── tailwind.config.ts      # Bound to CSS variables (--color-primary, --color-secondary, --color-surface)
    ├── app.vue
    ├── assets/css/main.css
    ├── stores/
    │   ├── theme.ts            # Dynamic color token state
    │   └── cart.ts             # Unified Cart & POS Ticket store
    ├── plugins/
    │   └── theme.client.ts     # Real-time WebSocket connection to backend
    ├── components/
    │   ├── SiteHeader.vue      # Editorial navigation header
    │   ├── SiteFooter.vue      # Minimalist high-contrast dark footer
    │   └── AdminSidebar.vue    # Floating vertical dark pill sidebar
    └── pages/
        ├── index.vue           # 1. Landing Page ("Editorial Bento Minimalist")
        ├── shop.vue            # 2. E-Commerce Shop Page ("Clean Filterable Catalog")
        ├── login.vue           # 3. Authentication Page ("Dark Split Bento")
        ├── pos.vue             # 4. Point of Sale Terminal (Barcode & Touch Screen)
        ├── admin/
        │   ├── index.vue       # 4. Admin Dashboard Bento OS Grid
        │   └── settings.vue    # Admin Brand Customization Studio
```

---

## Quick Start Instructions

### 1. Start the PostgreSQL Database
```bash
docker compose up -d
```
* PostgreSQL will run on `localhost:5432`
* Database: `pos_ecommerce_db`
* User: `postgres`
* Password: `postgrespassword`

### 2. Start the NestJS Backend (Code-First Auto-Build & Seeder)
```bash
cd backend
npm install
npm run start:dev
```
* TypeORM will automatically construct all PostgreSQL tables on startup (`synchronize: true`).
* `DatabaseSeederService` will automatically seed the 4 default RBAC users, categories, products, and default store settings:
  * **OWNER:** `owner@biolabs.com` / `ownerpassword` (Full business overview, financials, orders & store ownership)
  * **ADMIN:** `admin@biolabs.com` / `adminpassword` (Brand studio, color engine & system configurations)
  * **CASHIER:** `cashier@biolabs.com` / `cashierpassword` (Dedicated in-store POS terminal & barcode checkout)
  * **CUSTOMER:** `customer@biolabs.com` / `customerpassword` (Online research catalog, cart & order history)
* NestJS will listen on `http://localhost:3001`.

### 3. Start the Nuxt 3 Frontend
```bash
cd frontend
npm install
npm run dev
```
* Open your browser at `http://localhost:3000`.

---

## Implemented Pages & Features

1. **Editorial Bento Minimalist Landing Page (`/`)**:
   * Split bento hero card with warm editorial surface background (`bg-[var(--color-surface)]`).
   * Spinning verified badge bridging the center hero gap.
   * Curated 4-column product carousel with wishlist triggers and instant cart additions.
   * Interactive product spotlight with expandable `- / +` accordions.
   * Frosted-glass video banner and split FAQ / Newsletter bento section.

2. **Clean Filterable Shop Catalog (`/shop`)**:
   * Minimalist light-gray subheader with breadcrumbs.
   * 12-column asymmetric layout (3-column sidebar with category counts, price range slider, size pills, brand checkboxes, and popular tags; 9-column product grid with search and pagination).

3. **Dark Split Bento Auth (`/login` & `/register`)**:
   * 50/50 desktop split layout with `bg-[#0d0d0d]`.
   * Left 3x3 Bento visual grid mixing photography, colored typography cards, and brand tiles.
   * Right minimalist dark inputs, solid white pill CTA button, demo quick-fill buttons, and OAuth options.

4. **Modern Tablet/Desktop OS Admin Dashboard (`/admin`)**:
   * Floating vertical dark pill sidebar (`bg-[#141414]`).
   * 12-month dual-channel bar chart with floating dark tooltip.
   * 3-tier KPI stack (Total Customers with split progress bar, Total Revenue with sparkline, and Total Orders with SVG bezier chart).
   * Country donut chart and live orders activity list.
   * Full-width product sales table with discounts and stock levels.

5. **Brand Customization Studio (`/admin/settings`)**:
   * Color pickers for `--color-primary`, `--color-secondary`, and `--color-surface`.
   * Preset palette options (Warm Editorial, Sage Botanicals, Nordic Indigo, Onyx Monochrome).
   * Live runtime preview card.
   * Real-time WebSocket broadcasting to all open tabs.

6. **Touch & Barcode POS Terminal (`/pos`)**:
   * Instant search and barcode scanner listener (`8934500101`, etc.).
   * Category filter pills and touch-friendly product cards.
   * Live receipt ticket with quantity controls, discounts (0%, 5%, 10%, 15%), and instant checkout modal.
