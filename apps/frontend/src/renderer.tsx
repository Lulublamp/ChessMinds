import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import ClientApi from '@TRPI/client/electron/preload'
import { WindowContext }  from './contexts/WindowContext'


let container: HTMLElement | null = null
export const MainRenderer = (root: HTMLElement , windowContext: ClientApi | null) => {  
    if (!container) {
      let clientOrWeb = 'MainRenderer in @TRPI/frontend :'
      clientOrWeb += windowContext ? ' Client side use' : ' Frontend side use'
      console.log(clientOrWeb)
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