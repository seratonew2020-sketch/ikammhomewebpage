import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { getLocalizedIkammArticles } from '../src/data/ikammArticlesData.js'
import { ARTICLES as CONSTRUCTION_ARTICLES } from '../src/data/constructionData.js'
import { I18N_DATA } from '../src/data/i18nData.js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://pxlqylmlktavvptxonym.supabase.co'
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_VAEStEmaDCPyhwd6cAhYFQ_xV-7rgvK'

const supabase = createClient(supabaseUrl, supabaseKey)

function buildAllArticleRows() {
  const ikammTh = getLocalizedIkammArticles('th')
  const ikammRows = ikammTh.map((a) => ({
    id: a.id,
    title: a.title || '',
    category_id: a.categoryId || 'bedroom-living',
    category_name: a.pillar || a.category || '',
    summary: a.summary || '',
    sections: a.sections || [],
    recommendations: a.highlights || a.recommendations || [],
    image: a.image || null,
    post_url: a.postUrl || null,
    read_time: a.readTime || '',
    hashtags: a.hashtags || [],
    is_fb_highlight: Boolean(a.isFbHighlight),
  }))

  const dict = I18N_DATA.th?.articles || {}
  const constructionRows = CONSTRUCTION_ARTICLES.map((base) => {
    const loc = dict[base.id] || {}
    return {
      id: base.id,
      title: loc.title || base.title || '',
      category_id: base.categoryId || 'structure',
      category_name: loc.category || base.category || '',
      summary: loc.summary || base.summary || '',
      sections: loc.sections || base.sections || [],
      recommendations: loc.recommendations || base.recommendations || [],
      image: base.image || null,
      post_url: null,
      read_time: loc.readTime || base.readTime || '',
      hashtags: [],
      is_fb_highlight: false,
    }
  })

  return [...ikammRows, ...constructionRows]
}

function sqlStr(val) {
  if (val === null || val === undefined) return 'NULL'
  return `'${String(val).replace(/'/g, "''")}'`
}

function sqlJsonb(val) {
  return `${sqlStr(JSON.stringify(val ?? []))}::jsonb`
}

function sqlTextArray(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return `'{}'::text[]`
  const items = arr.map((v) => `"${String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`)
  return `${sqlStr(`{${items.join(',')}}`)}::text[]`
}

function writeSeedSql(rows) {
  const statements = rows.map(
    (r) => `INSERT INTO public.articles (id, title, category_id, category_name, summary, sections, recommendations, image, post_url, read_time, hashtags, is_fb_highlight)
VALUES (${sqlStr(r.id)}, ${sqlStr(r.title)}, ${sqlStr(r.category_id)}, ${sqlStr(r.category_name)}, ${sqlStr(r.summary)}, ${sqlJsonb(r.sections)}, ${sqlJsonb(r.recommendations)}, ${sqlStr(r.image)}, ${sqlStr(r.post_url)}, ${sqlStr(r.read_time)}, ${sqlTextArray(r.hashtags)}, ${r.is_fb_highlight ? 'TRUE' : 'FALSE'})
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  category_id = EXCLUDED.category_id,
  category_name = EXCLUDED.category_name,
  summary = EXCLUDED.summary,
  sections = EXCLUDED.sections,
  recommendations = EXCLUDED.recommendations,
  image = EXCLUDED.image,
  post_url = EXCLUDED.post_url,
  read_time = EXCLUDED.read_time,
  hashtags = EXCLUDED.hashtags,
  is_fb_highlight = EXCLUDED.is_fb_highlight;`
  )
  const outPath = resolve(process.cwd(), 'supabase/seed_articles.sql')
  writeFileSync(outPath, `-- Auto-generated seed for ${rows.length} iKamm articles\n\n${statements.join('\n\n')}\n`, 'utf8')
  console.log(`Generated ${outPath} (${rows.length} articles).`)
}

async function seed() {
  const rows = buildAllArticleRows()
  if (process.argv.includes('--write-sql')) {
    writeSeedSql(rows)
    return
  }
  console.log(`Preparing to seed ${rows.length} articles (iKamm + Facebook + Construction)...`)

  const { data, error } = await supabase
    .from('articles')
    .upsert(rows, { onConflict: 'id' })
    .select('id')

  if (error) {
    console.error('Error seeding to Supabase:', error.message, '| code:', error.code, '| details:', error.details)
    process.exitCode = 1
  } else {
    console.log(`Successfully seeded ${data?.length ?? rows.length} articles to Supabase!`)
  }
}

seed()
