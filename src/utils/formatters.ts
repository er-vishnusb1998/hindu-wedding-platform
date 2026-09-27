export function formatDateString(dateStr: string, lang: 'en' | 'ml' = 'en'): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  if (lang === 'ml') {
    const monthsMl = [
      'ജനുവരി', 'ഫെബ്രുവരി', 'മാർച്ച്', 'ഏപ്രിൽ', 'മേയ്', 'ജൂൺ',
      'ജൂലൈ', 'ഓഗസ്റ്റ്', 'സെപ്റ്റംബർ', 'ഒക്ടോബർ', 'നവംബർ', 'ഡിസംബർ'
    ];
    const day = date.getDate();
    const month = monthsMl[date.getMonth()];
    const year = date.getFullYear();
    return `${year} ${month} ${day}`;
  }

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPassed: boolean;
}

export function calculateTimeRemaining(targetDateStr: string, targetTimeStr: string = '10:30 AM'): TimeRemaining {
  if (!targetDateStr) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true };
  }

  // Combine YYYY-MM-DD and time string if available
  const fullDateTimeStr = `${targetDateStr} ${targetTimeStr}`;
  const targetDate = new Date(fullDateTimeStr);
  
  // Fallback if parsing failed
  const target = isNaN(targetDate.getTime()) ? new Date(targetDateStr) : targetDate;
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, isPassed: false };
}
