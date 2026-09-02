import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const ratingSyncConfigured = Boolean(
  supabaseUrl
  && supabasePublishableKey
  && /^https:\/\/[^/]+\.supabase\.co$/.test(supabaseUrl)
  && supabasePublishableKey.startsWith('sb_publishable_')
  && !supabaseUrl.includes('YOUR_PROJECT_REF')
  && !supabasePublishableKey.includes('REPLACE_ME'),
);

const supabase = ratingSyncConfigured
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
  : null;

function ratingsFromRows(rows) {
  return Object.fromEntries(
    rows.map((row) => [`${row.traveler_id}:${row.place_id}`, row.score]),
  );
}

function rowFromRating(routeId, key, score) {
  const separator = key.indexOf(':');
  return {
    route_id: routeId,
    traveler_id: key.slice(0, separator),
    place_id: key.slice(separator + 1),
    score,
    updated_at: new Date().toISOString(),
  };
}

export async function reconcileRatings(routeId, localRatings) {
  if (!supabase) return localRatings;

  const { data, error } = await supabase
    .from('route_ratings')
    .select('traveler_id, place_id, score')
    .eq('route_id', routeId);

  if (error) throw error;

  const remoteRatings = ratingsFromRows(data || []);
  const localOnlyRows = Object.entries(localRatings)
    .filter(([key]) => remoteRatings[key] == null)
    .map(([key, score]) => rowFromRating(routeId, key, score));

  if (localOnlyRows.length) {
    const { error: migrationError } = await supabase
      .from('route_ratings')
      .upsert(localOnlyRows, { onConflict: 'route_id,place_id,traveler_id' });

    if (migrationError) throw migrationError;
  }

  // Existing cloud values win; local-only values are migrated on first load.
  return { ...localRatings, ...remoteRatings };
}

export async function persistRating({ routeId, placeId, travelerId, score }) {
  if (!supabase) return;

  if (score == null) {
    const { error } = await supabase
      .from('route_ratings')
      .delete()
      .eq('route_id', routeId)
      .eq('place_id', placeId)
      .eq('traveler_id', travelerId);

    if (error) throw error;
    return;
  }

  const { error } = await supabase
    .from('route_ratings')
    .upsert({
      route_id: routeId,
      place_id: placeId,
      traveler_id: travelerId,
      score,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'route_id,place_id,traveler_id' });

  if (error) throw error;
}

export async function loadAllRatings() {
  if (!supabase) return [];

  const pageSize = 1000;
  const rows = [];

  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from('route_ratings')
      .select('route_id, place_id, traveler_id, score, updated_at')
      .order('route_id')
      .order('place_id')
      .order('traveler_id')
      .range(from, from + pageSize - 1);

    if (error) throw error;
    rows.push(...(data || []));
    if (!data || data.length < pageSize) break;
  }

  return rows;
}
