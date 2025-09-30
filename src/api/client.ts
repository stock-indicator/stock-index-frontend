import axios from 'axios'

const envBaseUrl = import.meta.env.VITE_ENGINE_API_BASE_URL?.trim()
const fallbackBaseUrl = import.meta.env.DEV ? '/engine-api' : 'http://localhost:8000'

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
