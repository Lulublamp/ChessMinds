import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {windowContext} from '../../client/src/renderer'

const root = document.getElementById('root') as HTMLElement
let container: HTMLElement | null = null

export const MainRenderer = (root: HTMLElement , windowContext: any) => {  
  if (!container) {
    container = root
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <App/>
      </React.StrictMode>,
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('Je MainRender depuis le front ?')
  MainRenderer(root , null);
})

// MainRenderer(root , null)

