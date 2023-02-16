import * as React from 'react'
import { useState , FC, useContext} from 'react'
import './App.css'
import  ClientApi from '@TRPI/client/electron/preload'
import {WindowContext} from './contexts/WindowContext'

interface IAppProps {
  windowContext: ClientApi | null
}


const App : FC = () => {
  const [count, setCount] = useState(0)
  const [communication , setCommunication] = useState('')
  
  const windowContext = useContext(WindowContext)
  
  return (
    <div className="App">
      <h1>Projet Integrateur</h1>
      <div className="card">
        <p>
          Pour pouvoir modifier : <code>frontend/src/App.tsx</code>
        </p>
        <button onClick={() => setCount((count) => count + 1)}>
          Simple compteur {count}
        </button>
        <>
          {
            windowContext &&
            <p>
              {windowContext.test}
            </p>
          }
        </>
      </div>
    </div>
  )
}

export default App