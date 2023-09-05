import React from 'react';
import { Link, useLocation, NavLink } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { HomeIcon, MessageCircle, Cog, Sparkles, Users, Bot, User, Book } from 'lucide-react';

const NavBar: React.FC = () => {

  const location = useLocation();

  return (
  <nav className={`sm:px-16 px-6 w-full flex items-center justify-between py-5 fixed top-0 z-20 bg-theme-box bg-opacity-50 backdrop-blur-xl border-b-theme-border-width border-b-theme-border theme-border-style`}>
    <div className="flex items-center gap-2" id='titleBar'>
      <p className="text-theme-text text-[18px] font-bold">Construct<span className="text-theme-flavor-text">OS</span> - AI Agent Manager</p>
    </div>
    <div className="hidden md:flex gap-5">
      <NavLink to="/" title="Home" className={`p-1 transition-all duration-125 hover:opacity-50`} >
        <HomeIcon style={location.pathname === "/" ? { color: 'text-theme-italic' } : { color: 'text-theme-text' }}/>
      </NavLink>
      <NavLink to="/chat" title="Chat" className={`p-1 transition-all duration-125 hover:opacity-50`} >
        <MessageCircle style={location.pathname === "/chat" ? { color: 'text-theme-italic' } : { color: 'text-theme-text' }}/>
      </NavLink>
      <NavLink to="/constructs" title="Constructs" className={`p-1 transition-all duration-125 hover:opacity-50`}>
        <Users style={location.pathname === "/constructs" ? { color: 'text-theme-italic' } : { color: 'text-theme-text' }} id='constructsPage'/>
      </NavLink>
      <NavLink to="/lorebooks" title="Lorebooks" className={`p-1 transition-all duration-125 hover:opacity-50`}>
        <Book style={location.pathname === "/lorebooks" ? { color: 'text-theme-italic' } : { color: 'text-theme-text' }}/>
      </NavLink>
      <NavLink to="/discord" title="Discord Bot" className={`p-1 transition-all duration-125 hover:opacity-50`} >
        <Bot style={location.pathname === "/discord" ? { color: 'text-theme-italic' } : { color: 'text-theme-text' }}/>
      </NavLink>
      <NavLink to="/users" title="User Profiles" className={`p-1 transition-all duration-125 hover:opacity-50`}>
        <User style={location.pathname === "/users" ? { color: 'text-theme-italic' } : { color: 'text-theme-text' }}/>
      </NavLink>
      <NavLink to="/settings" title="Settings" className={`p-1 transition-all duration-125 hover:opacity-50`}>
        <Cog style={location.pathname === "/settings" ? { color: 'text-theme-italic' } : { color: 'text-theme-text' }}/>
      </NavLink>
      {/* <HashLink to="/nodes" title="Nodes" className={`p-1 transition-all duration-125 hover:opacity-25`}>
        <Sparkles style={location.hash === "/nodes" ? { color: 'white' } : { color: '#c2c2c2' }} />
      </HashLink> */}
    </div>
  </nav>
  
  );
};

export default NavBar;