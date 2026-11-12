<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { Chart, registerables } from 'chart.js'
import { HERO_IMAGE, ARTICLES as CONSTRUCTION_ARTICLES } from '../data/constructionData'
import { LANGUAGES, I18N_DATA, getLocalizedArticleSvg } from '../data/i18nData'
import { EXTRA_I18N } from '../data/extraMenuData'
import {
  IKAMM_CATEGORIES,
  getLocalizedIkammArticles,
  getIkammArticleSvg,
} from '../data/ikammArticlesData'
import { fetchIkammArticles, submitCustomerLead } from '../services/articleService'

Chart.register(...registerables)

// --- Language State (TH / EN / ZH) ---
const currentLang = ref('th')

const t = computed(() => I18N_DATA[currentLang.value] || I18N_DATA.th)
const tx = computed(() => EXTRA_I18N[currentLang.value] || EXTRA_I18N.th)

function setLanguage(langCode) {
  if (!I18N_DATA[langCode]) return
  currentLang.value = langCode
  try {
    localStorage.setItem('sangsan_lang', langCode)
  } catch (e) {
    // ignore storage errors
  }
  document.documentElement.lang = langCode
  document.title = t.value.brand.pageTitle
  if (activeTab.value === 'compare') {
    nextTick(() => renderChart())
  }
  syncArticlesFromDb(langCode)
}

// --- Navigation & View State ---
const activeTab = ref('articles')
const mobileDrawer = ref(false)

const navItems = computed(() => [
  { value: 'articles', label: t.value.nav.articles, icon: 'mdi-book-open-page-variant-outline' },
  { value: 'compare', label: t.value.nav.compare, icon: 'mdi-scale-balance' },
  { value: 'prices', label: tx.value.nav.prices, icon: 'mdi-tag-multiple-outline' },
  { value: 'calculator', label: t.value.nav.calculator, icon: 'mdi-calculator-variant-outline' },
  { value: 'measure', label: tx.value.nav.measure, icon: 'mdi-tape-measure' },
  { value: 'saved', label: t.value.nav.saved, icon: 'mdi-bookmark-outline', hasBadge: true },
])

function switchTab(tab) {
  activeTab.value = tab
  mobileDrawer.value = false
  if (tab === 'compare') {
    nextTick(() => renderChart())
  }
}

// --- Localized Articles List (Dual-Mode: Supabase or Local Fallback + 6 Construction Knowledge) ---
const remoteIkammArticles = ref(null)
const dbSyncSource = ref('local')
const dbArticleCount = ref(0)
const isSyncingDb = ref(false)

async function syncArticlesFromDb(lang = currentLang.value, showToast = false) {
  isSyncingDb.value = true
  try {
    const res = await fetchIkammArticles(lang)
    if (res.source === 'supabase' && Array.isArray(res.articles) && res.articles.length > 0) {
      remoteIkammArticles.value = res.articles
      dbSyncSource.value = 'supabase'
      dbArticleCount.value = res.totalInDb || res.articles.length
      if (showToast) {
        triggerToast(`ดึงข้อมูลจาก Supabase สำเร็จแล้ว (${dbArticleCount.value} บทความ)`)
      }
    } else {
      remoteIkammArticles.value = null
      dbSyncSource.value = 'local'
      if (showToast && res.error) {
        triggerToast(`Supabase: ${res.error}`)
      }
    }
  } finally {
    isSyncingDb.value = false
  }
}

const localizedArticles = computed(() => {
  const ikamm = remoteIkammArticles.value || getLocalizedIkammArticles(currentLang.value)
  const dict = t.value.articles || {}
  const construction = CONSTRUCTION_ARTICLES.map((base, idx) => {
    const loc = dict[base.id] || {}
    return {
      ...base,
      ...loc,
      id: base.id,
      day: 31 + idx,
      dayLabel: `Guide ${idx + 1}`,
      pillar: loc.category || base.category,
      image: base.image || null,
      svgType: base.svgType || null,
      isConstruction: true,
    }
  })
  return [...ikamm, ...construction]
})

const articleCategories = computed(() => {
  const ikammCats = IKAMM_CATEGORIES[currentLang.value] || IKAMM_CATEGORIES.th
  const constructionCats = (t.value.categories || []).filter((c) => c.id !== 'all')
  const allLabelMap = {
    th: 'ทั้งหมด (48 บทความ)',
    en: 'All (48 Articles)',
    zh: '全部文章 (48篇)',
  }
  const fbGroupMap = {
    th: 'โพสต์ Facebook จริง (12)',
    en: 'Featured Facebook Posts (12)',
    zh: 'Facebook 实景精选帖 (12)',
  }
  const constGroupMap = {
    th: 'งานก่อสร้าง & สเปกวัสดุ (6)',
    en: 'Construction & Materials (6)',
    zh: '建筑施工与建材 (6)',
  }
  const lang = currentLang.value
  return [
    { id: 'all', label: allLabelMap[lang] || allLabelMap.th },
    { id: 'fb-posts', label: fbGroupMap[lang] || fbGroupMap.th },
    ...ikammCats.filter((c) => c.id !== 'all'),
    { id: 'construction-all', label: constGroupMap[lang] || constGroupMap.th },
    ...constructionCats,
  ]
})

const paginationText = computed(() => {
  const map = {
    th: (page, total, count) => `หน้า ${page} จาก ${total} (ทั้งหมด ${count} รายการ)`,
    en: (page, total, count) => `Page ${page} of ${total} (${count} items)`,
    zh: (page, total, count) => `第 ${page} 页 / 共 ${total} 页（共 ${count} 项）`,
  }
  return map[currentLang.value] || map.th
})

function renderArticleSvg(article) {
  if (article?.svgType) {
    return getLocalizedArticleSvg(article.svgType, t.value.svgLabels)
  }
  return getIkammArticleSvg(article)
}

// --- Articles & Filtering State ---
const selectedCategoryId = ref('all')
const searchQuery = ref('')
const articlePage = ref(1)
const articlesPerPage = ref(6)
const articleViewMode = ref('grid') // 'grid' | 'directory'
const directoryDialogOpen = ref(false)

const articleUiText = computed(() => {
  const map = {
    th: {
      quickDirectoryBtn: '📖 สารบัญบทความ',
      quickDirectoryTitle: 'สารบัญบทความทั้งหมด (Facebook + บิ้วอิน + งานก่อสร้าง)',
      quickDirectorySub: 'คลิกที่หัวข้อใดก็ได้เพื่อเปิดอ่านเนื้อหาและรูปภาพทันที',
      viewGrid: 'มุมมองการ์ด',
      viewDirectory: 'สารบัญบทความ',
      perPageLabel: 'แสดงต่อหน้า:',
      showAllLabel: 'ทั้งหมด (48)',
      readNowBtn: 'เปิดอ่านทันที',
      fbBannerNote: 'รวบรวมบทความล่าสุด & ไอเดียบิ้วอินจากเพจ Facebook: iKamm Home Decor',
      fbPostBadge: 'Facebook Post',
      fbViewPostBtn: 'ดูโพสต์บน Facebook',
      ctaTitle: 'ข้อเสนอพิเศษ & ติดต่อทีมงาน',
    },
    en: {
      quickDirectoryBtn: '📖 Quick 48-Topic Directory',
      quickDirectoryTitle: 'Complete 48 Articles Directory (12 FB Posts + 30 Built-In + 6 Guides)',
      quickDirectorySub: 'Click any topic below to jump straight into the full article and visuals',
      viewGrid: 'Card Grid',
      viewDirectory: 'Master Directory (48)',
      perPageLabel: 'Per page:',
      showAllLabel: 'All (48)',
      readNowBtn: 'Read Now',
      fbBannerNote: 'Curated 12 latest posts & 30 articles from Facebook Page: iKamm Home Decor',
      fbPostBadge: 'Facebook Post',
      fbViewPostBtn: 'View on Facebook',
      ctaTitle: 'Special Offer & Next Step',
    },
    zh: {
      quickDirectoryBtn: '📖 48篇主题速查目录',
      quickDirectoryTitle: '全部 48 篇文章总目录（12篇 FB 精选帖 + 30篇定制 + 6篇施工指南）',
      quickDirectorySub: '点击下方任意主题即可立即查看完整方案与配图',
      viewGrid: '卡片视图',
      viewDirectory: '48篇总目录',
      perPageLabel: '每页显示：',
      showAllLabel: '全部 (48)',
      readNowBtn: '立即阅读',
      fbBannerNote: '精选收录 Facebook 专页 iKamm Home Decor 12篇实景帖及 30篇干货',
      fbPostBadge: 'Facebook 专页文章',
      fbViewPostBtn: '在 Facebook 查看',
      ctaTitle: '专属预约与联系咨询',
    },
  }
  return map[currentLang.value] || map.th
})

const filteredArticles = computed(() => {
  const q = searchQuery.value ? searchQuery.value.trim().toLowerCase() : ''
  const selectedCatObj = articleCategories.value.find((c) => c.id === selectedCategoryId.value)
  const selectedCatLabel = selectedCatObj ? selectedCatObj.label : ''

  return localizedArticles.value.filter((a) => {
    const matchCat =
      selectedCategoryId.value === 'all' ||
      (selectedCategoryId.value === 'fb-posts' && a.isFbHighlight) ||
      (selectedCategoryId.value === 'construction-all' && a.isConstruction) ||
      a.categoryId === selectedCategoryId.value ||
      a.category === selectedCatLabel ||
      (a.tags && a.tags.includes(selectedCatLabel))
    const matchQ =
      !q ||
      (a.title || '').toLowerCase().includes(q) ||
      (a.summary || '').toLowerCase().includes(q) ||
      (a.pillar || '').toLowerCase().includes(q) ||
      (a.format || '').toLowerCase().includes(q) ||
      (a.tags && a.tags.some((tag) => tag.toLowerCase().includes(q)))
    return matchCat && matchQ
  })
})

const totalArticlePages = computed(() => {
  return Math.max(1, Math.ceil(filteredArticles.value.length / articlesPerPage.value))
})

const paginatedArticles = computed(() => {
  const start = (articlePage.value - 1) * articlesPerPage.value
  return filteredArticles.value.slice(start, start + articlesPerPage.value)
})

watch([searchQuery, selectedCategoryId, articlesPerPage], () => {
  articlePage.value = 1
})

function resetFilters() {
  searchQuery.value = ''
  selectedCategoryId.value = 'all'
  articlePage.value = 1
}

// --- Bookmarks (Saved Articles) ---
const savedIds = ref([])

onMounted(() => {
  try {
    const savedLang = localStorage.getItem('sangsan_lang')
    if (savedLang && I18N_DATA[savedLang]) {
      currentLang.value = savedLang
    }
  } catch (e) {
    // ignore
  }
  document.documentElement.lang = currentLang.value
  document.title = t.value.brand.pageTitle

  try {
    const raw = localStorage.getItem('sangsan_bookmarks')
    if (raw) {
      savedIds.value = JSON.parse(raw)
    }
  } catch (e) {
    savedIds.value = []
  }

  // Initialize default measured zones if empty
  if (measuredZones.value.length === 0) {
    measuredZones.value = tx.value.measure.defaultZones.map((z) => ({ ...z }))
  }
  syncArticlesFromDb(currentLang.value)
})

// --- Customer Lead / Quote Inquiry Form (Supabase `leads`) ---
const leadForm = ref({
  name: '',
  phone: '',
  lineId: '',
  roomType: '',
  budget: '',
  notes: '',
})
const leadSubmitting = ref(false)
const leadFeedback = ref({ type: '', text: '' })

const leadUiText = computed(() => {
  const map = {
    th: {
      title: 'ส่งข้อมูลนัดวัดพื้นที่ & ขอประเมินราคาฟรี',
      subtitle: 'ระบบจะบันทึกข้อมูลและขนาดพื้นที่ที่วัดได้ไปยังฐานข้อมูลทีมงาน iKamm โดยตรง',
      nameLabel: 'ชื่อ - นามสกุล *',
      phoneLabel: 'เบอร์โทรศัพท์ *',
      lineLabel: 'Line ID',
      roomLabel: 'ประเภทงาน / ห้อง (เช่น คอนโด Studio, ครัว, Walk-in Closet)',
      budgetLabel: 'งบประมาณโดยประมาณ (เช่น 150,000 - 300,000 บาท)',
      notesLabel: 'รายละเอียดเพิ่มเติม / โครงการ / ทำเล',
      submitBtn: 'ส่งข้อมูลให้ทีมงาน iKamm',
      requiredErr: 'กรุณากรอกชื่อและเบอร์โทรศัพท์',
      successMsg: 'บันทึกข้อมูลเรียบร้อย! ทีมงาน iKamm จะติดต่อกลับโดยเร็วที่สุด',
      failPrefix: 'ไม่สามารถบันทึกข้อมูลได้: ',
    },
    en: {
      title: 'Request Free Site Measurement & Quote',
      subtitle: 'Saves your contact details and measured area directly to the iKamm database',
      nameLabel: 'Full Name *',
      phoneLabel: 'Phone Number *',
      lineLabel: 'Line ID',
      roomLabel: 'Project / Room Type (e.g., Studio Condo, Kitchen, Walk-in Closet)',
      budgetLabel: 'Estimated Budget',
      notesLabel: 'Additional Notes / Project Location',
      submitBtn: 'Submit Inquiry to iKamm',
      requiredErr: 'Please enter your name and phone number',
      successMsg: 'Inquiry saved! Our iKamm team will contact you shortly.',
      failPrefix: 'Submission failed: ',
    },
    zh: {
      title: '预约免费上门量尺与报价评估',
      subtitle: '系统将把您的联系信息与已测量的面积直接保存至 iKamm 数据库',
      nameLabel: '姓名 *',
      phoneLabel: '联系电话 *',
      lineLabel: 'Line ID / 微信号',
      roomLabel: '定制空间类型（如公寓、厨房、衣帽间）',
      budgetLabel: '预算范围',
      notesLabel: '项目地址或补充说明',
      submitBtn: '提交预约信息',
      requiredErr: '请填写姓名和联系电话',
      successMsg: '提交成功！iKamm 团队将尽快与您联系。',
      failPrefix: '提交失败：',
    },
  }
  return map[currentLang.value] || map.th
})

async function handleSubmitLead() {
  leadFeedback.value = { type: '', text: '' }
  if (!leadForm.value.name.trim() || !leadForm.value.phone.trim()) {
    leadFeedback.value = { type: 'error', text: leadUiText.value.requiredErr }
    return
  }
  leadSubmitting.value = true
  try {
    const res = await submitCustomerLead({
      name: leadForm.value.name.trim(),
      phone: leadForm.value.phone.trim(),
      lineId: leadForm.value.lineId.trim(),
      roomType: leadForm.value.roomType.trim(),
      budget: leadForm.value.budget.trim(),
      areaSqm: totalMeasuredStats.value?.area || null,
      notes: leadForm.value.notes.trim(),
      lang: currentLang.value,
      sourcePage: 'measure-tab',
    })
    if (res.ok) {
      leadFeedback.value = { type: 'success', text: leadUiText.value.successMsg }
      leadForm.value = { name: '', phone: '', lineId: '', roomType: '', budget: '', notes: '' }
    } else {
      leadFeedback.value = {
        type: 'error',
        text: `${leadUiText.value.failPrefix}${res.message || 'Unknown error'}`,
      }
    }
  } finally {
    leadSubmitting.value = false
  }
}

function persistBookmarks() {
  try {
    localStorage.setItem('sangsan_bookmarks', JSON.stringify(savedIds.value))
  } catch (e) {
    // ignore storage errors
  }
}

function isBookmarked(id) {
  return savedIds.value.includes(id)
}

function toggleBookmark(id) {
  const idx = savedIds.value.indexOf(id)
  if (idx > -1) {
    savedIds.value.splice(idx, 1)
    triggerToast(t.value.toasts.removed)
  } else {
    savedIds.value.push(id)
    triggerToast(t.value.toasts.saved)
  }
  persistBookmarks()
}

function clearAllSaved() {
  savedIds.value = []
  persistBookmarks()
  triggerToast(t.value.toasts.clearedAll)
}

const savedArticles = computed(() => {
  return localizedArticles.value.filter((a) => savedIds.value.includes(a.id))
})

// --- Article Reader Dialog (Modal) ---
const dialogOpen = ref(false)
const currentArticleId = ref(null)

const currentArticle = computed(() => {
  return localizedArticles.value.find((a) => a.id === currentArticleId.value) || null
})

function openArticle(id) {
  currentArticleId.value = id
  dialogOpen.value = true
}

function copyArticleSummary() {
  const article = currentArticle.value
  if (!article) return
  const text = `${article.title}\n\n${article.summary}\n\n${t.value.modal.recommendedMaterials}:\n- ${article.recommendations.join('\n- ')}`
  copyTextToClipboard(text, t.value.toasts.copied)
}

function copyTextToClipboard(text, successMsg) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(() => triggerToast(successMsg))
      .catch(() => fallbackCopy(text, successMsg))
  } else {
    fallbackCopy(text, successMsg)
  }
}

function fallbackCopy(text, successMsg) {
  const ta = document.createElement('textarea')
  ta.value = text
  ta.style.position = 'fixed'
  ta.style.opacity = '0'
  document.body.appendChild(ta)
  ta.select()
  try {
    document.execCommand('copy')
    triggerToast(successMsg)
  } catch (e) {
    triggerToast(t.value.toasts.copyFailed)
  }
  document.body.removeChild(ta)
}

// --- Material Comparison & Chart.js ---
const activeCompare = ref('bricks')
const compareCanvas = ref(null)
let chartInstance = null

const currentCompareData = computed(() => t.value.compareData[activeCompare.value])

function getBadgeStyle(badgeColor) {
  if (badgeColor.includes('orange')) return { bg: '#FFEDD5', text: '#9A3412' }
  if (badgeColor.includes('emerald')) return { bg: '#D1FAE5', text: '#065F46' }
  if (badgeColor.includes('sky')) return { bg: '#E0F2FE', text: '#075985' }
  if (badgeColor.includes('amber')) return { bg: '#FEF3C7', text: '#92400E' }
  if (badgeColor.includes('indigo')) return { bg: '#E0E7FF', text: '#3730A3' }
  if (badgeColor.includes('rose')) return { bg: '#FFE4E6', text: '#9F1239' }
  if (badgeColor.includes('teal')) return { bg: '#CCFBF1', text: '#115E59' }
  return { bg: '#E2E8F0', text: '#1E293B' }
}

function renderChart() {
  if (!compareCanvas.value) return
  const ctx = compareCanvas.value.getContext('2d')
  if (chartInstance) {
    chartInstance.destroy()
  }
  const data = currentCompareData.value
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: data.datasets.map((ds) => ({
        label: ds.label,
        data: ds.data,
        backgroundColor: ds.color,
        borderRadius: 6,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true, max: 10, ticks: { stepSize: 2 } },
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 12,
            font: { size: 12, family: "'Noto Sans Thai', 'Noto Sans SC', 'Inter', sans-serif" },
          },
        },
      },
    },
  })
}

watch(activeCompare, () => {
  if (activeTab.value === 'compare') {
    nextTick(() => renderChart())
  }
  syncArticlesFromDb(langCode)
})

// --- VIEW: MATERIAL PRICES & BUDGET ESTIMATOR ---
const priceSearch = ref('')
const selectedPriceCat = ref('all')
const pricePage = ref(1)
const pricesPerPage = 3
const estimateCart = ref([
  { id: 'p-cement-1', qty: 20 },
  { id: 'p-brick-aac', qty: 250 },
  { id: 'p-rebar-db12', qty: 15 },
])

const filteredPriceItems = computed(() => {
  const q = priceSearch.value ? priceSearch.value.trim().toLowerCase() : ''
  return tx.value.prices.items.filter((item) => {
    const matchCat = selectedPriceCat.value === 'all' || item.catId === selectedPriceCat.value
    const matchQ =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.spec.toLowerCase().includes(q) ||
      item.catLabel.toLowerCase().includes(q)
    return matchCat && matchQ
  })
})

const totalPricePages = computed(() => {
  return Math.max(1, Math.ceil(filteredPriceItems.value.length / pricesPerPage))
})

const paginatedPriceItems = computed(() => {
  const start = (pricePage.value - 1) * pricesPerPage
  return filteredPriceItems.value.slice(start, start + pricesPerPage)
})

watch([priceSearch, selectedPriceCat], () => {
  pricePage.value = 1
})

const detailedEstimateCart = computed(() => {
  const itemsDict = tx.value.prices.items
  return estimateCart.value
    .map((entry) => {
      const info = itemsDict.find((i) => i.id === entry.id)
      if (!info) return null
      const qty = Math.max(1, parseFloat(entry.qty) || 1)
      return {
        ...info,
        qty,
        subtotal: qty * info.price,
      }
    })
    .filter(Boolean)
})

const totalEstimateBudget = computed(() => {
  return detailedEstimateCart.value.reduce((sum, item) => sum + item.subtotal, 0)
})

function addToEstimate(itemId) {
  const found = estimateCart.value.find((e) => e.id === itemId)
  if (found) {
    found.qty = (parseFloat(found.qty) || 1) + 1
  } else {
    estimateCart.value.push({ id: itemId, qty: 1 })
  }
  triggerToast(tx.value.prices.addedToast)
}

function removeFromEstimate(itemId) {
  estimateCart.value = estimateCart.value.filter((e) => e.id !== itemId)
}

function clearEstimateCart() {
  estimateCart.value = []
  triggerToast(tx.value.prices.clearedToast)
}

function formatMoney(val) {
  const localeMap = { th: 'th-TH', en: 'en-US', zh: 'zh-CN' }
  return Number(val || 0).toLocaleString(localeMap[currentLang.value] || 'en-US', {
    minimumFractionDigits: val % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })
}

function copyEstimateSummary() {
  if (detailedEstimateCart.value.length === 0) return
  const lines = detailedEstimateCart.value.map(
    (item, i) =>
      `${i + 1}. ${item.name} — ${item.qty} ${item.unit} × ฿${formatMoney(item.price)} = ฿${formatMoney(item.subtotal)}`
  )
  const text = `${tx.value.prices.estimatorTitle}\n${lines.join('\n')}\n\n${tx.value.prices.totalLabel} ฿${formatMoney(totalEstimateBudget.value)} ${tx.value.prices.currencyUnit}`
  copyTextToClipboard(text, tx.value.prices.copiedToast)
}

// --- VIEW: CALCULATORS ---
const wallWidth = ref(5)
const wallHeight = ref(3)
const openingsArea = ref(2)
const brickType = ref('aac')

const brickCalcResult = computed(() => {
  const w = Math.max(0, parseFloat(wallWidth.value) || 0)
  const h = Math.max(0, parseFloat(wallHeight.value) || 0)
  const op = Math.max(0, parseFloat(openingsArea.value) || 0)
  const netArea = Math.max(0, w * h - op)
  const specs = t.value.calculator.brickSpecs
  const s = specs[brickType.value] || specs.aac
  const baseCount = Math.ceil(netArea * s.perSqm)
  const withWaste = Math.ceil(baseCount * 1.05)
  const localeMap = { th: 'th-TH', en: 'en-US', zh: 'zh-CN' }
  return {
    netArea: netArea.toFixed(2),
    name: s.name,
    withWaste: withWaste.toLocaleString(localeMap[currentLang.value] || 'en-US'),
    mortar: s.mortar,
  }
})

const roofPlanArea = ref(80)
const roofPitch = ref(25)

const roofCalcResult = computed(() => {
  const plan = Math.max(0, parseFloat(roofPlanArea.value) || 0)
  const deg = Math.min(45, Math.max(3, parseFloat(roofPitch.value) || 25))
  const rad = (deg * Math.PI) / 180
  const factor = 1 / Math.cos(rad)
  const slopedArea = plan * factor

  let rec = ''
  if (deg < 15) {
    rec = t.value.calculator.roofRecLow
  } else if (deg < 20) {
    rec = t.value.calculator.roofRecMid
  } else {
    rec = t.value.calculator.roofRecHigh
  }

  return {
    deg,
    slopedArea: slopedArea.toFixed(1),
    factor: factor.toFixed(2),
    rec,
  }
})

// --- VIEW: SITE AREA MEASUREMENT ---
const zoneName = ref('')
const zoneShape = ref('rect')
const dimA = ref(4)
const dimB = ref(6)
const dimC = ref(2)
const dimD = ref(3)
const slabThicknessCm = ref(10)
const deductArea = ref(0)

const measuredZones = ref([])

const currentZoneCalc = computed(() => {
  const a = Math.max(0, parseFloat(dimA.value) || 0)
  const b = Math.max(0, parseFloat(dimB.value) || 0)
  const c = Math.max(0, parseFloat(dimC.value) || 0)
  const d = Math.max(0, parseFloat(dimD.value) || 0)
  const deduct = Math.max(0, parseFloat(deductArea.value) || 0)
  const thickM = Math.max(0, parseFloat(slabThicknessCm.value) || 0) / 100

  let rawArea = 0
  let perimeter = 0

  if (zoneShape.value === 'rect') {
    rawArea = a * b
    perimeter = 2 * (a + b)
  } else if (zoneShape.value === 'lshape') {
    rawArea = a * b + c * d
    perimeter = 2 * (a + b) + 2 * d
  } else if (zoneShape.value === 'triangle') {
    rawArea = 0.5 * a * b
    const hyp = Math.sqrt(a * a + b * b)
    perimeter = a + b + hyp
  } else if (zoneShape.value === 'trapezoid') {
    rawArea = 0.5 * (a + c) * b
    const side = Math.sqrt(Math.pow((a - c) / 2, 2) + b * b)
    perimeter = a + c + 2 * side
  }

  const netArea = Math.max(0, rawArea - deduct)
  const volume = netArea * thickM

  return {
    area: netArea,
    perimeter,
    volume,
    thickness: Math.max(0, parseFloat(slabThicknessCm.value) || 0),
  }
})

function addMeasuredZone() {
  const shapeObj = tx.value.measure.shapes.find((s) => s.value === zoneShape.value)
  const shortShape = shapeObj ? shapeObj.title.split(' ')[0] : zoneShape.value
  const defaultTitle = `${tx.value.measure.zoneNameLabel} #${measuredZones.value.length + 1}`
  measuredZones.value.push({
    id: Date.now(),
    name: zoneName.value.trim() || defaultTitle,
    shape: zoneShape.value,
    shapeName: shortShape,
    area: Number(currentZoneCalc.value.area.toFixed(2)),
    perimeter: Number(currentZoneCalc.value.perimeter.toFixed(2)),
    thickness: currentZoneCalc.value.thickness,
    volume: Number(currentZoneCalc.value.volume.toFixed(2)),
  })
  zoneName.value = ''
  triggerToast(tx.value.measure.zoneAddedToast)
}

function removeMeasuredZone(id) {
  measuredZones.value = measuredZones.value.filter((z) => z.id !== id)
}

function clearMeasuredZones() {
  measuredZones.value = []
  triggerToast(tx.value.measure.zoneClearedToast)
}

const totalMeasuredStats = computed(() => {
  const totalArea = measuredZones.value.reduce((s, z) => s + z.area, 0)
  const totalPerimeter = measuredZones.value.reduce((s, z) => s + z.perimeter, 0)
  const totalVolume = measuredZones.value.reduce((s, z) => s + z.volume, 0)
  return {
    area: totalArea.toFixed(2),
    perimeter: totalPerimeter.toFixed(2),
    volume: totalVolume.toFixed(2),
    rawArea: totalArea,
  }
})

function copyMeasuredSummary() {
  if (measuredZones.value.length === 0) return
  const m = tx.value.measure
  const lines = measuredZones.value.map(
    (z, idx) =>
      `${idx + 1}. ${z.name}: ${z.area.toFixed(2)} ${m.unitSqm} | ${m.previewPerimeter} ${z.perimeter.toFixed(1)} ${m.unitM} | ${z.volume.toFixed(2)} ${m.unitCum}`
  )
  const text = `${m.heading}\n${lines.join('\n')}\n\n${m.totalAreaLabel} ${totalMeasuredStats.value.area} ${m.unitSqm}\n${m.totalVolumeLabel} ${totalMeasuredStats.value.volume} ${m.unitCum}`
  copyTextToClipboard(text, m.zoneCopiedToast)
}

// Thai Land Converter & Floor Tile Estimator
const landSqmInput = ref(120)

function syncFromMeasuredTotal() {
  if (totalMeasuredStats.value.rawArea > 0) {
    landSqmInput.value = Number(totalMeasuredStats.value.rawArea.toFixed(2))
  }
}

const landAndTileCalc = computed(() => {
  const sqm = Math.max(0, parseFloat(landSqmInput.value) || 0)
  const totalWah = sqm / 4
  const rai = Math.floor(totalWah / 400)
  const remAfterRai = totalWah - rai * 400
  const ngan = Math.floor(remAfterRai / 100)
  const wah = (remAfterRai - ngan * 100).toFixed(1)

  const tileAreaWithWaste = sqm * 1.07
  const tileBoxes = Math.ceil(tileAreaWithWaste)
  const tiles60x60 = Math.ceil(tileAreaWithWaste / 0.36)

  return {
    rai,
    ngan,
    wah,
    tileBoxes: tileBoxes.toLocaleString('en-US'),
    tiles60x60: tiles60x60.toLocaleString('en-US'),
  }
})

// --- Snackbar / Toast ---
const snackbar = ref(false)
const snackbarText = ref('')

function triggerToast(msg) {
  snackbarText.value = msg
  snackbar.value = true
}
</script>

<template>
  <div class="sangsan-wrapper d-flex flex-column min-h-screen">
    <!-- Top Navigation App Bar -->
    <v-app-bar flat color="rgba(255, 255, 255, 0.95)" class="border-b app-header" height="64">
      <v-container class="max-w-6xl d-flex align-center justify-space-between py-0 px-3 px-sm-6">
        <!-- Brand -->
        <div
          class="d-flex align-center cursor-pointer brand-box flex-shrink-0"
          role="button"
          tabindex="0"
          @click="switchTab('articles')"
        >
          <v-sheet
            color="#D97706"
            width="36"
            height="36"
            rounded="lg"
            class="d-flex align-center justify-center mr-2.5 elevation-1 brand-icon"
          >
            <v-icon icon="mdi-home-city-outline" color="white" size="20" />
          </v-sheet>
          <div>
            <div class="text-subtitle-1 font-weight-bold text-slate-900 leading-none">
              {{ t.brand.name }}
            </div>
            <div class="text-caption text-slate-500 mt-0.5" style="font-size: 11px !important">
              {{ t.brand.subtitle }}
            </div>
          </div>
        </div>

        <!-- Desktop Navigation + Language Switcher -->
        <div class="d-none d-lg-flex align-center ga-1">
          <div class="d-flex align-center ga-0.5">
            <v-btn
              v-for="item in navItems"
              :key="item.value"
              variant="flat"
              rounded="lg"
              size="small"
              class="text-none px-2.5 py-2 font-weight-medium nav-btn"
              :color="activeTab === item.value ? '#FFFBEB' : 'transparent'"
              :class="activeTab === item.value ? 'text-amber-800 font-weight-bold' : 'text-slate-600'"
              @click="switchTab(item.value)"
            >
              <span>{{ item.label }}</span>
              <v-chip
                v-if="item.hasBadge"
                size="x-small"
                color="#FEF3C7"
                variant="flat"
                class="ml-1 font-weight-bold text-amber-800 px-1.5"
              >
                {{ savedIds.length }}
              </v-chip>
            </v-btn>
          </div>

          <v-divider vertical inset class="mx-1" />

          <v-btn
            href="https://www.facebook.com/profile.php?id=100093160863461"
            target="_blank"
            rel="noopener noreferrer"
            icon
            size="small"
            variant="tonal"
            color="#1877F2"
            rounded="lg"
            aria-label="iKamm Home Decor Facebook Page"
            title="Facebook: iKamm Home Decor"
            class="mr-1"
          >
            <v-icon icon="mdi-facebook" size="20" />
          </v-btn>

          <!-- Language Switcher Buttons (TH / EN / ZH) -->
          <v-sheet
            rounded="lg"
            color="#F5F5F4"
            class="pa-1 d-flex align-center ga-1 border-stone"
          >
            <v-btn
              v-for="lang in LANGUAGES"
              :key="lang.code"
              size="x-small"
              rounded="md"
              variant="flat"
              class="text-none px-2 font-weight-bold lang-btn"
              :color="currentLang === lang.code ? '#D97706' : 'transparent'"
              :class="currentLang === lang.code ? 'text-white elevation-1' : 'text-slate-700'"
              @click="setLanguage(lang.code)"
            >
              <span class="mr-1">{{ lang.flag }}</span>
              <span>{{ lang.label }}</span>
            </v-btn>
          </v-sheet>
        </div>

        <!-- Mobile / Tablet Right Controls: Compact Language Menu + Hamburger -->
        <div class="d-flex d-lg-none align-center ga-1">
          <v-menu location="bottom end">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                variant="outlined"
                size="small"
                rounded="lg"
                class="text-none font-weight-bold border-stone px-2.5 text-slate-800"
                prepend-icon="mdi-translate"
              >
                {{ LANGUAGES.find((l) => l.code === currentLang)?.label }}
              </v-btn>
            </template>
            <v-list density="compact" rounded="lg" class="py-1">
              <v-list-item
                v-for="lang in LANGUAGES"
                :key="lang.code"
                :active="currentLang === lang.code"
                active-color="#D97706"
                @click="setLanguage(lang.code)"
              >
                <v-list-item-title class="text-body-2 font-weight-medium">
                  <span class="mr-2">{{ lang.flag }}</span>
                  <span>{{ lang.label }}</span>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-btn
            icon="mdi-menu"
            variant="text"
            color="#475569"
            :aria-label="t.nav.openMenu"
            @click="mobileDrawer = !mobileDrawer"
          />
        </div>
      </v-container>
    </v-app-bar>

    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer v-model="mobileDrawer" location="top" temporary class="d-lg-none" style="height: auto !important">
      <v-list density="comfortable" class="px-3 py-2">
        <v-list-item
          v-for="item in navItems"
          :key="item.value"
          rounded="lg"
          :active="activeTab === item.value"
          active-color="#B45309"
          @click="switchTab(item.value)"
        >
          <template #prepend>
            <v-icon :icon="item.icon" size="20" class="mr-2" />
          </template>
          <v-list-item-title class="text-body-2 font-weight-medium">
            {{ item.label }}
          </v-list-item-title>
          <template v-if="item.hasBadge" #append>
            <v-chip size="x-small" color="#FEF3C7" variant="flat" class="font-weight-bold text-amber-800">
              {{ savedIds.length }}
            </v-chip>
          </template>
        </v-list-item>

        <v-divider class="my-2" />

        <!-- Mobile Language Switcher Row -->
        <div class="px-2 py-1 d-flex align-center justify-space-between ga-2">
          <div class="d-flex align-center ga-1 text-caption font-weight-bold text-slate-600">
            <v-icon icon="mdi-translate" size="16" />
            <span>Language / ภาษา / 语言</span>
          </div>
          <div class="d-flex ga-1">
            <v-btn
              v-for="lang in LANGUAGES"
              :key="lang.code"
              size="x-small"
              rounded="md"
              variant="flat"
              class="text-none px-2 font-weight-bold"
              :color="currentLang === lang.code ? '#D97706' : '#F5F5F4'"
              :class="currentLang === lang.code ? 'text-white' : 'text-slate-700'"
              @click="setLanguage(lang.code)"
            >
              {{ lang.flag }} {{ lang.label }}
            </v-btn>
          </div>
        </div>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-container class="max-w-6xl flex-grow-1 py-6 py-sm-8 px-4 px-sm-6">
      <!-- VIEW 1: ARTICLES & HOME -->
      <div v-if="activeTab === 'articles'" class="animate-fade-up">
        <!-- Hero Banner -->
        <v-card rounded="xl" elevation="2" class="overflow-hidden bg-slate-900 border-stone mb-8">
          <v-row no-gutters align="stretch">
            <v-col cols="12" md="7" class="position-relative" style="min-height: 260px">
              <v-img
                :src="HERO_IMAGE"
                :alt="t.hero.alt"
                cover
                height="100%"
                min-height="260"
              />
              <div class="hero-gradient-overlay"></div>
            </v-col>
            <v-col cols="12" md="5" class="pa-6 pa-sm-8 d-flex flex-column justify-center bg-slate-900 text-white">
              <div class="mb-3">
                <span class="hero-badge">
                  {{ t.hero.badge }}
                </span>
              </div>
              <h1 class="text-h5 text-sm-h4 font-weight-bold leading-snug mb-3 text-white">
                {{ t.hero.title }}
              </h1>
              <p class="text-body-2 text-sm-body-1 text-slate-300 leading-relaxed mb-3">
                {{ t.hero.desc }}
              </p>
              <div class="d-inline-flex align-center ga-2 px-3 py-1.5 rounded-lg mb-5" style="background: rgba(24, 119, 242, 0.16); border: 1px solid rgba(96, 165, 250, 0.35)">
                <v-icon icon="mdi-facebook" color="#60A5FA" size="18" />
                <span class="text-caption font-weight-semibold text-blue-100">{{ articleUiText.fbBannerNote }}</span>
              </div>
              <div class="d-flex flex-wrap ga-3">
                <v-btn
                  v-if="localizedArticles.length > 0"
                  color="#D97706"
                  variant="flat"
                  rounded="lg"
                  class="text-none font-weight-bold px-5 text-white"
                  size="large"
                  @click="openArticle(localizedArticles[0].id)"
                >
                  {{ t.hero.featuredBtn }}
                </v-btn>
                <v-btn
                  v-if="localizedArticles.length > 0"
                  color="#FEF3C7"
                  variant="flat"
                  rounded="lg"
                  class="text-none font-weight-bold px-5 text-amber-900"
                  size="large"
                  @click="directoryDialogOpen = true"
                >
                  {{ articleUiText.quickDirectoryBtn }}
                </v-btn>
                <v-btn
                  color="#1E293B"
                  variant="outlined"
                  rounded="lg"
                  class="text-none font-weight-medium px-5 text-slate-100 border-slate-700"
                  size="large"
                  @click="switchTab('compare')"
                >
                  {{ t.hero.compareBtn }}
                </v-btn>
                <v-btn
                  href="https://www.facebook.com/profile.php?id=100093160863461"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="#1877F2"
                  variant="flat"
                  rounded="lg"
                  class="text-none font-weight-bold px-5 text-white"
                  size="large"
                  prepend-icon="mdi-facebook"
                >
                  Facebook Page
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card>

        <!-- Search & Category Filter Bar -->
        <v-card rounded="xl" elevation="0" class="pa-4 pa-sm-5 border-stone bg-white mb-8">
          <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-3 mb-4">
            <v-text-field
              v-model="searchQuery"
              :placeholder="t.search.placeholder"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              hide-details
              clearable
              rounded="lg"
              bg-color="#FAF9F6"
              color="#D97706"
              class="flex-grow-1"
            />
            <div class="text-caption text-sm-body-2 text-slate-500 font-weight-medium text-no-wrap">
              {{ t.search.showingCount(filteredArticles.length) }}
            </div>
          </div>

          <!-- Category Pills -->
          <div class="d-flex flex-wrap ga-2 mb-4">
            <v-chip
              v-for="cat in articleCategories"
              :key="cat.id"
              :color="selectedCategoryId === cat.id ? '#0F172A' : '#F5F5F4'"
              variant="flat"
              :class="selectedCategoryId === cat.id ? 'text-white font-weight-semibold' : 'text-slate-700'"
              size="small"
              class="px-3.5 py-4 cursor-pointer category-chip"
              rounded="pill"
              @click="selectedCategoryId = cat.id"
            >
              {{ cat.label }}
            </v-chip>
          </div>

          <!-- View Switcher + Per-Page Controls + Quick 30-Topic Directory -->
          <div class="pt-3 border-t-stone d-flex flex-wrap align-center justify-space-between ga-3">
            <div class="d-flex flex-wrap align-center ga-2">
              <v-btn-toggle
                v-model="articleViewMode"
                mandatory
                density="compact"
                rounded="lg"
                color="#D97706"
                variant="outlined"
                class="border-stone"
              >
                <v-btn value="grid" size="small" class="text-none font-weight-medium" prepend-icon="mdi-view-grid-outline">
                  {{ articleUiText.viewGrid }}
                </v-btn>
                <v-btn value="directory" size="small" class="text-none font-weight-medium" prepend-icon="mdi-format-list-numbered">
                  {{ articleUiText.viewDirectory }}
                </v-btn>
              </v-btn-toggle>

              <v-btn
                color="#FFFBEB"
                variant="flat"
                size="small"
                rounded="lg"
                class="text-none font-weight-bold text-amber-900 border-amber"
                @click="directoryDialogOpen = true"
              >
                {{ articleUiText.quickDirectoryBtn }}
              </v-btn>
            </div>

            <div v-if="articleViewMode === 'grid'" class="d-flex align-center ga-1.5 flex-wrap">
              <span class="text-caption text-slate-500 font-weight-medium mr-1">{{ articleUiText.perPageLabel }}</span>
              <v-chip
                v-for="opt in [
                  { val: 3, label: '3' },
                  { val: 6, label: '6' },
                  { val: 12, label: '12' },
                  { val: 48, label: articleUiText.showAllLabel },
                ]"
                :key="opt.val"
                size="x-small"
                rounded="lg"
                variant="flat"
                :color="articlesPerPage === opt.val ? '#D97706' : '#F1F5F9'"
                :class="articlesPerPage === opt.val ? 'text-white font-weight-bold' : 'text-slate-700'"
                class="cursor-pointer px-2.5"
                @click="articlesPerPage = opt.val"
              >
                {{ opt.label }}
              </v-chip>
            </div>
          </div>

          <!-- Supabase Live Status & Refresh Bar -->
          <div class="d-flex align-center justify-space-between flex-wrap ga-2 mt-3 pt-3 border-t-stone">
            <div class="d-flex align-center ga-2 flex-wrap">
              <v-chip
                size="small"
                :color="dbSyncSource === 'supabase' ? '#10B981' : '#64748B'"
                variant="tonal"
                class="font-weight-bold"
                :prepend-icon="dbSyncSource === 'supabase' ? 'mdi-database-check' : 'mdi-database-outline'"
              >
                {{ dbSyncSource === 'supabase' ? `Supabase Live (${dbArticleCount} บทความ)` : 'โหมด Local Fallback' }}
              </v-chip>
              <v-btn
                size="small"
                variant="tonal"
                color="#0284C7"
                rounded="lg"
                class="text-none font-weight-bold"
                prepend-icon="mdi-refresh"
                :loading="isSyncingDb"
                @click="syncArticlesFromDb(currentLang, true)"
              >
                ดึงข้อมูลจาก Database
              </v-btn>
            </div>
          </div>
        </v-card>

        <!-- Articles Content -->
        <template v-if="filteredArticles.length > 0">
          <!-- Mode 1: Card Grid View -->
          <template v-if="articleViewMode === 'grid'">
            <v-row dense class="mx-n3">
              <v-col
                v-for="article in paginatedArticles"
                :key="article.id"
                cols="12"
                md="6"
                lg="4"
                class="pa-3 d-flex"
              >
                <v-card
                  rounded="xl"
                  elevation="0"
                  class="border-stone bg-white d-flex flex-column w-100 article-card overflow-hidden"
                >
                  <!-- Card Visual -->
                  <div
                    class="position-relative bg-stone-100 cursor-pointer overflow-hidden"
                    style="height: 192px"
                    @click="openArticle(article.id)"
                  >
                    <v-img
                      v-if="article.image"
                      :src="article.image"
                      :alt="article.title"
                      cover
                      height="192"
                      class="article-img"
                    />
                    <div
                      v-else
                      class="w-100 h-100"
                      v-html="renderArticleSvg(article)"
                    ></div>
                    <v-chip
                      size="small"
                      color="rgba(255, 255, 255, 0.95)"
                      variant="flat"
                      rounded="pill"
                      class="position-absolute font-weight-bold text-slate-800 elevation-1"
                      style="top: 12px; left: 12px"
                    >
                      {{ article.category }}
                    </v-chip>
                    <v-chip
                      v-if="!article.isConstruction"
                      size="x-small"
                      color="rgba(24, 119, 242, 0.92)"
                      variant="flat"
                      rounded="pill"
                      prepend-icon="mdi-facebook"
                      class="position-absolute font-weight-bold text-white elevation-1"
                      style="top: 12px; right: 12px"
                    >
                      {{ articleUiText.fbPostBadge }}
                    </v-chip>
                  </div>

                  <!-- Card Body -->
                  <v-card-text class="pa-5 flex-grow-1 d-flex flex-column">
                    <div class="d-flex align-center justify-space-between text-caption text-slate-400 mb-2">
                      <span>{{ article.readTime }}</span>
                      <span>{{ article.date }}</span>
                    </div>
                    <h3
                      class="text-subtitle-1 font-weight-bold text-slate-900 leading-snug mb-2 line-clamp-2 cursor-pointer article-title"
                      @click="openArticle(article.id)"
                    >
                      {{ article.title }}
                    </h3>
                    <p class="text-body-2 text-slate-600 line-clamp-3 mb-4 flex-grow-1">
                      {{ article.summary }}
                    </p>

                    <div class="pt-3 border-t-stone d-flex align-center justify-space-between">
                      <v-btn
                        variant="text"
                        color="#B45309"
                        density="compact"
                        class="text-none font-weight-bold px-0"
                        append-icon="mdi-chevron-right"
                        @click="openArticle(article.id)"
                      >
                        {{ t.search.readArticle }}
                      </v-btn>

                      <v-btn
                        icon
                        size="small"
                        variant="outlined"
                        rounded="lg"
                        :color="isBookmarked(article.id) ? '#B45309' : '#94A3B8'"
                        :class="isBookmarked(article.id) ? 'bg-amber-50 border-amber-300' : 'border-stone'"
                        :aria-label="t.search.bookmarkAria"
                        @click="toggleBookmark(article.id)"
                      >
                        <v-icon
                          :icon="isBookmarked(article.id) ? 'mdi-bookmark' : 'mdi-bookmark-outline'"
                          size="18"
                        />
                      </v-btn>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Articles Pagination -->
            <div class="d-flex flex-column flex-sm-row align-center justify-space-between ga-3 mt-6 pt-4 border-t-stone">
              <div class="text-caption text-slate-500 font-weight-medium">
                {{ paginationText(articlePage, totalArticlePages, filteredArticles.length) }}
              </div>
              <v-pagination
                v-model="articlePage"
                :length="totalArticlePages"
                :total-visible="10"
                rounded="lg"
                density="comfortable"
                active-color="#D97706"
                color="#334155"
              />
            </div>
          </template>

          <!-- Mode 2: Master Directory View (All 30 Topics Day 01 - Day 30) -->
          <v-card v-else rounded="xl" elevation="0" class="border-stone bg-white overflow-hidden">
            <div class="px-5 py-4 bg-stone-50 border-b-stone d-flex align-center justify-space-between flex-wrap ga-2">
              <div>
                <h3 class="text-subtitle-1 font-weight-bold text-slate-900">
                  {{ articleUiText.quickDirectoryTitle }}
                </h3>
                <div class="text-caption text-slate-500">
                  {{ articleUiText.quickDirectorySub }}
                </div>
              </div>
              <v-chip size="small" color="#FEF3C7" variant="flat" class="text-amber-900 font-weight-bold">
                {{ t.search.showingCount(filteredArticles.length) }}
              </v-chip>
            </div>
            <v-list lines="two" class="pa-0 divide-y">
              <v-list-item
                v-for="article in filteredArticles"
                :key="article.id"
                class="px-5 py-3 border-b-stone hover-row cursor-pointer"
                @click="openArticle(article.id)"
              >
                <template #prepend>
                  <v-chip
                    size="small"
                    color="#0F172A"
                    variant="flat"
                    rounded="lg"
                    class="text-white font-weight-bold mr-3"
                    style="min-width: 68px; justify-content: center"
                  >
                    {{ article.dayLabel }}
                  </v-chip>
                </template>

                <v-list-item-title class="font-weight-bold text-slate-900 text-body-1 mb-1">
                  {{ article.title }}
                </v-list-item-title>
                <v-list-item-subtitle class="d-flex flex-wrap align-center ga-2 text-caption text-slate-500">
                  <v-chip size="x-small" color="#FEF3C7" variant="flat" class="text-amber-900 font-weight-medium">
                    {{ article.category }}
                  </v-chip>
                  <span>•</span>
                  <span>{{ article.readTime }}</span>
                </v-list-item-subtitle>

                <template #append>
                  <div class="d-flex align-center ga-2">
                    <v-btn
                      icon
                      size="x-small"
                      variant="text"
                      :color="isBookmarked(article.id) ? '#B45309' : '#94A3B8'"
                      @click.stop="toggleBookmark(article.id)"
                    >
                      <v-icon :icon="isBookmarked(article.id) ? 'mdi-bookmark' : 'mdi-bookmark-outline'" size="18" />
                    </v-btn>
                    <v-btn
                      color="#D97706"
                      variant="tonal"
                      size="small"
                      rounded="lg"
                      class="text-none font-weight-bold"
                      append-icon="mdi-chevron-right"
                      @click.stop="openArticle(article.id)"
                    >
                      {{ articleUiText.readNowBtn }}
                    </v-btn>
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </template>

        <!-- Empty State -->
        <v-card
          v-else
          rounded="xl"
          elevation="0"
          class="border-stone bg-white pa-10 text-center"
        >
          <v-icon icon="mdi-file-search-outline" size="48" color="#94A3B8" class="mb-3" />
          <div class="text-h6 font-weight-bold text-slate-700 mb-1">
            {{ t.search.emptyTitle }}
          </div>
          <p class="text-body-2 text-slate-500 mb-4">
            {{ t.search.emptyDesc }}
          </p>
          <v-btn
            color="#D97706"
            variant="flat"
            rounded="lg"
            class="text-none text-white font-weight-medium"
            @click="resetFilters"
          >
            {{ t.search.resetBtn }}
          </v-btn>
        </v-card>
      </div>

      <!-- VIEW 2: MATERIAL COMPARISON -->
      <div v-else-if="activeTab === 'compare'" class="animate-fade-up">
        <v-card rounded="xl" elevation="0" class="pa-6 border-stone bg-white">
          <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-4 mb-6">
            <div>
              <h2 class="text-h6 text-sm-h5 font-weight-bold text-slate-900">
                {{ t.compare.heading }}
              </h2>
              <p class="text-body-2 text-slate-500 mt-1">
                {{ t.compare.subheading }}
              </p>
            </div>
            <div class="d-flex flex-wrap ga-2">
              <v-btn
                v-for="tab in [
                  { key: 'bricks', label: t.compare.tabs.bricks },
                  { key: 'roofing', label: t.compare.tabs.roofing },
                  { key: 'cement', label: t.compare.tabs.cement },
                ]"
                :key="tab.key"
                variant="flat"
                rounded="lg"
                size="small"
                class="text-none font-weight-medium px-3.5 py-2"
                :color="activeCompare === tab.key ? '#0F172A' : '#F5F5F4'"
                :class="activeCompare === tab.key ? 'text-white' : 'text-slate-700'"
                @click="activeCompare = tab.key"
              >
                {{ tab.label }}
              </v-btn>
            </div>
          </div>

          <!-- Comparison Cards -->
          <v-row class="mb-6">
            <v-col
              v-for="card in currentCompareData.cards"
              :key="card.name"
              cols="12"
              md="4"
              class="d-flex"
            >
              <v-card
                rounded="lg"
                elevation="0"
                class="border-stone bg-stone-50 pa-4 w-100 d-flex flex-column justify-space-between"
              >
                <div>
                  <div class="d-flex align-start justify-space-between ga-2 mb-3">
                    <h3 class="text-subtitle-1 font-weight-bold text-slate-900">
                      {{ card.name }}
                    </h3>
                    <span
                      class="px-2.5 py-0.5 rounded-pill text-caption font-weight-bold text-no-wrap"
                      :style="{
                        backgroundColor: getBadgeStyle(card.badgeColor).bg,
                        color: getBadgeStyle(card.badgeColor).text,
                        fontSize: '11px',
                      }"
                    >
                      {{ card.badge }}
                    </span>
                  </div>

                  <div class="mb-3">
                    <div class="text-caption font-weight-bold text-emerald-700 mb-1">
                      {{ t.compare.prosLabel }}
                    </div>
                    <ul class="text-caption text-slate-700 pl-4 space-y-1">
                      <li v-for="pro in card.pros" :key="pro">{{ pro }}</li>
                    </ul>
                  </div>

                  <div class="mb-3">
                    <div class="text-caption font-weight-bold text-rose-700 mb-1">
                      {{ t.compare.consLabel }}
                    </div>
                    <ul class="text-caption text-slate-700 pl-4 space-y-1">
                      <li v-for="con in card.cons" :key="con">{{ con }}</li>
                    </ul>
                  </div>
                </div>

                <div class="pt-2 border-t-stone text-caption text-slate-600">
                  <strong class="text-slate-800">{{ t.compare.bestForLabel }}</strong> {{ card.bestFor }}
                </div>
              </v-card>
            </v-col>
          </v-row>

          <!-- Chart + Table Grid -->
          <v-row align="start">
            <v-col cols="12" lg="5">
              <v-card rounded="lg" elevation="0" class="bg-stone-50 pa-4 border-stone">
                <h3 class="text-body-2 font-weight-bold text-slate-800 mb-3">
                  {{ currentCompareData.title }} {{ t.compare.scoreSuffix }}
                </h3>
                <div style="position: relative; height: 290px; width: 100%">
                  <canvas ref="compareCanvas"></canvas>
                </div>
              </v-card>
            </v-col>

            <v-col cols="12" lg="7">
              <v-card rounded="lg" elevation="0" class="border-stone overflow-hidden">
                <v-table density="comfortable" class="text-body-2">
                  <thead class="bg-stone-100">
                    <tr>
                      <th class="font-weight-bold text-slate-700 text-caption">
                        {{ t.compare.tableTopicHeader }}
                      </th>
                      <th
                        v-for="c in currentCompareData.cards"
                        :key="c.name"
                        class="font-weight-bold text-slate-700 text-caption"
                      >
                        {{ c.name }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, idx) in currentCompareData.rows" :key="idx">
                      <td class="font-weight-bold text-slate-800 py-3">{{ row[0] }}</td>
                      <td class="text-slate-600 py-3">{{ row[1] }}</td>
                      <td class="text-slate-600 py-3">{{ row[2] }}</td>
                      <td class="text-slate-600 py-3">{{ row[3] }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </div>

      <!-- VIEW 3: MATERIAL PRICES & BUDGET ESTIMATOR (วัสดุก่อสร้างราคา) -->
      <div v-else-if="activeTab === 'prices'" class="animate-fade-up">
        <div class="mb-6">
          <h2 class="text-h6 text-sm-h5 font-weight-bold text-slate-900">
            {{ tx.prices.heading }}
          </h2>
          <p class="text-body-2 text-slate-500 mt-1">
            {{ tx.prices.subheading }}
          </p>
        </div>

        <v-row align="start">
          <!-- Left: Catalog & Price Table -->
          <v-col cols="12" lg="7">
            <v-card rounded="xl" elevation="0" class="pa-5 border-stone bg-white">
              <v-text-field
                v-model="priceSearch"
                :placeholder="tx.prices.searchPlaceholder"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                hide-details
                clearable
                rounded="lg"
                bg-color="#FAF9F6"
                color="#D97706"
                class="mb-4"
              />

              <!-- Price Categories -->
              <div class="d-flex flex-wrap ga-1.5 mb-4">
                <v-chip
                  v-for="cat in tx.prices.categories"
                  :key="cat.id"
                  :color="selectedPriceCat === cat.id ? '#0F172A' : '#F5F5F4'"
                  variant="flat"
                  :class="selectedPriceCat === cat.id ? 'text-white font-weight-bold' : 'text-slate-700'"
                  size="small"
                  rounded="pill"
                  class="cursor-pointer px-3"
                  @click="selectedPriceCat = cat.id"
                >
                  {{ cat.label }}
                </v-chip>
              </div>

              <!-- Price Table -->
              <v-card rounded="lg" elevation="0" class="border-stone overflow-hidden">
                <v-table density="comfortable" class="text-body-2">
                  <thead class="bg-stone-100">
                    <tr>
                      <th class="font-weight-bold text-slate-700 text-caption">
                        {{ tx.prices.tableHeaders.name }}
                      </th>
                      <th class="font-weight-bold text-slate-700 text-caption text-center">
                        {{ tx.prices.tableHeaders.unit }}
                      </th>
                      <th class="font-weight-bold text-slate-700 text-caption text-right">
                        {{ tx.prices.tableHeaders.price }}
                      </th>
                      <th class="font-weight-bold text-slate-700 text-caption text-center">
                        {{ tx.prices.tableHeaders.action }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in paginatedPriceItems" :key="item.id" class="hover-row">
                      <td class="py-3">
                        <div class="font-weight-bold text-slate-900">{{ item.name }}</div>
                        <div class="text-caption text-slate-500">{{ item.spec }}</div>
                      </td>
                      <td class="text-center text-slate-600 text-no-wrap">
                        {{ item.unit }}
                      </td>
                      <td class="text-right font-weight-bold text-amber-800 text-no-wrap">
                        {{ tx.prices.currency }}{{ formatMoney(item.price) }}
                      </td>
                      <td class="text-center">
                        <v-btn
                          color="#D97706"
                          variant="tonal"
                          size="x-small"
                          rounded="lg"
                          prepend-icon="mdi-plus"
                          class="text-none font-weight-bold px-2.5"
                          @click="addToEstimate(item.id)"
                        >
                          {{ tx.prices.addBtn }}
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card>

              <!-- Material Prices Pagination (1 - 10) -->
              <div
                v-if="filteredPriceItems.length > 0"
                class="d-flex flex-column flex-sm-row align-center justify-space-between ga-3 mt-4 pt-3 border-t-stone"
              >
                <div class="text-caption text-slate-500 font-weight-medium">
                  {{ paginationText(pricePage, totalPricePages, filteredPriceItems.length) }}
                </div>
                <v-pagination
                  v-model="pricePage"
                  :length="totalPricePages"
                  :total-visible="10"
                  rounded="lg"
                  density="compact"
                  active-color="#D97706"
                  color="#334155"
                />
              </div>

              <div class="text-caption text-slate-400 mt-3">
                {{ tx.prices.disclaimer }}
              </div>
            </v-card>
          </v-col>

          <!-- Right: Interactive Budget Estimator -->
          <v-col cols="12" lg="5">
            <v-card rounded="xl" elevation="0" class="pa-5 border-stone bg-white">
              <div class="d-flex align-center justify-space-between mb-4">
                <div>
                  <h3 class="text-subtitle-1 font-weight-bold text-slate-900 d-flex align-center ga-1.5">
                    <v-icon icon="mdi-receipt-text-check-outline" color="#D97706" size="20" />
                    <span>{{ tx.prices.estimatorTitle }}</span>
                  </h3>
                  <div class="text-caption text-slate-500">
                    {{ tx.prices.estimatorSub }}
                  </div>
                </div>
                <v-btn
                  v-if="detailedEstimateCart.length > 0"
                  variant="text"
                  size="x-small"
                  color="#E11D48"
                  class="text-none font-weight-bold"
                  @click="clearEstimateCart"
                >
                  {{ tx.prices.clearBtn }}
                </v-btn>
              </div>

              <div v-if="detailedEstimateCart.length > 0" class="space-y-2 mb-4">
                <v-sheet
                  v-for="(item, idx) in detailedEstimateCart"
                  :key="item.id"
                  rounded="lg"
                  color="#FAF9F6"
                  class="pa-3 border-stone d-flex flex-column ga-2"
                >
                  <div class="d-flex align-start justify-space-between ga-2">
                    <div class="text-body-2 font-weight-bold text-slate-800">
                      {{ item.name }}
                    </div>
                    <v-btn
                      icon="mdi-close"
                      variant="text"
                      size="x-small"
                      color="#94A3B8"
                      density="compact"
                      @click="removeFromEstimate(item.id)"
                    />
                  </div>

                  <div class="d-flex align-center justify-space-between ga-2">
                    <div class="d-flex align-center ga-2" style="max-width: 150px">
                      <v-text-field
                        v-model.number="estimateCart[idx].qty"
                        type="number"
                        min="1"
                        step="1"
                        variant="outlined"
                        density="compact"
                        hide-details
                        rounded="lg"
                        bg-color="white"
                        color="#D97706"
                      />
                      <span class="text-caption text-slate-500 text-no-wrap">
                        {{ item.unit }}
                      </span>
                    </div>

                    <div class="text-right">
                      <div class="text-caption text-slate-400">
                        @ {{ tx.prices.currency }}{{ formatMoney(item.price) }}
                      </div>
                      <div class="text-body-2 font-weight-bold text-slate-900">
                        {{ tx.prices.currency }}{{ formatMoney(item.subtotal) }}
                      </div>
                    </div>
                  </div>
                </v-sheet>
              </div>

              <v-sheet
                v-else
                rounded="lg"
                color="#FAF9F6"
                class="pa-6 text-center border-stone mb-4"
              >
                <v-icon icon="mdi-cart-outline" size="36" color="#94A3B8" class="mb-2" />
                <div class="text-caption text-slate-500">
                  {{ tx.prices.emptyEstimator }}
                </div>
              </v-sheet>

              <!-- Budget Summary Box -->
              <v-sheet rounded="lg" color="#FFFBEB" class="pa-4 border-amber">
                <div class="d-flex align-baseline justify-space-between mb-3">
                  <span class="text-body-2 font-weight-bold text-amber-900">
                    {{ tx.prices.totalLabel }}
                  </span>
                  <span class="text-h5 font-weight-bold text-amber-700">
                    {{ tx.prices.currency }}{{ formatMoney(totalEstimateBudget) }}
                  </span>
                </div>
                <v-btn
                  block
                  color="#D97706"
                  variant="flat"
                  rounded="lg"
                  prepend-icon="mdi-content-copy"
                  class="text-none text-white font-weight-bold"
                  :disabled="detailedEstimateCart.length === 0"
                  @click="copyEstimateSummary"
                >
                  {{ tx.prices.copyBtn }}
                </v-btn>
              </v-sheet>
            </v-card>
          </v-col>
        </v-row>

      </div>

      <!-- VIEW 4: MATERIAL CALCULATOR -->
      <div v-else-if="activeTab === 'calculator'" class="animate-fade-up">
        <v-row>
          <!-- Calculator 1: Wall Bricks -->
          <v-col cols="12" lg="6" class="d-flex">
            <v-card rounded="xl" elevation="0" class="pa-6 border-stone bg-white w-100">
              <div class="mb-5">
                <v-chip
                  size="x-small"
                  color="#FEF3C7"
                  variant="flat"
                  class="font-weight-bold text-amber-800 mb-2 px-2.5"
                >
                  {{ t.calculator.brickBadge }}
                </v-chip>
                <h2 class="text-h6 font-weight-bold text-slate-900">
                  {{ t.calculator.brickTitle }}
                </h2>
                <p class="text-body-2 text-slate-500 mt-1">
                  {{ t.calculator.brickDesc }}
                </p>
              </div>

              <v-row dense class="mb-2">
                <v-col cols="12" sm="4">
                  <label class="d-block text-caption font-weight-bold text-slate-700 mb-1">
                    {{ t.calculator.wallWidthLabel }}
                  </label>
                  <v-text-field
                    v-model.number="wallWidth"
                    type="number"
                    min="0.5"
                    step="0.1"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    bg-color="#FAF9F6"
                    color="#D97706"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <label class="d-block text-caption font-weight-bold text-slate-700 mb-1">
                    {{ t.calculator.wallHeightLabel }}
                  </label>
                  <v-text-field
                    v-model.number="wallHeight"
                    type="number"
                    min="0.5"
                    step="0.1"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    bg-color="#FAF9F6"
                    color="#D97706"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <label class="d-block text-caption font-weight-bold text-slate-700 mb-1">
                    {{ t.calculator.openingsLabel }}
                  </label>
                  <v-text-field
                    v-model.number="openingsArea"
                    type="number"
                    min="0"
                    step="0.1"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    bg-color="#FAF9F6"
                    color="#D97706"
                    hide-details
                  />
                </v-col>
              </v-row>

              <div class="mb-5">
                <label class="d-block text-caption font-weight-bold text-slate-700 mb-1">
                  {{ t.calculator.brickTypeLabel }}
                </label>
                <v-select
                  v-model="brickType"
                  :items="t.calculator.brickOptions"
                  item-title="title"
                  item-value="value"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  bg-color="#FAF9F6"
                  color="#D97706"
                  hide-details
                />
              </div>

              <v-sheet rounded="lg" color="#FFFBEB" class="pa-4 border-amber">
                <div class="d-flex align-baseline justify-space-between mb-2">
                  <span class="text-caption font-weight-bold text-amber-900">
                    {{ t.calculator.netWallAreaLabel }}
                  </span>
                  <span class="text-subtitle-1 font-weight-bold text-slate-900">
                    {{ brickCalcResult.netArea }} {{ t.calculator.sqmUnit }}
                  </span>
                </div>
                <div class="d-flex align-baseline justify-space-between mb-3">
                  <span class="text-caption font-weight-bold text-amber-900">
                    {{ t.calculator.brickCountLabel(brickCalcResult.name) }}
                  </span>
                  <span class="text-h5 font-weight-bold text-amber-700">
                    {{ brickCalcResult.withWaste }} {{ t.calculator.brickUnit }}
                  </span>
                </div>
                <div class="text-caption text-amber-950 pt-2 border-t-amber">
                  <strong>{{ t.calculator.recommendedMortarLabel }}</strong> {{ brickCalcResult.mortar }}
                </div>
              </v-sheet>
            </v-card>
          </v-col>

          <!-- Calculator 2: Roof Area -->
          <v-col cols="12" lg="6" class="d-flex">
            <v-card rounded="xl" elevation="0" class="pa-6 border-stone bg-white w-100">
              <div class="mb-5">
                <v-chip
                  size="x-small"
                  color="#E0F2FE"
                  variant="flat"
                  class="font-weight-bold text-sky-800 mb-2 px-2.5"
                >
                  {{ t.calculator.roofBadge }}
                </v-chip>
                <h2 class="text-h6 font-weight-bold text-slate-900">
                  {{ t.calculator.roofTitle }}
                </h2>
                <p class="text-body-2 text-slate-500 mt-1">
                  {{ t.calculator.roofDesc }}
                </p>
              </div>

              <v-row class="mb-4">
                <v-col cols="12" sm="6">
                  <label class="d-block text-caption font-weight-bold text-slate-700 mb-1">
                    {{ t.calculator.roofPlanLabel }}
                  </label>
                  <v-text-field
                    v-model.number="roofPlanArea"
                    type="number"
                    min="1"
                    step="1"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    bg-color="#FAF9F6"
                    color="#D97706"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <label class="d-block text-caption font-weight-bold text-slate-700 mb-1">
                    {{ t.calculator.roofPitchLabel(roofCalcResult.deg) }}
                  </label>
                  <v-slider
                    v-model="roofPitch"
                    min="3"
                    max="45"
                    step="1"
                    color="#D97706"
                    track-color="#E2E8F0"
                    hide-details
                    class="mt-2"
                  />
                  <div class="d-flex justify-space-between text-caption text-slate-400 mt-n1" style="font-size: 11px !important">
                    <span>{{ t.calculator.pitchLow }}</span>
                    <span>{{ t.calculator.pitchMid }}</span>
                    <span>{{ t.calculator.pitchHigh }}</span>
                  </div>
                </v-col>
              </v-row>

              <v-sheet rounded="lg" color="#F0F9FF" class="pa-4 border-sky">
                <div class="d-flex align-baseline justify-space-between mb-2">
                  <span class="text-caption font-weight-bold text-sky-900">
                    {{ t.calculator.actualRoofAreaLabel }}
                  </span>
                  <span class="text-h5 font-weight-bold text-sky-700">
                    {{ roofCalcResult.slopedArea }} {{ t.calculator.sqmUnit }}
                  </span>
                </div>
                <div class="d-flex align-baseline justify-space-between mb-3">
                  <span class="text-caption font-weight-bold text-sky-900">
                    {{ t.calculator.slopeFactorLabel(roofCalcResult.deg) }}
                  </span>
                  <span class="text-body-2 font-weight-bold text-slate-800">
                    ×{{ roofCalcResult.factor }}
                  </span>
                </div>
                <div
                  class="text-caption text-sky-950 pt-2 border-t-sky"
                  v-html="roofCalcResult.rec"
                ></div>
              </v-sheet>
            </v-card>
          </v-col>
        </v-row>

      </div>

      <!-- VIEW 5: SITE AREA MEASUREMENT (วัดพื้นที่หน้างาน) -->
      <div v-else-if="activeTab === 'measure'" class="animate-fade-up">
        <div class="mb-6">
          <h2 class="text-h6 text-sm-h5 font-weight-bold text-slate-900">
            {{ tx.measure.heading }}
          </h2>
          <p class="text-body-2 text-slate-500 mt-1">
            {{ tx.measure.subheading }}
          </p>
        </div>

        <v-row align="start" class="mb-6">
          <!-- Left: Add Site Zone Measurement Form -->
          <v-col cols="12" lg="6">
            <v-card rounded="xl" elevation="0" class="pa-6 border-stone bg-white">
              <h3 class="text-subtitle-1 font-weight-bold text-slate-900 mb-4 d-flex align-center ga-2">
                <v-icon icon="mdi-ruler-square-compass" color="#D97706" size="20" />
                <span>{{ tx.measure.zoneFormTitle }}</span>
              </h3>

              <div class="mb-3">
                <label class="d-block text-caption font-weight-bold text-slate-700 mb-1">
                  {{ tx.measure.zoneNameLabel }}
                </label>
                <v-text-field
                  v-model="zoneName"
                  :placeholder="tx.measure.zoneNamePlaceholder"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  bg-color="#FAF9F6"
                  color="#D97706"
                  hide-details
                />
              </div>

              <div class="mb-3">
                <label class="d-block text-caption font-weight-bold text-slate-700 mb-1">
                  {{ tx.measure.shapeLabel }}
                </label>
                <v-select
                  v-model="zoneShape"
                  :items="tx.measure.shapes"
                  item-title="title"
                  item-value="value"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  bg-color="#FAF9F6"
                  color="#D97706"
                  hide-details
                />
              </div>

              <!-- Dynamic Geometry Dimensions -->
              <v-row dense class="mb-2">
                <v-col cols="12" sm="6">
                  <label class="d-block text-caption font-weight-bold text-slate-700 mb-1">
                    {{
                      zoneShape === 'triangle'
                        ? tx.measure.baseLabel
                        : zoneShape === 'trapezoid'
                          ? tx.measure.parallel1Label
                          : tx.measure.widthLabel
                    }}
                  </label>
                  <v-text-field
                    v-model.number="dimA"
                    type="number"
                    min="0.1"
                    step="0.1"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    bg-color="#FAF9F6"
                    color="#D97706"
                    hide-details
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <label class="d-block text-caption font-weight-bold text-slate-700 mb-1">
                    {{
                      zoneShape === 'triangle' || zoneShape === 'trapezoid'
                        ? tx.measure.heightLabel
                        : tx.measure.lengthLabel
                    }}
                  </label>
                  <v-text-field
                    v-model.number="dimB"
                    type="number"
                    min="0.1"
                    step="0.1"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    bg-color="#FAF9F6"
                    color="#D97706"
                    hide-details
                  />
                </v-col>

                <v-col v-if="zoneShape === 'lshape' || zoneShape === 'trapezoid'" cols="12" sm="6" class="mt-2">
                  <label class="d-block text-caption font-weight-bold text-slate-700 mb-1">
                    {{ zoneShape === 'trapezoid' ? tx.measure.parallel2Label : tx.measure.subWidthLabel }}
                  </label>
                  <v-text-field
                    v-model.number="dimC"
                    type="number"
                    min="0.1"
                    step="0.1"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    bg-color="#FAF9F6"
                    color="#D97706"
                    hide-details
                  />
                </v-col>

                <v-col v-if="zoneShape === 'lshape'" cols="12" sm="6" class="mt-2">
                  <label class="d-block text-caption font-weight-bold text-slate-700 mb-1">
                    {{ tx.measure.subLengthLabel }}
                  </label>
                  <v-text-field
                    v-model.number="dimD"
                    type="number"
                    min="0.1"
                    step="0.1"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    bg-color="#FAF9F6"
                    color="#D97706"
                    hide-details
                  />
                </v-col>
              </v-row>

              <v-row dense class="mb-4">
                <v-col cols="12" sm="6">
                  <label class="d-block text-caption font-weight-bold text-slate-700 mb-1">
                    {{ tx.measure.thicknessLabel }}
                  </label>
                  <v-text-field
                    v-model.number="slabThicknessCm"
                    type="number"
                    min="1"
                    step="1"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    bg-color="#FAF9F6"
                    color="#D97706"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <label class="d-block text-caption font-weight-bold text-slate-700 mb-1">
                    {{ tx.measure.deductLabel }}
                  </label>
                  <v-text-field
                    v-model.number="deductArea"
                    type="number"
                    min="0"
                    step="0.1"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    bg-color="#FAF9F6"
                    color="#D97706"
                    hide-details
                  />
                </v-col>
              </v-row>

              <!-- Live Preview Box -->
              <v-sheet rounded="lg" color="#FFFBEB" class="pa-4 border-amber mb-4">
                <div class="d-flex align-baseline justify-space-between mb-1.5">
                  <span class="text-caption font-weight-bold text-amber-900">
                    {{ tx.measure.previewArea }}
                  </span>
                  <span class="text-h6 font-weight-bold text-amber-700">
                    {{ currentZoneCalc.area.toFixed(2) }} {{ tx.measure.unitSqm }}
                  </span>
                </div>
                <div class="d-flex align-baseline justify-space-between mb-1.5">
                  <span class="text-caption font-weight-bold text-amber-900">
                    {{ tx.measure.previewPerimeter }}
                  </span>
                  <span class="text-body-2 font-weight-bold text-slate-800">
                    {{ currentZoneCalc.perimeter.toFixed(2) }} {{ tx.measure.unitM }}
                  </span>
                </div>
                <div class="d-flex align-baseline justify-space-between">
                  <span class="text-caption font-weight-bold text-amber-900">
                    {{ tx.measure.previewVolume }}
                  </span>
                  <span class="text-body-2 font-weight-bold text-slate-800">
                    {{ currentZoneCalc.volume.toFixed(2) }} {{ tx.measure.unitCum }}
                  </span>
                </div>
              </v-sheet>

              <v-btn
                block
                color="#D97706"
                variant="flat"
                rounded="lg"
                size="large"
                prepend-icon="mdi-plus-circle-outline"
                class="text-none text-white font-weight-bold"
                @click="addMeasuredZone"
              >
                {{ tx.measure.addZoneBtn }}
              </v-btn>
            </v-card>
          </v-col>

          <!-- Right: Recorded Site Zones & Multi-Zone Summary -->
          <v-col cols="12" lg="6">
            <v-card rounded="xl" elevation="0" class="pa-6 border-stone bg-white mb-6">
              <div class="d-flex align-center justify-space-between mb-4">
                <h3 class="text-subtitle-1 font-weight-bold text-slate-900 d-flex align-center ga-2">
                  <v-icon icon="mdi-floor-plan" color="#0284C7" size="20" />
                  <span>{{ tx.measure.zoneListTitle }}</span>
                </h3>
                <v-btn
                  v-if="measuredZones.length > 0"
                  variant="text"
                  size="x-small"
                  color="#E11D48"
                  class="text-none font-weight-bold"
                  @click="clearMeasuredZones"
                >
                  {{ tx.measure.clearZonesBtn }}
                </v-btn>
              </div>

              <div v-if="measuredZones.length > 0" class="space-y-2 mb-4">
                <v-sheet
                  v-for="z in measuredZones"
                  :key="z.id"
                  rounded="lg"
                  color="#FAF9F6"
                  class="pa-3 border-stone d-flex align-center justify-space-between ga-2"
                >
                  <div>
                    <div class="text-body-2 font-weight-bold text-slate-900">
                      {{ z.name }}
                    </div>
                    <div class="text-caption text-slate-500">
                      {{ tx.measure.previewPerimeter }} {{ z.perimeter.toFixed(1) }} {{ tx.measure.unitM }} •
                      {{ z.thickness }} cm ({{ z.volume.toFixed(2) }} {{ tx.measure.unitCum }})
                    </div>
                  </div>
                  <div class="d-flex align-center ga-2">
                    <v-chip size="small" color="#E0F2FE" variant="flat" class="font-weight-bold text-sky-800">
                      {{ z.area.toFixed(2) }} {{ tx.measure.unitSqm }}
                    </v-chip>
                    <v-btn
                      icon="mdi-delete-outline"
                      variant="text"
                      size="x-small"
                      color="#94A3B8"
                      @click="removeMeasuredZone(z.id)"
                    />
                  </div>
                </v-sheet>
              </div>

              <v-sheet
                v-else
                rounded="lg"
                color="#FAF9F6"
                class="pa-6 text-center border-stone mb-4"
              >
                <v-icon icon="mdi-vector-square-plus" size="36" color="#94A3B8" class="mb-2" />
                <div class="text-caption text-slate-500">
                  {{ tx.measure.emptyZones }}
                </div>
              </v-sheet>

              <v-sheet rounded="lg" color="#F0F9FF" class="pa-4 border-sky">
                <div class="d-flex align-baseline justify-space-between mb-1.5">
                  <span class="text-caption font-weight-bold text-sky-900">
                    {{ tx.measure.totalAreaLabel }}
                  </span>
                  <span class="text-h5 font-weight-bold text-sky-700">
                    {{ totalMeasuredStats.area }} {{ tx.measure.unitSqm }}
                  </span>
                </div>
                <div class="d-flex align-baseline justify-space-between mb-1.5">
                  <span class="text-caption font-weight-bold text-sky-900">
                    {{ tx.measure.totalVolumeLabel }}
                  </span>
                  <span class="text-subtitle-2 font-weight-bold text-slate-900">
                    {{ totalMeasuredStats.volume }} {{ tx.measure.unitCum }}
                  </span>
                </div>
                <div class="d-flex align-baseline justify-space-between mb-3">
                  <span class="text-caption font-weight-bold text-sky-900">
                    {{ tx.measure.totalPerimeterLabel }}
                  </span>
                  <span class="text-body-2 font-weight-bold text-slate-700">
                    {{ totalMeasuredStats.perimeter }} {{ tx.measure.unitM }}
                  </span>
                </div>
                <v-btn
                  block
                  color="#0284C7"
                  variant="flat"
                  rounded="lg"
                  prepend-icon="mdi-content-copy"
                  class="text-none text-white font-weight-bold"
                  :disabled="measuredZones.length === 0"
                  @click="copyMeasuredSummary"
                >
                  {{ tx.measure.copyZonesBtn }}
                </v-btn>
              </v-sheet>
            </v-card>

            <!-- Thai Land Area Converter & Tile Estimator -->
            <v-card rounded="xl" elevation="0" class="pa-6 border-stone bg-white">
              <div class="d-flex align-start justify-space-between ga-2 mb-3">
                <div>
                  <h3 class="text-subtitle-1 font-weight-bold text-slate-900">
                    {{ tx.measure.landTitle }}
                  </h3>
                  <p class="text-caption text-slate-500">
                    {{ tx.measure.landDesc }}
                  </p>
                </div>
                <v-btn
                  variant="tonal"
                  size="x-small"
                  color="#D97706"
                  rounded="lg"
                  class="text-none font-weight-bold"
                  @click="syncFromMeasuredTotal"
                >
                  {{ tx.measure.useMeasuredBtn }}
                </v-btn>
              </div>

              <div class="mb-4">
                <label class="d-block text-caption font-weight-bold text-slate-700 mb-1">
                  {{ tx.measure.inputSqmLabel }}
                </label>
                <v-text-field
                  v-model.number="landSqmInput"
                  type="number"
                  min="1"
                  step="1"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  bg-color="#FAF9F6"
                  color="#D97706"
                  hide-details
                />
              </div>

              <v-sheet rounded="lg" color="#FAF9F6" class="pa-4 border-stone space-y-2">
                <div>
                  <div class="text-caption font-weight-bold text-slate-600 mb-1">
                    {{ tx.measure.thaiLandResultLabel }}
                  </div>
                  <div class="text-subtitle-1 font-weight-bold text-slate-900">
                    {{ landAndTileCalc.rai }} {{ tx.measure.raiUnit }} •
                    {{ landAndTileCalc.ngan }} {{ tx.measure.nganUnit }} •
                    {{ landAndTileCalc.wah }} {{ tx.measure.wahUnit }}
                  </div>
                </div>
                <div class="pt-2 border-t-stone">
                  <div class="text-caption font-weight-bold text-slate-600 mb-1">
                    {{ tx.measure.tileEstimatorLabel }}
                  </div>
                  <div class="text-body-2 font-weight-bold text-amber-800">
                    ~{{ landAndTileCalc.tileBoxes }} {{ tx.measure.tileBoxesUnit }} ({{ landAndTileCalc.tiles60x60 }} {{ tx.measure.tile60Unit }})
                  </div>
                </div>
              </v-sheet>
            </v-card>
          </v-col>
        </v-row>

        <!-- Supabase Lead / Free Quote Inquiry Card -->
        <v-card rounded="xl" elevation="0" class="pa-6 border-stone bg-white mt-6">
          <div class="d-flex align-center ga-3 mb-4">
            <v-avatar color="#FEF3C7" size="40" rounded="lg">
              <v-icon color="#D97706">mdi-calendar-check-outline</v-icon>
            </v-avatar>
            <div>
              <h3 class="text-subtitle-1 font-weight-bold text-slate-900">
                {{ leadUiText.title }}
              </h3>
              <p class="text-caption text-slate-500">
                {{ leadUiText.subtitle }}
              </p>
            </div>
          </div>

          <v-row dense>
            <v-col cols="12" sm="4">
              <v-text-field
                v-model="leadForm.name"
                :label="leadUiText.nameLabel"
                variant="outlined"
                density="compact"
                rounded="lg"
                bg-color="#FAF9F6"
                color="#D97706"
                hide-details
                class="mb-2"
              />
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                v-model="leadForm.phone"
                :label="leadUiText.phoneLabel"
                variant="outlined"
                density="compact"
                rounded="lg"
                bg-color="#FAF9F6"
                color="#D97706"
                hide-details
                class="mb-2"
              />
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                v-model="leadForm.lineId"
                :label="leadUiText.lineLabel"
                variant="outlined"
                density="compact"
                rounded="lg"
                bg-color="#FAF9F6"
                color="#D97706"
                hide-details
                class="mb-2"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="leadForm.roomType"
                :label="leadUiText.roomLabel"
                variant="outlined"
                density="compact"
                rounded="lg"
                bg-color="#FAF9F6"
                color="#D97706"
                hide-details
                class="mb-2"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="leadForm.budget"
                :label="leadUiText.budgetLabel"
                variant="outlined"
                density="compact"
                rounded="lg"
                bg-color="#FAF9F6"
                color="#D97706"
                hide-details
                class="mb-2"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="leadForm.notes"
                :label="leadUiText.notesLabel"
                rows="2"
                variant="outlined"
                density="compact"
                rounded="lg"
                bg-color="#FAF9F6"
                color="#D97706"
                hide-details
                class="mb-3"
              />
            </v-col>
          </v-row>

          <v-alert
            v-if="leadFeedback.text"
            :type="leadFeedback.type === 'success' ? 'success' : 'error'"
            variant="tonal"
            density="compact"
            rounded="lg"
            class="mb-3"
          >
            {{ leadFeedback.text }}
          </v-alert>

          <div class="d-flex justify-end">
            <v-btn
              color="#D97706"
              variant="flat"
              rounded="lg"
              prepend-icon="mdi-send"
              class="text-none text-white font-weight-bold px-6"
              :loading="leadSubmitting"
              @click="handleSubmitLead"
            >
              {{ leadUiText.submitBtn }}
            </v-btn>
          </div>
        </v-card>
      </div>

      <!-- VIEW 6: SAVED ARTICLES -->
      <div v-else-if="activeTab === 'saved'" class="animate-fade-up">
        <div class="d-flex align-center justify-space-between mb-6">
          <div>
            <h2 class="text-h6 text-sm-h5 font-weight-bold text-slate-900">
              {{ t.saved.heading }}
            </h2>
            <p class="text-body-2 text-slate-500 mt-1">
              {{ t.saved.subheading }}
            </p>
          </div>
          <v-btn
            v-if="savedArticles.length > 0"
            variant="outlined"
            rounded="lg"
            size="small"
            color="#475569"
            class="text-none font-weight-bold border-stone"
            @click="clearAllSaved"
          >
            {{ t.saved.clearAllBtn }}
          </v-btn>
        </div>

        <v-row v-if="savedArticles.length > 0" dense class="mx-n3">
          <v-col
            v-for="article in savedArticles"
            :key="article.id"
            cols="12"
            md="6"
            lg="4"
            class="pa-3 d-flex"
          >
            <v-card
              rounded="xl"
              elevation="0"
              class="border-stone bg-white d-flex flex-column w-100 article-card overflow-hidden"
            >
              <div
                class="position-relative bg-stone-100 cursor-pointer overflow-hidden"
                style="height: 192px"
                @click="openArticle(article.id)"
              >
                <v-img
                  v-if="article.image"
                  :src="article.image"
                  :alt="article.title"
                  cover
                  height="192"
                  class="article-img"
                />
                <div
                  v-else
                  class="w-100 h-100"
                  v-html="renderArticleSvg(article)"
                ></div>
                <v-chip
                  size="small"
                  color="rgba(255, 255, 255, 0.95)"
                  variant="flat"
                  rounded="pill"
                  class="position-absolute font-weight-bold text-slate-800 elevation-1"
                  style="top: 12px; left: 12px"
                >
                  {{ article.category }}
                </v-chip>
              </div>

              <v-card-text class="pa-5 flex-grow-1 d-flex flex-column">
                <div class="d-flex align-center justify-space-between text-caption text-slate-400 mb-2">
                  <span>{{ article.readTime }}</span>
                  <span>{{ article.date }}</span>
                </div>
                <h3
                  class="text-subtitle-1 font-weight-bold text-slate-900 leading-snug mb-2 line-clamp-2 cursor-pointer article-title"
                  @click="openArticle(article.id)"
                >
                  {{ article.title }}
                </h3>
                <p class="text-body-2 text-slate-600 line-clamp-3 mb-4 flex-grow-1">
                  {{ article.summary }}
                </p>

                <div class="pt-3 border-t-stone d-flex align-center justify-space-between">
                  <v-btn
                    variant="text"
                    color="#B45309"
                    density="compact"
                    class="text-none font-weight-bold px-0"
                    append-icon="mdi-chevron-right"
                    @click="openArticle(article.id)"
                  >
                    {{ t.search.readArticle }}
                  </v-btn>

                  <v-btn
                    icon
                    size="small"
                    variant="outlined"
                    rounded="lg"
                    color="#B45309"
                    class="bg-amber-50 border-amber-300"
                    :aria-label="t.search.bookmarkAria"
                    @click="toggleBookmark(article.id)"
                  >
                    <v-icon icon="mdi-bookmark" size="18" />
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-card
          v-else
          rounded="xl"
          elevation="0"
          class="border-stone bg-white pa-10 text-center"
        >
          <v-icon icon="mdi-bookmark-multiple-outline" size="48" color="#94A3B8" class="mb-3" />
          <div class="text-h6 font-weight-bold text-slate-700 mb-1">
            {{ t.saved.emptyTitle }}
          </div>
          <p class="text-body-2 text-slate-500 mb-4">
            {{ t.saved.emptyDesc }}
          </p>
          <v-btn
            color="#D97706"
            variant="flat"
            rounded="lg"
            class="text-none text-white font-weight-medium"
            @click="switchTab('articles')"
          >
            {{ t.saved.exploreBtn }}
          </v-btn>
        </v-card>
      </div>
    </v-container>

    <!-- Footer -->
    <footer class="bg-white border-t-stone mt-12">
      <v-container class="max-w-6xl py-6 px-4 px-sm-6 d-flex flex-column flex-sm-row align-center justify-space-between ga-3 text-caption text-slate-500">
        <div>{{ t.footer.copyright }}</div>
        <div>{{ t.footer.note }}</div>
      </v-container>
    </footer>

    <!-- Article Reader Modal (v-dialog) -->
    <v-dialog v-model="dialogOpen" max-width="768" scrollable>
      <v-card v-if="currentArticle" rounded="xl" class="overflow-hidden border-stone">
        <!-- Modal Header -->
        <div class="d-flex align-center justify-space-between px-5 py-3.5 bg-stone-50 border-b-stone">
          <v-chip
            size="small"
            color="#FEF3C7"
            variant="flat"
            rounded="pill"
            class="font-weight-bold text-amber-800"
          >
            {{ currentArticle.category }}
          </v-chip>

          <div class="d-flex align-center ga-2 flex-wrap">
            <v-btn
              v-if="!currentArticle.isConstruction"
              :href="currentArticle.postUrl || 'https://www.facebook.com/profile.php?id=100093160863461'"
              target="_blank"
              rel="noopener noreferrer"
              variant="flat"
              size="small"
              rounded="lg"
              color="#1877F2"
              class="text-none font-weight-bold text-white"
              prepend-icon="mdi-facebook"
            >
              {{ articleUiText.fbViewPostBtn }}
            </v-btn>
            <v-btn
              variant="outlined"
              size="small"
              rounded="lg"
              color="#334155"
              class="text-none font-weight-medium bg-white border-stone"
              prepend-icon="mdi-content-copy"
              @click="copyArticleSummary"
            >
              {{ t.modal.copySummary }}
            </v-btn>
            <v-btn
              variant="outlined"
              size="small"
              rounded="lg"
              :color="isBookmarked(currentArticle.id) ? '#78350F' : '#334155'"
              :class="
                isBookmarked(currentArticle.id)
                  ? 'bg-amber-100 border-amber-300 font-weight-bold'
                  : 'bg-white border-stone font-weight-medium'
              "
              class="text-none"
              :prepend-icon="isBookmarked(currentArticle.id) ? 'mdi-bookmark-check' : 'mdi-bookmark-outline'"
              @click="toggleBookmark(currentArticle.id)"
            >
              {{ isBookmarked(currentArticle.id) ? t.modal.saved : t.modal.save }}
            </v-btn>
            <v-btn
              icon="mdi-close"
              variant="text"
              size="small"
              color="#64748B"
              :aria-label="t.modal.closeAria"
              @click="dialogOpen = false"
            />
          </div>
        </div>

        <v-card-text class="pa-0">
          <!-- Modal Visual -->
          <div class="w-100 bg-stone-100 overflow-hidden d-flex align-center justify-center" style="max-height: 320px">
            <v-img
              v-if="currentArticle.image"
              :src="currentArticle.image"
              :alt="currentArticle.title"
              cover
              max-height="320"
              width="100%"
            />
            <div
              v-else
              class="w-100"
              style="height: 224px"
              v-html="renderArticleSvg(currentArticle)"
            ></div>
          </div>

          <!-- Modal Content Body -->
          <div class="pa-6 pa-sm-8">
            <div class="d-flex align-center ga-2 text-caption text-slate-500 mb-2">
              <span>{{ currentArticle.readTime }}</span>
              <span>•</span>
              <span>{{ currentArticle.date }}</span>
            </div>
            <h2 class="text-h5 text-sm-h4 font-weight-bold text-slate-900 leading-snug mb-6">
              {{ currentArticle.title }}
            </h2>

            <div class="space-y-4 mb-6">
              <div
                v-for="(sec, idx) in currentArticle.sections"
                :key="idx"
                class="mb-4"
              >
                <h3 class="text-subtitle-1 font-weight-bold text-slate-900 mb-1">
                  {{ sec.heading }}
                </h3>
                <p class="text-body-2 text-sm-body-1 text-slate-700 leading-relaxed">
                  {{ sec.body }}
                </p>
              </div>
            </div>

            <!-- Material Recommendation Box -->
            <v-sheet rounded="lg" color="#FFFBEB" class="pa-4 pa-sm-5 border-amber mb-5">
              <h4 class="text-body-2 font-weight-bold text-amber-900 mb-2 d-flex align-center ga-1.5">
                <v-icon icon="mdi-check-circle-outline" color="#D97706" size="18" />
                <span>{{ t.modal.recommendedMaterials }}</span>
              </h4>
              <ul class="text-body-2 text-amber-950 pl-5 space-y-1">
                <li v-for="rec in currentArticle.recommendations" :key="rec">
                  {{ rec }}
                </li>
              </ul>
            </v-sheet>

            <!-- Call To Action Banner -->
            <v-sheet
              v-if="currentArticle.cta"
              rounded="lg"
              color="#EFF6FF"
              class="pa-4 mb-5"
              style="border: 1px solid #BFDBFE"
            >
              <div class="text-caption font-weight-bold text-blue-900 mb-1 d-flex align-center ga-1.5">
                <v-icon icon="mdi-bullhorn-outline" color="#1D4ED8" size="16" />
                <span>{{ articleUiText.ctaTitle }}</span>
              </div>
              <div class="text-body-2 font-weight-semibold text-slate-900">
                {{ currentArticle.cta }}
              </div>
            </v-sheet>

            <!-- iKamm Home Decor Contact Info Card -->
            <v-sheet
              v-if="currentArticle.contact"
              rounded="lg"
              color="#F8FAFC"
              class="pa-4 border-stone mb-5"
            >
              <div class="text-body-2 font-weight-bold text-slate-900 mb-1">
                {{ currentArticle.contact.prompt }}
              </div>
              <div class="text-subtitle-2 font-weight-bold text-amber-800 mb-2">
                {{ currentArticle.contact.company }}
              </div>
              <div class="text-caption text-slate-600 d-flex flex-column ga-1">
                <div><strong>{{ currentArticle.contact.phoneLabel }}:</strong> {{ currentArticle.contact.phones }}</div>
                <div><strong>{{ currentArticle.contact.lineLabel }}:</strong> {{ currentArticle.contact.line }}</div>
                <div><strong>{{ currentArticle.contact.emailLabel }}:</strong> {{ currentArticle.contact.emails }}</div>
                <div><strong>{{ currentArticle.contact.webLabel }}:</strong> {{ currentArticle.contact.website }}</div>
                <div v-if="currentArticle.contact.facebook" class="mt-2 pt-2 border-t-stone d-flex align-center justify-space-between flex-wrap ga-2">
                  <div>
                    <strong>{{ currentArticle.contact.facebookLabel }}:</strong> {{ currentArticle.contact.facebookName }}
                  </div>
                  <v-btn
                    :href="currentArticle.contact.facebook"
                    target="_blank"
                    rel="noopener noreferrer"
                    color="#1877F2"
                    variant="flat"
                    size="x-small"
                    rounded="lg"
                    class="text-none font-weight-bold text-white px-3"
                    prepend-icon="mdi-facebook"
                  >
                    {{ currentArticle.contact.facebookLabel }}
                  </v-btn>
                </div>
              </div>
            </v-sheet>

            <!-- Hashtags -->
            <div v-if="currentArticle.hashtags" class="d-flex flex-wrap ga-1.5 mb-5">
              <v-chip
                v-for="tag in currentArticle.hashtags"
                :key="tag"
                size="x-small"
                variant="tonal"
                color="#475569"
                rounded="pill"
              >
                {{ tag }}
              </v-chip>
            </div>

            <!-- Sources -->
            <div class="pt-4 border-t-stone">
              <div class="text-caption font-weight-bold text-slate-500 mb-2">
                {{ t.modal.sourcesLabel }}
              </div>
              <div class="d-flex flex-wrap ga-2">
                <v-btn
                  v-for="src in currentArticle.sources"
                  :key="src.url"
                  :href="src.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="flat"
                  color="#F5F5F4"
                  size="small"
                  rounded="lg"
                  class="text-none text-caption text-slate-700"
                  append-icon="mdi-open-in-new"
                >
                  {{ src.label }}
                </v-btn>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Quick Jump 30-Topic Directory Dialog -->
    <v-dialog v-model="directoryDialogOpen" max-width="860" scrollable>
      <v-card rounded="xl" class="overflow-hidden border-stone">
        <div class="d-flex align-center justify-space-between px-5 py-4 bg-stone-50 border-b-stone">
          <div>
            <h3 class="text-subtitle-1 font-weight-bold text-slate-900">
              {{ articleUiText.quickDirectoryTitle }}
            </h3>
            <div class="text-caption text-slate-500">
              {{ articleUiText.quickDirectorySub }}
            </div>
          </div>
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            color="#64748B"
            @click="directoryDialogOpen = false"
          />
        </div>
        <v-card-text class="pa-0" style="max-height: 70vh">
          <v-list lines="two" class="pa-0">
            <v-list-item
              v-for="article in localizedArticles"
              :key="article.id"
              class="px-5 py-3 border-b-stone hover-row cursor-pointer"
              @click="directoryDialogOpen = false; openArticle(article.id)"
            >
              <template #prepend>
                <v-chip
                  size="small"
                  color="#0F172A"
                  variant="flat"
                  rounded="lg"
                  class="text-white font-weight-bold mr-3"
                  style="min-width: 68px; justify-content: center"
                >
                  {{ article.dayLabel }}
                </v-chip>
              </template>
              <v-list-item-title class="font-weight-bold text-slate-900 text-body-2 mb-1">
                {{ article.title }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-caption text-slate-500">
                {{ article.category }} • {{ article.readTime }}
              </v-list-item-subtitle>
              <template #append>
                <v-btn
                  color="#D97706"
                  variant="tonal"
                  size="x-small"
                  rounded="lg"
                  class="text-none font-weight-bold"
                  append-icon="mdi-chevron-right"
                >
                  {{ articleUiText.readNowBtn }}
                </v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Toast Notification -->
    <v-snackbar
      v-model="snackbar"
      :timeout="2400"
      color="#0F172A"
      location="bottom end"
      rounded="lg"
    >
      <span class="text-body-2 font-weight-medium text-white">{{ snackbarText }}</span>
    </v-snackbar>
  </div>
</template>

<style scoped>
.sangsan-wrapper {
  background-color: #f7f6f2;
  color: #1e293b;
  font-family: 'Noto Sans Thai', 'Noto Sans SC', 'Inter', system-ui, -apple-system, sans-serif;
}

.max-w-6xl {
  max-width: 1152px !important;
  margin-left: auto;
  margin-right: auto;
}

.app-header {
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #e7e5e4 !important;
}

.border-stone {
  border: 1px solid #e7e5e4 !important;
}

.border-t-stone {
  border-top: 1px solid #e7e5e4 !important;
}

.border-b-stone {
  border-bottom: 1px solid #e7e5e4 !important;
}

.border-amber {
  border: 1px solid #fde68a !important;
}

.border-t-amber {
  border-top: 1px solid rgba(253, 230, 138, 0.8) !important;
}

.border-sky {
  border: 1px solid #bae6fd !important;
}

.border-t-sky {
  border-top: 1px solid rgba(186, 230, 253, 0.8) !important;
}

.bg-slate-900 {
  background-color: #0f172a !important;
}

.bg-stone-50 {
  background-color: #fafaf9 !important;
}

.bg-stone-100 {
  background-color: #f5f5f4 !important;
}

.bg-amber-50 {
  background-color: #fffbeb !important;
}

.bg-amber-100 {
  background-color: #fef3c7 !important;
}

.text-slate-900 {
  color: #0f172a !important;
}

.text-slate-800 {
  color: #1e293b !important;
}

.text-slate-700 {
  color: #334155 !important;
}

.text-slate-600 {
  color: #475569 !important;
}

.text-slate-500 {
  color: #64748b !important;
}

.text-slate-400 {
  color: #94a3b8 !important;
}

.text-slate-300 {
  color: #cbd5e1 !important;
}

.text-slate-100 {
  color: #f1f5f9 !important;
}

.text-amber-700 {
  color: #b45309 !important;
}

.text-amber-800 {
  color: #92400e !important;
}

.text-amber-900 {
  color: #78350f !important;
}

.text-amber-950 {
  color: #451a03 !important;
}

.text-emerald-700 {
  color: #047857 !important;
}

.text-rose-700 {
  color: #be123c !important;
}

.text-sky-700 {
  color: #0369a1 !important;
}

.text-sky-800 {
  color: #075985 !important;
}

.text-sky-900 {
  color: #0c4a6e !important;
}

.text-sky-950 {
  color: #082f49 !important;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  background-color: rgba(245, 158, 11, 0.2);
  color: #fcd34d;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.hero-gradient-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.2), transparent);
  pointer-events: none;
}

@media (min-width: 960px) {
  .hero-gradient-overlay {
    background: linear-gradient(to right, transparent, rgba(15, 23, 42, 0.8));
  }
}

.leading-none {
  line-height: 1 !important;
}

.leading-snug {
  line-height: 1.375 !important;
}

.leading-relaxed {
  line-height: 1.625 !important;
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

.article-card {
  transition: box-shadow 0.25s ease, transform 0.2s ease;
}

.article-card:hover {
  box-shadow: 0 6px 16px -4px rgba(15, 23, 42, 0.08) !important;
}

.article-img {
  transition: transform 0.3s ease;
}

.article-card:hover .article-img {
  transform: scale(1.05);
}

.article-card:hover .article-title {
  color: #b45309 !important;
}

.space-y-1 > * + * {
  margin-top: 4px;
}

.space-y-2 > * + * {
  margin-top: 8px;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-up {
  animation: fadeUp 0.25s ease-out forwards;
}
</style>
