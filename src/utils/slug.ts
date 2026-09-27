export function generateSlug(brideName: string, groomName: string): string {
  const combined = `${groomName}-${brideName}`;
  return combined
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
}

export function validateSlug(slug: string): { isValid: boolean; error?: string } {
  if (!slug) {
    return { isValid: false, error: 'Slug cannot be empty.' };
  }
  if (slug.length < 3) {
    return { isValid: false, error: 'Slug must be at least 3 characters long.' };
  }
  if (slug.length > 50) {
    return { isValid: false, error: 'Slug cannot exceed 50 characters.' };
  }
  const regex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!regex.test(slug)) {
    return { 
      isValid: false, 
      error: 'Slug must only contain lowercase letters, numbers, and single hyphens.' 
    };
  }
  return { isValid: true };
}
