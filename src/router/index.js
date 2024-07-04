import { createRouter, createWebHistory } from 'vue-router'

import { get } from '@/utils/httpRequest'

import HomeView from '@/views/control_views/HomeView.vue'

import homePageRoute from './homePageRoute'
import workingRoute from './workingRoute'
import store from '@/store'

import menuList from '@/components/control_components/menuList'
import { MenuItemChildChange, MenuItemReset } from '@/components/control_components/menuList'

const routes = [
  ...homePageRoute,
  {
    path: '/control',
    name: 'home',
    component: HomeView
  },
  {
    path: '/control/login',
    name: 'login',
    component: () => import('@/views/control_views/LoginView.vue')
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
  if (to.fullPath.includes('control')) {
    const check_jwt = async () => {
      try {
        const check_result = await get('/api_check_jwt', {})
        if (check_result.user) {
          store.commit('login', true)
          store.commit('changeUser', JSON.stringify(check_result.user))
          store.commit('changeDataNeeded', check_result.dataNeeded)
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
          sessionStorage.removeItem('dataNeeded')
        }
        if (to.name != 'login') {
          next({ name: 'login' })
        } else {
          next()
        }
      }
    }
    await check_jwt()
    // thay đổi giao diện sidebar cho phù hợp mỗi view
    const menu = menuList
    const index = menu.findIndex((menu) => menu.type === to.name)
    if (index != -1) {
      const childIndex = menu[index].listChild.findIndex(
        (child) => child.to.params.place === to.params.place
      )
      if (childIndex != -1) {
        const newMenu = MenuItemChildChange(menu, index, childIndex)
        store.commit('changeMenu', newMenu)
      }
    } else {
      const newMenu = MenuItemReset(menu)
      store.commit('changeMenu', newMenu)
    }
  } else {
    next()
  }
})

export default router
