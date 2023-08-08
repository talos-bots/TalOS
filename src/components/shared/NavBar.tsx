import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon, MessageCircle, Cog, Sparkles } from 'lucide-react';
import '../../../src/index.scss'; 

const NavBar: React.FC = () => {

  return (
    <nav className={`sm:px-16 px-6 w-full flex items-center justify-between py-5 fixed top-0 z-20 bg-black bg-opacity-50`}>
      <div className="flex items-center gap-2">
        <p className="text-white text-[18px] font-bold">Construct<span className="text-[#00ff00]">OS</span> - AI Agent Manager</p>
      </div>
      <div className="hidden md:flex gap-5">
        <a aria-label="Home" href="#" className="text-white text-[18px] font-bold">
          <HomeIcon size={24} />
        </a>
        <a aria-label="Home" href="#" className="text-white text-[18px] font-bold">
          <MessageCircle size={24} />
        </a>
        <a aria-label="Home" href="#" className="text-white text-[18px] font-bold">
          <Cog size={24} />
        </a>
        <a aria-label="Home" href="#" className="text-white text-[18px] font-bold">
          <Sparkles size={24} />
        </a>
      </div>
    </nav>
  );
};

export default NavBar;
