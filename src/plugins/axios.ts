// src/plugins/axios.ts
import axios, { type AxiosInstance } from 'axios'
import type { App } from 'vue'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

// 1️⃣ Create the *single* instance you want to share
export const http: AxiosInstance = axios.create({
  baseURL: BASE_URL,
})

// 👉 Optionally add interceptors, error handling, auth tokens, etc.
http.interceptors.request.use((config) => {
  // example: add a token header if you have one
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default {
  install(app: App) {
    // <-- Vue 3 plugin interface
    // expose it as $http on every component instance
    app.config.globalProperties.$http = http

    // optional: also make it available via inject()
    app.provide('http', http)
  },
}
