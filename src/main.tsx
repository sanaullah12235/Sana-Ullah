import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.tsx'

/* Signals to the stylesheet that scripted animation is available, so reveal
   targets can start hidden without ever leaving content invisible if the
   bundle fails to run. */
document.documentElement.classList.add('js', 'js-mesh')

const root = document.getElementById('root')

if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
