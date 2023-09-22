import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { DiscordListeners } from './listeners/discord-listeners';
import { useEffect, useState } from 'react';
import { ipcMain, ipcRenderer } from 'electron';
import { Steps, Hints } from 'intro.js-react';
import { getStorageValue, setStorageValue } from './api/dbapi';
import { getDefaultCharactersFromPublic } from './api/extrasapi';
import HomePage from './pages/home';
import LorebooksPage from './pages/lorebooks';
import AttachmentsPage from './pages/attachments';
import CompletionsPage from './pages/completions';
import UserPage from './pages/users';
import DiscordPage from './pages/discord';
import MenuThemeLoader from './components/menu-theme-loader';
import ConstructsPage from './pages/constructs';
import ChatPage from './pages/chat/';
import SettingsPage from './pages/settings';
import ConstructManagement from './components/construct-crud';
import ZeroPage from './pages/zero';
import DevPanel from './components/dev-panel';
import NavBar from './components/shared/NavBar';
import { sendDesktopNotification } from './components/desktop-notification';
import axios from 'axios';

export const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
  e.preventDefault();
  ipcRenderer.send('open-external-url', url);
};

export const loadModels = async () => {
  return axios.post('/api/models/load').then((response) => {
    sendDesktopNotification('ConstructOS', 'Models Loaded');
  }).catch((err) => {
    console.error(err);
  });
}

function App() {
  const [needsReload, setNeedsReload] = useState(false);
  const [doneTutorial, setDoneTutorial] = useState(true);
  const [isFirstRun, setIsFirstRun] = useState(false);

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
    getStorageValue('isFirstRun').then((value) => {
      if(value === null) {
        setIsFirstRun(true);
      }else{
        let hasTrue = value === 'true';
        setIsFirstRun(hasTrue);
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

  useEffect(() => {
    if(isFirstRun) {
      getDefaultCharactersFromPublic();
      setStorageValue('isFirstRun', 'false');
      setIsFirstRun(false);
      loadModels();
    }
  }, [isFirstRun]);

  return (
    <div id='App'>
      <Router>
        <MenuThemeLoader needsReload setNeedsReload={setNeedsReload}/>
        <NavBar />
        <div className='main-content'>
          <Routes>
            <Route path='/*' element={<HomePage/>} />
            <Route path='/constructs' element={<ConstructsPage/>} />
            <Route path='/constructs/:id' element={<ConstructManagement/>} />
            <Route path='/constructs/new' element={<ConstructManagement/>} />
            <Route path='/chat' element={<ChatPage />} />
            <Route path='/chat/:id' element={<ChatPage />} />
            <Route path='/discord' element={<DiscordPage/>} />
            <Route path='/settings' element={<SettingsPage/>} />
            <Route path='/zero' element={<ZeroPage/>} />
            <Route path='/users' element={<UserPage/>} />
            <Route path='/lorebooks' element={<LorebooksPage/>} />
            <Route path='/attachments' element={<AttachmentsPage/>} />
            <Route path='/completions' element={<CompletionsPage/>} />
          </Routes>
        </div>
        {/* {isDev ? <DevPanel /> : null} */}
        <Steps
          initialStep={0}
          enabled={!doneTutorial}
          steps={[
            {
              title: 'Welcome to ConstructOS!',
              tooltipClass: 'introJs-custom-box',
              element: '#titlePage',
              intro: 'This is the main menu. From here you can access all of the features of ConstructOS. You can also access this menu at any time by pressing the Home button in the top right corner of the screen.',
            },
            {
              title: 'Viewing Constructs',
              tooltipClass: 'introJs-custom-box',
              element: '#constructsPage',
              intro: 'Click here to view all of your Constructs. You can also add a new Construct from this page.',
            },
            {
              title: 'Add a Construct',
              tooltipClass: 'introJs-custom-box',
              element: '#newConstruct',
              intro: 'Click here to add a new Construct.',
            },
            {
              title: 'Import a Character Card',
              tooltipClass: 'introJs-custom-box',
              element: '#importCard',
              intro: 'You can import a character card in both V1 (Tavern) and V2 formats. This will automatically add the Construct to your list.',
            }
          ]}
          onAfterChange={(e) => {if(e === 1) {window.location.hash = '/constructs';}}}
          onChange={(e) => {}}
          onStart={() => {setDoneTutorial(false); setStorageValue('doneTutorial', 'false'); window.location.hash = '/';}}
          onExit={() => {setDoneTutorial(true); setStorageValue('doneTutorial', 'true');}}
        />
      </Router>
    </div>
  )
}

export default App;
