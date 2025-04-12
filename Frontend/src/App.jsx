import { useState } from 'react'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  const [showNavbar, setShowNavbar] = useState(false)

  return (
    <Router>
      {/* Navbar always rendered, but controlled by showNavbar */}
      <Navbar show={showNavbar} />

      <Routes>
        <Route path='/' element={<Hero onFinish={() => setShowNavbar(true)} />} />
        {/* Add more routes here */}
      </Routes>
    </Router>
  )
}

export default App
