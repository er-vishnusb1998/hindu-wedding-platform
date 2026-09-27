import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DEMO_WEDDING_DATA } from '../lib/initialData';
import { 
  Wedding, 
  WeddingFullData, 
  WeddingSection, 
  WeddingEvent, 
  GalleryItem, 
  FamilyMember, 
  RSVP 
} from '../types';

const LOCAL_STORAGE_KEY = 'hindu_wedding_platform_data_v1';

// Helper to load state from local storage or fallback to demo data
function getLocalFullData(): WeddingFullData {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEMO_WEDDING_DATA));
    return DEMO_WEDDING_DATA;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to parse local wedding data, resetting to demo.', e);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEMO_WEDDING_DATA));
    return DEMO_WEDDING_DATA;
  }
}

function saveLocalFullData(data: WeddingFullData) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
}

export const weddingService = {
  // 1. Fetch wedding by slug (Guest view - loginless public access)
  async getWeddingBySlug(slug: string): Promise<WeddingFullData | null> {
    if (!isSupabaseConfigured) {
      const local = getLocalFullData();
      if (local.wedding.slug === slug) {
        return local;
      }
      // If requested slug matches a secondary demo slug, return customized demo
      if (slug === 'arjun-ananya' || slug === 'rahul-meera') {
        const names = slug.split('-');
        return {
          ...local,
          wedding: {
            ...local.wedding,
            id: `demo-${slug}`,
            slug: slug,
            groom_name: names[0].charAt(0).toUpperCase() + names[0].slice(1),
            bride_name: names[1].charAt(0).toUpperCase() + names[1].slice(1),
            title: `${names[0].toUpperCase()} & ${names[1].toUpperCase()} — Wedding Invitation`,
            status: 'published',
          }
        };
      }
      return null;
    }

    try {
      // Supabase Query
      const { data: wedding, error } = await supabase
        .from('weddings')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error || !wedding) {
        // Fallback to local if error or demo slug
        const local = getLocalFullData();
        if (local.wedding.slug === slug) return local;
        return null;
      }

      // Fetch related records
      const [secRes, evRes, galRes, famRes] = await Promise.all([
        supabase.from('wedding_sections').select('*').eq('wedding_id', wedding.id).order('display_order'),
        supabase.from('wedding_events').select('*').eq('wedding_id', wedding.id).order('display_order'),
        supabase.from('wedding_gallery').select('*').eq('wedding_id', wedding.id).order('display_order'),
        supabase.from('wedding_family').select('*').eq('wedding_id', wedding.id).order('display_order'),
      ]);

      return {
        wedding,
        sections: secRes.data || [],
        events: evRes.data || [],
        gallery: galRes.data || [],
        family: famRes.data || [],
      };
    } catch (err) {
      console.error('Error fetching wedding from Supabase:', err);
      const local = getLocalFullData();
      return local.wedding.slug === slug ? local : null;
    }
  },

  // 2. Fetch all weddings owned by admin
  async getAdminWeddings(userId: string): Promise<Wedding[]> {
    if (!isSupabaseConfigured) {
      const local = getLocalFullData();
      return [local.wedding];
    }

    try {
      const { data, error } = await supabase
        .from('weddings')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching admin weddings:', err);
      return [getLocalFullData().wedding];
    }
  },

  // 3. Update Wedding basic details & theme
  async updateWedding(wedding: Partial<Wedding> & { id: string }): Promise<Wedding> {
    if (!isSupabaseConfigured) {
      const local = getLocalFullData();
      const updatedWedding: Wedding = {
        ...local.wedding,
        ...wedding,
        updated_at: new Date().toISOString(),
      };
      local.wedding = updatedWedding;
      saveLocalFullData(local);
      return updatedWedding;
    }

    const { data, error } = await supabase
      .from('weddings')
      .update({
        ...wedding,
        updated_at: new Date().toISOString(),
      })
      .eq('id', wedding.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 4. Update Sections Order / Enable
  async updateSections(sections: WeddingSection[]): Promise<WeddingSection[]> {
    if (!isSupabaseConfigured) {
      const local = getLocalFullData();
      local.sections = sections;
      saveLocalFullData(local);
      return sections;
    }

    const { data, error } = await supabase
      .from('wedding_sections')
      .upsert(sections)
      .select();

    if (error) throw error;
    return data || sections;
  },

  // 5. Manage Events
  async saveEvent(eventData: Partial<WeddingEvent> & { wedding_id: string }): Promise<WeddingEvent> {
    if (!isSupabaseConfigured) {
      const local = getLocalFullData();
      if (eventData.id) {
        local.events = local.events.map((e) => (e.id === eventData.id ? { ...e, ...eventData } as WeddingEvent : e));
      } else {
        const newEvent: WeddingEvent = {
          id: `ev-${Date.now()}`,
          display_order: local.events.length + 1,
          title: eventData.title || 'New Event',
          event_date: eventData.event_date || new Date().toISOString().slice(0, 10),
          event_time: eventData.event_time || '10:00 AM',
          venue_name: eventData.venue_name || 'Venue',
          ...eventData,
        } as WeddingEvent;
        local.events.push(newEvent);
      }
      saveLocalFullData(local);
      return (local.events.find((e) => e.id === eventData.id) || local.events[local.events.length - 1]);
    }

    const { data, error } = await supabase
      .from('wedding_events')
      .upsert([eventData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteEvent(eventId: string): Promise<void> {
    if (!isSupabaseConfigured) {
      const local = getLocalFullData();
      local.events = local.events.filter((e) => e.id !== eventId);
      saveLocalFullData(local);
      return;
    }

    const { error } = await supabase.from('wedding_events').delete().eq('id', eventId);
    if (error) throw error;
  },

  // 6. Manage Gallery
  async saveGalleryItem(item: Partial<GalleryItem> & { wedding_id: string; image_url: string }): Promise<GalleryItem> {
    if (!isSupabaseConfigured) {
      const local = getLocalFullData();
      if (item.id) {
        local.gallery = local.gallery.map((g) => (g.id === item.id ? { ...g, ...item } as GalleryItem : g));
      } else {
        const newItem: GalleryItem = {
          id: `gal-${Date.now()}`,
          display_order: local.gallery.length + 1,
          is_cover: local.gallery.length === 0,
          caption: item.caption || '',
          ...item,
        } as GalleryItem;
        local.gallery.push(newItem);
      }
      saveLocalFullData(local);
      return local.gallery[local.gallery.length - 1];
    }

    const { data, error } = await supabase.from('wedding_gallery').upsert([item]).select().single();
    if (error) throw error;
    return data;
  },

  async deleteGalleryItem(itemId: string): Promise<void> {
    if (!isSupabaseConfigured) {
      const local = getLocalFullData();
      local.gallery = local.gallery.filter((g) => g.id !== itemId);
      saveLocalFullData(local);
      return;
    }
    const { error } = await supabase.from('wedding_gallery').delete().eq('id', itemId);
    if (error) throw error;
  },

  // 7. Manage Family
  async saveFamilyMember(member: Partial<FamilyMember> & { wedding_id: string; name: string }): Promise<FamilyMember> {
    if (!isSupabaseConfigured) {
      const local = getLocalFullData();
      if (member.id) {
        local.family = local.family.map((f) => (f.id === member.id ? { ...f, ...member } as FamilyMember : f));
      } else {
        const newMember: FamilyMember = {
          id: `fam-${Date.now()}`,
          display_order: local.family.length + 1,
          family_side: member.family_side || 'groom',
          ...member,
        } as FamilyMember;
        local.family.push(newMember);
      }
      saveLocalFullData(local);
      return local.family[local.family.length - 1];
    }
    const { data, error } = await supabase.from('wedding_family').upsert([member]).select().single();
    if (error) throw error;
    return data;
  },

  async deleteFamilyMember(memberId: string): Promise<void> {
    if (!isSupabaseConfigured) {
      const local = getLocalFullData();
      local.family = local.family.filter((f) => f.id !== memberId);
      saveLocalFullData(local);
      return;
    }
    const { error } = await supabase.from('wedding_family').delete().eq('id', memberId);
    if (error) throw error;
  },

  // 8. Submit RSVP (Guest facing - loginless)
  async submitRsvp(rsvpData: Omit<RSVP, 'id' | 'created_at'>): Promise<RSVP> {
    const newRsvp: RSVP = {
      id: `rsvp-${Date.now()}`,
      created_at: new Date().toISOString(),
      ...rsvpData,
    };

    if (!isSupabaseConfigured) {
      const local = getLocalFullData();
      if (!local.rsvps) local.rsvps = [];
      local.rsvps.unshift(newRsvp);
      saveLocalFullData(local);
      return newRsvp;
    }

    try {
      const { data, error } = await supabase
        .from('wedding_rsvp')
        .insert([
          {
            wedding_id: rsvpData.wedding_id,
            guest_name: rsvpData.guest_name,
            number_of_guests: rsvpData.number_of_guests,
            attending_status: rsvpData.attending_status,
            phone_number: rsvpData.phone_number,
            message: rsvpData.message,
            meal_preference: rsvpData.meal_preference,
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Failed to submit RSVP to Supabase, saving locally:', err);
      const local = getLocalFullData();
      if (!local.rsvps) local.rsvps = [];
      local.rsvps.unshift(newRsvp);
      saveLocalFullData(local);
      return newRsvp;
    }
  },

  // 9. Fetch RSVPs for Admin Dashboard
  async getRsvps(weddingId: string): Promise<RSVP[]> {
    if (!isSupabaseConfigured) {
      const local = getLocalFullData();
      return local.rsvps || [];
    }

    try {
      const { data, error } = await supabase
        .from('wedding_rsvp')
        .select('*')
        .eq('wedding_id', weddingId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching RSVPs from Supabase:', err);
      return getLocalFullData().rsvps || [];
    }
  }
};
