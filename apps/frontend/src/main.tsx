import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {windowContext} from '../../client/src/renderer'

const root = document.getElementById('root') as HTMLElement
let container: HTMLElement | null = null

export const MainRenderer = (root: HTMLElement , windowContext: any) => {  
  if (!container) {
    console.log('windowContext', windowContext)
    container = root
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <App/>
      </React.StrictMode>,
    )

  }
}

MainRenderer(root , null)