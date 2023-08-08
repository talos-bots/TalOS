import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Sliders, Home, Upload, MessageSquare } from 'lucide-react';
import '../../../src/index.scss';

const NavBar: React.FC = () => {

  return (
    <nav className={`sm:px-16 px-6 w-full flex items-center justify-between py-5 fixed top-0 z-20 bg-black bg-opacity-50`}>
      <div className="flex items-center gap-2">
        <p className="text-white text-[18px] font-bold" >Senaustism</p>
        <p className="text-[#63c5da] text-[10px] font-bold">v0.0.1 alpha</p>
      </div>
      <div className="hidden md:flex gap-5">
        <a aria-label="Home" className={`p-1 transition-all duration-125 ${location.pathname === "/" ? '' : 'hover:opacity-75'}`} href="/">
          <Home style={location.pathname === "/" ? { color: 'white' } : { color: '#c2c2c2' }}/>
        </a>
        <a aria-label="Home" className={`p-1 transition-all duration-125 ${location.pathname === "/characters" ? '' : 'hover:opacity-75'}`} href="/characters">
          <Users style={location.pathname === "/characters" ? { color: 'white' } : { color: '#c2c2c2' }}/>
        </a>
        <a aria-label="Home" className={`p-1 transition-all duration-125 ${location.pathname === "/settings" ? '' : 'hover:opacity-75'}`} href="/settings">
          <Sliders style={location.pathname === "/settings" ? { color: 'white' } : { color: '#c2c2c2' }}/>
        </a>
        <a aria-label="Chat" className={`p-1 transition-all duration-125 ${location.pathname === "/chat" ? '' : 'hover:opacity-75'}`} href="/chat">
          <MessageSquare style={location.pathname === "/chat" ? { color: 'white' } : { color: '#c2c2c2' }}/>
        </a>
      </div>
    </nav>
  );
};

export default NavBar;
