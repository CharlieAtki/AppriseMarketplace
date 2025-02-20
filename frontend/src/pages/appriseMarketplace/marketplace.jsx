import { ArrowRight, Search, Loader } from "lucide-react";
import MarketplaceNavigationBar from "../../components/appriseMarketplace/marketplaceNavigationBar";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Shop = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const defaultImage = `${backendUrl}/path/to/default/image`; // Default image path

    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true); // Loading Sate

    // UseSates for managing the scroll user-feedback
    const [scrollProgress, setScrollProgress] = useState(0);
    const [scrollVisible, setScrollVisible] = useState(false);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/user-unAuth/auth-check`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'content-type': 'application/json',
                        'Accept': 'application/json',
                    }
                });

                console.log('Auth check response:', response);
                const result = await response.json();
                console.log('Auth check result:', result);

                if (!result || !result.success) {
                    navigate('/customerAccountManagement');
                }
            } catch (error) {
                console.error('Auth check error:', error);
                navigate('/customerAccountManagement');
            }
        };

        checkLoginStatus();
    }, [navigate, backendUrl]);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                setLoading(true); // Show loading screen before fetching

                const response = await fetch(`${backendUrl}/api/business-Auth/fetch-listings`, {
                    method: "GET",
                    headers: { "content-type": "application/json" },
                    credentials: 'include',
                });

                if (!response.ok) throw new Error("Failed to fetch destinations");

                const fetchedData = await response.json();
                console.log("Fetched Destinations:", fetchedData);

                if (!fetchedData.success || !fetchedData.payload) return;

                const formattedDestinations = fetchedData.payload.map(destination => {
                    const imageSrc = destination.images && destination.images[0]
                        ? destination.images[0]
                        : defaultImage;

                    return {
                        // Passing the attributes to create the listings
                        _id: destination._id,  // Ensure _id is included
                        business_id: destination.business_id,
                        name: destination.name,
                        image: imageSrc,
                        description: destination.description || "No Description Available",
                        highlights: Array.isArray(destination.highlights) ? destination.highlights : [],
                        price: destination?.price || "Unknown Price",
                        country: destination.location?.country || "Unknown Country",
                        city: destination.location?.city || "Unknown City",
                        maxGuests: destination.max_guests || "unknown Guests",
                        servicesOffered: destination.services_offered || "Unknown Service offered",
                    };
                });

                // Update state with fetched destinations
                setDestinations(formattedDestinations);

            } catch (error) {
                console.error("Error fetching destinations data:", error);
            } finally {
                setLoading(false); // Hide loading after fetching
            }
        };

        fetchDestinations();
    }, [backendUrl]);

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

    // Filter destinations based on search query (case-insensitive)
    // Allows the user to search for specific destinations
    const filteredDestinations = searchQuery
        ? destinations.filter(destination =>
            destination.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
        )
        : destinations;

    return (
        <div className="p-6">

            {/* Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 z-50">
                <div
                    className="h-full bg-indigo-600 transition-all duration-150 ease-out"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            <MarketplaceNavigationBar title="Apprise Marketplace" subtitle="Holidays Made Simple"/>

            <div className="py-6 px-4 border-2 border-gray-300 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Explore Destinations</h2>

                {/* Search Bar */}
                <div className="flex justify-center mb-6">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18}/>
                        <input
                            type="text"
                            placeholder="Search destinations..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <hr className="border-2 border-gray-300 rounded-2xl shadow-lg"/>

                {/* Show Shimmer Effect While Loading */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-6">
                        {[...Array(8)].map((_, index) => (
                            <div key={index} className="bg-gray-200 rounded-lg animate-pulse p-4">
                                <div className="w-full h-48 bg-gray-300 rounded-md"></div>
                                <div className="mt-4 h-6 bg-gray-400 rounded"></div>
                                <div className="mt-2 h-4 bg-gray-300 rounded w-3/4"></div>
                                <div className="mt-2 h-4 bg-gray-300 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // Render the actual destinations after loading
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-6">
                        {filteredDestinations.length > 0 ? (
                            filteredDestinations.map((destination) => (
                                <div
                                    key={destination._id}
                                    className="bg-white rounded-2xl shadow-md overflow-hidden transform transition-all hover:scale-105 hover:shadow-lg"
                                >
                                    <div className="relative">
                                        <img
                                            src={destination.image}
                                            alt={destination.name}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div
                                            className="absolute inset-0 bg-black opacity-20 hover:opacity-30 transition-opacity"></div>
                                    </div>

                                    <div className="p-4">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{destination.name}</h3>
                                        <p className="text-gray-600 text-sm mb-3">{destination.description}</p>

                                        {/* Highlights */}
                                        <div className="mb-3">
                                            <h4 className="text-xs font-medium text-gray-500">Highlights:</h4>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {destination.highlights.map((highlight) => (
                                                    <span key={highlight}
                                                          className="bg-blue-50 text-indigo-500 px-2 py-1 rounded-full text-xs">
                                                        {highlight}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <button
                                            className="w-full flex items-center justify-center bg-indigo-700 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                            onClick={() => navigate('/destination-view', {state: {destination}})}
                                        >
                                            Explore
                                            <ArrowRight className="ml-2 transition-transform" size={18}/>
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 text-lg">No destinations found.</p>
                        )}
                    </div>
                )}
            </div>

            {/* Scroll to Top Button */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`fixed bottom-8 right-8 bg-white/80 backdrop-blur-sm p-3 rounded-full 
                    shadow-lg transition-all duration-300 hover:bg-white
                    border border-gray-200 group
                    ${scrollVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
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
        </div>
    );
};

export default Shop;