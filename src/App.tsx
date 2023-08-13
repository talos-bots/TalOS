import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { DiscordListeners } from './listeners/discord-listeners';
import AgentsPage from './pages/agents';
import ActionsPage from './pages/actions';
import ChatPage from './pages/chat';
import DocsPage from './pages/docs';
import DevPanel from './components/dev-panel';
import NavBar from './components/shared/NavBar';
import SettingsPage from './pages/settings';
import AgentManagement from './components/agent-crud';
import { useEffect } from 'react';

function App() {
  const greenTheme = {
    bgImage: "/backgrounds/bluedefault.svg",
    bgColor: "lime-200",
    borderColor: "lime-200",
  };

  const selectedTheme = greenTheme;
  
  const returnToMenu = () => {
    history.back();
  }

  useEffect(() => {
      const closeOnEscapeKey = (e: { key: string; }) => e.key === "Escape" ? returnToMenu() : null;
      document.body.addEventListener("keydown", closeOnEscapeKey);
      return () => {
          document.body.removeEventListener("keydown", closeOnEscapeKey);
      };
  }, []);
  
  const isDev = process.env.NODE_ENV === 'development';
  return (
    <div id='App'>
    <Router>
      <DiscordListeners/>
      <NavBar />
      <div className='main-content'>
      <Routes>
        <Route path='/*' element={<></>} />
        <Route path='/actions' element={<ActionsPage/>} />
        <Route path='/agents' element={<AgentsPage/>} />
        <Route path='/agents/:id' element={<AgentManagement/>} />
        <Route path='/agents/new' element={<AgentManagement/>} />
        <Route path='/chat' element={<ChatPage/>} />
        <Route path='/docs' element={<DocsPage/>} />
        <Route path='/settings' element={<SettingsPage/>} />
      </Routes>
      </div>
      {isDev ? <DevPanel /> : null}
    </Router>
    </div>
  )
}

export default App
