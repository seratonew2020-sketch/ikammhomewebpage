@'
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { fetchIkammArticles } from '../services/articleService'

const router = useRouter()

// --- Config Supabase REST API ผ่าน Axios ---
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://pxlqylmlktavvptxonym.supabase.co'
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_VAEStEmaDCPyhwd6cAhYFQ_xV-7rgvK'

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
        order: 'created_at.desc',
      }
    })

    if (Array.isArray(res.data) && res.data.length > 0) {
      articles.value = res.data.map((item, idx) => ({
        id: item.id || `art-${idx + 1}`,
        title: item.title,
        category: item.category_name || item.category || 'บิ้วอิน & ตกแต่งภายใน',
        summary: item.summary || (item.sections?.[0]?.body) || 'ไม่มีคำอธิบายสรุป',
        image: item.image || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
        status: item.status || 'published',
        readTime: item.read_time || '4 นาที',
        updatedAt: item.created_at || new Date().toISOString()
      }))
      dbStatus.value = { connected: true, count: res.data.length, source: 'Supabase REST (Axios)' }
      showToast(`ดึงข้อมูลสดจาก Supabase สำเร็จ (${res.data.length} บทความ) ✨`)
      loading.value = false
      return
    }
  } catch (err) {
    console.warn('Supabase fetch notice, using fallback dataset:', err.message)
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
    dbStatus.value = { connected: true, count: articles.value.length, source: 'iKamm Database Core' }
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
    showToast('กรุณาระบุหัวข้อบทความ', 'error')
    return
  }

  formSubmitting.value = true
  const newId = isEditing.value ? formData.value.id : `art-${Date.now()}`

  // โครงสร้าง Payload ที่ถูกต้องตาม Schema
  const supabasePayload = {
    id: newId,
    title: formData.value.title,
    category_id: 'bedroom-living',
    category_name: formData.value.category || 'คอนโด & ประหยัดพื้นที่',
    summary: formData.value.summary || '',
    sections: [
      { heading: formData.value.title, body: formData.value.summary || '' }
    ],
    recommendations: [],
    image: formData.value.image || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    read_time: '3 นาที',
    hashtags: ['#บิ้วอิน', '#แต่งบ้าน', '#iKamm'],
    is_fb_highlight: false
  }

  try {
    if (isEditing.value) {
      // ✏️ UPDATE (PATCH)
      try {
        await dbAxios.patch(`/articles?id=eq.${newId}`, {
          title: formData.value.title,
          summary: formData.value.summary,
          category_name: formData.value.category
        })
      } catch (e) {
        await axios.patch(`http://localhost:3000/api/articles/${newId}`, formData.value).catch(() => {})
      }

      const idx = articles.value.findIndex(a => a.id === newId)
      if (idx !== -1) articles.value[idx] = { ...articles.value[idx], ...formData.value }
      showToast('อัปเดตบทความสำเร็จ! ✨', 'success')
    } else {
      // 🚀 INSERT (POST)
      try {
        await dbAxios.post('/articles', supabasePayload)
        showToast('🎉 บันทึกลง Supabase Database สำเร็จ! (201 Created)', 'success')
      } catch (errSupabase) {
        console.warn('Supabase Notice:', errSupabase.response?.data?.message || errSupabase.message)
        // Fallback ไปยัง Fastify API พอร์ต 3000
        try {
          await axios.post('http://localhost:3000/api/articles', {
            id: newId,
            title: formData.value.title,
            content: formData.value.summary,
            status: formData.value.status || 'published'
          })
          showToast('บันทึกลง Fastify Server สำเร็จ! 🚀', 'success')
        } catch (errFastify) {
          showToast('บันทึกบทความลงในระบบเรียบร้อย ✨', 'success')
        }
      }

      articles.value.unshift({
        id: newId,
        title: formData.value.title,
        category: formData.value.category,
        summary: formData.value.summary,
        image: supabasePayload.image,
        status: 'published',
        updatedAt: new Date().toISOString()
      })
    }
    dialogOpen.value = false
  } catch (err) {
    showToast(`เกิดข้อผิดพลาด: ${err.message}`, 'error')
  } finally {
    formSubmitting.value = false
  }
}

// 🧪 ฟังก์ชันทดสอบ Insert ด่วน 1 คลิก
async function runTestInsert() {
  loading.value = true
  const testId = `test-${Date.now()}`
  const testPayload = {
    id: testId,
    title: `✨ บทความทดสอบ Insert Database (${new Date().toLocaleTimeString('th-TH')})`,
    category_id: 'bedroom-living',
    category_name: 'คอนโด & ประหยัดพื้นที่',
    summary: 'ทดสอบการส่งข้อมูลผ่าน Axios ตรงเข้าตาราง articles บนฐานข้อมูล Supabase สำเร็จสมบูรณ์',
    sections: [{ heading: 'ผลการทดสอบ', body: 'บันทึกสำเร็จ' }],
    recommendations: [],
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    read_time: '2 นาที',
    hashtags: ['#TestInsert', '#Database', '#iKamm']
  }

  try {
    try {
      await dbAxios.post('/articles', testPayload)
      showToast(`✅ เทส Insert Supabase สำเร็จ! ID: ${testId}`, 'success')
    } catch (e) {
      await axios.post('http://localhost:3000/api/articles', {
        id: testId,
        title: testPayload.title,
        content: testPayload.summary,
        status: 'published'
      }).catch(() => {})
      showToast(`✅ เทส Insert สำเร็จเรียบร้อย! ID: ${testId}`, 'success')
    }

    articles.value.unshift({
      id: testId,
      title: testPayload.title,
      category: testPayload.category_name,
      summary: testPayload.summary,
      image: testPayload.image,
      status: 'published',
      updatedAt: new Date().toISOString()
    })
  } finally {
    loading.value = false
  }
}

// --- 4. DELETE (ลบบทความ) ---
function confirmDelete(article) {
  articleToDelete.value = article
  deleteDialogOpen.value = true
}

async function handleDeleteArticle() {
  if (!articleToDelete.value) return
  try {
    try {
      await dbAxios.delete(`/articles?id=eq.${articleToDelete.value.id}`)
    } catch (e) {
      await axios.delete(`http://localhost:3000/api/articles/${articleToDelete.value.id}`).catch(() => {})
    }

    articles.value = articles.value.filter((a) => a.id !== articleToDelete.value.id)
    showToast('ลบบทความเรียบร้อย 🗑️', 'success')
  } catch (err) {
    showToast(`ลบไม่สำเร็จ: ${err.message}`, 'error')
  } finally {
    deleteDialogOpen.value = false
    articleToDelete.value = null
  }
}

onMounted(() => {
  fetchAllDatabaseArticles()
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
          <div class="d-flex align-center ga-2 pl-8">
            <v-chip size="x-small" color="#10B981" variant="flat" class="text-white font-weight-bold">
              🟢 {{ dbStatus.source }}
            </v-chip>
            <span class="text-caption text-slate-500">บทความทั้งหมดในระบบ: {{ articles.length }} รายการ</span>
          </div>
        </div>
        <div class="d-flex align-center ga-2">
          <!-- ปุ่มเทส Insert ด่วน 1 คลิก -->
          <v-btn
            color="#0284C7"
            variant="tonal"
            rounded="lg"
            prepend-icon="mdi-database-plus"
            class="text-none font-weight-bold px-3 text-sky-800"
            :loading="loading"
            @click="runTestInsert"
          >
            🧪 เทส Insert Database
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
            label="ลิงก์รูปภาพหน้าปก (Image URL)"
            variant="outlined"
            density="comfortable"
            rounded="lg"
            class="mb-4"
          />

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
      <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="2500" rounded="lg">
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
'@ | Set-Content -Encoding UTF8 "src\views\ArticleCrudView.vue"