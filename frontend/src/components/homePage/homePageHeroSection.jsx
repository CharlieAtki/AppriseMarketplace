
import { useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import {Rocket, Globe, LineChart, LogIn, X, Menu, Home, Calendar, Settings, DoorOpen} from 'lucide-react';
import {useNavigate} from "react-router-dom";


const navigation = [
  { name: 'Marketplace', href: '/marketplace' },
];

const HomePageHeroSection = () => {
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false); // Manages the menu state
    const [loading, setLoading] = useState(false); // Manages the loading state


    return (
        <div className="relative min-h-screen">
            {/* Background image container */}
            <div className="absolute inset-0 z-0 bg-cover bg-center filter blur-3xl"
                 style={{
                     backgroundImage: 'url(https://res.cloudinary.com/dtjcj2krm/image/upload/v1739969615/Screenshot_2025-02-19_at_12.23.51_kpvtgl.png)',
                     backgroundSize: '110%' // Increase the size to zoom in
                 }}>
            </div>

            <header className="absolute inset-x-0 top-0 z-50">
                <nav className="flex items-center justify-between p-6 lg:px-8">
                    <div className="flex lg:flex-1">
                        {/* Logo */}
                        <a href="/" className="group relative block w-fit" aria-label="Go to Homepage">
                            {/* Logo Container */}
                            <div className="relative transition-transform duration-300 group-hover:scale-110">
                                {/* Soft Glow Effect on Hover */}
                                <div
                                    className="absolute inset-0 bg-indigo-200/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                {/* Logo Wrapper */}
                                <div className="relative bg-white/90 backdrop-blur-md rounded-full p-3 shadow-lg">
                                    <img
                                        src="https://res.cloudinary.com/dtjcj2krm/image/upload/t_1To1/v1740137665/Screenshot_2025-02-21_at_11.19.24_npmcgm.png"
                                        alt="Apprise Logo"
                                        className="h-12 w-12 drop-shadow-md"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </a>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex lg:gap-x-12">
                        {navigation.map((item) => (
                            <a key={item.name} href={item.href} className="text-md font-semibold text-gray-900">
                                {item.name}
                            </a>
                        ))}
                    </div>

                    {/* Desktop Login Button */}
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                        <a href='/customerAccountManagement' className="text-md font-semibold text-gray-900">
                            Log in →
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex justify-end">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="text-indigo-700 focus:outline-none p-2 rounded-md hover:bg-gray-200 transition">
                            {menuOpen ? <X size={32} /> : <Menu size={32} />}
                        </button>

                        {/* Mobile Dropdown Menu */}
                        {menuOpen && (
                            <div className="absolute top-full right-6 mt-2 bg-white shadow-xl rounded-xl border border-gray-200 w-64 z-50 p-4 flex flex-col space-y-4 animate-fade-in">
                                {loading ? (
                                    <p className="text-gray-600 text-center">Loading...</p>
                                ) : (
                                    <>
                                        {navigation.map((item) => (
                                            <a
                                                key={item.name}
                                                href={item.href}
                                                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none flex items-center gap-2">
                                                {item.name}
                                            </a>
                                        ))}

                                        {/* Separator */}
                                        <hr className="border-gray-300 my-2"/>

                                        <a href="/customerAccountManagement" className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none flex items-center gap-2">
                                            Log in →
                                        </a>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </nav>
            </header>

            {/* Content container */}
            <div className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 z-10">
                <h1 className="mt-6 text-5xl font-bold text-gray-900 sm:text-7xl">
                    Find Stays That Feel Like Home
                </h1>
                <p className="mt-6 text-lg text-gray-600">
                    Discover unique places to stay, from cozy apartments to luxury retreats — anywhere in the world.
                </p>
                <div className="mt-8 flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/customerAccountManagement')}
                        className="bg-indigo-600 text-white px-5 py-3 text-sm font-semibold rounded-md shadow-md hover:bg-indigo-500">
                        Get started
                    </button>
                    <a href='/customerAccountManagement' className="text-md font-semibold text-gray-900">Explore Stays
                        →</a>
                </div>
            </div>
        </div>
    );
};

export default HomePageHeroSection;