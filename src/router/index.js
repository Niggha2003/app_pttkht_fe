import { createRouter, createWebHistory } from 'vue-router'

import { get } from '@/utils/httpRequest'

import controlPageRoute from './controlPageRoute'
import homePageRoute from './homePageRoute'
import store from '@/store'

import menuList from '@/components/control_components/menuList'
import {
  MenuItemChildChange,
  MenuItemReset,
  MenuShowItem
} from '@/components/control_components/menuList'

const routes = [
  ...homePageRoute,
  ...controlPageRoute,
  {
    path: '/control/login',
    name: 'login',
    component: () => import('@/views/control_views/LoginView.vue')
  },
  {
    path: '/not_found_page',
    name: 'not_found_page',
    component: () => import('@/views/control_views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

const roleCheckAccess = {
  working: 'working',
  ordering: 'ordering.flight.news',
  signing: 'signing',
  admin: 'employee.working.signing.ordering.flight.news'
}

// kiểm tra người dùng đăng nhập chưa, nếu rồi thì cho truy cập còn không thì cho chuyển hướng đến trang đăng nhập
router.beforeEach(async (to, from, next) => {
  if (to.fullPath.includes('control')) {
    const check_jwt = async () => {
      try {
        const check_result = await get('/api_check_jwt', {})
        if (check_result.user) {
          store.commit('login', true)
          store.commit('changeUser', JSON.stringify(check_result.user))

          // khi vào trang login và trang home
          if (to.name == 'login') {
            next({ name: 'home' })
          } else if (to.name == 'home') {
            next()
          } else if (to.name == 'not_found_page') {
            next()
          } else if (from.name == 'login') {
            next({ name: 'home' })
          } else if (!roleCheckAccess[store.state.user.role].includes(to.name)) {
            // kiểm tra xem người dùng có quyền truy cập vào các trang được phép hay không
            next({ name: 'not_found_page' })
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

    const menu = menuList
    // phân quyền lựa chọn các chức năng mà người dùng có thể thực hiện dựa trên role của họ
    const newMenu = MenuShowItem(menu, store.state.user.role)
    store.commit('changeMenu', newMenu)

    // thay đổi giao diện sidebar cho phù hợp mỗi view
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
    // Có hiện nút sửa ở trang chủ hay không
    if (
      store.state.user &&
      (store.state.user.role == 'ordering' || store.state.user.role == 'admin')
    ) {
      store.commit('setHomePageModifyShow', true)
    }
    next()
  }
})

export default router
