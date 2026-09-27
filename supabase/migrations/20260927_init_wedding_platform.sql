-- PostgreSQL Migration Script for Hindu Wedding Invitation SaaS Platform
-- Enables UUID generation, Multi-Tenant Tables, RLS Policies, Storage, and Demo Seed Data

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. WEDDINGS TABLE
CREATE TABLE IF NOT EXISTS public.weddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  bride_name TEXT NOT NULL,
  bride_malayalam_name TEXT,
  groom_name TEXT NOT NULL,
  groom_malayalam_name TEXT,
  wedding_date DATE NOT NULL,
  wedding_time TEXT NOT NULL DEFAULT '10:30 AM',
  location TEXT NOT NULL,
  location_malayalam TEXT,
  venue_name TEXT NOT NULL,
  venue_address TEXT,
  google_maps_url TEXT,
  bride_photo_url TEXT,
  groom_photo_url TEXT,
  couple_photo_url TEXT,
  hero_subtitle TEXT,
  hero_subtitle_malayalam TEXT,
  story_title TEXT,
  story_text TEXT,
  story_malayalam_text TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_password_protected BOOLEAN DEFAULT FALSE,
  passcode TEXT,
  theme_id TEXT DEFAULT 'kerala-traditional',
  music_url TEXT,
  music_enabled BOOLEAN DEFAULT TRUE,
  opening_envelope_enabled BOOLEAN DEFAULT TRUE,
  og_image_url TEXT,
  seo_title TEXT,
  seo_description TEXT,
  gift_blessing_text TEXT,
  upi_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_weddings_slug ON public.weddings(slug);
CREATE INDEX IF NOT EXISTS idx_weddings_owner ON public.weddings(owner_id);

-- 3. SECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.wedding_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL,
  title TEXT NOT NULL,
  title_malayalam TEXT,
  enabled BOOLEAN DEFAULT TRUE,
  display_order INT NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_sections_wedding ON public.wedding_sections(wedding_id);

-- 4. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.wedding_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_malayalam TEXT,
  event_date DATE NOT NULL,
  event_time TEXT NOT NULL,
  venue_name TEXT NOT NULL,
  venue_address TEXT,
  description TEXT,
  description_malayalam TEXT,
  google_maps_url TEXT,
  image_url TEXT,
  dress_code TEXT,
  display_order INT NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_events_wedding ON public.wedding_events(wedding_id);

-- 5. GALLERY TABLE
CREATE TABLE IF NOT EXISTS public.wedding_gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INT NOT NULL DEFAULT 1,
  is_cover BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_gallery_wedding ON public.wedding_gallery(wedding_id);

-- 6. FAMILY TABLE
CREATE TABLE IF NOT EXISTS public.wedding_family (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relation TEXT,
  family_side TEXT NOT NULL CHECK (family_side IN ('blessings', 'bride', 'groom')),
  photo_url TEXT,
  display_order INT NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_family_wedding ON public.wedding_family(wedding_id);

-- 7. RSVP TABLE (GUEST facing - public write)
CREATE TABLE IF NOT EXISTS public.wedding_rsvp (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  number_of_guests INT NOT NULL DEFAULT 1,
  attending_status TEXT NOT NULL CHECK (attending_status IN ('attending', 'not_attending', 'maybe')),
  phone_number TEXT NOT NULL,
  message TEXT,
  meal_preference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rsvp_wedding ON public.wedding_rsvp(wedding_id);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.weddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_family ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_rsvp ENABLE ROW LEVEL SECURITY;

-- Weddings RLS
CREATE POLICY "Public guests can view published weddings"
  ON public.weddings FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admin full access to owned weddings"
  ON public.weddings FOR ALL
  USING (auth.uid() = owner_id);

-- Sections RLS
CREATE POLICY "Public guests read sections of published weddings"
  ON public.wedding_sections FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = wedding_sections.wedding_id AND status = 'published'));

CREATE POLICY "Admin full access to owned sections"
  ON public.wedding_sections FOR ALL
  USING (EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = wedding_sections.wedding_id AND owner_id = auth.uid()));

-- Events RLS
CREATE POLICY "Public guests read events of published weddings"
  ON public.wedding_events FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = wedding_events.wedding_id AND status = 'published'));

CREATE POLICY "Admin full access to owned events"
  ON public.wedding_events FOR ALL
  USING (EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = wedding_events.wedding_id AND owner_id = auth.uid()));

-- Gallery RLS
CREATE POLICY "Public guests read gallery of published weddings"
  ON public.wedding_gallery FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = wedding_gallery.wedding_id AND status = 'published'));

CREATE POLICY "Admin full access to owned gallery"
  ON public.wedding_gallery FOR ALL
  USING (EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = wedding_gallery.wedding_id AND owner_id = auth.uid()));

-- Family RLS
CREATE POLICY "Public guests read family of published weddings"
  ON public.wedding_family FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = wedding_family.wedding_id AND status = 'published'));

CREATE POLICY "Admin full access to owned family"
  ON public.wedding_family FOR ALL
  USING (EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = wedding_family.wedding_id AND owner_id = auth.uid()));

-- RSVP RLS (Public loginless insert)
CREATE POLICY "Public guests can submit RSVPs without login"
  ON public.wedding_rsvp FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Admin view RSVPs for owned weddings"
  ON public.wedding_rsvp FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = wedding_rsvp.wedding_id AND owner_id = auth.uid()));

-- STORAGE BUCKETS SETUP
INSERT INTO storage.buckets (id, name, public) 
VALUES ('wedding-images', 'wedding-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('wedding-music', 'wedding-music', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Public read wedding images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'wedding-images');

CREATE POLICY "Authenticated admin upload wedding images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'wedding-images' AND auth.role() = 'authenticated');

CREATE POLICY "Public read wedding music"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'wedding-music');

CREATE POLICY "Authenticated admin upload wedding music"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'wedding-music' AND auth.role() = 'authenticated');
