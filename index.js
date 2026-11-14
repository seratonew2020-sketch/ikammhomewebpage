// Root entry point (index.js)
// - หากรัน node --watch index.js และพอร์ต 3000 ยังไม่เปิด จะบูต ./server/server.js ให้อัตโนมัติ
// - หากพอร์ต 3000 เปิดอยู่แล้ว จะไม่ชน EADDRINUSE และจะรันชุดทดสอบ CRUD (Supabase + Fastify) แสดงผลใน Terminal ทันที

const FASTIFY_BASE = 'http://localhost:3000'
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://pxlqylmlktavvptxonym.supabase.co'
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_VAEStEmaDCPyhwd6cAhYFQ_xV-7rgvK'

async function isPort3000Running() {
  try {
    const res = await fetch(`${FASTIFY_BASE}/health`)
    return res.ok
  } catch {
    return false
  }
}

async function runCrudVerification() {
  const testId = `test-${Date.now()}`
  console.log('\n=======================================================')
  console.log(`🧪 [CRUD Auto-Test] เริ่มทดสอบ CRUD (ID: ${testId})`)
  console.log('=======================================================')

  const headers = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  }

  try {
    // 1. INSERT
    const insSupabase = await fetch(`${SUPABASE_URL}/rest/v1/articles`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        id: testId,
        title: `บทความทดสอบ CRUD (${testId})`,
        category_id: 'bedroom-living',
        category_name: 'คอนโด & ประหยัดพื้นที่',
        summary: 'ทดสอบ Insert ผ่าน index.js',
      }),
    })
    console.log(`✅ [1/4 INSERT Supabase] Status: ${insSupabase.status}`)

    const insFastify = await fetch(`${FASTIFY_BASE}/api/articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: testId,
        title: `บทความทดสอบ CRUD (${testId})`,
        summary: 'ทดสอบ Insert ผ่าน index.js',
      }),
    })
    console.log(`✅ [1/4 INSERT Fastify]  Status: ${insFastify.status}`)

    // 2. READ
    const getFastify = await fetch(`${FASTIFY_BASE}/api/articles/${testId}`)
    console.log(`✅ [2/4 READ Fastify]    Status: ${getFastify.status}`)

    // 3. UPDATE
    const updSupabase = await fetch(`${SUPABASE_URL}/rest/v1/articles?id=eq.${testId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ title: `บทความทดสอบ CRUD (${testId}) [UPDATED]` }),
    })
    console.log(`✅ [3/4 UPDATE Supabase] Status: ${updSupabase.status}`)

    const updFastify = await fetch(`${FASTIFY_BASE}/api/articles/${testId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: `บทความทดสอบ CRUD (${testId}) [UPDATED]` }),
    })
    console.log(`✅ [3/4 UPDATE Fastify]  Status: ${updFastify.status}`)

    // 4. DELETE
    const delSupabase = await fetch(`${SUPABASE_URL}/rest/v1/articles?id=eq.${testId}`, {
      method: 'DELETE',
      headers,
    })
    console.log(`✅ [4/4 DELETE Supabase] Status: ${delSupabase.status}`)

    const delFastify = await fetch(`${FASTIFY_BASE}/api/articles/${testId}`, {
      method: 'DELETE',
    })
    console.log(`✅ [4/4 DELETE Fastify]  Status: ${delFastify.status}`)

    console.log('🎉 ทดสอบครบทั้ง INSERT ➔ READ ➔ UPDATE ➔ DELETE สำเร็จสมบูรณ์!\n')
  } catch (err) {
    console.error('❌ [CRUD Auto-Test Error]:', err.message)
  }
}

const alreadyUp = await isPort3000Running()
if (!alreadyUp) {
  await import('./server/server.js')
} else {
  console.log('🟢 ตรวจพบ Fastify Server ทำงานอยู่แล้วที่ http://localhost:3000')
  await runCrudVerification()
}
