import { useEffect, useState } from 'react'
import NavigationBar from './components/NavigationBar'
import Home from './pages/Home'
import Scrolle from './components/Scrolle'
import About from './pages/About'
import Contact from './pages/Contact'
import Project from './pages/Project/Project'
import WaterPage from './pages/Home/WaterPage'
import CardContainer from './components/CardContainer.jsx'
import './App.css'

function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const moveCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', moveCursor)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
    }
  }, [])

  return (
    <div className='custom-cursor'>
      <div
        className='cursor-dot'
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />

      <NavigationBar />
      <WaterPage />
      <div id="about">
      <About />
      </div>
      {/*  <Home /> */}
      <div id="project">
      <Project />
      </div>
      <CardContainer />
      <div id="contact">
      <Contact />
      </div>
      
    </div>
  )
}

export default App
