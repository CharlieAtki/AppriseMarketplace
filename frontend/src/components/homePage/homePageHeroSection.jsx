
import { useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Rocket, Globe, LineChart, LogIn } from 'lucide-react';


const navigation = [
  { name: 'Product', href: '#' },
  { name: 'Features', href: '#' },
  { name: 'Marketplace', href: '/marketplace' },
  { name: 'Company', href: '#' }
];

const HomePageHeroSection = () => {
      const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="relative min-h-screen">
            {/* Background image container */}
            <div className="absolute inset-0 z-0 bg-cover bg-center filter blur-3xl"
                 style={{
                     backgroundImage: 'url(https://res.cloudinary.com/dtjcj2krm/image/upload/t_gradientBGImage/v1739967855/Screenshot_2025-02-19_at_12.23.51_kpvtgl.png)',
                     backgroundSize: '110%' // Increase the size to zoom in
                 }}></div>


            <header className="absolute inset-x-0 top-0 z-50">
                <nav className="flex items-center justify-between p-6 lg:px-8">
                    <div className="flex lg:flex-1">
                        <a href="#" className="text-lg font-semibold text-gray-900">Brand</a>
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
                        <a href="#" className="text-sm font-semibold text-gray-900">
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
                <div className="bg-white/70 p-4 rounded-lg shadow-lg">
                    <p className="text-sm text-gray-600">
                        Announcing our next round of funding. <a href="#" className="text-indigo-600 font-semibold">Read
                        more →</a>
                    </p>
                </div>
                <h1 className="mt-6 text-5xl font-bold text-gray-900 sm:text-7xl">
                    Data to enrich your online business
                </h1>
                <p className="mt-6 text-lg text-gray-600">
                    Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.
                </p>
                <div className="mt-8 flex items-center space-x-4">
                    <button
                        className="bg-indigo-600 text-white px-5 py-3 text-sm font-semibold rounded-md shadow-md hover:bg-indigo-500">
                        Get started
                    </button>
                    <a href="#" className="text-sm font-semibold text-gray-900">Learn more →</a>
                </div>
            </div>
        </div>
    );
};

export default HomePageHeroSection;