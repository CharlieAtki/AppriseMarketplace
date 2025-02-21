import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomePageHeroSection from "../../components/landing/homePageHeroSection";
import AboutPageHeroSection from "../../components/landing/aboutPageHeroSection";
import InfoModal from "../../components/landing/infoModal";

// Function for calculating when the components should load into view
const useInView = (options = {}, once = true) => {
    const [isInView, setIsInView] = useState(false);
    const elementRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsInView(true);
                if (once && elementRef.current) {
                    observer.unobserve(elementRef.current);
                }
            } else if (!once) {
                setIsInView(false);
            }
        }, { threshold: 0.2, ...options });

        const currentElement = elementRef.current;
        if (currentElement) {
            observer.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                observer.unobserve(currentElement);
            }
        };
    }, [options, once]);

    return [elementRef, isInView];
};

const AboutPage = () => {
    const navigate = useNavigate();

    const [scrollProgress, setScrollProgress] = useState(0);
    const [scrollVisible, setScrollVisible] = useState(false);
    const [heroRef, heroInView] = useInView({ threshold: 0.1 });
    const [contentRef, contentInView] = useInView({ threshold: 0.2 });

    // Handle scroll progress and button visibility
    useEffect(() => {
        const handleScroll = () => {
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            setScrollProgress(scrolled);
            setScrollVisible(winScroll > 500);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <main className="relative min-h-screen">
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 z-50">
                <div
                    className="h-full bg-indigo-600 transition-all duration-150 ease-out"
                    style={{width: `${scrollProgress}%`}}
                />
            </div>

            <InfoModal />

            {/* Hero Section */}
            <section
                ref={heroRef}
                className={`relative flex flex-col items-center justify-center min-h-screen text-center px-6 z-10 transition-all duration-700 ease-out 
                    ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
                <div className="absolute inset-0 z-0 bg-cover bg-center"
                     style={{backgroundImage: 'url(https://res.cloudinary.com/dtjcj2krm/image/upload/v1739969615/Screenshot_2025-02-19_at_12.23.51_kpvtgl.png)'}}>
                </div>
                \
                {/* Hero Section */}
                <section
                    ref={heroRef}
                    className={`w-full transition-all duration-700 ease-out
                        ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                >
                    <AboutPageHeroSection navigation={[
                        {name: 'Home', href: '/'},
                        {name: 'Marketplace', href: '/marketplace'},
                    ]}/>
                </section>
            </section>

            {/* About Content */}
            <section
                ref={contentRef}
                className={`max-w-6xl mx-auto px-6 sm:px-12 lg:px-24 py-16 transition-all duration-700 ease-out 
                ${contentInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
                <h2 className="text-4xl font-semibold text-gray-900 text-center">About This Project</h2>
                <p className="mt-6 text-lg text-gray-700 text-center">
                    This application is a personal project created for educational purposes only. It serves as a
                    demonstration
                    of my technical capabilities in web development. Please note that this is not an operational
                    business,
                    and no real transactions or bookings can be made through this platform.
                </p>

                <h2 className="mt-16 text-4xl font-semibold text-gray-900 text-center">Project Overview</h2>
                <ul className="mt-6 space-y-4 text-lg text-gray-700 text-center">
                    <li>✅ Built as a showcase of technical skills in web development</li>
                    <li>✅ No financial transactions or real bookings available</li>
                    <li>✅ Designed to illustrate UI/UX and functional implementation</li>
                    <li>✅ Open for feedback and inquiries about the project</li>
                </ul>

                <div className="mt-12 flex justify-center">
                    <button
                        onClick={() => navigate('/marketplace')}
                        className="bg-indigo-600 text-white px-5 py-3 text-lg font-semibold rounded-md shadow-md hover:bg-indigo-500"
                    >
                        View Demo
                    </button>
                </div>
            </section>
        </main>
    );
};

export default AboutPage;