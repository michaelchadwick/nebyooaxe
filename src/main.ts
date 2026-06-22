import './assets/css/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axiosCustomPlugin from '@/plugins/axios'
import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faGear, faQuestion } from '@fortawesome/free-solid-svg-icons'

library.add(faGear, faQuestion)

const app = createApp(App).component('font-awesome-icon', FontAwesomeIcon)

app.use(createPinia())
app.use(axiosCustomPlugin)
app.mount('#app')
