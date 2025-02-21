import React, { useEffect, useRef, useState } from 'react';
import HomePageCommentSection from "../../components/landing/homePageCommentSection";
import HomePageBentoGrid from "../../components/landing/homePageBentoGrid";
import HomePageHeroSection from "../../components/landing/homePageHeroSection";
import HomePageStayInspired from "../../components/landing/homePageStayInspired";
import HomePageFAQ from "../../components/landing/homePageFAQ";
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

const LandingPage = () => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [scrollVisible, setScrollVisible] = useState(false);
    const [heroRef, heroInView] = useInView({ threshold: 0.1 });
    const [bentoRef, bentoInView] = useInView({ threshold: 0.2 });
    const [commentRef, commentInView] = useInView({ threshold: 0.2 });
    const [faqRef, faqInView] = useInView({ threshold: 0.2 });
    const [inspiredRef, inspiredInView] = useInView({ threshold: 0.2 });
    const [isBannerVisible, setIsBannerVisible] = useState(true); // State to control the visibility of the banner

    // Handle scroll progress and button visibility
    useEffect(() => {
        const handleScroll = () => {
            // Calculate scroll progress
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
            {/* Info Banner */}
            {isBannerVisible && <InfoModal onClose={() => setIsBannerVisible(false)} />}

            {/* Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 z-60">
                <div
                    className="h-full bg-indigo-600 transition-all duration-150 ease-out"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            {/* Hero Section */}
            <section
                ref={heroRef}
                className={`w-full transition-all duration-700 ease-out ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ marginTop: isBannerVisible ? '80px' : '0' }}
            >
                <HomePageHeroSection navigation={[
                    { name: 'About', href: '/about' },
                    { name: 'Marketplace', href: '/marketplace' },
                ]}/>
            </section>

            {/* Main Content Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Bento Grid Section */}
                <section
                    ref={bentoRef}
                    className={`my-20 transition-all duration-700 ease-out ${bentoInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                >
                    <HomePageBentoGrid />
                </section>

                {/* Comment Section */}
                <section
                    ref={commentRef}
                    className={`my-20 relative transition-all duration-700 ease-out ${commentInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                >
                    <HomePageCommentSection />
                </section>

                {/* FAQ Section */}
                <section
                    ref={faqRef}
                    className={`my-20 transition-all duration-700 ease-out ${faqInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                >
                    <HomePageFAQ />
                </section>

                {/* Stay Inspired Section */}
                <section
                    ref={inspiredRef}
                    className={`my-20 transition-all duration-700 ease-out ${inspiredInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                >
                    <HomePageStayInspired />
                </section>
            </div>

            {/* Scroll to Top Button */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`fixed bottom-8 right-8 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg transition-all duration-300 hover:bg-white border border-gray-200 group ${scrollVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
                aria-label="Scroll to top"
            >
                <svg
                    className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
            </button>
        </main>
    );
};

export default LandingPage;