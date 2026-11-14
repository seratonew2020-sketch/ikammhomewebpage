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

// 2. READ ONE - ดึงบทความตาม ID
fastify.get('/api/articles/:id', async (req, reply) => {
  const id = parseInt(req.params.id)
  const item = articles.find((a) => a.id === id)
  if (!item) {
    return reply.code(404).send({ success: false, message: 'ไม่พบบทความที่ต้องการ' })
  }
  return { success: true, data: item }
})

// 3. CREATE - สร้างบทความใหม่
fastify.post('/api/articles', async (req, reply) => {
  const { title, content, status = 'draft' } = req.body || {}
  if (!title) {
    return reply.code(400).send({ success: false, message: 'กรุณาระบุหัวข้อบทความ' })
  }
  const newArticle = {
    id: nextId++,
    title,
    content: content || '',
    status,
    updatedAt: new Date().toISOString()
  }
  articles.unshift(newArticle)
  return reply.code(201).send({ success: true, data: newArticle })
})

// 4. UPDATE - แก้ไขบทความ (PATCH)
fastify.patch('/api/articles/:id', async (req, reply) => {
  const id = parseInt(req.params.id)
  const idx = articles.findIndex((a) => a.id === id)
  if (idx === -1) {
    return reply.code(404).send({ success: false, message: 'ไม่พบบทความที่ต้องการแก้ไข' })
  }
  articles[idx] = {
    ...articles[idx],
    ...req.body,
    id, // ล็อคไม่ให้ id เปลี่ยน
    updatedAt: new Date().toISOString()
  }
  return { success: true, message: 'อัปเดตบทความสำเร็จ', data: articles[idx] }
})

// 5. DELETE - ลบบทความ
fastify.delete('/api/articles/:id', async (req, reply) => {
  const id = parseInt(req.params.id)
  const idx = articles.findIndex((a) => a.id === id)
  if (idx === -1) {
    return reply.code(404).send({ success: false, message: 'ไม่พบบทความที่ต้องการลบ' })
  }
  const deleted = articles.splice(idx, 1)
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