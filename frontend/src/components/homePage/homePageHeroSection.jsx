
import { useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Rocket, Globe, LineChart, LogIn } from 'lucide-react';
import {useNavigate} from "react-router-dom";


const navigation = [
  { name: 'Marketplace', href: '/marketplace' },
];

const HomePageHeroSection = () => {
    const navigate = useNavigate();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="relative min-h-screen">
            {/* Background image container */}
            <div className="absolute inset-0 z-0 bg-cover bg-center filter blur-3xl"
                 style={{
                     backgroundImage: 'url(https://res.cloudinary.com/dtjcj2krm/image/upload/v1739969615/Screenshot_2025-02-19_at_12.23.51_kpvtgl.png)',
                     backgroundSize: '110%' // Increase the size to zoom in
                 }}></div>


            <header className="absolute inset-x-0 top-0 z-50">
                <nav className="flex items-center justify-between p-6 lg:px-8">
                    <div className="flex lg:flex-1">
                        <a href="/" className="group relative block w-fit" aria-label="Go to Homepage">
                            {/* Logo Container */}
                            <div
                                className="relative transition-transform duration-300 group-hover:scale-110 will-change-transform">
                                {/* Background Glow */}
                                <div
                                    className="absolute inset-0 bg-white/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                {/* Logo Wrapper */}
                                <div className="relative bg-white/90 backdrop-blur-md rounded-full p-2 shadow-xl">
                                    <img
                                        src="https://res.cloudinary.com/dtjcj2krm/image/upload/t_1To1/v1740137665/Screenshot_2025-02-21_at_11.19.24_npmcgm.png"
                                        alt="Apprise Logo"
                                        className="h-10 w-auto drop-shadow-md"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="flex lg:hidden">
                        <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-gray-700">
                            <Bars3Icon className="size-6"/>
                        </button>
                    </div>
                    <div className="hidden lg:flex lg:gap-x-12">
                        {navigation.map((item) => (
                            <a key={item.name} href={item.href} className="text-sm font-semibold text-gray-900">
                                {item.name}
                            </a>
                        ))}
                    </div>
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                        <a href='/customerAccountManagement' className="text-sm font-semibold text-gray-900">
                            Log in →
                        </a>
                    </div>
                </nav>
            </header>

            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <DialogPanel className="fixed inset-y-0 right-0 w-full bg-white p-6">
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-700">
                        <XMarkIcon className="size-6"/>
                    </button>
                    <div className="mt-6">
                        {navigation.map((item) => (
                            <a key={item.name} href={item.href}
                               className="block p-2 text-base font-semibold text-gray-900">
                                {item.name}
                            </a>
                        ))}
                        <a href="#" className="block mt-4 p-2 text-base font-semibold text-gray-900">Log in</a>
                    </div>
                </DialogPanel>
            </Dialog>

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
                    <a href='/customerAccountManagement' className="text-sm font-semibold text-gray-900">Explore Stays →</a>
                </div>
            </div>
        </div>
    );
};

export default HomePageHeroSection;