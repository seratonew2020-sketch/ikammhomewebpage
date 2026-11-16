<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import {
  fetchIkammArticles,
  fetchDriveFolderImages,
  normalizeDriveImageUrl,
  GOOGLE_DRIVE_IMAGES,
  GOOGLE_DRIVE_FOLDER_URL,
} from '../services/articleService'

const router = useRouter()

// --- Config Supabase REST API & Production/Local API ผ่าน Axios ---
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://pxlqylmlktavvptxonym.supabase.co'
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_VAEStEmaDCPyhwd6cAhYFQ_xV-7rgvK'
const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
const FASTIFY_URL = isLocalhost ? 'http://localhost:3000/api/articles' : '/api/articles'
const VERCEL_CRUD_URL = 'https://ikammhomewebpage.vercel.app/crud'

const dbAxios = axios.create({
  baseURL: `${SUPABASE_URL}/rest/v1`,
  timeout: 8000,
  headers: {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation'
  }
})

// --- State ---
const articles = ref([])
const loading = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('all')
const dbStatus = ref({ connected: false, count: 0, source: 'loading' })

// Diagnostic Console Log State (แสดงทั้งใน F12 Console และบนหน้าจอ)
const diagnosticLogs = ref([])
const showLogPanel = ref(true)

function addDiagLog(level, action, message, detail = null) {
  const timestamp = new Date().toLocaleTimeString('th-TH', { hour12: false })
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp,
    level, // 'success' | 'error' | 'warn' | 'info'
    action,
    message,
    detail: detail ? (typeof detail === 'string' ? detail : JSON.stringify(detail, null, 2)) : null
  }
  diagnosticLogs.value.unshift(entry)

  const prefix = `[CRUD-${action}] (${timestamp})`
  if (level === 'error') {
    console.error(`❌ ${prefix} ${message}`, detail || '')
  } else if (level === 'warn') {
    console.warn(`⚠️ ${prefix} ${message}`, detail || '')
  } else {
    console.log(`✅ ${prefix} ${message}`, detail || '')
  }
}

// Pagination State
const currentPage = ref(1)
const itemsPerPage = ref(9)

// Modal Form State (Create / Edit)
const dialogOpen = ref(false)
const isEditing = ref(false)
const formSubmitting = ref(false)
const formData = ref({
  id: '',
  title: '',
  category: 'คอนโด & ประหยัดพื้นที่',
  summary: '',
  image: '',
  status: 'published',
})

// Delete Dialog State
const deleteDialogOpen = ref(false)
const articleToDelete = ref(null)

// Toast Feedback
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

function showToast(msg, color = 'success') {
  snackbarText.value = msg
  snackbarColor.value = color
  snackbar.value = true
}

// --- 1. READ ALL (ดึงบทความทั้งหมดจาก Database ด้วย Axios) ---
async function fetchAllDatabaseArticles() {
  loading.value = true
  try {
    const res = await dbAxios.get('/articles', {
      params: {
        select: '*',
        category_id: 'neq.__deleted__',
        order: 'created_at.desc',
      }
    })

    if (Array.isArray(res.data) && res.data.length > 0) {
      articles.value = res.data.map((item, idx) => ({
        id: item.id || `art-${idx + 1}`,
        title: item.title,
        category: item.category_name || item.category || 'บิ้วอิน & ตกแต่งภายใน',
        summary: item.summary || (item.sections?.[0]?.body) || 'ไม่มีคำอธิบายสรุป',
        image: normalizeDriveImageUrl(item.image) || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
        status: item.status || 'published',
        readTime: item.read_time || '4 นาที',
        updatedAt: item.created_at || new Date().toISOString()
      }))
      dbStatus.value = { connected: true, count: res.data.length, source: 'Supabase REST (Axios)' }
      addDiagLog('success', 'SELECT', `ดึงข้อมูลจาก Supabase สำเร็จ จำนวน ${res.data.length} บทความ`)
      showToast(`ดึงข้อมูลสดจาก Supabase สำเร็จ (${res.data.length} บทความ) ✨`)
      loading.value = false
      return
    } else {
      addDiagLog('warn', 'SELECT', 'Supabase ตอบกลับ 200 OK แต่ไม่มีข้อมูลในตาราง articles (0 แถว) — อาจติด RLS Policy FOR SELECT หรือตารางว่างเปล่า')
    }
  } catch (err) {
    const reason = err.response?.data?.message || err.response?.data || err.message
    addDiagLog('error', 'SELECT', `ดึงข้อมูลจาก Supabase ไม่สำเร็จเพราะ: ${ err.message }`, {
      status: err.response?.status,
      reason,
      url: `${SUPABASE_URL}/rest/v1/articles`
    })
  }

  // Fallback 48 บทความสมบูรณ์
  const serviceRes = await fetchIkammArticles('th')
  if (serviceRes && Array.isArray(serviceRes.articles)) {
    articles.value = serviceRes.articles.map((item) => ({
      id: item.id,
      title: item.title,
      category: item.pillar || item.category || 'บิ้วอิน & ตกแต่งภายใน',
      summary: item.summary || 'รายละเอียดบทความด้านการออกแบบและตกแต่งภายใน',
      image: item.image || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
      status: 'published',
      readTime: item.readTime || '4 นาที',
      updatedAt: new Date().toISOString()
    }))
    dbStatus.value = { connected: true, count: articles.value.length, source: 'iKamm Database Core (Fallback)' }
  }
  loading.value = false
}

// Categories List
const categories = computed(() => {
  const set = new Set(articles.value.map((a) => a.category).filter(Boolean))
  return ['all', ...Array.from(set)]
})

// Filtered Articles
const filteredArticles = computed(() => {
  return articles.value.filter((a) => {
    const matchCat = selectedCategory.value === 'all' || a.category === selectedCategory.value
    const q = searchQuery.value.trim().toLowerCase()
    const matchQuery = !q || (a.title && a.title.toLowerCase().includes(q)) || (a.summary && a.summary.toLowerCase().includes(q))
    return matchCat && matchQuery
  })
})

// Pagination
const totalPages = computed(() => Math.max(1, Math.ceil(filteredArticles.value.length / itemsPerPage.value)))
const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredArticles.value.slice(start, start + itemsPerPage.value)
})

// --- 2. CREATE & 3. UPDATE (สร้างและแก้ไข) ---
function openCreateDialog() {
  isEditing.value = false
  formData.value = {
    id: `art-${Date.now()}`,
    title: '',
    category: 'คอนโด & ประหยัดพื้นที่',
    summary: '',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    status: 'published',
  }
  dialogOpen.value = true
}

function openEditDialog(article) {
  isEditing.value = true
  formData.value = { ...article }
  dialogOpen.value = true
}

async function handleSaveArticle() {
  if (!formData.value.title.trim()) {
    addDiagLog('error', isEditing.value ? 'UPDATE' : 'INSERT', 'บันทึกไม่สำเร็จเพราะ: ไม่ได้กรอกหัวข้อบทความ (title ว่างเปล่า)')
    showToast('กรุณาระบุหัวข้อบทความ', 'error')
    return
  }

  formSubmitting.value = true
  const targetId = isEditing.value ? String(formData.value.id) : `art-${Date.now()}`

  const nowIso = new Date().toISOString()
  const resolvedImageUrl = normalizeDriveImageUrl(formData.value.image) || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80'
  formData.value.image = resolvedImageUrl

  const supabasePayload = {
    id: targetId,
    title: formData.value.title.trim(),
    category_id: 'bedroom-living',
    category_name: formData.value.category || 'คอนโด & ประหยัดพื้นที่',
    summary: formData.value.summary || '',
    sections: [
      { heading: formData.value.title.trim(), body: formData.value.summary || '' }
    ],
    recommendations: [],
    image: resolvedImageUrl,
    read_time: '3 นาที',
    hashtags: ['#บิ้วอิน', '#แต่งบ้าน', '#iKamm'],
    is_fb_highlight: false,
    created_at: nowIso
  }

  try {
    if (isEditing.value) {
      // ✏️ UPDATE (PATCH) พร้อมอัปเดต created_at ให้ขึ้นเป็นโพสต์ล่าสุดบนหน้าแรก
      const updatePatch = {
        title: formData.value.title.trim(),
        summary: formData.value.summary || '',
        category_name: formData.value.category || 'คอนโด & ประหยัดพื้นที่',
        image: resolvedImageUrl,
        sections: [{ heading: formData.value.title.trim(), body: formData.value.summary || '' }],
        created_at: nowIso
      }

      let supabaseUpdated = false
      try {
        const res = await dbAxios.patch(`/articles?id=eq.${encodeURIComponent(targetId)}`, updatePatch)
        if (Array.isArray(res.data) && res.data.length > 0) {
          supabaseUpdated = true
          addDiagLog('success', 'UPDATE (Supabase)', `อัปเดตบทความ ID="${targetId}" บน Supabase สำเร็จ (${res.data.length} แถว)`, res.data[0])
        } else {
          addDiagLog(
            'error',
            'UPDATE (Supabase)',
            `Update บน Supabase ไม่สำเร็จ (Status ${res.status} แต่อัปเดตจริงได้ 0 แถว!) สาเหตุที่เป็นไปได้: ` +
            `1) ไม่พบ ID="${targetId}" ในตาราง public.articles บน Supabase (เป็นบทความจาก Local Fallback) หรือ ` +
            `2) ติดสิทธิ์ Row Level Security (RLS) ยังไม่ได้เปิด Policy FOR UPDATE บนตาราง public.articles`,
            {
              targetId,
              responseStatus: res.status,
              rowsAffected: 0,
              sqlFix: `CREATE POLICY "Allow Public Update Articles" ON public.articles FOR UPDATE USING (true) WITH CHECK (true);`
            }
          )
        }
      } catch (errSupabase) {
        addDiagLog(
          'error',
          'UPDATE (Supabase)',
          `Update บน Supabase ล้มเหลวเพราะ: ${errSupabase.response?.data?.message || errSupabase.message}`,
          {
            status: errSupabase.response?.status,
            errorData: errSupabase.response?.data,
            targetId
          }
        )
      }

      // ทดสอบ/ซิงค์ต่อไปที่ Fastify Server (localhost:3000)
      try {
        const resFastify = await axios.patch(`${FASTIFY_URL}/${encodeURIComponent(targetId)}`, formData.value)
        addDiagLog('success', 'UPDATE (Fastify)', `อัปเดตบทความ ID="${targetId}" บน Fastify สำเร็จ`, resFastify.data)
      } catch (errFastify) {
        const fastifyReason = errFastify.response?.data?.reason || errFastify.response?.data?.message || errFastify.message
        addDiagLog(
          'warn',
          'UPDATE (Fastify)',
          `Update บน Fastify (localhost:3000) ไม่สำเร็จเพราะ: ${fastifyReason}`,
          {
            status: errFastify.response?.status || 'NO_RESPONSE (Server อาจไม่ได้เปิด หรือ ID ไม่อยู่ใน Fastify Memory)',
            detail: errFastify.response?.data || errFastify.message
          }
        )
      }

      const idx = articles.value.findIndex(a => String(a.id) === targetId)
      if (idx !== -1) {
        articles.value[idx] = { ...articles.value[idx], ...formData.value }
      }
      showToast(supabaseUpdated ? 'อัปเดตบทความลง Supabase สำเร็จ! ✨' : 'อัปเดตในหน้าเว็บแล้ว (ดูสาเหตุใน Console Log)', supabaseUpdated ? 'success' : 'warning')
    } else {
      // 🚀 INSERT (POST)
      let supabaseInserted = false
      try {
        const res = await dbAxios.post('/articles', supabasePayload)
        if (res.status === 201 || (Array.isArray(res.data) && res.data.length > 0)) {
          supabaseInserted = true
          addDiagLog('success', 'INSERT (Supabase)', `Insert บทความ ID="${targetId}" ลง Supabase สำเร็จ (201 Created)`, res.data?.[0] || supabasePayload)
          showToast('🎉 บันทึกลง Supabase Database สำเร็จ! (201 Created)', 'success')
        } else {
          addDiagLog('error', 'INSERT (Supabase)', `Insert ตอบกลับ Status ${res.status} แต่ไม่มีแถวที่ถูกสร้าง`, res.data)
        }
      } catch (errSupabase) {
        addDiagLog(
          'error',
          'INSERT (Supabase)',
          `Insert ลง Supabase ไม่สำเร็จเพราะ: ${errSupabase.response?.data?.message || errSupabase.message}`,
          {
            status: errSupabase.response?.status,
            code: errSupabase.response?.data?.code,
            details: errSupabase.response?.data?.details,
            hint: errSupabase.response?.data?.hint || 'ตรวจสอบ RLS Policy FOR INSERT บนตาราง public.articles',
            sqlFix: `CREATE POLICY "Allow Public Insert Articles" ON public.articles FOR INSERT WITH CHECK (true);`
          }
        )
      }

      // บันทึกสำรองเข้า Fastify Server (localhost:3000)
      try {
        const resFastify = await axios.post(FASTIFY_URL, {
          id: targetId,
          title: formData.value.title.trim(),
          category: formData.value.category,
          content: formData.value.summary,
          summary: formData.value.summary,
          image: supabasePayload.image,
          status: formData.value.status || 'published'
        })
        addDiagLog('success', 'INSERT (Fastify)', `Insert บทความ ID="${targetId}" ลง Fastify Server สำเร็จ`, resFastify.data)
        if (!supabaseInserted) {
          showToast('บันทึกลง Fastify Server สำเร็จ! 🚀', 'success')
        }
      } catch (errFastify) {
        addDiagLog(
          'warn',
          'INSERT (Fastify)',
          `Insert ลง Fastify (localhost:3000) ไม่สำเร็จเพราะ: ${errFastify.response?.data?.message || errFastify.message}`,
          {
            status: errFastify.response?.status || 'CONNECTION_REFUSED (ตรวจสอบว่ารัน node server/server.js หรือยัง)',
            detail: errFastify.message
          }
        )
      }

      articles.value.unshift({
        id: targetId,
        title: formData.value.title.trim(),
        category: formData.value.category,
        summary: formData.value.summary,
        image: supabasePayload.image,
        status: 'published',
        updatedAt: new Date().toISOString()
      })
    }
    dialogOpen.value = false
  } catch (err) {
    addDiagLog('error', 'SAVE_EXCEPTION', `เกิดข้อผิดพลาดที่ไม่คาดคิด: ${err.message}`, err.stack)
    showToast(`เกิดข้อผิดพลาด: ${err.message}`, 'error')
  } finally {
    formSubmitting.value = false
  }
}

// --- 4. DELETE (ลบบทความ พร้อมตรวจสอบจำนวนแถวที่ถูกลบจริง) ---
function confirmDelete(article) {
  articleToDelete.value = article
  deleteDialogOpen.value = true
}

async function handleDeleteArticle() {
  if (!articleToDelete.value) return
  const targetId = String(articleToDelete.value.id)
  let supabaseDeleted = false

  try {
    try {
      const res = await dbAxios.delete(`/articles?id=eq.${encodeURIComponent(targetId)}`)
      if (Array.isArray(res.data) && res.data.length > 0) {
        supabaseDeleted = true
        addDiagLog('success', 'DELETE (Supabase)', `ลบบทความ ID="${targetId}" ออกจาก Supabase สำเร็จ (${res.data.length} แถว)`, res.data[0])
      } else {
        addDiagLog(
          'warn',
          'DELETE (Supabase RLS Notice)',
          `คำสั่ง Hard DELETE ถูกบล็อกโดย RLS (ยังไม่ได้เปิด Policy FOR DELETE บน Supabase) ➔ ระบบกำลังสลับไปลบด้วยวิธี Database Soft-Delete (PATCH category_id='__deleted__') แทนอัตโนมัติ...`,
          {
            targetId,
            sqlForHardDelete: `CREATE POLICY "Allow Public Delete Articles" ON public.articles FOR DELETE USING (true);`
          }
        )
        const resSoft = await dbAxios.patch(`/articles?id=eq.${encodeURIComponent(targetId)}`, {
          category_id: '__deleted__'
        })
        if (Array.isArray(resSoft.data) && resSoft.data.length > 0) {
          supabaseDeleted = true
          addDiagLog(
            'success',
            'DELETE (Supabase Soft-Delete)',
            `✅ ลบบทความ ID="${targetId}" บน Supabase สำเร็จผ่าน Soft-Delete (PATCH category_id='__deleted__') รีเฟรชแล้วข้อมูลจะไม่กลับมา!`,
            resSoft.data[0]
          )
        } else {
          addDiagLog('error', 'DELETE (Supabase)', `ลบไม่สำเร็จทั้ง Hard Delete และ Soft Delete (ไม่พบ ID="${targetId}" ใน Supabase)`)
        }
      }
    } catch (errSupabase) {
      addDiagLog(
        'error',
        'DELETE (Supabase)',
        `Delete บน Supabase ล้มเหลวเพราะ: ${errSupabase.response?.data?.message || errSupabase.message}`,
        {
          targetId,
          status: errSupabase.response?.status,
          errorData: errSupabase.response?.data
        }
      )
    }

    // ลบใน Fastify Server ด้วย
    try {
      const resFastify = await axios.delete(`${FASTIFY_URL}/${encodeURIComponent(targetId)}`)
      addDiagLog('success', 'DELETE (Fastify)', `ลบบทความ ID="${targetId}" ออกจาก Fastify Server สำเร็จ`, resFastify.data)
    } catch (errFastify) {
      const fastifyReason = errFastify.response?.data?.reason || errFastify.response?.data?.message || errFastify.message
      addDiagLog(
        'warn',
        'DELETE (Fastify)',
        `Delete บน Fastify (localhost:3000) ไม่สำเร็จเพราะ: ${fastifyReason}`,
        {
          targetId,
          status: errFastify.response?.status || 'NO_RESPONSE'
        }
      )
    }

    articles.value = articles.value.filter((a) => String(a.id) !== targetId)
    if (supabaseDeleted) {
      showToast('ลบบทความออกจาก Supabase เรียบร้อย 🗑️', 'success')
    } else {
      showToast('⚠️ ลบจากหน้าจอแล้ว แต่ Supabase บล็อกการลบ (ดูสาเหตุใน Console Log)', 'warning')
    }
  } catch (err) {
    addDiagLog('error', 'DELETE_EXCEPTION', `ลบไม่สำเร็จเพราะ: ${err.message}`, err.stack)
    showToast(`ลบไม่สำเร็จ: ${err.message}`, 'error')
  } finally {
    deleteDialogOpen.value = false
    articleToDelete.value = null
  }
}

// 🧪 ฟังก์ชันทดสอบครบวงจร: INSERT ➔ UPDATE ➔ DELETE พร้อมเขียน Console Log วินิจฉัยละเอียด
async function runFullCrudTest() {
  loading.value = true
  showLogPanel.value = true
  const testId = `test-${Date.now()}`
  console.group(`🧪 [CRUD DIAGNOSTIC TEST] เริ่มทดสอบ INSERT -> UPDATE -> DELETE (ID: ${testId})`)
  addDiagLog('info', 'TEST_START', `เริ่มทดสอบครบวงจร INSERT ➔ UPDATE ➔ DELETE ด้วย ID="${testId}"`)

  const testPayload = {
    id: testId,
    title: `✨ บทความทดสอบ CRUD (${new Date().toLocaleTimeString('th-TH')})`,
    category_id: 'bedroom-living',
    category_name: 'คอนโด & ประหยัดพื้นที่',
    summary: 'ข้อความเริ่มต้นสำหรับการทดสอบ Insert เข้าฐานข้อมูล',
    sections: [{ heading: 'ผลการทดสอบ', body: 'บันทึกสำเร็จ' }],
    recommendations: [],
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    read_time: '2 นาที',
    hashtags: ['#TestCRUD', '#Database', '#iKamm'],
    is_fb_highlight: false
  }

  try {
    // =====================================================
    // STEP 1: TEST INSERT
    // =====================================================
    try {
      const resInsert = await dbAxios.post('/articles', testPayload)
      if (Array.isArray(resInsert.data) && resInsert.data.length > 0) {
        addDiagLog('success', '1. TEST INSERT (Supabase)', `✅ INSERT สำเร็จ! สร้างแถวใหม่ ID="${testId}" บน Supabase เรียบร้อย`, resInsert.data[0])
      } else {
        addDiagLog('error', '1. TEST INSERT (Supabase)', `❌ INSERT ไม่สำเร็จ: Status ${resInsert.status} แต่ไม่มีข้อมูลถูกสร้าง (ติด RLS FOR INSERT)`, resInsert.data)
      }
    } catch (err) {
      addDiagLog('error', '1. TEST INSERT (Supabase)', `❌ INSERT ล้มเหลวเพราะ: ${err.response?.data?.message || err.message}`, err.response?.data || err.message)
    }

    try {
      const resFastifyIns = await axios.post(FASTIFY_URL, {
        id: testId,
        title: testPayload.title,
        content: testPayload.summary,
        status: 'published'
      })
      addDiagLog('success', '1. TEST INSERT (Fastify)', `✅ INSERT ลง Fastify (localhost:3000) สำเร็จ! ID="${resFastifyIns.data?.data?.id}"`, resFastifyIns.data)
    } catch (err) {
      addDiagLog('warn', '1. TEST INSERT (Fastify)', `⚠️ INSERT ลง Fastify ไม่สำเร็จเพราะ: ${err.response?.data?.message || err.message}`)
    }

    // =====================================================
    // STEP 2: TEST UPDATE
    // =====================================================
    const updatedTitle = `${testPayload.title} [UPDATED ✅]`
    const updatedSummary = 'อัปเดตข้อความสำเร็จผ่านคำสั่ง PATCH'
    try {
      const resUpdate = await dbAxios.patch(`/articles?id=eq.${encodeURIComponent(testId)}`, {
        title: updatedTitle,
        summary: updatedSummary
      })
      if (Array.isArray(resUpdate.data) && resUpdate.data.length > 0) {
        addDiagLog('success', '2. TEST UPDATE (Supabase)', `✅ UPDATE สำเร็จ! แก้ไขชื่อบทความ ID="${testId}" เป็น "${updatedTitle}"`, resUpdate.data[0])
      } else {
        addDiagLog(
          'error',
          '2. TEST UPDATE (Supabase)',
          `❌ UPDATE ไม่สำเร็จ! (HTTP ${resUpdate.status} แต่อัปเดตได้ 0 แถว) เพราะติด RLS Policy FOR UPDATE หรือไม่พบ ID="${testId}"`,
          {
            sqlFix: `CREATE POLICY "Allow Public Update Articles" ON public.articles FOR UPDATE USING (true) WITH CHECK (true);`
          }
        )
      }
    } catch (err) {
      addDiagLog('error', '2. TEST UPDATE (Supabase)', `❌ UPDATE ล้มเหลวเพราะ: ${err.response?.data?.message || err.message}`, err.response?.data || err.message)
    }

    try {
      const resFastifyUpd = await axios.patch(`${FASTIFY_URL}/${encodeURIComponent(testId)}`, {
        title: updatedTitle,
        content: updatedSummary
      })
      addDiagLog('success', '2. TEST UPDATE (Fastify)', `✅ UPDATE บน Fastify (localhost:3000) สำเร็จ!`, resFastifyUpd.data)
    } catch (err) {
      addDiagLog('warn', '2. TEST UPDATE (Fastify)', `⚠️ UPDATE บน Fastify ไม่สำเร็จเพราะ: ${err.response?.data?.reason || err.response?.data?.message || err.message}`)
    }

    // =====================================================
    // STEP 3: TEST DELETE
    // =====================================================
    try {
      const resDelete = await dbAxios.delete(`/articles?id=eq.${encodeURIComponent(testId)}`)
      if (Array.isArray(resDelete.data) && resDelete.data.length > 0) {
        addDiagLog('success', '3. TEST DELETE (Supabase)', `✅ DELETE สำเร็จ! ลบบทความ ID="${testId}" ออกจาก Supabase จริง (${resDelete.data.length} แถว)`, resDelete.data[0])
      } else {
        addDiagLog(
          'warn',
          '3. TEST DELETE (Supabase RLS)',
          `⚠️ Hard DELETE คืนค่า 0 แถวเพราะตาราง public.articles ยังไม่มี Policy "FOR DELETE" ➔ ระบบใช้ Soft-Delete (PATCH category_id='__deleted__') แทนอัตโนมัติ`,
          {
            howToEnableHardDeleteInSupabase: `CREATE POLICY "Allow Public Delete Articles" ON public.articles FOR DELETE USING (true);`
          }
        )
        const resSoftDel = await dbAxios.patch(`/articles?id=eq.${encodeURIComponent(testId)}`, {
          category_id: '__deleted__'
        })
        if (Array.isArray(resSoftDel.data) && resSoftDel.data.length > 0) {
          addDiagLog('success', '3. TEST DELETE (Supabase Soft-Delete)', `✅ DELETE สำเร็จผ่าน Soft-Delete บน Supabase! แถว ID="${testId}" ถูกซ่อนถาวรแล้ว`, resSoftDel.data[0])
        }
      }
    } catch (err) {
      addDiagLog('error', '3. TEST DELETE (Supabase)', `❌ DELETE ล้มเหลวเพราะ: ${err.response?.data?.message || err.message}`, err.response?.data || err.message)
    }

    try {
      const resFastifyDel = await axios.delete(`${FASTIFY_URL}/${encodeURIComponent(testId)}`)
      addDiagLog('success', '3. TEST DELETE (Fastify)', `✅ DELETE บน Fastify (localhost:3000) สำเร็จ!`, resFastifyDel.data)
    } catch (err) {
      addDiagLog('warn', '3. TEST DELETE (Fastify)', `⚠️ DELETE บน Fastify ไม่สำเร็จเพราะ: ${err.response?.data?.reason || err.response?.data?.message || err.message}`)
    }

    await fetchAllDatabaseArticles()
    showToast('รันชุดทดสอบ Insert / Update / Delete เสร็จสิ้น! ดูผลลัพธ์ใน Console Log ด้านล่าง', 'info')
  } finally {
    console.groupEnd()
    loading.value = false
  }
}

// Google Drive Folder Sync State (รองรับการแชร์ยกโฟลเดอร์)
const driveFolderUrlInput = ref(GOOGLE_DRIVE_FOLDER_URL)
const driveFolderFiles = ref([...GOOGLE_DRIVE_IMAGES])
const syncingDriveFolder = ref(false)

async function syncDriveFolder() {
  syncingDriveFolder.value = true
  try {
    const res = await fetchDriveFolderImages(driveFolderUrlInput.value)
    if (res && Array.isArray(res.files) && res.files.length > 0) {
      driveFolderFiles.value = res.files
      addDiagLog('success', 'GOOGLE_DRIVE_FOLDER', `ดึงรูปทั้งหมดจากโฟลเดอร์ Google Drive สำเร็จ (${res.files.length} ไฟล์)`, res.files)
      showToast(`ดึงรูปจากโฟลเดอร์ Google Drive สำเร็จ (${res.files.length} รูป) 📁`, 'success')
    }
  } catch (err) {
    addDiagLog('error', 'GOOGLE_DRIVE_FOLDER', `ดึงโฟลเดอร์ Google Drive ไม่สำเร็จ: ${err.message}`)
  } finally {
    syncingDriveFolder.value = false
  }
}

function createArticleFromDriveImage(driveFile) {
  const cleanTitle = (driveFile.name || '').replace(/\.[^/.]+$/, '')
  isEditing.value = false
  formData.value = {
    id: `art-${Date.now()}`,
    title: cleanTitle || 'บทความใหม่จาก Google Drive',
    category: 'คอนโด & ประหยัดพื้นที่',
    summary: `รายละเอียดผลงานและไอเดียบิ้วอิน: ${cleanTitle}`,
    image: driveFile.directUrl,
    status: 'published',
  }
  dialogOpen.value = true
}

onMounted(() => {
  fetchAllDatabaseArticles()
  syncDriveFolder()
})
</script>

<template>
  <div class="min-h-screen bg-stone-50 py-8 px-4 px-sm-6">
    <v-container class="max-w-6xl">
      <!-- Top Bar -->
      <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-4 mb-6">
        <div>
          <div class="d-flex align-center ga-2 mb-1">
            <v-btn icon="mdi-arrow-left" variant="text" size="small" @click="router.push('/')" />
            <h1 class="text-h5 font-weight-bold text-slate-900">🗄️ จัดการคลังบทความ Database (CRUD)</h1>
          </div>
          <div class="d-flex flex-wrap align-center ga-2 pl-8">
            <v-chip size="x-small" color="#10B981" variant="flat" class="text-white font-weight-bold">
              🟢 {{ dbStatus.source }}
            </v-chip>
            <span class="text-caption text-slate-500">บทความทั้งหมดในระบบ: {{ articles.length }} รายการ</span>
            <v-chip
              :href="VERCEL_CRUD_URL"
              target="_blank"
              rel="noopener noreferrer"
              size="x-small"
              color="#0F172A"
              variant="tonal"
              prepend-icon="mdi-open-in-new"
              class="font-weight-bold cursor-pointer"
            >
              ikammhomewebpage.vercel.app/crud
            </v-chip>
          </div>
        </div>
        <div class="d-flex flex-wrap align-center ga-2">
          <!-- ปุ่มเทสครบวงจร Insert / Update / Delete + Console Log -->
          <v-btn
            color="#0284C7"
            variant="tonal"
            rounded="lg"
            prepend-icon="mdi-console"
            class="text-none font-weight-bold px-3 text-sky-800"
            :loading="loading"
            @click="runFullCrudTest"
          >
            🧪 เทส Insert / Update / Delete
          </v-btn>

          <v-btn
            color="#D97706"
            variant="flat"
            rounded="lg"
            prepend-icon="mdi-plus"
            class="text-none font-weight-bold text-white px-4"
            @click="openCreateDialog"
          >
            สร้างบทความใหม่
          </v-btn>
          <v-btn
            icon="mdi-refresh"
            variant="outlined"
            rounded="lg"
            color="#64748B"
            :loading="loading"
            @click="fetchAllDatabaseArticles"
          />
        </div>
      </div>

      <!-- Diagnostic Console Log Panel -->
      <v-card rounded="xl" elevation="0" class="mb-6 border-stone overflow-hidden" style="background: #0F172A; color: #F8FAFC">
        <div class="px-4 py-3 d-flex align-center justify-space-between" style="border-bottom: 1px solid #1E293B">
          <div class="d-flex align-center ga-2">
            <v-icon icon="mdi-console-line" color="#38BDF8" size="20" />
            <span class="text-subtitle-2 font-weight-bold text-white">
              Console Log วินิจฉัยการทำงาน (Insert / Update / Delete)
            </span>
            <v-chip size="x-small" color="#334155" variant="flat" class="text-white">
              {{ diagnosticLogs.length }} logs
            </v-chip>
          </div>
          <div class="d-flex align-center ga-2">
            <v-btn
              size="x-small"
              variant="text"
              color="#94A3B8"
              class="text-none"
              @click="diagnosticLogs = []"
            >
              ล้าง Log
            </v-btn>
            <v-btn
              size="x-small"
              variant="tonal"
              color="#38BDF8"
              class="text-none"
              @click="showLogPanel = !showLogPanel"
            >
              {{ showLogPanel ? 'ซ่อน' : 'แสดง' }}
            </v-btn>
          </div>
        </div>

        <div v-if="showLogPanel" class="pa-4" style="max-height: 280px; overflow-y: auto; font-family: monospace; font-size: 12.5px">
          <div v-if="diagnosticLogs.length === 0" class="text-slate-400">
            กดปุ่ม "🧪 เทส Insert / Update / Delete" หรือลองกดเพิ่ม/แก้ไข/ลบบทความ เพื่อดู Console Log วินิจฉัยแบบละเอียด...
          </div>
          <div
            v-for="log in diagnosticLogs"
            :key="log.id"
            class="mb-2 pa-2 rounded-lg"
            :style="{
              background: log.level === 'error' ? 'rgba(225, 29, 72, 0.15)' : log.level === 'warn' ? 'rgba(245, 158, 11, 0.14)' : 'rgba(16, 185, 129, 0.12)',
              borderLeft: log.level === 'error' ? '3px solid #F43F5E' : log.level === 'warn' ? '3px solid #F59E0B' : '3px solid #10B981'
            }"
          >
            <div class="d-flex align-center ga-2 mb-1">
              <span class="font-weight-bold" :style="{ color: log.level === 'error' ? '#FDA4AF' : log.level === 'warn' ? '#FCD34D' : '#6EE7B7' }">
                [{{ log.action }}]
              </span>
              <span style="color: #94A3B8">{{ log.timestamp }}</span>
            </div>
            <div style="color: #F1F5F9; line-height: 1.5">{{ log.message }}</div>
            <pre v-if="log.detail" class="mt-1 pa-2 rounded" style="background: rgba(2, 6, 23, 0.65); color: #CBD5E1; overflow-x: auto; font-size: 11.5px">{{ log.detail }}</pre>
          </div>
        </div>
      </v-card>

      <!-- Search & Category Filters -->
      <v-card rounded="xl" elevation="0" class="pa-4 border-stone bg-white mb-6">
        <div class="d-flex flex-column flex-sm-row align-center justify-space-between ga-3 mb-3">
          <v-text-field
            v-model="searchQuery"
            placeholder="ค้นหาชื่อเรื่อง หรือคำอธิบายบทความในฐานข้อมูล..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            hide-details
            clearable
            rounded="lg"
            bg-color="#FAF9F6"
            class="flex-grow-1 w-100"
          />
          <div class="text-caption text-slate-500 font-weight-medium text-no-wrap">
            พบ {{ filteredArticles.length }} บทความ
          </div>
        </div>

        <!-- Category Pills -->
        <div class="d-flex flex-wrap ga-1.5 pt-2 border-t-stone">
          <v-chip
            v-for="cat in categories"
            :key="cat"
            size="small"
            rounded="pill"
            :color="selectedCategory === cat ? '#0F172A' : '#F5F5F4'"
            variant="flat"
            :class="selectedCategory === cat ? 'text-white font-weight-bold' : 'text-slate-700'"
            class="cursor-pointer"
            @click="selectedCategory = cat; currentPage = 1"
          >
            {{ cat === 'all' ? `ทั้งหมด (${articles.length})` : cat }}
          </v-chip>
        </div>
      </v-card>

      <!-- Articles Grid Cards -->
      <v-row v-if="paginatedArticles.length > 0">
        <v-col v-for="item in paginatedArticles" :key="item.id" cols="12" md="6" lg="4" class="d-flex">
          <v-card rounded="xl" elevation="0" class="pa-0 border-stone bg-white d-flex flex-column w-100 overflow-hidden hover-card">
            <!-- Article Image -->
            <div class="position-relative" style="height: 180px">
              <v-img :src="item.image" cover height="180" class="bg-stone-100" />
              <v-chip
                size="x-small"
                color="rgba(15, 23, 42, 0.85)"
                variant="flat"
                class="position-absolute text-white font-weight-bold"
                style="top: 10px; left: 10px"
              >
                {{ item.category }}
              </v-chip>
            </div>

            <!-- Content Area -->
            <div class="pa-4 d-flex flex-column flex-grow-1 justify-space-between">
              <div>
                <h3 class="text-subtitle-1 font-weight-bold text-slate-900 mb-2 line-clamp-2">
                  {{ item.title }}
                </h3>
                <p class="text-body-2 text-slate-600 line-clamp-3 mb-4">
                  {{ item.summary }}
                </p>
              </div>

              <!-- Action Buttons -->
              <div class="pt-3 border-t-stone d-flex align-center justify-space-between">
                <span class="text-caption text-slate-400 font-mono">ID: {{ item.id }}</span>
                <div class="d-flex align-center ga-1">
                  <v-btn
                    size="small"
                    variant="tonal"
                    color="#0284C7"
                    icon="mdi-pencil-outline"
                    class="rounded-lg"
                    @click="openEditDialog(item)"
                  />
                  <v-btn
                    size="small"
                    variant="tonal"
                    color="#E11D48"
                    icon="mdi-delete-outline"
                    class="rounded-lg"
                    @click="confirmDelete(item)"
                  />
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Empty State -->
      <v-card v-else rounded="xl" class="pa-12 text-center border-stone bg-white">
        <v-icon icon="mdi-database-search" size="56" color="#94A3B8" class="mb-3" />
        <div class="text-h6 font-weight-bold text-slate-800">ไม่พบบทความที่ตรงกับการค้นหา</div>
        <p class="text-body-2 text-slate-400 mt-1">ลองเปลี่ยนคำค้นหา หรือกดปุ่มสร้างบทความใหม่</p>
      </v-card>

      <!-- Pagination Controls -->
      <div v-if="totalPages > 1" class="d-flex justify-center mt-8">
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          rounded="lg"
          active-color="#D97706"
          density="comfortable"
        />
      </div>

      <!-- Create / Edit Modal Dialog -->
      <v-dialog v-model="dialogOpen" max-width="600" persistent>
        <v-card rounded="xl" class="pa-6">
          <div class="d-flex align-center justify-space-between mb-4">
            <h3 class="text-h6 font-weight-bold text-slate-900">
              {{ isEditing ? '✏️ แก้ไขบทความใน Database' : '✨ สร้างบทความใหม่ลง Database' }}
            </h3>
            <v-btn icon="mdi-close" variant="text" size="small" @click="dialogOpen = false" />
          </div>

          <v-text-field
            v-model="formData.title"
            label="หัวข้อบทความ *"
            variant="outlined"
            density="comfortable"
            rounded="lg"
            class="mb-3"
          />

          <v-select
            v-model="formData.category"
            label="หมวดหมู่ *"
            :items="[
              'คอนโด & ประหยัดพื้นที่',
              'ครัว & มินิบาร์',
              'ห้องนอน & พักผ่อน',
              'สมาร์ทโฮม & ฟังก์ชันลับ',
              'งานช่าง & วิดีโอสั้น'
            ]"
            variant="outlined"
            density="comfortable"
            rounded="lg"
            class="mb-3"
          />

          <v-textarea
            v-model="formData.summary"
            label="คำอธิบายสรุป / เนื้อหาบทความ *"
            variant="outlined"
            rows="4"
            rounded="lg"
            class="mb-3"
          />

          <v-text-field
            v-model="formData.image"
            label="ลิงก์รูปภาพหน้าปก (รองรับลิงก์แชร์ Google Drive ทุกรูปแบบ)"
            placeholder="วางลิงก์ https://drive.google.com/file/d/... หรือ URL รูปภาพ"
            variant="outlined"
            density="comfortable"
            rounded="lg"
            class="mb-2"
            @blur="formData.image = normalizeDriveImageUrl(formData.image)"
          />

          <!-- Quick Select from Google Drive Folder -->
          <div class="mb-4 pa-3 rounded-lg bg-stone-50 border-stone">
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="text-caption font-weight-bold text-slate-700">
                📁 เลือกรูปจาก Google Drive (โฟลเดอร์ ikammhomeimgweb):
              </span>
              <a :href="GOOGLE_DRIVE_FOLDER_URL" target="_blank" rel="noopener noreferrer" class="text-caption font-weight-bold text-sky-700">
                เปิดโฟลเดอร์ Drive ↗
              </a>
            </div>
            <div class="d-flex flex-wrap ga-2">
              <v-chip
                v-for="dImg in driveFolderFiles"
                :key="dImg.id"
                size="small"
                color="#0284C7"
                variant="tonal"
                class="cursor-pointer font-weight-bold"
                prepend-icon="mdi-google-drive"
                @click="formData.image = dImg.directUrl"
              >
                {{ dImg.name }}
              </v-chip>
            </div>
            <v-img
              v-if="formData.image"
              :src="normalizeDriveImageUrl(formData.image)"
              height="140"
              cover
              class="rounded-lg mt-3 border-stone bg-stone-100"
            />
          </div>

          <div class="d-flex justify-end ga-2">
            <v-btn variant="outlined" rounded="lg" color="#64748B" @click="dialogOpen = false">
              ยกเลิก
            </v-btn>
            <v-btn
              color="#D97706"
              variant="flat"
              rounded="lg"
              class="text-white font-weight-bold px-6"
              :loading="formSubmitting"
              @click="handleSaveArticle"
            >
              {{ isEditing ? 'บันทึกการแก้ไข' : 'สร้างบทความลง Database' }}
            </v-btn>
          </div>
        </v-card>
      </v-dialog>

      <!-- Delete Confirmation Dialog -->
      <v-dialog v-model="deleteDialogOpen" max-width="400">
        <v-card rounded="xl" class="pa-6 text-center">
          <v-icon icon="mdi-trash-can-outline" size="56" color="#E11D48" class="mb-3" />
          <h3 class="text-h6 font-weight-bold text-slate-900 mb-2">ลบบทความจาก Database?</h3>
          <p class="text-body-2 text-slate-500 mb-5">
            ยืนยันการลบ "{{ articleToDelete?.title }}" ออกจากฐานข้อมูลหรือไม่
          </p>
          <div class="d-flex justify-center ga-3">
            <v-btn variant="outlined" rounded="lg" color="#64748B" @click="deleteDialogOpen = false">
              ยกเลิก
            </v-btn>
            <v-btn
              color="#E11D48"
              variant="flat"
              rounded="lg"
              class="text-white font-weight-bold px-5"
              @click="handleDeleteArticle"
            >
              ลบออกจาก Database
            </v-btn>
          </div>
        </v-card>
      </v-dialog>

      <!-- Snackbar Toast Feedback -->
      <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3500" rounded="lg">
        {{ snackbarText }}
      </v-snackbar>
    </v-container>
  </div>
</template>

<style scoped>
.hover-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hover-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08) !important;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
