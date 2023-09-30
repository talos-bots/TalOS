import React, { useState } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { HomeIcon, MessageCircle, Cog, Sparkles, Users, Bot, User, Book, File, Text, MoreHorizontalIcon, Menu, Paperclip } from 'lucide-react';
import Clock from '../clock';

const NavBar: React.FC = () => {
	const location = useLocation();

	return (
		<nav className={`sm:px-16 px-4 w-full flex items-center justify-between py-5 fixed top-0 z-20 bg-theme-root bg-opacity-50 backdrop-blur-xl border-b-theme-border-width border-b-theme-border theme-border-style`}>
			<div className="flex items-center gap-2" id='titleBar'>
				<p className="text-theme-text text-[18px] font-bold">Tal<span className="text-theme-flavor-text">OS</span> - AI Sandbox</p>
				<Clock/>
			</div>
			<div className="hidden md:flex gap-5">
				<NavLink to="/" title="Home" className={`p-1 transition-all duration-125 hover:opacity-50`} >
					<HomeIcon style={location.pathname === "/" ? { color: 'text-theme-italic' } : { color: 'text-theme-text' }} size={'1.5rem'}/>
				</NavLink>
				<Dropdown 
					icon={  
					<NavLink to="/chat" title="Chat" className={`p-1 transition-all duration-125 hover:opacity-50`} >
						<MessageCircle style={location.pathname === "/chat" ? { color: 'text-theme-italic' } : { color: 'text-theme-text' }} size={'1.5rem'}/>
					</NavLink>
				}>
					<NavLink to="/users" title="User Profiles" className={`p-1 transition-all duration-125 hover:opacity-50`}>
						<User style={location.pathname === "/users" ? { color: 'text-theme-italic' } : { color: 'text-theme-text' }} size={'1.5rem'}/>
					</NavLink>
					<NavLink to="/lorebooks" title="Lorebooks" className={`p-1 transition-all duration-125 hover:opacity-50`}>
						<Book style={location.pathname === "/lorebooks" ? { color: 'text-theme-italic' } : { color: 'text-theme-text' }} size={'1.5rem'}/>
					</NavLink>
				</Dropdown>
				<Dropdown
					icon={				
					<NavLink to="/constructs" title="Constructs" className={`p-1 transition-all duration-125 hover:opacity-50`}>
						<Users style={location.pathname === "/constructs" ? { color: 'text-theme-italic' } : { color: 'text-theme-text' }} id='constructsPage' size={'1.5rem'}/>
					</NavLink>
				}>
					<NavLink to="/discord" title="Discord Bot" className={`p-1 transition-all duration-125 hover:opacity-50`} >
						<Bot style={location.pathname === "/discord" ? { color: 'text-theme-italic' } : { color: 'text-theme-text' }} size={'1.5rem'}/>
					</NavLink>
				</Dropdown>
				{/* <NavLink to="/completions" title="Completions" className={`p-1 transition-all duration-125 hover:opacity-50`}>
				<Text style={location.pathname === "/completions" ? { color: 'text-theme-italic' } : { color: 'text-theme-text' }}/>
				</NavLink> */}
				<Dropdown 
					icon={<Menu size={'2rem'} className={`p-1 transition-all duration-125 hover:opacity-50`}/>}
					title="Utilities"
				>
					<NavLink to="/attachments" title="Attachments" className={`p-1 transition-all duration-125 hover:opacity-50`}>
						<Paperclip style={location.pathname === "/attachments" ? { color: 'text-theme-italic' } : { color: 'text-theme-text' }} size={'1.5rem'}/>
					</NavLink>
					<NavLink to="/zero" title="Zero" className={`p-1 transition-all duration-125 hover:opacity-50`}>
						<Sparkles style={location.pathname === "/zero" ? { color: 'text-theme-italic' } : { color: 'text-theme-text' }} size={'1.5rem'}/>
					</NavLink>
				</Dropdown>
				<NavLink to="/settings" title="Settings" className={`p-1 transition-all duration-125 hover:opacity-50`}>
					<Cog style={location.pathname === "/settings" ? { color: 'text-theme-italic' } : { color: 'text-theme-text' }} size={'1.5rem'}/>
				</NavLink>
			</div>
		</nav>
	);
};

interface DropdownProps {
	children: React.ReactNode;
	icon?: React.ReactNode;
	title?: string;
	className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ children, icon, title, className }) => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div className="relative flex justify-center">
			<button onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}  className='flex flex-col justify-center items-center' title={title} >
			{icon}
			</button>

			{isOpen && (
			<div className={"absolute mt-8 w-fit h-fit z-50 themed-root " + className} onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
				{children}
			</div>
			)}
		</div>
	);
};


export default NavBar;