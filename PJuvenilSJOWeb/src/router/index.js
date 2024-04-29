import { createRouter, createWebHistory } from 'vue-router'
import ImagenesView from '../views/ImagenesView.vue'
import AgregarImagenes from '../views/AgregarImagenes.vue'
import AgregarVideos from '@/views/AgregarVideos.vue'
import InicioView from '@/views/InicioView.vue'
import AgregarActividad from '@/views/AgregarActividad.vue'
import AgregarGrupo from '@/views/AgregarGrupo.vue'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    
    {
      path: '/',
      name: 'inicio',
      component: InicioView
    },
    {
      path: '/imagenesView/:infoType',
      name: 'imagenesView',
      component: ImagenesView,
      props: true
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
    {
      path: '/agregarActividad',
      name: 'agregarActividad',
      component: AgregarActividad
    },
    {
      path: '/agregarGrupo',
      name: 'agregarGrupo',
      component: AgregarGrupo
    },

    
  ]
})

export default router
