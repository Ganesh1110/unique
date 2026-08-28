# AURA Client Demo Walkthrough Checklist & Script

This checklist outlines the optimal screen-share flow to present AURA to the client, demonstrating both the luxury Net-A-Porter + Uniqlo inspired storefront and the enterprise admin operations suite.

---

## 🎯 Pre-Demo Preparation (1 Minute Before Demo)

Run the one-click demo reset command in your terminal to ensure a fresh, pristine dataset:
```bash
npm run db:seed:demo
```
Start the local server:
```bash
npm run dev
```
Open two browser windows/tabs:
1. **Storefront:** `http://localhost:3000`
2. **Admin Console:** `http://localhost:3000/admin` (Credentials: `admin@aura.com` / `admin123`)

---

## 🎬 Live Walkthrough Script (Step-by-Step)

### Step 1: Luxury Storefront Homepage & Brand Experience (`http://localhost:3000`)
- **Top Announcement Bar:** Point out the smooth marquee: *"Complimentary Pan-India Express Shipping on Orders Above ₹15,000"*.
- **Hero Section:** Highlight Cormorant Garamond luxury serif typography, subtle zoom animation, and sharp zero-radius CTA button.
- **Category Portrait Grid:** Showcase the Uniqlo-style 3:4 portrait tiles (Sarees, Silk Sarees, Bridal Lehengas, Designer Blouses, Fine Jewelry).
- **The AURA Edit (Editorial Lookbook):** Show the asymmetric 55/45 split, *"Story No. 01"* curator badge, and craft narrative.
- **Featured Collection Grid:** Point out the luxury product card treatments:
  - 4:5 vertical proportions
  - Hover crossfade into close-up texture shot (700ms elegant easing)
  - Near-black `.badge-sale` tags on sale items (e.g. Banarasi Katan Silk at ₹14,490 instead of ₹18,990)
  - Flush bottom quick-add bar
- **Service Promise Strip:** Reassure with the 4 luxury pillars (Complimentary Shipping · Authentic Handwoven · 14-Day Returns · WhatsApp Concierge).
- **Customer Reviews:** Show the 5-star testimonials explicitly mentioning AURA heirloom sarees.

---

### Step 2: Product Detail Page (PDP) & Craft Specifications
- **Navigation:** Click on **"Kanjeevaram Pure Mulberry Silk Saree"** or **"The Solitaire Diamond Pendant"**.
- **Visuals:** Showcase the multi-image gallery with zoom and angle switching.
- **Variant Selector:** Switch between *Crimson Red & Gold*, *Emerald Green*, and *Peacock Blue* — show how price and stock dynamically adjust.
- **Craft & Certification Details:**
  - For Sarees: Expand the *"Fabric Composition & Care Instructions"* accordion (Pure mulberry silk, dry clean only, muslin storage).
  - For Jewelry: Point out the GIA Laser-Inscribed Certification (#64821903), VVS1 clarity, and 18k solid gold specs.
- **WhatsApp Concierge Button:** Click *"Order via WhatsApp"* to show pre-formatted product message with title, variant, price, and URL.
- **Add to Bag:** Click *"Add to Bag"* to open the refined, quiet Cart Drawer (showing the ₹15,000 free shipping progress tracker).

---

### Step 3: Admin Console & Executive Financial Dashboard (`http://localhost:3000/admin`)
- **Executive Metrics:** Walk through:
  - Total Inventory Capital: **₹3.9L+** (COGS at 45%)
  - Catalog Retail Value: **₹8.8L+**
  - Projected Gross Profit: **₹4.8L+ (55%+ Margin)**
  - Realized Checkout Sales: Real customer order totals
- **Operations Hub:** Show the 8 active modules (Add Product, Inventory, Orders, Customers, Discounts, Weavers, CSV Export, Settings).
- **Export Financial CSV:** Click *"Export Financial CSV"* — shows instant spreadsheet download with unit margins and inventory valuation.

---

### Step 4: Real-Time Product Creation & Variant Matrix (`/admin/products/new`)
- **Action:** Click **"Add Product"**.
- **Live Preview:** Show the split screen with the real-time storefront card preview on the right.
- **Option Matrix Generator:** 
  - Add an option set: Option Name: `Border Finish`, Values: `Antique Gold, Matte Silver`.
  - Show how the matrix instantly generates the Cartesian combination table.
- **Per-Variant Control:** Show how each variant has independent SKU, barcode, price, compare price, and stock threshold.

---

### Step 5: Inventory Stock Management (`/admin/inventory`)
- **Metrics Bar:** 
  - Show **In Stock**, **Low Stock (e.g. Paithani Silk, Patola Ikat)**, and **Out of Stock (Kota Doria)** counts.
- **Tab Filtering:** Click *"Low Stock"* tab to immediately highlight items needing weaver reorders.
- **Instant Restock / Adjustment:**
  - Click on a variant ➔ Click *"Restock"* ➔ Add 5 units with note *"Master Weaver Murugan Consignment"*.
  - Show how stock and valuation update atomically in real time.

---

### Step 6: Customer Orders & Dispatch Console (`/admin/orders`)
- **Order Pipeline:** Show the 7 seeded orders across *Processing*, *Shipped*, and *Fulfilled*.
- **Search & Filter:** Search by *"Worli"*, *"Ananya"*, or order number *"AUR-10084"*.
- **Fulfillment:** Click *"Fulfill"* on a processing order — status updates with toast notification.
- **Print Tax Invoice:** Click **"Print Invoice"** on order `AUR-10084`:
  - Opens clean, A4 print-ready tax invoice with GSTIN, itemized HSN codes, customer billing/shipping address, and dispatch slip.

---

### Step 7: Customer CRM & Loyalty Tiers (`/admin/customers`)
- **Customer Segmentation:** Show how customers are automatically classified into tiers:
  - **VIP Collector:** *Kavita Singhania* & *Ananya Deshmukh* (Total spent >₹40k)
  - **Loyal Buyer:** *Dr. Radhika Srinivasan* & *Meenakshi Sundaram* (>₹15k)
  - **First Timer:** *Pooja Reddy* & *Suman Mukherjee*
- **Quick Contact:** Show one-click email and phone copying for client outreach.

---

### Step 8: Master Weaver Supplier Orders (`/admin/suppliers`)
- **Purchase Orders:** Show active weaver consignments:
  - *Sri Varadaraja Handloom Guild* (Kanchipuram) — Weaving in Progress
  - *Banaras Zari Heritage Looms* (Varanasi) — In Transit
  - *Chanderi Weavers Co-Op* (Madhya Pradesh) — Received & QC Passed
- **Create PO:** Show the simple modal to issue new purchase orders to artisan guilds.

---

### Step 9: Store Settings & Feature Toggles (`/admin/settings`)
- Show live control over Store Name, WhatsApp Phone, Currency (INR ₹), Free Shipping Threshold, Return Window, and Marquee Banner text.

---

## 💡 Quick Reset Between Rehearsal Runs

To reset the database back to this pristine state at any point, simply run:
```bash
npm run db:seed:demo
```
All catalog products, inventory levels, test orders, customer tiers, and weaver purchase orders will instantly reset to the demo configuration.
