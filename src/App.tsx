import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react'
import ChatNavBar from './components/shared/NavBar';
import './App.scss'
import { ConstructOS } from './components/constructOS';
import { DiscordListeners } from './listeners/discord-listeners';
import AgentsPage from './pages/agents';
import ActionsPage from './pages/actions';
import SettingsPage from './pages/settings';
import DocsPage from './pages/docs';
import DevPanel from './components/dev-panel';

console.log('[App.tsx]', `Hello world from Electron ${process.versions.electron}!`)

function App() {
  const isDev = process.env.NODE_ENV === 'development';
  return (
  <div className='App'>
    <Router>
      <DiscordListeners/>
      <ChatNavBar/>
      <Routes>
        <Route path='/*' element={<></>} />
        <Route path='/terminal' element={<ConstructOS/>} />
        <Route path='/agents' element={<AgentsPage/>} />
        <Route path='/actions' element={<ActionsPage/>} />
        <Route path='/settings' element={<SettingsPage/>} />
        <Route path='/docs' element={<DocsPage/>} />
      </Routes>
      {isDev ? <DevPanel /> : null}
    </Router>
  </div>
  )
}

export default App
