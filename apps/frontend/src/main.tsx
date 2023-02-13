import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

const root = document.getElementById('root') as HTMLElement
let container: HTMLElement | null = null

export const MainRenderer = (root: HTMLElement) => {  
  if (!container) {
    container = root
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )

  }
}

MainRenderer(root)