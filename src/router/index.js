import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...setupLayouts(routes),
  ],
})

router.beforeEach(to => {
  const isLoggedIn = !!(localStorage.getItem('user-info'))
  if(isLoggedIn) {
    if(to.path === '/') {
      return '/dashboard'
    }
  }

})
export default router
