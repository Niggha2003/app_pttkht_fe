import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'
import HomeView from '@/views/HomeView.vue'
import { get } from '@/utils/httpRequest'
import workingRoute from './workingRoute'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  },
  workingRoute
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

// kiểm tra người dùng đăng nhập chưa, nếu rồi thì cho tuy cập còn không thì cho chuyển hướng đến trang đăng nhập
router.beforeEach(async (to, from, next) => {
  const check_jwt = async () => {
    try {
      const user = await get('/api_check_jwt', {})
      if (user) {
        store.commit('login', true)
        store.commit('changeUser', JSON.stringify(user))
        if (to.name == 'login') {
          next({ name: 'home' })
        } else if (to.name == 'home') {
          next()
        } else if (from.name == 'login') {
          next({ name: 'home' })
        } else {
          next()
        }
      }
    } catch (err) {
      store.commit('login', false)
      if (sessionStorage.getItem('user')) {
        sessionStorage.removeItem('user')
      }
      if (to.name != 'login') {
        next({ name: 'login' })
      } else {
        next()
      }
    }
  }
  await check_jwt()
  // console.log(to.name, store.state.isLoggedIn)
  // if (store.state.isLoggedIn == false || to.name != 'login') {
  //   next({ name: 'login' })
  //   console.log('fjdo')
  // } else if (to.name == 'login' && store.state.isLoggedIn) {
  //   next(false)
  // }
})

export default router
