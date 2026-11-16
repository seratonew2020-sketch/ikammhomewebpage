// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/crud',
      name: 'article-crud',
      // ใช้ Lazy-loading เพื่อความเร็วในการโหลด
      component: () => import('../views/ArticleCrudView.vue'),
    },
    {
      // จัดการกรณีพิมพ์ URL ไม่ถูกต้อง ให้เด้งกลับหน้าแรก
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})


export default router