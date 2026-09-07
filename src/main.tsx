import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import {
  BrowserRouter,
} from 'react-router-dom'

import {
  Toaster,
} from 'sonner'

import './index.css'

import App from './App'

import {
  AuthProvider,
} from './context/AuthContext'

import StorageSync from './components/StorageSync'

createRoot(
  document.getElementById(
    'root',
  )!,
).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <StorageSync />

        <App />

        <Toaster
          position="top-center"
          richColors
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)