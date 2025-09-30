import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import { AppProviders } from './providers/AppProviders.tsx'
import './index.css'

const container = document.getElementById('root')

if (!container) {
  throw new Error('Root element `#root` not found in DOM')
}

createRoot(container).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
)
