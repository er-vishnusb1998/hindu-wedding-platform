import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const storageService = {
  async uploadFile(
    file: File,
    bucket: 'wedding-images' | 'wedding-music',
    folderPath: string
  ): Promise<string> {
    if (!isSupabaseConfigured) {
      // Return a Data URL for instant local demo preview
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folderPath}/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return publicUrlData.publicUrl;
    } catch (err) {
      console.error(`Upload to ${bucket} failed:`, err);
      // Fallback to Data URL if storage fails or bucket doesn't exist yet
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    }
  },
};
