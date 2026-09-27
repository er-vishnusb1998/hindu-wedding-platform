# Hindu Wedding Invitation Website Platform 🪷

A production-ready, mobile-first **Hindu Wedding Invitation Platform** built with **React, Vite, TypeScript, React Router, Bootstrap 5, custom luxury CSS, and Supabase**.

Designed for creating royal Indian digital wedding invitations customized via an Admin Dashboard and shared with guests using **loginless public links (`/w/:slug`)**.

---

## 🌟 Key Features

- 📱 **Mobile-First Luxury Aesthetics**: Elegant typography, gold accents, temple/lotus motifs, and responsive design across all viewports (320px – 1440px).
- 🌐 **Loginless Public Invitation Links**: Guests open `/w/vishnu-vijisha` with **zero authentication required**.
- ✉️ **Royal Envelope Opening Animation**: Interactive invitation card unfolding experience with golden confetti burst.
- 🎵 **Floating Audio Music Player**: Play/pause background wedding music (flute/shehnai) respecting browser autoplay policies.
- 🔤 **Malayalam & English Dual Language Support**: Dynamic language switcher (`EN | മലയാളം`) using Google Fonts (`Noto Serif Malayalam`).
- ⏳ **Live Countdown Ticker**: Days, Hours, Minutes, Seconds live tick targeting wedding ceremony date and time.
- 📅 **Unlimited Events & Calendar Links**: Muhurtham, Reception, Haldi, Sangeet with Google Calendar links & `.ics` file downloads.
- 🖼️ **Masonry Photo Gallery & Fullscreen Lightbox**: Swipeable lightbox gallery with captions and image cover selection.
- 💌 **Loginless RSVP System**: Form with guest count, meal preference (Traditional Sadhya/Veg/Non-Veg), phone, blessings message, and **CSV Export** in admin dashboard.
- 📍 **Venue & Google Maps Integration**: Direct navigation buttons to Google Maps URLs.
- 🔐 **Admin Dashboard & Visual Builder**:
  - Customize 6 curated luxury themes (*Royal Maroon, Kerala Traditional, Ivory & Gold, Temple Elegance, Minimal Luxury, Floral Romance*).
  - Drag/reorder & enable/disable modular invitation sections.
  - Live preview modal for Mobile (375px), Tablet (768px), and Desktop (100%).
  - QR Code generator and high-res PNG download button.
  - Optional password protection for private invitations.

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install Dependencies

```bash
cd hindu-wedding-platform
npm install
```

### 2. Start Local Development Server

```bash
npm run dev
```

Open your browser at:
- **Public Demo Invitation**: [http://localhost:5173/w/vishnu-vijisha](http://localhost:5173/w/vishnu-vijisha)
- **Admin Portal Login**: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)

> 💡 **Offline / Instant Demo Mode**: The application works 100% out of the box even before connecting Supabase! LocalStorage persists all admin updates, RSVPs, events, and themes locally.

---

## 🗄️ Supabase Setup & Production Deployment

### 1. Create Supabase Project

1. Sign up at [supabase.com](https://supabase.com) and create a new project.
2. Go to **Project Settings -> API** and copy your **Project URL** and **Anon Key**.

### 2. Run Database Migration

1. In Supabase Dashboard, go to **SQL Editor**.
2. Copy the contents of `supabase/migrations/20260927_init_wedding_platform.sql` and run the script.
3. This creates all tables (`weddings`, `wedding_events`, `wedding_sections`, `wedding_gallery`, `wedding_family`, `wedding_rsvp`), RLS Policies, and Storage buckets (`wedding-images`, `wedding-music`).

### 3. Environment Variables

Create `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## ⚡ Vercel Hosting Deployment

1. Push your repository to GitHub / GitLab.
2. Import project in [Vercel](https://vercel.com).
3. Add Environment Variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`).
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. `vercel.json` is pre-configured for SPA rewrites so routes like `/admin` and `/w/vishnu-vijisha` refresh seamlessly.

---

## 👥 Admin Login Credentials (Demo)

- **Email**: `admin@wedding.com`
- **Password**: `admin123`
*(Or click "Instant Demo Login" on `/admin/login`)*

---

## 📁 Project Structure

```
src/
├── components/
│   ├── common/      # AudioPlayer, LanguageSwitcher, PasswordModal, LoadingSpinner
│   ├── public/      # OpeningEnvelope, HeroSection, CoupleSection, Countdown, Events, Gallery, RSVP
│   └── admin/       # Sidebar, Header, DashboardOverview, ThemeEditor, SectionManager, RSVPDashboard
├── context/         # AuthContext, WeddingContext
├── lib/             # Supabase client, ThemePresets, InitialDemoData, Analytics
├── pages/
│   ├── public/      # GuestInvitationPage, NotFoundPage
│   ├── admin/       # AdminLoginPage, AdminDashboardPage
│   └── LandingPage.tsx
├── services/        # weddingService, storageService, authService
├── styles/          # base.css, themes.css, invitation.css, admin.css, animations.css
├── utils/           # calendar (.ics), csvExport, slug, formatters
└── types/           # TypeScript interfaces
```

---

## 🛡️ Security & Privacy

- Guest access requires **zero account or login credentials**.
- Admin routes (`/admin`) are protected by Supabase Auth & RLS.
- Only anon keys are used in the frontend; database tables enforce strict Row Level Security policies.
