import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Layout({ showNavbar }) {
  console.log("Layout"+showNavbar);
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {showNavbar && <Navbar />}
      <div className="pt-16">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
