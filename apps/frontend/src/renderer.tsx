import React from 'react'
import ReactDOM from 'react-dom/client'
import ClientApi from '@TRPI/client/electron/preload'
import App from './App'
import './index.css'
import { WindowContext }  from './contexts/ContextProviders'



let container: HTMLElement | null = null
export const MainRenderer = (root: HTMLElement , windowContext: ClientApi | null) => {  
    if (!container) {
      container = root
      ReactDOM.createRoot(root).render(
        <WindowContext.Provider value={windowContext}>
          <React.StrictMode>
            <App/>
          </React.StrictMode>
        </WindowContext.Provider >
      )
    }
  }