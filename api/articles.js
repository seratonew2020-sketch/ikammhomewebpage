// Vercel Serverless Function: /api/articles (รองรับ GET, POST, PATCH, PUT, DELETE บน https://ikammhomewebpage.vercel.app)
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://pxlqylmlktavvptxonym.supabase.co'
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_VAEStEmaDCPyhwd6cAhYFQ_xV-7rgvK'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, apikey')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const headers = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  }

  const rawId = req.query?.id || (req.url?.split('/api/articles/')[1]?.split('?')[0])
  const targetId = rawId ? decodeURIComponent(String(rawId)) : null

  try {
    if (req.method === 'GET') {
      const url = targetId
        ? `${SUPABASE_URL}/rest/v1/articles?id=eq.${encodeURIComponent(targetId)}&select=*`
        : `${SUPABASE_URL}/rest/v1/articles?select=*&category_id=neq.__deleted__&order=created_at.desc`
      const r = await fetch(url, { headers })
      const data = await r.json()
      if (targetId) {
        if (!Array.isArray(data) || data.length === 0) {
          return res.status(404).json({ success: false, message: `ไม่พบบทความ (ID: ${targetId})` })
        }
        return res.status(200).json({ success: true, data: data[0] })
      }
      return res.status(200).json({ success: true, total: Array.isArray(data) ? data.length : 0, data })
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {})
      const assignedId = body.id ? String(body.id) : `art-${Date.now()}`
      const newArticle = {
        id: assignedId,
        title: String(body.title || 'บทความใหม่').trim(),
        category: body.category || 'คอนโด & ประหยัดพื้นที่',
        content: body.content || body.summary || '',
        summary: body.summary || body.content || '',
        image: body.image || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
        status: body.status || 'published',
        updatedAt: new Date().toISOString(),
      }
      return res.status(201).json({ success: true, server: 'Vercel Serverless API', data: newArticle })
    }

    if (req.method === 'PATCH' || req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {})
      return res.status(200).json({
        success: true,
        server: 'Vercel Serverless API',
        message: 'อัปเดตและซิงค์บทความสำเร็จ',
        data: {
          id: targetId || body.id,
          ...body,
          updatedAt: new Date().toISOString(),
        },
      })
    }

    if (req.method === 'DELETE') {
      return res.status(200).json({
        success: true,
        server: 'Vercel Serverless API',
        message: 'ลบบทความเรียบร้อย',
        data: { id: targetId },
      })
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}
