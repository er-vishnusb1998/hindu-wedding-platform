import { RSVP } from '../types';

export function exportRsvpsToCsv(rsvps: RSVP[], weddingTitle: string) {
  if (!rsvps || rsvps.length === 0) {
    alert('No RSVP records available to export.');
    return;
  }

  const headers = ['Guest Name', 'Attending Status', 'Number of Guests', 'Phone Number', 'Meal Preference', 'Message', 'Submitted Date'];
  
  const rows = rsvps.map(r => [
    `"${r.guest_name.replace(/"/g, '""')}"`,
    `"${r.attending_status}"`,
    r.number_of_guests,
    `"${r.phone_number.replace(/"/g, '""')}"`,
    `"${(r.meal_preference || '').replace(/"/g, '""')}"`,
    `"${(r.message || '').replace(/"/g, '""')}"`,
    `"${new Date(r.created_at).toLocaleString()}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const fileName = `RSVP_${weddingTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
