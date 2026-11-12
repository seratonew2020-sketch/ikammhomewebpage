import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import { getLocalizedIkammArticles } from '../data/ikammArticlesData'

/**
 * Normalize a Supabase `articles` row into the localized article shape
 * expected by HomeView.vue, merging localized fields from local dictionary
 * when the table stores flat Thai rows.
 */
function normalizeSupabaseArticle(row, lang = 'th', localById = new Map()) {
  const localMatch = localById.get(row.id)
  if (localMatch && lang !== 'th') {
    return {
      ...localMatch,
      image: row.image || localMatch.image,
      postUrl: row.post_url || localMatch.postUrl || '',
      isFbHighlight: row.is_fb_highlight ?? localMatch.isFbHighlight,
      hashtags: Array.isArray(row.hashtags) && row.hashtags.length ? row.hashtags : localMatch.hashtags,
    }
  }

  return {
    id: row.id,
    day: localMatch?.day ?? 0,
    dayLabel: localMatch?.dayLabel || (row.is_fb_highlight ? 'FB ล่าสุด' : ''),
    isFbHighlight: Boolean(row.is_fb_highlight),
    dateLabel: localMatch?.dateLabel || (row.is_fb_highlight ? 'โพสต์ Facebook ล่าสุด' : ''),
    postUrl: row.post_url || localMatch?.postUrl || '',
    categoryId: row.category_id || localMatch?.categoryId || 'bedroom-living',
    image: row.image || localMatch?.image || null,
    svgType: localMatch?.svgType || null,
    isConstruction: localMatch?.isConstruction || false,
    hashtags: Array.isArray(row.hashtags) ? row.hashtags : [],
    title: row.title || localMatch?.title || '',
    pillar: row.category_name || localMatch?.pillar || '',
    category: row.category_name || localMatch?.category || '',
    readTime: row.read_time || localMatch?.readTime || '',
    summary: row.summary || localMatch?.summary || '',
    sections: Array.isArray(row.sections) ? row.sections : [],
    highlights: Array.isArray(row.recommendations) ? row.recommendations : [],
    recommendations: Array.isArray(row.recommendations) ? row.recommendations : [],
    cta: localMatch?.cta || '',
    sources: localMatch?.sources || [],
  }
}

/**
 * Dual-Mode Article Fetcher:
 * - When Supabase is configured and `articles` table returns rows, returns Supabase data.
 * - Otherwise seamlessly falls back to local `getLocalizedIkammArticles(lang)`.
 */
export async function fetchIkammArticles(lang = 'th') {
  const localFallback = getLocalizedIkammArticles(lang)
  const localById = new Map(localFallback.map((a) => [a.id, a]))

  if (!isSupabaseConfigured || !supabase) {
    return {
      source: 'local',
      articles: localFallback,
      error: null,
    }
  }

  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: true })

    if (error || !data || data.length === 0) {
      return {
        source: 'local',
        articles: localFallback,
        error: error ? error.message : null,
      }
    }

    // Filter out construction rows here if HomeView appends construction separately,
    // or return normalized rows for iKamm articles (those present in localById or non-construction).
    const ikammRows = data.filter((row) => localById.has(row.id) || !String(row.id).startsWith('guide-'))
    const normalized = (ikammRows.length > 0 ? ikammRows : data).map((row) =>
      normalizeSupabaseArticle(row, lang, localById)
    )

    return {
      source: 'supabase',
      totalInDb: data.length,
      articles: normalized,
      error: null,
    }
  } catch (err) {
    return {
      source: 'local',
      articles: localFallback,
      error: err?.message || 'Supabase fetch failed',
    }
  }
}

/**
 * Submit a customer inquiry / quote estimation request to Supabase `leads` table.
 */
export async function submitCustomerLead(payload) {
  const record = {
    customer_name: payload.name || '',
    phone: payload.phone || '',
    line_id: payload.lineId || '',
    room_type: payload.roomType || '',
    budget_range: payload.budget || '',
    area_sqm: payload.areaSqm ? Number(payload.areaSqm) : null,
    notes: payload.notes || '',
    lang: payload.lang || 'th',
    source_page: payload.sourcePage || 'website',
  }

  if (!isSupabaseConfigured || !supabase) {
    return {
      ok: false,
      mode: 'local',
      message: 'Supabase ยังไม่ได้ตั้งค่า URL/Anon Key ในไฟล์ .env',
      record,
    }
  }

  const { data, error } = await supabase.from('leads').insert([record]).select().single()

  if (error) {
    return {
      ok: false,
      mode: 'supabase',
      message: error.message,
      record,
    }
  }

  return {
    ok: true,
    mode: 'supabase',
    data,
  }
}
