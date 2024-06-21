import { createStore } from 'vuex'
import menuList from '@/components/control_components/menuList'

export default createStore({
  state: {
    user: JSON.parse(sessionStorage.getItem('user')),
    isLoggedIn: sessionStorage.getItem('isLoggedIn'),
    menu: menuList,
    dataNeeded: JSON.parse(sessionStorage.getItem('dataNeeded'))
  },
  mutations: {
    changeMenu(state, menu) {
      state.menu = menu
    },
    changeUser(state, user) {
      sessionStorage.setItem('user', user)
      state.user = JSON.parse(sessionStorage.getItem('user'))
    },
    changeDataNeeded(state, data) {
      sessionStorage.setItem('dataNeeded', JSON.stringify(data))
      state.dataNeeded = JSON.parse(sessionStorage.getItem('dataNeeded'))
    },
    login(state, isLoggedIn) {
      sessionStorage.setItem('isLoggedIn', isLoggedIn)
      state.isLoggedIn = sessionStorage.getItem('isLoggedIn')
    }
  },
  actions: {},
  getters: {}
})
