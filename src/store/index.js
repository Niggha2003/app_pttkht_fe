import { createStore } from 'vuex'
import menuList from '@/components/control_components/menuList'

export default createStore({
  state: {
    user: JSON.parse(sessionStorage.getItem('user')),
    isLoggedIn: sessionStorage.getItem('isLoggedIn'),
    menu: menuList,
    isHomePageModify: false
  },
  mutations: {
    changeMenu(state, menu) {
      state.menu = menu
    },
    changeUser(state, user) {
      sessionStorage.setItem('user', user)
      state.user = JSON.parse(sessionStorage.getItem('user'))
    },

    setHomePageModify(state, modifyState) {
      state.isHomePageModify = modifyState
    },
    login(state, isLoggedIn) {
      sessionStorage.setItem('isLoggedIn', isLoggedIn)
      state.isLoggedIn = sessionStorage.getItem('isLoggedIn')
    }
  },
  actions: {},
  getters: {}
})
