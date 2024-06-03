// vuexSessionStorage.js

export default function createSessionStoragePlugin() {
  return (store) => {
    // Lắng nghe sự thay đổi trong store
    store.subscribe((mutation, state) => {
      // Lưu trạng thái của store vào sessionStorage
      sessionStorage.setItem('vuex_state', JSON.stringify(state))
    })

    // Khởi tạo store với trạng thái từ sessionStorage (nếu có)
    if (sessionStorage.getItem('vuex_state')) {
      store.replaceState(JSON.parse(sessionStorage.getItem('vuex_state')))
    }
  }
}
