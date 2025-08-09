import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import InitTable from "./InitTable.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <header className="App-header">
          header
      </header>
        <nav className="App-nav">
            nav
        </nav>
        <body>
        <div className="App-body">
            <InitTable name = "bob"></InitTable>
            <div></div>
            <InitTable name = "joe"></InitTable>
        </div>

        </body>
        <footer className="App-footer">
            feet
        </footer>
    </>
  )
}

export default App
