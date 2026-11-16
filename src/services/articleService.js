import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import { getLocalizedIkammArticles } from '../data/ikammArticlesData'

export const GOOGLE_DRIVE_FOLDER_ID = '1L3gDZl97NrkXJ4Wl1tPgb35wf8LzM820'
export const GOOGLE_DRIVE_FOLDER_URL = `https://drive.google.com/drive/folders/${GOOGLE_DRIVE_FOLDER_ID}`

export const GOOGLE_DRIVE_IMAGES = [
  {
    id: '1yB_I9rjN2NjY14xuX23QEnDI_d6JxD-X',
    name: 'ฉากกั้นห้องกระจกเฟรมสลิม.png',
    directUrl: 'https://lh3.googleusercontent.com/d/1yB_I9rjN2NjY14xuX23QEnDI_d6JxD-X=w1200',
    viewUrl: 'https://drive.google.com/file/d/1yB_I9rjN2NjY14xuX23QEnDI_d6JxD-X/view?usp=sharing',
  },
  {
    id: '1V4HbHGyk-nO1270TW5Q-Nu3yMSg6qltL',
    name: 'ช่องปรับระดับตามของที่เก็บ.png',
    directUrl: 'https://lh3.googleusercontent.com/d/1V4HbHGyk-nO1270TW5Q-Nu3yMSg6qltL=w1200',
    viewUrl: 'https://drive.google.com/file/d/1V4HbHGyk-nO1270TW5Q-Nu3yMSg6qltL/view?usp=sharing',
  },
  {
    id: '1ZWRXCgMUT8xrWmzS4kArM-NzCNmp6dWs',
    name: 'ซ่อนกระเป๋าเดินทาง.png',
    directUrl: 'https://lh3.googleusercontent.com/d/1ZWRXCgMUT8xrWmzS4kArM-NzCNmp6dWs=w1200',
    viewUrl: 'https://drive.google.com/file/d/1ZWRXCgMUT8xrWmzS4kArM-NzCNmp6dWs/view?usp=sharing',
  },
  {
    id: '1RirNiD1zkj949xyzTdq6m03RHH9QYu1h',
    name: 'ปิดตู้แล้วบ้านคลีน.png',
    directUrl: 'https://lh3.googleusercontent.com/d/1RirNiD1zkj949xyzTdq6m03RHH9QYu1h=w1200',
    viewUrl: 'https://drive.google.com/file/d/1RirNiD1zkj949xyzTdq6m03RHH9QYu1h/view?usp=sharing',
  },
  {
    id: '1tEPQOLawYuU_vZQ0mgHkJGSH9aOMrDfm',
    name: 'ส่งรายการของชิ้นใหญ่.png',
    directUrl: 'https://lh3.googleusercontent.com/d/1tEPQOLawYuU_vZQ0mgHkJGSH9aOMrDfm=w1200',
    viewUrl: 'https://drive.google.com/file/d/1tEPQOLawYuU_vZQ0mgHkJGSH9aOMrDfm/view?usp=sharing',
  },
  {
    id: '1CduHxCzVhi6vMYt5TNFlzSrh1sExYg0w',
    name: 'เก็บของชิ้นใหญ่ให้เนียนตา.png',
    directUrl: 'https://lh3.googleusercontent.com/d/1CduHxCzVhi6vMYt5TNFlzSrh1sExYg0w=w1200',
    viewUrl: 'https://drive.google.com/file/d/1CduHxCzVhi6vMYt5TNFlzSrh1sExYg0w/view?usp=sharing',
  },
  {
    id: '1kvNOLBje8SSRw_FHopG8YMImFLh3UIBW',
    name: 'เคาน์เตอร์ซักล้างทนชื้น.png',
    directUrl: 'https://lh3.googleusercontent.com/d/1kvNOLBje8SSRw_FHopG8YMImFLh3UIBW=w1200',
    viewUrl: 'https://drive.google.com/file/d/1kvNOLBje8SSRw_FHopG8YMImFLh3UIBW/view?usp=sharing',
  },
]

/**
 * แปลงลิงก์แชร์ Google Drive ทุกรูปแบบให้เป็น Direct Image URL ที่แสดงผลบนหน้าเว็บได้ทันที
 * รองรับ:
 * - https://drive.google.com/file/d/<FILE_ID>/view?usp=sharing
 * - https://drive.google.com/open?id=<FILE_ID>
 * - https://drive.google.com/uc?export=view&id=<FILE_ID>
 * - https://drive.google.com/thumbnail?id=<FILE_ID>
 */
export function normalizeDriveImageUrl(inputUrl) {
  if (!inputUrl || typeof inputUrl !== 'string') return inputUrl
  const trimmed = inputUrl.trim()
  if (!trimmed) return trimmed

  // Match /d/<id> on drive.google.com (including /u/0/, /u/1/, /file/d/, etc.)
  if (trimmed.includes('drive.google.com') || trimmed.includes('docs.google.com')) {
    const fileMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]{10,})/)
    if (fileMatch && fileMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${fileMatch[1]}=w1200`
    }

    const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]{10,})/)
    if (idMatch && idMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${idMatch[1]}=w1200`
    }
  }

  return trimmed
}

/**
 * ดึงรายการรูปภาพทั้งหมดในโฟลเดอร์ Google Drive ที่เปิดแชร์สาธารณะ (Anyone with the link)
 * เพียงใส่ลิงก์โฟลเดอร์ หรือ Folder ID ระบบจะดึงไฟล์ทั้งหมดในโฟลเดอร์มาให้อัตโนมัติ
 */
export async function fetchDriveFolderImages(folderInput = GOOGLE_DRIVE_FOLDER_ID) {
  let folderId = GOOGLE_DRIVE_FOLDER_ID
  if (folderInput && typeof folderInput === 'string') {
    const m = folderInput.trim().match(/\/folders\/([a-zA-Z0-9_-]+)/)
    folderId = m && m[1] ? m[1] : folderInput.trim()
  }

  try {
    const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    const apiBase = isLocal ? 'http://localhost:3000/api/drive-folder' : '/api/drive-folder'
    const res = await fetch(`${apiBase}?folder=${encodeURIComponent(folderId)}`)
    if (res.ok) {
      const data = await res.json()
      if (data.success && Array.isArray(data.files) && data.files.length > 0) {
        return {
          folderId: data.folderId,
          folderUrl: data.folderUrl,
          files: data.files,
          source: 'live-drive-folder',
        }
      }
    }
  } catch {
    // Fallback to known folder images when local Fastify server is offline
  }

  return {
    folderId,
    folderUrl: `https://drive.google.com/drive/folders/${folderId}`,
    files: GOOGLE_DRIVE_IMAGES,
    source: 'fallback',
  }
}

/**
 * Normalize a Supabase `articles` row into the localized article shape
 * expected by HomeView.vue, merging localized fields from local dictionary
 * when the table stores flat Thai rows.
 */
function formatArticleDate(isoStr, fallbackDate = '') {
  if (!isoStr) return fallbackDate || 'โพสต์ล่าสุด'
  try {
    const d = new Date(isoStr)
    if (Number.isNaN(d.getTime())) return fallbackDate || 'โพสต์ล่าสุด'
    return d.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return fallbackDate || 'โพสต์ล่าสุด'
  }
}

function normalizeSupabaseArticle(row, lang = 'th', localById = new Map()) {
  const localMatch = localById.get(row.id)
  const resolvedImage = normalizeDriveImageUrl(row.image || localMatch?.image || null)
  if (localMatch && lang !== 'th') {
    return {
      ...localMatch,
      title: row.title || localMatch.title,
      summary: row.summary || localMatch.summary,
      image: resolvedImage,
      postUrl: row.post_url || localMatch.postUrl || '',
      isFbHighlight: row.is_fb_highlight ?? localMatch.isFbHighlight,
      hashtags: Array.isArray(row.hashtags) && row.hashtags.length ? row.hashtags : localMatch.hashtags,
      createdAt: row.created_at || null,
    }
  }

  return {
    id: row.id,
    day: localMatch?.day ?? 0,
    dayLabel: localMatch?.dayLabel || (row.is_fb_highlight ? 'FB ล่าสุด' : 'โพสต์ใหม่'),
    isFbHighlight: Boolean(row.is_fb_highlight),
    dateLabel: localMatch?.dateLabel || (row.is_fb_highlight ? 'โพสต์ Facebook ล่าสุด' : 'อัปเดตล่าสุด'),
    date: formatArticleDate(row.created_at, localMatch?.date),
    createdAt: row.created_at || null,
    postUrl: row.post_url || localMatch?.postUrl || '',
    categoryId: row.category_id || localMatch?.categoryId || 'bedroom-living',
    image: resolvedImage,
    svgType: localMatch?.svgType || null,
    isConstruction: localMatch?.isConstruction || row.category_id === 'structure' || false,
    hashtags: Array.isArray(row.hashtags) ? row.hashtags : [],
    title: row.title || localMatch?.title || '',
    pillar: row.category_name || localMatch?.pillar || '',
    category: row.category_name || localMatch?.category || '',
    readTime: row.read_time || localMatch?.readTime || '4 นาที',
    summary: row.summary || localMatch?.summary || '',
    sections: Array.isArray(row.sections) && row.sections.length > 0 ? row.sections : (localMatch?.sections || []),
    highlights: Array.isArray(row.recommendations) && row.recommendations.length > 0 ? row.recommendations : (localMatch?.highlights || []),
    recommendations: Array.isArray(row.recommendations) && row.recommendations.length > 0 ? row.recommendations : (localMatch?.recommendations || []),
    cta: localMatch?.cta || '',
    sources: localMatch?.sources || [],
  }
}

/**
 * Dual-Mode Article Fetcher:
 * - When Supabase is configured and `articles` table returns rows, returns Supabase data ordered newest first (`created_at` DESC).
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
      .neq('category_id', '__deleted__')
      .order('created_at', { ascending: false })

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

const VIEWS_STORAGE_KEY = 'ikamm_article_views'
const VIEWS_DB_ROW_ID = '__article_views__'

function readLocalViewsMap() {
  try {
    const raw = localStorage.getItem(VIEWS_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object') return parsed
    }
  } catch {
    // ignore storage errors
  }
  return {}
}

function writeLocalViewsMap(map) {
  try {
    localStorage.setItem(VIEWS_STORAGE_KEY, JSON.stringify(map))
  } catch {
    // ignore storage errors
  }
}

/**
 * ดึงยอดคลิกอ่านบทความทั้งหมดจาก Supabase (ซิงค์ร่วมกับ localStorage)
 */
export async function fetchArticleViewCounts() {
  const localMap = readLocalViewsMap()
  if (!isSupabaseConfigured || !supabase) {
    return localMap
  }

  try {
    const { data, error } = await supabase
      .from('articles')
      .select('sections')
      .eq('id', VIEWS_DB_ROW_ID)
      .maybeSingle()

    if (!error && data && Array.isArray(data.sections) && data.sections[0]?.views) {
      const remoteMap = data.sections[0].views
      const merged = { ...remoteMap }
      for (const [k, v] of Object.entries(localMap)) {
        merged[k] = Math.max(Number(merged[k] || 0), Number(v || 0))
      }
      writeLocalViewsMap(merged)
      return merged
    }
  } catch {
    // fallback to localStorage
  }
  return localMap
}

/**
 * เพิ่มยอดคลิกดูบทความ +1 และบันทึกลงทั้ง localStorage และ Supabase Database
 */
export async function incrementArticleViewCount(articleId, currentMap = {}) {
  if (!articleId) return currentMap
  const baseMap = { ...readLocalViewsMap(), ...currentMap }
  const nextCount = Number(baseMap[articleId] || 0) + 1
  const updatedMap = {
    ...baseMap,
    [articleId]: nextCount,
  }
  writeLocalViewsMap(updatedMap)

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('articles').upsert(
        {
          id: VIEWS_DB_ROW_ID,
          title: '__system_views__',
          category_id: '__deleted__',
          sections: [{ views: updatedMap }],
          recommendations: [],
        },
        { onConflict: 'id' }
      )
    } catch {
      // ignore network error, already persisted in localStorage
    }
  }

  return updatedMap
}
