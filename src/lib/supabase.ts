import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Detect if keys are dummy/defaults
const isDummy =
  !supabaseUrl ||
  !supabaseAnonKey ||
  supabaseUrl.includes('dummy-supabase-url') ||
  supabaseAnonKey.includes('dummy');

export const supabase = !isDummy ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Mock database wrapper for seamless local development
export const db = {
  async getTestimonials() {
    if (!supabase) {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('portfolio_testimonials');
        if (stored) return JSON.parse(stored);
      }
      return [
        {
          id: '1',
          name: 'Sarah Chen',
          role: 'VP of Product',
          company: 'Linear',
          text: 'Krish has an exceptional ability to bridge AI engineering with high-fidelity visual design. His work on our interactive tools exceeded all performance expectations.',
          avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
          rating: 5
        },
        {
          id: '2',
          name: 'Marc Hemeon',
          role: 'Creative Director',
          company: 'Framer',
          text: 'Krish is a rare talent—an elite developer who thinks like a designer. The animations and attention to detail on our interface were top-tier.',
          avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          rating: 5
        },
        {
          id: '3',
          name: 'Aris Kouroudis',
          role: 'Technical Recruiter',
          company: 'Stripe',
          text: 'We were blown away by Krish\'s dynamic project showcase. He is a full-stack engineer who builds experiences, not just screens.',
          avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
          rating: 5
        }
      ];
    }
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching testimonials:', error);
      return [];
    }
    return data || [];
  },

  async addTestimonial(testimonial: { name: string; role: string; company: string; text: string; rating: number; avatar_url?: string }) {
    if (!supabase) {
      const current = await this.getTestimonials();
      const newTestimonial = {
        ...testimonial,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        avatar_url: testimonial.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      };
      const updated = [newTestimonial, ...current];
      if (typeof window !== 'undefined') {
        localStorage.setItem('portfolio_testimonials', JSON.stringify(updated));
      }
      return { data: newTestimonial, error: null };
    }
    const { data, error } = await supabase
      .from('testimonials')
      .insert([testimonial])
      .select()
      .single();
    return { data, error };
  },

  async submitContact(contact: { name: string; email: string; company: string; budget: string; message: string }) {
    console.log('Database Contact Submission:', contact);
    if (!supabase) {
      if (typeof window !== 'undefined') {
        const key = 'portfolio_contacts';
        const current = JSON.parse(localStorage.getItem(key) || '[]');
        const updated = [{ ...contact, id: Math.random().toString(36).substr(2, 9), created_at: new Date().toISOString() }, ...current];
        localStorage.setItem(key, JSON.stringify(updated));
      }
      return { data: contact, error: null };
    }
    const { data, error } = await supabase
      .from('contacts')
      .insert([contact])
      .select()
      .single();
    return { data, error };
  },

  async getContacts() {
    if (!supabase) {
      if (typeof window !== 'undefined') {
        return JSON.parse(localStorage.getItem('portfolio_contacts') || '[]');
      }
      return [];
    }
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching contacts:', error);
      return [];
    }
    return data || [];
  },

  async getProjectSettings() {
    if (!supabase) {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('portfolio_project_settings');
        if (stored) return JSON.parse(stored);
      }
      return {};
    }
    const { data, error } = await supabase
      .from('project_settings')
      .select('*');
    if (error) {
      console.error('Error fetching project settings:', error);
      return {};
    }
    const settings: Record<string, any> = {};
    data.forEach((row: any) => {
      settings[row.repo_name] = {
        repoName: row.repo_name,
        visible: row.visible,
        customThumbnail: row.custom_thumbnail,
        customDescription: row.custom_description,
        customWebsite: row.custom_website,
        certificateLink: row.certificate_link
      };
    });
    return settings;
  },

  async saveProjectSetting(repoName: string, setting: { visible: boolean; customThumbnail?: string; customDescription?: string; customWebsite?: string; certificateLink?: string }) {
    if (!supabase) {
      const current = await this.getProjectSettings();
      current[repoName] = {
        repoName,
        visible: setting.visible,
        customThumbnail: setting.customThumbnail,
        customDescription: setting.customDescription,
        customWebsite: setting.customWebsite,
        certificateLink: setting.certificateLink
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('portfolio_project_settings', JSON.stringify(current));
      }
      return { data: current[repoName], error: null };
    }
    const { data, error } = await supabase
      .from('project_settings')
      .upsert({
        repo_name: repoName,
        visible: setting.visible,
        custom_thumbnail: setting.customThumbnail,
        custom_description: setting.customDescription,
        custom_website: setting.customWebsite,
        certificate_link: setting.certificateLink,
        updated_at: new Date().toISOString()
      }, { onConflict: 'repo_name' })
      .select()
      .single();
    return { data, error };
  }
};
