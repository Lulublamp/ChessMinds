import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

let container: HTMLElement | null = null
export const MainRenderer = (root: HTMLElement , windowContext: any) => {  
    if (!container) {
      let clientOrWeb = 'MainRenderer in @TRPI/frontend :'
      clientOrWeb += windowContext ? ' Client side use' : ' Frontend side use'
      console.log(clientOrWeb)
      container = root
      ReactDOM.createRoot(root).render(
        <React.StrictMode>
          <App/>
        </React.StrictMode>,
      )
    }
  }