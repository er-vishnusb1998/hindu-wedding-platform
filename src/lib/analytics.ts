// Simple privacy-friendly analytics abstraction for wedding invitations

export interface AnalyticsEvent {
  weddingId: string;
  eventType: 'page_view' | 'rsvp_submit' | 'music_play' | 'calendar_add' | 'map_click' | 'share_click';
  timestamp: string;
  metadata?: Record<string, unknown>;
}

class WeddingAnalytics {
  private storageKey = 'wedding_analytics_events';

  track(event: Omit<AnalyticsEvent, 'timestamp'>) {
    const payload: AnalyticsEvent = {
      ...event,
      timestamp: new Date().toISOString(),
    };

    try {
      const existing = localStorage.getItem(this.storageKey);
      const events: AnalyticsEvent[] = existing ? JSON.parse(existing) : [];
      events.push(payload);
      // Keep last 200 events
      if (events.length > 200) events.shift();
      localStorage.setItem(this.storageKey, JSON.stringify(events));
    } catch {
      // Ignore storage error
    }
  }

  getStats(weddingId: string) {
    try {
      const existing = localStorage.getItem(this.storageKey);
      const events: AnalyticsEvent[] = existing ? JSON.parse(existing) : [];
      const weddingEvents = events.filter((e) => e.weddingId === weddingId);

      const totalViews = weddingEvents.filter((e) => e.eventType === 'page_view').length || 1;
      const calendarAdds = weddingEvents.filter((e) => e.eventType === 'calendar_add').length;
      const shares = weddingEvents.filter((e) => e.eventType === 'share_click').length;

      return {
        totalViews,
        calendarAdds,
        shares,
      };
    } catch {
      return { totalViews: 1, calendarAdds: 0, shares: 0 };
    }
  }
}

export const analytics = new WeddingAnalytics();
