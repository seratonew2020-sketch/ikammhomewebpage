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
// ส่วนที่ 2: ระบบ CRUD บทความ (/api/articles)
// ==========================================
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
  articles.unshift(newArticle)
  console.log(`[Fastify INSERT /api/articles] ✅ Insert สำเร็จ! ID="${assignedId}", Title="${newArticle.title}"`)
  return reply.code(201).send({ success: true, data: newArticle })
})

// 4. UPDATE - แก้ไขบทความ (รองรับทั้ง PATCH และ PUT และรองรับ String ID)
const updateArticleHandler = async (req, reply) => {
  const targetId = String(req.params.id)
  const idx = articles.findIndex((a) => String(a.id) === targetId)
  if (idx === -1) {
    console.error(
      `[Fastify UPDATE /api/articles/${targetId}] ❌ Update ไม่สำเร็จ (404): ไม่พบ ID="${targetId}" ใน Fastify memory. ` +
      `สาเหตุ: บทความนี้อาจถูกดึงมาจาก Supabase หรือ Mock data แต่ยังไม่ได้ถูก Insert เข้า Fastify memory (IDs ที่มีใน Fastify ตอนนี้: [${articles.map(a => a.id).join(', ')}])`
    )
    return reply.code(404).send({
      success: false,
      reason: `ID "${targetId}" not found in Fastify server memory`,
      message: 'ไม่พบบทความที่ต้องการแก้ไขใน Fastify Server'
    })
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

// 5. DELETE - ลบบทความ (รองรับ String ID)
fastify.delete('/api/articles/:id', async (req, reply) => {
  const targetId = String(req.params.id)
  const idx = articles.findIndex((a) => String(a.id) === targetId)
  if (idx === -1) {
    console.error(
      `[Fastify DELETE /api/articles/${targetId}] ❌ Delete ไม่สำเร็จ (404): ไม่พบ ID="${targetId}" ใน Fastify memory. ` +
      `สาเหตุ: บทความนี้อยู่บน Supabase หรือ Local Fallback ไม่ได้อยู่ใน Fastify memory (IDs ที่มีใน Fastify ตอนนี้: [${articles.map(a => a.id).join(', ')}])`
    )
    return reply.code(404).send({
      success: false,
      reason: `ID "${targetId}" not found in Fastify server memory`,
      message: 'ไม่พบบทความที่ต้องการลบใน Fastify Server'
    })
  }
  const deleted = articles.splice(idx, 1)
  console.log(`[Fastify DELETE /api/articles/${targetId}] ✅ Delete สำเร็จ! ลบบทความ ID="${targetId}" เรียบร้อย`)
  return { success: true, message: 'ลบบทความเรียบร้อย', data: deleted[0] }
})

// เริ่มการทำงานของ Server พอร์ต 3000
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' })
    console.log('🚀 Fastify Server is running on http://localhost:3000')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()