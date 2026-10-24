import axios from 'axios'

const envBaseUrl = import.meta.env.VITE_ENGINE_API_BASE_URL?.trim()
// Production images serve the API from the same origin under /api (see nginx.conf)
const fallbackBaseUrl = import.meta.env.DEV ? '/engine-api' : '/api'

const baseURL = envBaseUrl && envBaseUrl.length > 0 ? envBaseUrl : fallbackBaseUrl

export const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response
      error.message = `API ${status}: ${typeof data === 'string' ? data : error.message}`
    }

    return Promise.reject(error)
  },
)
