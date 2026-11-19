import { publicClient } from './supabase/public';
import { DEFAULT_SETTINGS } from './defaults';

async function list(table, filter) {
  const sb = publicClient();
  if (!sb) return [];
  let q = sb.from(table).select('*').order('sort_order', { ascending: true });
  if (filter) q = filter(q);
  const { data, error } = await q;
  return error ? [] : data || [];
}
async function one(table, col, val) {
  const sb = publicClient();
  if (!sb) return null;
  const { data } = await sb.from(table).select('*').eq(col, val).maybeSingle();
  return data || null;
}
export const getMembers = () => list('members');
export const getEvents = () => list('events');
export const getTestimonials = (section) => list('testimonials', (q) => q.eq('section', section));
export const getAffiliations = () => list('affiliations');
export const getMember = (id) => one('members', 'id', id);
export const getEvent = (id) => one('events', 'id', id);
export const getAffiliation = (slug) => one('affiliations', 'slug', slug);

export async function getSettings() {
  const sb = publicClient();
  if (!sb) return DEFAULT_SETTINGS;
  const { data } = await sb.from('site_settings').select('value').eq('key', 'site').maybeSingle();
  return { ...DEFAULT_SETTINGS, ...(data?.value || {}) };
}
