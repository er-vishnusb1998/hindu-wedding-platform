export type WeddingStatus = 'draft' | 'published' | 'archived';
export type FamilySide = 'blessings' | 'bride' | 'groom';
export type AttendingStatus = 'attending' | 'not_attending' | 'maybe';
export type DecorativeStyle = 'mandala' | 'lotus' | 'temple' | 'floral';

export interface ThemeConfig {
  id: string;
  name: string;
  primary_color: string;
  secondary_color: string;
  background_color: string;
  surface_color: string;
  text_color: string;
  muted_color: string;
  accent_color: string;
  border_color: string;
  font_heading: string;
  font_body: string;
  decorative_style: DecorativeStyle;
}

export interface Wedding {
  id: string;
  owner_id: string;
  slug: string;
  title: string;
  bride_name: string;
  bride_malayalam_name?: string;
  groom_name: string;
  groom_malayalam_name?: string;
  wedding_date: string; // ISO format string YYYY-MM-DD
  wedding_time: string; // e.g. "10:30 AM"
  location: string;
  location_malayalam?: string;
  venue_name: string;
  venue_address?: string;
  google_maps_url?: string;
  bride_photo_url?: string;
  groom_photo_url?: string;
  couple_photo_url?: string;
  hero_subtitle?: string;
  hero_subtitle_malayalam?: string;
  story_title?: string;
  story_text?: string;
  story_malayalam_text?: string;
  status: WeddingStatus;
  is_password_protected: boolean;
  passcode?: string;
  theme_id: string;
  custom_theme?: Partial<ThemeConfig>;
  music_url?: string;
  music_enabled: boolean;
  opening_envelope_enabled: boolean;
  og_image_url?: string;
  seo_title?: string;
  seo_description?: string;
  gift_blessing_text?: string;
  gift_qr_url?: string;
  upi_id?: string;
  created_at: string;
  updated_at: string;
}

export interface WeddingSection {
  id: string;
  wedding_id: string;
  section_type: 
    | 'hero'
    | 'story'
    | 'countdown'
    | 'events'
    | 'venue'
    | 'gallery'
    | 'family'
    | 'dress_code'
    | 'rsvp'
    | 'gifts'
    | 'map'
    | 'footer';
  title: string;
  title_malayalam?: string;
  enabled: boolean;
  display_order: number;
}

export interface WeddingEvent {
  id: string;
  wedding_id: string;
  title: string;
  title_malayalam?: string;
  event_date: string;
  event_time: string;
  venue_name: string;
  venue_address?: string;
  description?: string;
  description_malayalam?: string;
  google_maps_url?: string;
  image_url?: string;
  dress_code?: string;
  display_order: number;
}

export interface GalleryItem {
  id: string;
  wedding_id: string;
  image_url: string;
  caption?: string;
  display_order: number;
  is_cover: boolean;
}

export interface FamilyMember {
  id: string;
  wedding_id: string;
  name: string;
  relation?: string;
  family_side: FamilySide;
  photo_url?: string;
  display_order: number;
}

export interface RSVP {
  id: string;
  wedding_id: string;
  guest_name: string;
  number_of_guests: number;
  attending_status: AttendingStatus;
  phone_number: string;
  message?: string;
  meal_preference?: string;
  created_at: string;
}

export interface WeddingFullData {
  wedding: Wedding;
  sections: WeddingSection[];
  events: WeddingEvent[];
  gallery: GalleryItem[];
  family: FamilyMember[];
  rsvps?: RSVP[];
}
