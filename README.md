# AURA — Headless E-Commerce & Admin Suite

A full-stack, luxury e-commerce platform and administrative store console built for **AURA Atelier**. Built on **Next.js 14 (App Router)**, **Prisma ORM**, and **SQLite**, this project features a high-performance customer storefront alongside a rich store owner console for managing multi-variant product catalogs, inventory movements, customer orders, discounts, suppliers, and store settings.

---

## ✨ Features & Modules

### 🛍️ Storefront (Customer Experience)

#### Core Shopping Experience
- **Next.js 14 App Router** — React Server Components (RSC), file-based routing, streaming SSR, and edge optimizations.
- **Brand Palette Theme (`#1e3932`)** — Deep emerald green signature brand theme across dark surfaces, header accents, and buttons.
- **Top Announcement Marquee Bar** — Admin-configurable top announcement banner with continuous scrolling ticker animation mode (`announcement_text`, `announcement_marquee`, `announcement_enabled`).
- **WhatsApp Concierge & Inquiries** — Floating WhatsApp concierge button and direct "Enquire on WhatsApp" action on Product Detail Pages with pre-filled product details.
- **Dynamic Catalog & Collections** — 10 products per page pagination, sorting (Price, Title, Newest), and smart collections (`/collections/all`, `/collections/bestsellers`, `/collections/new-arrivals`).
- **Sold Out Items Placed Last** — Automated product sorting that pushes out-of-stock / sold-out items (`availableForSale === false` or `totalInventory === 0`) to the very end of catalog grids.

#### Product Detail Pages (PDP)
- **Multi-variant Option Selector** — Material, Size, Length, Finish with real-time pricing and compare-at prices.
- **Live Inventory Stock Indicators** — Real-time stock level display with low stock warnings.
- **GIA Certification Specs** — Diamond certification details display.
- **Product Demo Video Player** — Embedded video showcase for products.
- **Care & Handling Instructions** — Collapsible accordion with liquid contact precautions, storage, and cleaning guide.
- **Lookbook Strip** — Editorial-style product showcase with imagery and call-to-action.
- **Fit Guide Modal** — Detailed sizing charts for Sarees, Tops, and stretch meter indicators.
- **Recently Viewed Products** — localStorage-backed recently viewed history (up to 6 items).
- **Complete the Look** — Cross-sell recommendations for complementary products.
- **Blouse Customizer** — Feature-flagged blouse customization with unstitched/standard/custom options, bust size, and neckline selection.
- **Petticoat Addon** — Matching petticoat add-on with fabric selection (Pure Cotton, Art Silk, Can-can).
- **Compare Drawer** — Compare up to 3 sarees side-by-side with localStorage persistence.

#### Homepage Features
- **Hero Slider** — Auto-rotating image carousel with manual navigation and configurable interval.
- **Testimonials Section** — Customer reviews with star ratings and product attribution.
- **Newsletter Subscription** — Email capture form with success state animation.

#### Navigation & Discovery
- **Browse Categories Menu** — Mega menu with nested subsections, featured cards, and hot badges.
- **Search Page** — Full-text product search with query parameter support.
- **Breadcrumb Navigation** — Consistent breadcrumb trails across all pages.

#### Shopping Cart & Checkout
- **Variant-Aware Cart Drawer** — Database-backed shopping cart with live subtotal calculation, gift note input, free shipping progress bar, and a prominent **Login Offer Alert Banner** encouraging guest users to log in for exclusive member rewards.
- **Guest Checkout & Address Capture** — Unauthenticated guest browsing and checkout with full address entry fields (Name, Email, Phone, Street Address, City, State, Pincode) and an optional checkbox to auto-create a Customer account during checkout.
- **Luxury Gift Wrap** — Feature-flagged gift wrapping option during checkout.

#### Customer Account Portal
- **Account Dashboard** — Tabbed interface with Account, Orders, Wishlist, and Settings sections.
- **Customer Authentication** — Sign in / Sign up with email and password.
- **Order History** — View past orders with status tracking.
- **Wishlist Management** — Save and manage favorite products with quick add-to-cart.
- **Guest Welcome Modal** — First-time visitor welcome with exclusive coupon offer.

#### Engagement & Social Proof
- **Live Sales Toast** — Rotating social proof notifications showing recent purchases from other customers.
- **Cookie Consent Banner** — GDPR-compliant cookie consent with accept/decline options.

#### Content Pages
- **About Page** — Brand story with values (Craft, Intention, Integrity).
- **Contact Page** — Contact form with store details (email, phone, address, hours).
- **Store Policies** — Privacy Policy, Terms & Conditions, Shipping Policy, Refund Policy pages.

#### SEO & Performance
- **Metadata API** — Dynamic meta titles and descriptions for all pages.
- **Automated `sitemap.xml`** — Dynamic sitemap generation.
- **`robots.txt`** — Search engine crawling rules.
- **Security Headers** — Next.js security header configuration.
- **Optimized Image Pipeline** — Next.js Image component with lazy loading.
- **Responsive Tailwind Styling** — Mobile-first responsive design.

---

### 🛡️ Admin Console (`/admin`)

#### Authentication & Security
- **Passcode Protection** — bcrypt-hashed credentials with DB-backed session management.
- **Session Management** — 7-day token cookies with Next.js middleware route guarding.
- **Admin Login** — Dedicated login page at `/admin/login`.

#### Dashboard & Analytics
- **Admin Dashboard** — Overview of store metrics and quick actions.
- **Analytics Charts** — Revenue trends (6-month view), category breakdown, top products by revenue, and profit metrics.

#### Product Catalog Management
- **Product CRUD** — Create, read, update products with custom handles, descriptions, vendors, categories, tags, images, price ranges, compare-at prices, and custom option sets.
- **Variant Matrix Generator** — Automatically generate option combinations (e.g. Length × Finish) with automated SKU/barcode uniqueness validation.
- **Product & Variant Archiving / Restoration** — Archive items or specific variants from the active catalog. Restore single variants or entire products back to active inventory with a single click.

#### Stock Control & Inventory Center (`/admin/inventory`)
- **Real-time Metrics** — Total In Stock, Low Stock Warning, Out of Stock, Inventory Valuation.
- **Restock & Adjust** — Perform restocks or manual stock adjustments with audit logs (`InventoryMovement`).
- **Variant-level Movements** — Track inventory movements per variant with history.

#### Order Management Console (`/admin/orders`)
- **Order Listing** — Search and filter orders by status (`All`, `Processing`, `Shipped`, `Fulfilled`) or customer query.
- **Order Management Modal** — Interactive modal for inspecting customer details, line items, address, and changing fulfillment status with real-time DB persistence.
- **Order Print Invoice** — Printable invoice view for individual orders at `/admin/orders/[id]/print`.

#### Customer Management (`/admin/customers`)
- **Customer Profiles** — Aggregated customer data from orders with tier classification.
- **Customer Tiers** — VIP Collector, Loyal Buyer, First Timer based on order history.
- **Search & Filter** — Search customers by name/email and filter by tier.
- **Customer Details** — View order count, total spent, last order date, contact info.

#### Supplier Management (`/admin/suppliers`)
- **Weaver Supplier Orders** — Track handloom supplier orders with master weaver details.
- **Order Status Tracking** — Weaving In Progress, In Transit, Received & QC Passed.
- **Supplier Details** — Location, phone, saree description, quantity, cost, advance paid, expected date.

#### Discount Management (`/admin/discounts`)
- **Discount Codes** — Create percentage or fixed amount discount codes.
- **Minimum Subtotal** — Set minimum order value for discount eligibility.
- **Discount CRUD** — Create, list, and delete discount codes.

#### Store Settings (`/admin/settings`)
- **Store Details** — Name, Email, WhatsApp Phone Number, Currency, Free Shipping threshold, Return Window.
- **Announcement Configuration** — Top Announcement text & Marquee toggle.
- **Notification Switches** — Alert toggle controls.
- **Theme Preference** — Light/Dark/System theme selection.

---

### 🎨 Theme & UI Alert System

- **Theme Engine (Light, Dark, System)** — Reactive `ThemeContext` supporting Light, Dark, and OS System preference (`prefers-color-scheme`) with `localStorage` persistence and custom dark mode surface palettes.
- **Luxury UI Alert Component** — Reusable alert banner with 4 status tones (`success`, `error`, `warning`, `info`), icons, title/body layout, and dismiss buttons.
- **Custom Confirmation Modal** — Animated modal dialog with backdrop blur, replacing native browser `confirm()` popups.
- **Global Toast System** — Floating status toasts with auto-dismissal and enter/exit animations.

---

### 🚩 Feature Flags

The application includes a client-side feature flag system for toggling advanced features:

| Flag | Description |
| :--- | :--- |
| `guestWelcomeOffer` | Welcome modal with exclusive coupon for first-time visitors |
| `blouseCustomizer` | Blouse customization options on product pages |
| `matchingPetticoatAddon` | Matching petticoat add-on option |
| `liveSalesToasts` | Rotating social proof purchase notifications |
| `compareDrawer` | Side-by-side product comparison (up to 3 items) |
| `luxuryGiftWrap` | Gift wrapping option during checkout |

Feature flags are stored in `localStorage` and can be toggled via the admin console or browser developer tools.

---

## 🧰 Tech Stack

- **Framework**: [Next.js 14.2](https://nextjs.org) (App Router, Server Actions, RSC)
- **Library**: [React 18.3](https://react.dev)
- **Database & ORM**: [Prisma ORM 5.22](https://www.prisma.io) + **SQLite**
- **Authentication**: [bcryptjs](https://www.npmjs.com/package/bcryptjs) + Cookie-based sessions
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com) + `clsx` + `tailwind-merge`
- **Icons**: [lucide-react](https://lucide.dev)
- **Testing**: [Vitest 2.1](https://vitest.dev) + `happy-dom` + [Playwright](https://playwright.dev) (E2E)
- **Language**: [TypeScript 5.4](https://www.typescriptlang.org)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.17+` (v20.x recommended)
- **SQLite**: Included via Prisma (no external database server required)

### 1. Clone & Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file from the example:

```bash
cp .env.example .env.local
```

Example configuration (`.env.local`):

```dotenv
# Database Connection (Required)
DATABASE_URL="file:./dev.db"

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Feature Flags
NEXT_PUBLIC_CART_DRAWER_ENABLED=true

# Admin Credentials (Used by seed script)
ADMIN_EMAIL="admin@sss.com"
ADMIN_PASSWORD="admin123"

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=
```

### 3. Run Database Migrations

Apply the Prisma schema to set up your SQLite database:

```bash
npm run db:migrate
```

### 4. Seed Initial Data

Populate default admin credentials, collections, products, variants, and store settings:

```bash
npm run db:seed
```

> **Default Admin Login**:
> - **Email**: `admin@sss.com`
> - **Password**: `admin123`

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the storefront or [http://localhost:3000/admin](http://localhost:3000/admin) for the store owner console.

---

## 🗄️ Database Architecture (`prisma/schema.prisma`)

| Model | Description |
| :--- | :--- |
| `User` | Admin store owner account with email and bcrypt `passwordHash`. |
| `Customer` | Registered storefront customer account for faster checkout. |
| `Session` | Database-backed admin login session tokens with 7-day expiration. |
| `Setting` | Key-value store configuration settings (Store Name, Email, WhatsApp Number, Currency, Shipping Threshold, Return Window, Announcement Text, Announcement Marquee, Alert Toggles). |
| `Collection` | Categorized product groupings (handle, title, description, image, SEO metadata). |
| `CollectionItem` | Join model mapping products to collections with position ordering. |
| `Product` | Main product catalog record (handle, title, description, vendor, type, tags, price, compareAtPrice, images, options, inventory summary). |
| `ProductVariant` | Individual product SKU variant (title, price, compareAtPrice, stock, lowStockThreshold, selectedOptions, SKU, barcode, archived status). |
| `InventoryMovement` | Inventory audit trail tracking restocks and manual stock adjustments. |
| `Order` | Placed customer orders (order number, status, customer name, email, phone, shipping address JSON, subtotal, shipping, total, payment method). |
| `OrderItem` | Snapshot of purchased line items inside an order. |
| `Cart` | Customer shopping cart identified by a unique session token. |
| `CartItem` | Line item in a cart linked to a specific `ProductVariant` and `Product`. |

---

## 🔌 API Route Reference (`src/app/api/`)

### Authentication
- `POST /api/auth/login` — Authenticate admin credentials and issue session token cookie.
- `POST /api/auth/logout` — Invalidate admin session cookie.
- `GET /api/auth/me` — Return current active admin session user.

### Customer Authentication
- `POST /api/auth/customer/signup` — Register a new customer account.
- `POST /api/auth/customer/signin` — Authenticate customer credentials.
- `POST /api/auth/customer/logout` — Invalidate customer session.
- `GET /api/auth/customer/me` — Return current logged-in customer user.

### Storefront & Cart
- `GET /api/cart` — Retrieve active cart by token.
- `POST /api/cart` — Create a new shopping cart.
- `POST /api/cart/items` — Add a product variant line item to cart.
- `PATCH /api/cart/items` — Update line item quantity.
- `DELETE /api/cart/items` — Remove a line item from cart.
- `POST /api/cart/note` — Set cart order note.
- `POST /api/checkout` — Place an order with guest/customer address details, option to create account, deduct stock, and update variant availability.

### Catalog & Discovery
- `GET /api/categories` — List all product categories.
- `GET /api/clothing-catalog` — Fetch clothing catalog data.

### Admin Operations
- `GET /api/admin/products` — List active or archived products.
- `POST /api/admin/products` — Create a new product with variants.
- `PATCH /api/admin/products/[id]` — Update basic product fields.
- `DELETE /api/admin/products/[id]` — Archive a product and its child variants.
- `PATCH /api/admin/products/[id]/restore` — Restore an archived product and all of its variants.
- `PATCH /api/admin/variants/[id]` — Update variant SKU, barcode, price, stock, or threshold.
- `PATCH /api/admin/variants/[id]/restore` — Restore a single variant (and un-archive parent product if archived).
- `GET /api/admin/variants/[id]/movements` — Get inventory movement history for a variant.
- `POST /api/admin/inventory/movements` — Record a restock or stock adjustment.
- `GET /api/admin/orders` — List customer orders.
- `PATCH /api/admin/orders/[id]` — Update order status (`Processing`, `Shipped`, `Fulfilled`).
- `GET /api/admin/settings` — Read store configuration settings.
- `PATCH /api/admin/settings` — Save updated store configurations, marquee text/settings, and notification switches.
- `GET /api/admin/discounts` — List all discount codes.
- `POST /api/admin/discounts` — Create a new discount code.
- `DELETE /api/admin/discounts` — Delete a discount code.

---

## 📜 Available NPM Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `npm run dev` | `next dev` | Start development server on port 3000. |
| `npm run build` | `next build` | Build production bundle. |
| `npm run start` | `next start` | Launch production server. |
| `npm run lint` | `next lint` | Run ESLint validation. |
| `npm run type-check` | `tsc --noEmit` | Run full TypeScript type check. |
| `npm run test` | `vitest run` | Run Vitest unit & integration test suite. |
| `npm run test:e2e` | `playwright test` | Run Playwright end-to-end tests. |
| `npm run db:migrate` | `prisma migrate dev` | Apply Prisma schema migrations to SQLite. |
| `npm run db:seed` | `prisma db seed` | Seed database with initial catalog & settings. |
| `npm run db:studio` | `prisma studio` | Open Prisma Studio GUI data browser. |

---

## 📂 Project Structure

```
.
├── prisma/
│   ├── schema.prisma                  # Prisma ORM SQLite schema
│   ├── seed.ts                        # Seed script for products, variants & settings
│   └── migrations/                    # SQL migration history
├── public/                            # Favicons, static SVG icons, imagery
├── src/
│   ├── app/                           # Next.js App Router structure
│   │   ├── page.tsx                   # Storefront Homepage (Hero, Testimonials, Newsletter)
│   │   ├── products/[handle]/         # Product Detail Page (PDP)
│   │   ├── collections/               # Collections Index & Detail Pages
│   │   ├── checkout/                  # Checkout & Confirmation
│   │   ├── search/                    # Product Search Page
│   │   ├── account/                   # Customer Account Portal
│   │   ├── wishlist/                  # Wishlist (redirects to account)
│   │   ├── about/                     # Brand Story Page
│   │   ├── contact/                   # Contact Form Page
│   │   ├── privacy-policy/            # Privacy Policy
│   │   ├── terms-of-service/          # Terms & Conditions
│   │   ├── shipping-policy/           # Shipping Policy
│   │   ├── refund-policy/             # Refund/Return Policy
│   │   ├── admin/                     # Store Console Admin Portal
│   │   │   ├── page.tsx               # Admin Dashboard & Analytics
│   │   │   ├── inventory/             # Stock Control & Movement History
│   │   │   ├── orders/                # Order Management Console & Status Modal
│   │   │   │   └── [id]/print/        # Printable Order Invoice
│   │   │   ├── products/new/          # Product Creator & Variant Matrix Generator
│   │   │   ├── customers/             # Customer Management & Tier Classification
│   │   │   ├── suppliers/             # Weaver Supplier Order Tracking
│   │   │   ├── discounts/             # Discount Code Management
│   │   │   ├── settings/              # Store Configuration & Theme Settings
│   │   │   └── login/                 # Admin Passcode Authentication
│   │   ├── api/                       # REST Route Handlers
│   │   │   ├── auth/                  # Admin & Customer Authentication
│   │   │   ├── cart/                  # Shopping Cart Operations
│   │   │   ├── checkout/              # Order Placement
│   │   │   ├── categories/            # Category Listing
│   │   │   ├── clothing-catalog/      # Clothing Catalog Data
│   │   │   └── admin/                 # Admin CRUD Operations
│   │   ├── layout.tsx                 # Root Layout with Theme & Toast Providers
│   │   ├── globals.css                # Global CSS & Tailwind Dark Theme Overrides
│   │   ├── sitemap.ts                 # Dynamic Sitemap Generation
│   │   ├── robots.ts                  # Robots.txt Configuration
│   │   ├── not-found.tsx              # Custom 404 Page
│   │   └── error.tsx                  # Error Boundary
│   ├── components/                    # Reusable React Components
│   │   ├── account/                   # Account Portal (Signin, Signup, Orders, Wishlist)
│   │   ├── cart/                      # Cart Drawer, Guest Address & Line Item controls
│   │   ├── contact/                   # Contact Form Component
│   │   ├── home/                      # Hero Slider, Testimonials, Newsletter Form
│   │   ├── layout/                    # Header, Footer, Marquee Banner, Browse Categories Menu
│   │   ├── product/                   # Product Cards, Grid, Gallery, Lookbook, Fit Guide,
│   │   │                              # Recently Viewed, Sort Dropdown, Petticoat Addon,
│   │   │                              # Blouse Customizer, Compare Drawer, Complete the Look
│   │   ├── admin/                     # Analytics Charts
│   │   └── ui/                        # Alert, Button, ConfirmModal, Input, Image,
│   │                                  # CookieConsent, GuestWelcomeModal, LiveSalesToast
│   ├── context/                       # Global Context Providers
│   │   ├── CartContext.tsx             # Shopping Cart State Management
│   │   ├── ToastContext.tsx            # Toast Notification System
│   │   ├── ThemeContext.tsx            # Light/Dark/System Theme Engine
│   │   └── WishlistContext.tsx         # Wishlist State Management
│   ├── lib/                           # Domain Services & Utilities
│   │   ├── prisma.ts                  # Prisma Client Instance
│   │   ├── auth.ts                    # Password Hashing & Session Cookie Helpers
│   │   ├── customer-auth.ts           # Customer Authentication Helpers
│   │   ├── shopify.ts                 # Data Access Layer over Prisma
│   │   ├── db-mappers.ts              # Data Mappers (DB records -> UI models)
│   │   ├── variant-matrix.ts          # Matrix Generator for Product Variants
│   │   ├── variant-uniqueness.ts      # SKU & Barcode Validation Helpers
│   │   ├── inventory.ts               # Inventory Management Helpers
│   │   ├── cart-api.ts                # Cart API Helpers
│   │   ├── currencies.ts              # Currency Formatting Utilities
│   │   ├── feature-flags.ts           # Client-side Feature Flag System
│   │   └── utils.ts                   # General Utilities (cn, formatMoney)
│   ├── middleware.ts                   # Next.js Middleware (Route Guarding)
│   └── types/                         # TypeScript Type Definitions
│       ├── shopify.ts                 # Storefront Types
│       └── admin.ts                   # Admin Types
├── tests/                             # Test Suites
│   ├── api/                           # API Integration Tests (Vitest)
│   ├── e2e/                           # End-to-End Tests (Playwright)
│   └── helpers/                       # Test Utilities & Seed Scripts
├── next.config.js                     # Next.js Security & Optimization Config
├── tailwind.config.ts                 # Tailwind Design System & Dark Mode Config
├── vitest.config.ts                   # Vitest Test Environment Setup
├── playwright.config.ts               # Playwright E2E Test Configuration
└── package.json                       # Project Dependencies & Scripts
```

---

## 🧪 Testing

### Unit & Integration Tests (Vitest)

```bash
npm run test
```

Test coverage includes API authentication, cart calculations, checkout stock deductions, middleware route guarding, database mapping contracts, variant matrix generation, and inventory movements.

### End-to-End Tests (Playwright)

```bash
npm run test:e2e
```

E2E tests cover admin workflows, storefront browsing, and cross-cutting concerns.

---

## 📄 License

This repository is private and proprietary to **Style Statement by Shakthi**. All rights reserved.
