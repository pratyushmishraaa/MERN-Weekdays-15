// import React from 'react'
import Navbar from "./Navbar"
import {Routes ,Route} from "react-router-dom"
import Home from "./Home"
import About from "./About"
import Contact from "./Contact"

const App = () => {
  return (
    <div>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      {/* <Route path ="services" element={<Services />} /> */}
    </Routes>
      
    </div>
  )
}

export default App
