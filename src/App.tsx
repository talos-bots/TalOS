import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { DiscordListeners } from './listeners/discord-listeners';
import ActionsPage from './pages/actions';
import ChatPage from './pages/chat';
import DocsPage from './pages/docs';
import DevPanel from './components/dev-panel';
import NavBar from './components/shared/NavBar';
import SettingsPage from './pages/settings';
import ConstructManagement from './components/construct-crud';
import ZeroPage from './pages/zero';
import { useEffect, useState } from 'react';
import MenuThemeLoader from './components/menu-theme-loader';
import ConstructsPage from './pages/constructs';

function App() {
  const [needsReload, setNeedsReload] = useState(false);
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
      <MenuThemeLoader needsReload setNeedsReload={setNeedsReload}/>
      <DiscordListeners/>
      <NavBar />
      <div className='main-content'>
      <Routes>
        <Route path='/*' element={<></>} />
        <Route path='/actions' element={<ActionsPage/>} />
        <Route path='/constructs' element={<ConstructsPage/>} />
        <Route path='/constructs/:id' element={<ConstructManagement/>} />
        <Route path='/constructs/new' element={<ConstructManagement/>} />
        <Route path='/chat' element={<ChatPage/>} />
        <Route path='/docs' element={<DocsPage/>} />
        <Route path='/settings' element={<SettingsPage/>} />
        <Route path='/zero' element={<ZeroPage/>} />
      </Routes>
      </div>
      {isDev ? <DevPanel /> : null}
    </Router>
    </div>
  )
}

export default App;
