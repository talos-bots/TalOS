import React from 'react';
import { Link, useLocation, NavLink } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { HomeIcon, MessageCircle, Cog, Sparkles, Users, Bot } from 'lucide-react';

const NavBar: React.FC = () => {

  const location = useLocation();

  return (
  <nav className={`sm:px-16 px-6 w-full flex items-center justify-between py-5 fixed top-0 z-20 bg-black bg-opacity-50 backdrop-blur-xl`}>
    <div className="flex items-center gap-2">
      <p className="text-white text-[18px] font-bold">Construct<span className="text-theme-flavor-text">OS</span> - AI Agent Manager</p>
    </div>
    <div className="hidden md:flex gap-5">
      <NavLink to="/" title="Home" className={`p-1 transition-all duration-125 hover:opacity-25`} >
        <HomeIcon style={location.pathname === "/" ? { color: 'white' } : { color: '#c2c2c2' }}/>
      </NavLink>
      <NavLink to="/chat" title="Chat" className={`p-1 transition-all duration-125 hover:opacity-25`} >
        <MessageCircle style={location.pathname === "/chat" ? { color: 'white' } : { color: '#c2c2c2' }}/>
      </NavLink>
      <NavLink to="/constructs" title="Constructs" className={`p-1 transition-all duration-125 hover:opacity-25`} >
        <Users style={location.pathname === "/constructs" ? { color: 'white' } : { color: '#c2c2c2' }}/>
      </NavLink>
      <NavLink to="/discord" title="Discord Bot" className={`p-1 transition-all duration-125 hover:opacity-25`} >
        <Bot style={location.pathname === "/discord" ? { color: 'white' } : { color: '#c2c2c2' }}/>
      </NavLink>
      <NavLink to="/settings" title="Settings" className={`p-1 transition-all duration-125 hover:opacity-25`}>
        <Cog style={location.pathname === "/settings" ? { color: 'white' } : { color: '#c2c2c2' }}/>
      </NavLink>
      <HashLink to="/nodes" title="Nodes" className={`p-1 transition-all duration-125 hover:opacity-25`}>
        <Sparkles style={location.hash === "/nodes" ? { color: 'white' } : { color: '#c2c2c2' }} />
      </HashLink>
      
    </div>
  </nav>
  
  );
};

export default NavBar;