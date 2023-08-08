import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react'
import ChatNavBar from './components/shared/NavBar';
import './App.scss'

console.log('[App.tsx]', `Hello world from Electron ${process.versions.electron}!`)

function App() {
  return (
    <Router>
    <ChatNavBar />
    <div className='App'>
      <Routes>
        <Route path='/' element={<></>} />
        <Route path='/*' element={<></>} />
      </Routes>
    </div>
  </Router>
  )
}

export default App
