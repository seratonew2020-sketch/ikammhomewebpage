// server/server.js
import Fastify from 'fastify'
import cors from '@fastify/cors'

const fastify = Fastify({ logger: true })

// 1. เปิดใช้งาน CORS (รองรับครบทุกเมธอดรวมถึง PATCH)
await fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS']
})

// ==========================================
// ส่วนที่ 1: คลังข้อมูล RedNote 30 บทความ
// ==========================================
const REDNOTE_DATA = Array.from({ length: 30 }, (_, i) => ({
  id: `rn_${i + 1}`,
  title: `ไอเดียตกแต่งภายในและบิวท์อิน RedNote #${i + 1}`,
  cover: `https://images.unsplash.com/photo-${1618221195710 + i * 1000}?auto=format&fit=crop&w=1200&q=80`,
  author: `RedNote Creator ${i + 1}`,
  likes: `${(i + 1) * 250 + 180}`,
  url: 'https://www.xiaohongshu.com/explore'
}))

fastify.get('/health', async () => ({ status: 'ok', server: 'Fastify', uptime: process.uptime() }))

const rednoteHandler = async (req) => {
  const limit = parseInt(req.query.limit) || 30
  return {
    success: true,
    server: 'Fastify',
    count: Math.min(limit, REDNOTE_DATA.length),
    data: REDNOTE_DATA.slice(0, limit)
  }
}
fastify.get('/api/rednote', rednoteHandler)
fastify.get('/api/notes', rednoteHandler)

// ==========================================
// ส่วนที่ 1.5: ดึงรูปทั้งหมดจากโฟลเดอร์ Google Drive แบบอัตโนมัติ (ทั้งโฟลเดอร์)
// ==========================================
const DEFAULT_DRIVE_FOLDER_ID = '1L3gDZl97NrkXJ4Wl1tPgb35wf8LzM820'

function extractDriveFolderId(input) {
  if (!input) return DEFAULT_DRIVE_FOLDER_ID
  const str = String(input).trim()
  const match = str.match(/\/folders\/([a-zA-Z0-9_-]+)/)
  if (match && match[1]) return match[1]
  return str
}

function parseDriveLastModified(rawText) {
  if (!rawText) return 0
  const text = String(rawText).replace(/[\u202f\u00a0]/g, ' ').trim()
  const now = new Date()

  // กรณีเป็นเวลาของวันนี้ เช่น "7:48 pm", "19:48" ➔ ถือเป็นไฟล์ใหม่ล่าสุดของวันนี้
  const timeMatch = text.match(/^(\d{1,2}):(\d{2})(?:\s*(am|pm))?$/i)
  if (timeMatch) {
    let hours = parseInt(timeMatch[1], 10)
    const minutes = parseInt(timeMatch[2], 10)
    const ampm = timeMatch[3]?.toLowerCase()
    if (ampm === 'pm' && hours < 12) hours += 12
    if (ampm === 'am' && hours === 12) hours = 0
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0).getTime()
  }

  // กรณีเป็นเดือนและวัน เช่น "Nov 13"
  const withYear = /\b\d{4}\b/.test(text) ? text : `${text}, ${now.getFullYear()}`
  const parsed = Date.parse(withYear)
  if (!Number.isNaN(parsed)) return parsed

  const direct = Date.parse(text)
  return Number.isNaN(direct) ? 0 : direct
}

async function listPublicDriveFolderFiles(folderInput) {
  const folderId = extractDriveFolderId(folderInput)
  const embedUrl = `https://drive.google.com/embeddedfolderview?id=${encodeURIComponent(folderId)}#list`
  const res = await fetch(embedUrl)
  if (!res.ok) {
    throw new Error(`Google Drive folder responded with HTTP ${res.status}`)
  }
  const html = await res.text()
  const re = /id="entry-([a-zA-Z0-9_-]+)"[\s\S]*?<div class="flip-entry-title">([^<]+)<\/div>(?:[\s\S]*?<div class="flip-entry-last-modified"><div>([^<]*)<\/div><\/div>)?/g
  const files = []
  let m
  while ((m = re.exec(html)) !== null) {
    const fileId = m[1]
    const fileName = m[2].trim()
    const lastModified = (m[3] || '').replace(/[\u202f\u00a0]/g, ' ').trim()
    const modifiedTime = parseDriveLastModified(lastModified)
    files.push({
      id: fileId,
      name: fileName,
      lastModified,
      modifiedTime,
      directUrl: `https://lh3.googleusercontent.com/d/${fileId}=w1200`,
      thumbnailUrl: `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`,
      viewUrl: `https://drive.google.com/file/d/${fileId}/view?usp=sharing`
    })
  }

  // เรียงรูปล่าสุดขึ้นก่อนเสมอ (Newest first)
  files.sort((a, b) => (b.modifiedTime || 0) - (a.modifiedTime || 0))

  return {
    folderId,
    folderUrl: `https://drive.google.com/drive/folders/${folderId}`,
    count: files.length,
    files
  }
}

fastify.get('/api/drive-folder', async (req, reply) => {
  try {
    const folderParam = req.query.folder || DEFAULT_DRIVE_FOLDER_ID
    const result = await listPublicDriveFolderFiles(folderParam)
    console.log(`[Fastify Drive Folder] ✅ ดึงรูปจากโฟลเดอร์ ${result.folderId} สำเร็จ (${result.count} ไฟล์)`)
    return { success: true, ...result }
  } catch (err) {
    console.error('[Fastify Drive Folder] ❌ ดึงข้อมูลโฟลเดอร์ไม่สำเร็จ:', err.message)
    return reply.code(500).send({ success: false, message: err.message })
  }
})

fastify.get('/api/drive-folder/:folderId', async (req, reply) => {
  try {
    const result = await listPublicDriveFolderFiles(req.params.folderId)
    console.log(`[Fastify Drive Folder] ✅ ดึงรูปจากโฟลเดอร์ ${result.folderId} สำเร็จ (${result.count} ไฟล์)`)
    return { success: true, ...result }
  } catch (err) {
    console.error('[Fastify Drive Folder] ❌ ดึงข้อมูลโฟลเดอร์ไม่สำเร็จ:', err.message)
    return reply.code(500).send({ success: false, message: err.message })
  }
})

// ==========================================
// ส่วนที่ 2: ระบบ CRUD บทความ (/api/articles) + ซิงค์ข้อมูลจาก Supabase อัตโนมัติ
// ==========================================
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://pxlqylmlktavvptxonym.supabase.co'
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_VAEStEmaDCPyhwd6cAhYFQ_xV-7rgvK'

let articles = [
  {
    id: 1,
    title: 'ไอเดียออกแบบตู้เสื้อผ้า Built-in สไตล์มินิมอล',
    content: 'การเลือกใช้วัสดุไม้ลามิเนตโทนสว่างช่วยให้ห้องดูกว้างขึ้น และเพิ่มมิติด้วยไฟ LED ซ่อนแนวตั้ง...',
    status: 'published',
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    title: '360° Rotating Shoe Rack ตู้เก็บรองเท้าหมุนได้ จุ 40 คู่',
    content: 'หมดปัญหาตู้รองเท้าไม่พอเก็บ นวัตกรรมแกนหมุน 360 องศา สองฝั่ง ใช้งานสะดวกในพื้นที่กว้างเพียง 80 ซม.',
    status: 'published',
    updatedAt: new Date().toISOString()
  }
]
let nextId = 3

async function syncArticlesFromSupabase() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/articles?select=*&category_id=neq.__deleted__&order=created_at.desc`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    })
    if (res.ok) {
      const rows = await res.json()
      if (Array.isArray(rows) && rows.length > 0) {
        articles = rows.map((item) => ({
          id: String(item.id),
          title: item.title,
          category: item.category_name || 'บิ้วอิน & ตกแต่งภายใน',
          content: item.summary || '',
          summary: item.summary || '',
          image: item.image || '',
          status: 'published',
          updatedAt: item.created_at || new Date().toISOString()
        }))
        console.log(`🔄 [Fastify Sync] ซิงค์บทความจาก Supabase เข้า Fastify Memory สำเร็จ (${articles.length} รายการ)`)
      }
    }
  } catch (err) {
    console.warn(`⚠️ [Fastify Sync] ซิงค์ข้อมูลเริ่มต้นจาก Supabase ไม่สำเร็จ ใช้ข้อมูลเริ่มต้นในเครื่องแทน:`, err.message)
  }
}

// 1. READ ALL - ดึงบทความทั้งหมด
fastify.get('/api/articles', async () => {
  return {
    success: true,
    total: articles.length,
    data: articles
  }
})

// 2. READ ONE - ดึงบทความตาม ID (รองรับทั้ง ID ตัวเลขและ String เช่น art-xxx, test-xxx)
fastify.get('/api/articles/:id', async (req, reply) => {
  const targetId = String(req.params.id)
  const item = articles.find((a) => String(a.id) === targetId)
  if (!item) {
    console.error(`[Fastify GET /api/articles/${targetId}] ❌ ไม่พบบทความ ID="${targetId}" ในหน่วยความจำ (มีทั้งหมด ${articles.length} รายการ)`)
    return reply.code(404).send({ success: false, message: `ไม่พบบทความที่ต้องการ (ID: ${targetId})` })
  }
  console.log(`[Fastify GET /api/articles/${targetId}] ✅ ดึงข้อมูลสำเร็จ:`, item.title)
  return { success: true, data: item }
})

// 3. CREATE - สร้างบทความใหม่
fastify.post('/api/articles', async (req, reply) => {
  const { id, title, content, summary, category, image, status = 'published' } = req.body || {}
  if (!title || !String(title).trim()) {
    console.error('[Fastify INSERT /api/articles] ❌ Insert ไม่สำเร็จ: ไม่ได้ระบุ title ใน req.body ->', req.body)
    return reply.code(400).send({ success: false, message: 'กรุณาระบุหัวข้อบทความ (title)' })
  }
  const assignedId = id ? String(id) : String(nextId++)
  const newArticle = {
    id: assignedId,
    title: String(title).trim(),
    category: category || 'คอนโด & ประหยัดพื้นที่',
    content: content || summary || '',
    summary: summary || content || '',
    image: image || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    status,
    updatedAt: new Date().toISOString()
  }
  const existingIdx = articles.findIndex((a) => String(a.id) === assignedId)
  if (existingIdx !== -1) {
    articles[existingIdx] = newArticle
  } else {
    articles.unshift(newArticle)
  }
  console.log(`[Fastify INSERT /api/articles] ✅ Insert สำเร็จ! ID="${assignedId}", Title="${newArticle.title}"`)
  return reply.code(201).send({ success: true, data: newArticle })
})

// 4. UPDATE - แก้ไขบทความ (รองรับทั้ง PATCH และ PUT และทำ Upsert อัตโนมัติถ้ายังไม่มี ID ใน Memory)
const updateArticleHandler = async (req, reply) => {
  const targetId = String(req.params.id)
  const idx = articles.findIndex((a) => String(a.id) === targetId)
  if (idx === -1) {
    const upserted = {
      id: targetId,
      title: req.body?.title || `Article ${targetId}`,
      category: req.body?.category || req.body?.category_name || 'คอนโด & ประหยัดพื้นที่',
      content: req.body?.content || req.body?.summary || '',
      summary: req.body?.summary || req.body?.content || '',
      image: req.body?.image || '',
      status: req.body?.status || 'published',
      updatedAt: new Date().toISOString()
    }
    articles.unshift(upserted)
    console.log(`[Fastify UPDATE /api/articles/${targetId}] ✅ Upsert บทความจาก Supabase เข้า Fastify Memory สำเร็จ! Title="${upserted.title}"`)
    return { success: true, message: 'อัปเดตและซิงค์บทความสำเร็จ', data: upserted }
  }
  articles[idx] = {
    ...articles[idx],
    ...req.body,
    id: articles[idx].id, // ล็อคไม่ให้ id เปลี่ยน
    updatedAt: new Date().toISOString()
  }
  console.log(`[Fastify UPDATE /api/articles/${targetId}] ✅ Update สำเร็จ! Title="${articles[idx].title}"`)
  return { success: true, message: 'อัปเดตบทความสำเร็จ', data: articles[idx] }
}
fastify.patch('/api/articles/:id', updateArticleHandler)
fastify.put('/api/articles/:id', updateArticleHandler)

// 5. DELETE - ลบบทความ (รองรับ String ID และไม่คืน 404 ถ้าถูกลบจาก Supabase)
fastify.delete('/api/articles/:id', async (req, reply) => {
  const targetId = String(req.params.id)
  const idx = articles.findIndex((a) => String(a.id) === targetId)
  if (idx === -1) {
    console.log(`[Fastify DELETE /api/articles/${targetId}] ℹ️ ซิงค์การลบบทความ ID="${targetId}" (ไม่อยู่ใน Fastify Memory หรือถูกลบไปแล้ว)`)
    return {
      success: true,
      synced: true,
      message: 'ซิงค์การลบบทความเรียบร้อย',
      data: { id: targetId }
    }
  }
  const deleted = articles.splice(idx, 1)
  console.log(`[Fastify DELETE /api/articles/${targetId}] ✅ Delete สำเร็จ! ลบบทความ ID="${targetId}" เรียบร้อย`)
  return { success: true, message: 'ลบบทความเรียบร้อย', data: deleted[0] }
})

// เริ่มการทำงานของ Server พอร์ต 3000
const start = async () => {
  try {
    await syncArticlesFromSupabase()
    await fastify.listen({ port: 3000, host: '0.0.0.0' })
    console.log('🚀 Fastify Server is running on http://localhost:3000')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()