import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { DiscordListeners } from './listeners/discord-listeners';
import ChatPage from './pages/chat/';
import DevPanel from './components/dev-panel';
import NavBar from './components/shared/NavBar';
import SettingsPage from './pages/settings';
import ConstructManagement from './components/construct-crud';
import ZeroPage from './pages/zero';
import { useEffect, useState } from 'react';
import MenuThemeLoader from './components/menu-theme-loader';
import ConstructsPage from './pages/constructs';
import DiscordPage from './pages/discord';
import { ipcRenderer } from 'electron';
import UserPage from './pages/users';
import { Steps, Hints } from 'intro.js-react';
import { getStorageValue, setStorageValue } from './api/dbapi';

export const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
  e.preventDefault();
  ipcRenderer.send('open-external-url', url);
};

function App() {
  const [needsReload, setNeedsReload] = useState(false);
  const [doneTutorial, setDoneTutorial] = useState(true);

  const returnToMenu = () => {
    history.back();
  }

  useEffect(() => {
    DiscordListeners();
    getStorageValue('doneTutorial').then((value) => {
      if(value === null) {
        setDoneTutorial(false);
      }else{
        let hasTrue = value === 'true';
        setDoneTutorial(hasTrue);
      }
    });
  }, []);

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
      <NavBar />
      <div className='main-content'>
      <Routes>
        <Route path='/*' element={<></>} />
        <Route path='/constructs' element={<ConstructsPage/>} />
        <Route path='/constructs/:id' element={<ConstructManagement/>} />
        <Route path='/constructs/new' element={<ConstructManagement/>} />
        <Route path='/chat' element={<ChatPage />} />
        <Route path='/chat/:id' element={<ChatPage />} />
        <Route path='/discord' element={<DiscordPage/>} />
        <Route path='/settings' element={<SettingsPage/>} />
        <Route path='/zero' element={<ZeroPage/>} />
        <Route path='/users' element={<UserPage/>} />
      </Routes>
      </div>
      {isDev ? <DevPanel /> : null}
      <Steps
        initialStep={0}
        enabled={!doneTutorial}
        steps={[
          {
            title: 'Welcome to ConstructOS!',
            element: '#titleBar',
            intro: 'This is the main menu. From here you can access all of the features of ConstructOS. You can also access this menu at any time by pressing the Home button in the top right corner of the screen.',
          }
        ]}
        onExit={() => {setDoneTutorial(true); setStorageValue('doneTutorial', 'true');}}
      />
    </Router>
    </div>
  )
}

export default App;
