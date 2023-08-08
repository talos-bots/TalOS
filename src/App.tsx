import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react'
import './App.scss'
import { ConstructOS } from './components/constructOS';

console.log('[App.tsx]', `Hello world from Electron ${process.versions.electron}!`)

function App() {
  return (
    <Router>
    <div className='App'>
      <Routes>
        <Route path='/' element={<ConstructOS/>} />
        <Route path='/*' element={<></>} />
      </Routes>
    </div>
  </Router>
  )
}

export default App
