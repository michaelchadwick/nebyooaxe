import './assets/css/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persistedstate'
import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faGear, faQuestion } from '@fortawesome/free-solid-svg-icons'

library.add(faGear, faQuestion)

const pinia = createPinia()
pinia.use(piniaPersist)

createApp(App).component('font-awesome-icon', FontAwesomeIcon).use(pinia).mount('#app')
