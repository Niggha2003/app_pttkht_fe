import './assets/css/main.css'
import './assets/scss/sidebar.scss'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js' // Nếu bạn cần sử dụng các tính năng JavaScript của Bootstrap

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

/* import prime vue lib */
import PrimeVue from 'primevue/config'
//css for prime vue
import 'primevue/resources/themes/aura-light-green/theme.css'
import 'primevue/resources/primevue.min.css' /* Deprecated */

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(PrimeVue, { ripple: true })
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
