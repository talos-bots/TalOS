import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react'
import ChatNavBar from './components/shared/NavBar';
import './App.scss'
import { ConstructOS } from './components/constructOS';
import { DiscordListeners } from './listeners/discord-listeners';

console.log('[App.tsx]', `Hello world from Electron ${process.versions.electron}!`)

function App() {
  return (
  <div className='App'>
    <DiscordListeners/>
    <ChatNavBar />
    <Router>
      <Routes>
        <Route path='/*' element={<></>} />
        <Route path='/terminal' element={<ConstructOS/>} />
      </Routes>
  </Router>
  </div>
  )
}

export default App
