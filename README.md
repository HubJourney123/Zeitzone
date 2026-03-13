# ZEITZONE — Premium Watch E-Commerce
**Wear Your Royal Moment** 🕐

---

## 📁 Folder Structure

```
zeitzone/                        ← ROOT (config files live here)
│
├── 📄 package.json              ← dependencies & scripts
├── 📄 next.config.js            ← Next.js settings
├── 📄 tailwind.config.js        ← Tailwind CSS settings
├── 📄 postcss.config.js         ← PostCSS settings
├── 📄 .env.local                ← your secret keys (create this yourself)
│
├── 📂 scripts/
│   └── initDb.js                ← run once to create DB tables
│
├── 📂 public/                   ← static files (favicon, images)
│
└── 📂 src/                      ← ALL your code lives here
    │
    ├── 📂 styles/
    │   └── globals.css          ← global CSS + Tailwind imports
    │
    ├── 📂 lib/                  ← helper/utility files
    │   ├── db.js                ← Neon database connection
    │   ├── cloudinary.js        ← Cloudinary image upload
    │   └── auth.js              ← admin token verification
    │
    ├── 📂 context/              ← React global state
    │   ├── CartContext.js       ← cart items, add/remove, WhatsApp message
    │   └── ThemeContext.js      ← dark/light mode toggle
    │
    ├── 📂 components/           ← reusable UI pieces
    │   ├── Navbar.js            ← top bar (burger, logo, cart icon)
    │   ├── SideMenu.js          ← slide-in menu with categories
    │   ├── BottomNav.js         ← bottom fixed bar (watches, whatsapp, cart)
    │   ├── HeroCarousel.js      ← auto-sliding banner (400×125px)
    │   ├── WatchCard.js         ← product card with prices + add to cart
    │   └── CartDrawer.js        ← slide-in cart panel
    │
    └── 📂 pages/                ← Next.js routes (URL = file path)
        │
        ├── _app.js              ← wraps every page (providers, navbar)
        ├── index.js             ← home page  →  /
        │
        ├── 📂 product/
        │   └── [id].js          ← product detail  →  /product/123
        │
        ├── 📂 category/
        │   └── [...slug].js     ← category page  →  /category/mens
        │                           sub-category   →  /category/mens/leather
        │
        ├── 📂 admin/
        │   ├── index.js         ← admin login  →  /admin
        │   └── dashboard.js     ← admin panel  →  /admin/dashboard
        │
        └── 📂 api/              ← backend API routes
            │
            ├── 📂 products/
            │   ├── index.js     ← GET all / POST new  →  /api/products
            │   └── [id].js      ← GET/PUT/DELETE one  →  /api/products/5
            │
            ├── 📂 admin/
            │   ├── login.js     ← password check      →  /api/admin/login
            │   └── upload.js    ← Cloudinary upload   →  /api/admin/upload
            │
            ├── carousel.js      ← GET all / POST new  →  /api/carousel
            └── 📂 carousel/
                └── [id].js      ← DELETE one          →  /api/carousel/3
```

---

## 🚀 How to Run

### Step 1 — Install packages
```bash
npm install
```

### Step 2 — Create your environment file
Create a file called `.env.local` in the ROOT folder:
```env
DATABASE_URL=postgresql://...your neon url...
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_PASSWORD=choose_a_password
ADMIN_SECRET=any_random_string_123
```

### Step 3 — Create database tables (run ONCE)
```bash
npm run db:init
```

### Step 4 — Start the app
```bash
npm run dev
```
Then open: **http://localhost:3000**

---

## 🔐 Admin Panel
- Go to: `http://localhost:3000/admin`
- Enter the password you set in `ADMIN_PASSWORD`
- Add/edit/delete watches with image upload
- Toggle watch availability on/off
- Manage hero carousel slides

---

## 📱 Contact Info (embedded in site)
- WhatsApp: +880 1795-818784
- Instagram: @zeitzone_watch
- Facebook: facebook.com/profile.php?id=61585824444108
- Email: zeitzonewatch@gmail.com
"# Zeitzone" 
