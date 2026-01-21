import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AleoWalletProvider } from './components/WalletProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AleoWalletProvider>
      <App />
    </AleoWalletProvider>
  </StrictMode>,
)
