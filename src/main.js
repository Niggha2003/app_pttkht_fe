import './assets/css/main.css'
import './assets/scss/output.scss'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js' // Nếu bạn cần sử dụng các tính năng JavaScript của Bootstrap

// theme cho quill
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import viLocale from '@/locales/viLocale'
/* import prime vue lib */
import PrimeVue from 'primevue/config'

// toast for prime vue
import ToastService from 'primevue/toastservice'

//css for prime vue
import 'primevue/resources/themes/aura-light-green/theme.css'
import 'primevue/resources/primevue.min.css' /* Deprecated */
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(PrimeVue, { ripple: true, locale: viLocale })
app.use(ToastService)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
