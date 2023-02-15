import * as React from 'react'
import { useState , FC} from 'react'
import './App.css'
import  ClientApi from '@TRPI/client/electron/preload'

interface IAppProps {
  windowContext: ClientApi | null
}


const App : FC<IAppProps> = ({windowContext} : IAppProps) => {
  const [count, setCount] = useState(0)
  const [communication , setCommunication] = useState('')
  
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