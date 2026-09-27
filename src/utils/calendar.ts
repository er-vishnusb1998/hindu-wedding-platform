import { WeddingEvent } from '../types';

export function getGoogleCalendarUrl(event: WeddingEvent, weddingTitle: string): string {
  const title = encodeURIComponent(`${event.title} | ${weddingTitle}`);
  const details = encodeURIComponent(event.description || `${event.title} celebration`);
  const location = encodeURIComponent(event.venue_address || event.venue_name || '');
  
  // Format date: YYYYMMDDTHHmmssZ
  // Parse date and time if available
  const dateStr = event.event_date.replace(/-/g, '');
  const startTime = '103000'; // Fallback default
  const endTime = '143000';

  const dates = `${dateStr}T${startTime}/${dateStr}T${endTime}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
}

export function downloadIcsFile(event: WeddingEvent, weddingTitle: string) {
  const dateFormatted = event.event_date.replace(/-/g, '');
  const uid = `wedding-event-${event.id}-${Date.now()}@weddinginvite.app`;
  
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Hindu Wedding Invitation Platform//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `SUMMARY:${event.title} - ${weddingTitle}`,
    `DESCRIPTION:${(event.description || '').replace(/\n/g, '\\n')}`,
    `LOCATION:${event.venue_name} ${event.venue_address ? ', ' + event.venue_address : ''}`,
    `DTSTART:${dateFormatted}T103000Z`,
    `DTEND:${dateFormatted}T143000Z`,
    `STATUS:CONFIRMED`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${event.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
