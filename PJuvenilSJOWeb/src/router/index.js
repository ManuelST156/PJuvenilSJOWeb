import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AgregarImagenes from '../views/AgregarImagenes.vue'
import AgregarVideos from '@/views/AgregarVideos.vue'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/agregarImagenes',
      name: 'agregarImagenes',
      component: AgregarImagenes
    },
    {
      path: '/agregarVideos',
      name: 'agregarVideos',
      component: AgregarVideos
    },

    
  ]
})

export default router
