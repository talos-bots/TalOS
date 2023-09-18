import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.scss'
import 'intro.js/introjs.css';
import { ThemeProvider } from '@material-tailwind/react'

function Main() {
  useEffect(() => {
    const loadingElement = document.getElementById('actual-loading');
    if (loadingElement) {
      loadingElement.style.visibility = 'hidden';
    }
  }, []);

  return (
    <React.StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<Main />);

window.addEventListener('resize', function() {
  document.documentElement.style.fontSize = window.innerWidth / 150 + 'px';
});