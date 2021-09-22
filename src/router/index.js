import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/home',
    component: () => import('@/views/Home.vue')
  }
]

const router = new VueRouter({
  routes
})

// 添加路由守卫
router.beforeEach((to, from, next) => {
  // 如果访问 login 直接放行
  if (to.path === '/login') return next()
  // 如果不是访问 login 则坚持sessionStorage有没有token
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  // 如果访问非 login 并且有token 放行
  next(true)
})

export default router
