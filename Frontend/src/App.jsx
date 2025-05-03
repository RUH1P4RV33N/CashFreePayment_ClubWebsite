import { useState } from 'react'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Hero from './components/Hero'
import Payment from './pages/Payment.jsx'
import Layout from './pages/Layout'

function App() {
  const [showNavbar, setShowNavbar] = useState(false)

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout showNavbar={true} />}>
        <Route index element={<Hero onFinish={() =>{ setShowNavbar(true); console.log(showNavbar); }} />} />
        <Route path="/payment" element={<Payment />} />
      </Route>
    )
  )

  return <RouterProvider router={router} />
}

export default App
