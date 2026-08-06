import { createRouter, createWebHistory } from 'vue-router'
import Accueil from '../views/Accueil.vue'
import TestAudioRecorder from "../components/TestAudioRecorder.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'accueil',
      component: Accueil
    },
    {
      path: '/test-audio-recorder',
      name: 'test-audio-recorder',
      component: TestAudioRecorder
    }
  ]
})

export default router