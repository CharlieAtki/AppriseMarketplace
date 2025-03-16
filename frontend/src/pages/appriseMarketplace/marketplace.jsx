import { ArrowRight, Search, Filter, X } from "lucide-react";
import MarketplaceNavigationBar from "../../components/appriseMarketplace/marketplaceNavigationBar";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Shop = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const defaultImage = `${backendUrl}/path/to/default/image`; // Default image path

    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [showFilters, setShowFilters] = useState(false);
    const [filtersApplied, setFiltersApplied] = useState(false);
    const [filters, setFilters] = useState({
        price: { min: "", max: "" },
        currency: "GBP",
        maxGuests: "",
        countries: [],
        cities: [],
        highlights: [],
        servicesOffered: [],
    });

    // Available filter options (will be populated from data)
    const [filterOptions, setFilterOptions] = useState({
        countries: [],
        cities: [],
        highlights: [],
        servicesOffered: []
    });

    // For AI recommendations
    const [searchPrompt, setSearchPrompt] = useState("");
    const [promptDetails, setPromptDetails] = useState({
        destination: "",
        budget: "",
        guests: "",
        interests: "",
        dates: ""
    });
    const [aiRecommendations, setAiRecommendations] = useState([]);
    const [showPromptForm, setShowPromptForm] = useState(false);

    // Scroll user-feedback - Not used as currently, I want the AI prompt always accessible
    const [scrollProgress, setScrollProgress] = useState(0);
    const [scrollVisible, setScrollVisible] = useState(true); // recommender always visible

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

                const result = await response.json();

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
                setLoading(true);

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
                        _id: destination._id,
                        business_id: destination.business_id,
                        name: destination.name,
                        image: imageSrc,
                        description: destination.description || "No Description Available",
                        highlights: Array.isArray(destination.highlights) ? destination.highlights : [],
                        price: destination?.price || 0,
                        currency: destination?.currency || "GBP",
                        country: destination.location?.country || "Unknown Country",
                        city: destination.location?.city || "Unknown City",
                        address: destination.location?.address || "Unknown Address",
                        lat: destination.location?.lat || "Unknown Latitude",
                        lng: destination.location?.lng || "Unknown Longitude",
                        maxGuests: destination.max_guests || 0,
                        servicesOffered: Array.isArray(destination.services_offered) ? destination.services_offered : [],
                        availability: Array.isArray(destination.availability) ? destination.availability : []
                    };
                });

                // Update state with fetched destinations
                setDestinations(formattedDestinations);

                // Extract filter options from destinations
                // This dynamically adds the attributes of the listings to the filter options.
                // Set automatically removes duplicate values.
                // flatMap is used to flatten arrays before applying Set to remove duplicates in nested arrays (like highlights or servicesOffered). - Making 2D arrays into 1D
                // The final result is an array of unique values for each of the filter categories (countries, cities, highlights, and services).
                const countries = [...new Set(formattedDestinations.map(d => d.country))];
                const cities = [...new Set(formattedDestinations.map(d => d.city))];
                const highlights = [...new Set(formattedDestinations.flatMap(d => d.highlights))];
                const services = [...new Set(formattedDestinations.flatMap(d => d.servicesOffered))];

                // Filter options attributes
                setFilterOptions({
                    countries,
                    cities,
                    highlights,
                    servicesOffered: services
                });

                // Error handling
            } catch (error) {
                console.error("Error fetching destinations data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDestinations();
    }, [backendUrl]);

    // Handle scroll progress and button visibility - Currently redundant
    useEffect(() => {
        const handleScroll = () => {
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            setScrollProgress(scrolled);
            setScrollVisible(true); // always visible for now.
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle filter changes
    // The .includes() method in JavaScript is used to check if a certain element or value is present in an array or string.
    // It returns a boolean: True if the element is found & False if the element is not found.
    const handleFilterChange = (category, value) => {
        if (category === 'price') {
            setFilters(prev => ({
                ...prev,
                price: { ...prev.price, ...value }
            }));
        } else if (['countries', 'cities', 'highlights', 'servicesOffered'].includes(category)) {
            // Toggle array items
            setFilters(prev => {
                const updatedArray = prev[category].includes(value)
                    ? prev[category].filter(item => item !== value)
                    : [...prev[category], value];

                return { ...prev, [category]: updatedArray };
            });
        } else {
            // Handle other single-value fields
            setFilters(prev => ({ ...prev, [category]: value }));
        }
    };

    // Apply filters to destinations
    const applyFilters = () => {
        setFiltersApplied(true);
    };

    const clearFilters = () => {
        setFilters({
            price: { min: "", max: "" },
            currency: "GBP",
            maxGuests: "",
            countries: [],
            cities: [],
            highlights: [],
            servicesOffered: []
        });
        setFiltersApplied(false);
    };

    // Handle AI recommendation prompt changes
    const handlePromptDetailChange = (field, value) => {
        setPromptDetails(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Generate an AI-friendly prompt from the details
    const generateSearchPrompt = () => {
        const { destination, budget, guests, interests, dates } = promptDetails;

        return `Looking for a vacation in ${destination || 'any location'} ${
            dates ? `during ${dates}` : ''
        }. Budget: ${budget || 'flexible'}, Number of guests: ${guests || '1-2'}. 
        Interested in: ${interests || 'general sightseeing'}.`;
    };

    // Send prompt to get AI recommendations
    const sendPrompt = async () => {
        try {
            const prompt = generateSearchPrompt();
            setSearchPrompt(prompt);

            const response = await fetch(`${backendUrl}/api/business-Auth/listing-recommendation`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    prompt,
                    currentFilters: filtersApplied ? filters : null, // Ternary operator for listings
                    availableListings: destinations.map(d => d._id) // Passing the ObjectId of the listing - No other attributes
                })
            });

            const result = await response.json(); // Recommended listing ObjectIds

            if (result.success && result.recommendations) {
                // Map recommendation IDs to full listing objects
                const recommendedListings = result.recommendations
                    .map(recId => destinations.find(d => d._id === recId))
                    .filter(Boolean); // Remove nulls

                setAiRecommendations(recommendedListings);
            }

            setShowPromptForm(false);

        } catch (error) {
            console.error("Error sending prompt data:", error);
        }
    };

    // Apply filtering logic
    const filteredDestinations = (() => {
        // If search query exists, filter by name
        let results = searchQuery
            ? destinations.filter(destination =>
                destination.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
            )
            : destinations;

        // If filters are applied, further filter the results
        if (filtersApplied) {
            results = results.filter(dest => {
                // Price filter
                const priceInRange = (
                    (!filters.price.min || dest.price >= Number(filters.price.min)) &&
                    (!filters.price.max || dest.price <= Number(filters.price.max))
                );

                // Max guests filter
                const guestsMatch = !filters.maxGuests || dest.maxGuests >= Number(filters.maxGuests);

                // Country filter
                const countryMatch = filters.countries.length === 0 ||
                    filters.countries.includes(dest.country);

                // City filter
                const cityMatch = filters.cities.length === 0 ||
                    filters.cities.includes(dest.city);

                // Highlights filter (any match)
                // The .some() method in JavaScript is used to check if at least one element in an array satisfies a given condition.
                // It returns a boolean value: True if at least one element satisfies the condition, False if no element satisfies the conditions.
                const highlightsMatch = filters.highlights.length === 0 ||
                    filters.highlights.some(h => dest.highlights.includes(h));

                // Services filter (any match)
                const servicesMatch = filters.servicesOffered.length === 0 ||
                    filters.servicesOffered.some(s => dest.servicesOffered.includes(s));

                return priceInRange && guestsMatch && countryMatch &&
                    cityMatch && highlightsMatch && servicesMatch;
            });
        }

        // If AI recommendations exist, prioritize them
        if (aiRecommendations.length > 0) {
            // Get IDs for O(1) lookup
            // This code snippet creates a Set from an array of AI-generated recommendations to ensure that each _id value is unique.
            // This is useful when working with a collection of items where duplicates need to be removed, or for faster lookups of recommended items.
            const recommendedIds = new Set(aiRecommendations.map(r => r._id));

            // Sort results to have recommendations first
            results.sort((a, b) => {
                const aIsRecommended = recommendedIds.has(a._id);
                const bIsRecommended = recommendedIds.has(b._id);

                if (aIsRecommended && !bIsRecommended) return -1;
                if (!aIsRecommended && bIsRecommended) return 1;
                return 0;
            });
        }

        return results;
    })();

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

                {/* Search and Filter Bar */}
                <div className="flex flex-wrap justify-center gap-4 mb-6">
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

                    <button
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${showFilters ? 'bg-indigo-100 border-indigo-300' : 'bg-white border-gray-300'}`}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter size={18} />
                        Filters
                        {filtersApplied && (
                            <span className="ml-1 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {Object.values(filters).flat().filter(Boolean).length}
                            </span>
                        )}
                    </button>

                    {filtersApplied && (
                        <button
                            className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-red-500"
                            onClick={clearFilters}
                        >
                            <X size={14} />
                            Clear Filters
                        </button>
                    )}
                </div>

                {/* Filters Section */}
                {showFilters && (
                    <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {/* Price Range Filter */}
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-700">Price Range</p>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        className="w-full p-2 border rounded"
                                        value={filters.price.min}
                                        onChange={(e) => handleFilterChange('price', { min: e.target.value })}
                                    />
                                    <span>to</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        className="w-full p-2 border rounded"
                                        value={filters.price.max}
                                        onChange={(e) => handleFilterChange('price', { max: e.target.value })}
                                    />
                                </div>
                                <select
                                    className="w-full p-2 border rounded text-sm"
                                    value={filters.currency}
                                    onChange={(e) => handleFilterChange('currency', e.target.value)}
                                >
                                    <option value="GBP">GBP (£)</option>
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                </select>
                            </div>

                            {/* Max Guests Filter */}
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-700">Minimum Guests</p>
                                <input
                                    type="number"
                                    placeholder="Number of guests"
                                    className="w-full p-2 border rounded"
                                    value={filters.maxGuests}
                                    onChange={(e) => handleFilterChange('maxGuests', e.target.value)}
                                    min="1"
                                />
                            </div>

                            {/* Countries Filter */}
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-700">Countries</p>
                                <div className="max-h-32 overflow-y-auto p-2 border rounded bg-white">
                                    {filterOptions.countries.map(country => (
                                        <label key={country} className="flex items-center gap-2 mb-1">
                                            <input
                                                type="checkbox"
                                                checked={filters.countries.includes(country)}
                                                onChange={() => handleFilterChange('countries', country)}
                                                className="rounded text-indigo-600"
                                            />
                                            <span className="text-sm">{country}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Cities Filter */}
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-700">Cities</p>
                                <div className="max-h-32 overflow-y-auto p-2 border rounded bg-white">
                                    {filterOptions.cities.map(city => (
                                        <label key={city} className="flex items-center gap-2 mb-1">
                                            <input
                                                type="checkbox"
                                                checked={filters.cities.includes(city)}
                                                onChange={() => handleFilterChange('cities', city)}
                                                className="rounded text-indigo-600"
                                            />
                                            <span className="text-sm">{city}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Highlights Filter */}
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-700">Highlights</p>
                                <div className="max-h-32 overflow-y-auto p-2 border rounded bg-white">
                                    {filterOptions.highlights.map(highlight => (
                                        <label key={highlight} className="flex items-center gap-2 mb-1">
                                            <input
                                                type="checkbox"
                                                checked={filters.highlights.includes(highlight)}
                                                onChange={() => handleFilterChange('highlights', highlight)}
                                                className="rounded text-indigo-600"
                                            />
                                            <span className="text-sm">{highlight}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Services Filter */}
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-700">Services Offered</p>
                                <div className="max-h-32 overflow-y-auto p-2 border rounded bg-white">
                                    {filterOptions.servicesOffered.map(service => (
                                        <label key={service} className="flex items-center gap-2 mb-1">
                                            <input
                                                type="checkbox"
                                                checked={filters.servicesOffered.includes(service)}
                                                onChange={() => handleFilterChange('servicesOffered', service)}
                                                className="rounded text-indigo-600"
                                            />
                                            <span className="text-sm">{service}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end gap-3">
                            <button
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
                                onClick={() => setShowFilters(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                onClick={applyFilters}
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                )}

                {/* AI Recommendations Tag */}
                {aiRecommendations.length > 0 && (
                    <div className="my-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span className="font-medium text-green-800">Personalized Recommendations</span>
                            </div>
                            <button
                                className="text-sm text-gray-500 hover:text-gray-700"
                                onClick={() => setAiRecommendations([])}
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{searchPrompt}</p>
                    </div>
                )}

                <hr className="border border-gray-300 rounded-xl my-6"/>

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
                                    className={`bg-white rounded-2xl shadow-md overflow-hidden transform transition-all hover:scale-105 hover:shadow-lg ${
                                        aiRecommendations.some(r => r._id === destination._id) 
                                            ? 'ring-2 ring-green-500 ring-offset-2' 
                                            : ''
                                    }`}
                                >
                                    <div className="relative">
                                        <img
                                            src={destination.image}
                                            alt={destination.name}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black opacity-20 hover:opacity-30 transition-opacity"></div>

                                        {/* Price Badge */}
                                        <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-indigo-800 font-semibold text-sm">
                                            {destination.currency === 'USD' ? '$' :
                                             destination.currency === 'EUR' ? '€' :
                                             destination.currency === 'GBP' ? '£' : ''}
                                            {destination.price}/night
                                        </div>

                                        {/* AI Recommended Badge */}
                                        {aiRecommendations.some(r => r._id === destination._id) && (
                                            <div className="absolute top-2 left-2 bg-green-500/90 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs flex items-center">
                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                Recommended
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-semibold text-gray-800">{destination.name}</h3>
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                {destination.maxGuests} guests
                                            </span>
                                        </div>

                                        <div className="flex items-center text-sm text-gray-600 mb-3">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            </svg>
                                            {destination.city}, {destination.country}
                                        </div>

                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{destination.description}</p>

                                        {/* Highlights */}
                                        <div className="mb-3">
                                            <h4 className="text-xs font-medium text-gray-500 mb-1">Highlights:</h4>
                                            <div className="flex flex-wrap gap-1">
                                                {destination.highlights.map((highlight) => (
                                                    <span key={highlight}
                                                          className="bg-blue-50 text-indigo-500 px-2 py-1 rounded-full text-xs">
                                                        {highlight}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Services */}
                                        {destination.servicesOffered.length > 0 && (
                                            <div className="mb-3">
                                                <h4 className="text-xs font-medium text-gray-500 mb-1">Services:</h4>
                                                <div className="flex flex-wrap gap-1">
                                                    {destination.servicesOffered.slice(0, 3).map((service) => (
                                                        <span key={service}
                                                              className="bg-purple-50 text-purple-500 px-2 py-1 rounded-full text-xs">
                                                            {service}
                                                        </span>
                                                    ))}
                                                    {destination.servicesOffered.length > 3 && (
                                                        <span className="bg-purple-50 text-purple-500 px-2 py-1 rounded-full text-xs">
                                                            +{destination.servicesOffered.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

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
                            <div className="col-span-full text-center py-8">
                                <div className="bg-gray-100 rounded-lg p-6 inline-block">
                                    <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <p className="text-gray-500 text-lg mt-4">No destinations found.</p>
                                    <p className="text-gray-400 mt-2">Try adjusting your filters or search query.</p>
                                    <button
                                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                        onClick={clearFilters}
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* AI Recommendation Form */}
            <div className={`fixed bottom-8 right-8 z-40 transition-all duration-300 
                  ${scrollVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>

                {showPromptForm ? (
                    <div className="bg-white/95 backdrop-blur-md rounded-lg shadow-lg border border-gray-200 p-4 w-80">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-medium text-gray-800">Find Recommendations</h3>
                            <button onClick={() => setShowPromptForm(false)} className="text-gray-500 hover:text-gray-700">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Destination</label>
                                <input
                                    type="text"
                                    placeholder="City, country or 'anywhere'"
                                    className="w-full p-2 text-sm border rounded-md"
                                    value={promptDetails.destination}
                                    onChange={(e) => handlePromptDetailChange('destination', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Budget</label>
                                <input
                                    type="text"
                                    placeholder="e.g. '$200 per night' or 'budget'"
                                    className="w-full p-2 text-sm border rounded-md"
                                    value={promptDetails.budget}
                                    onChange={(e) => handlePromptDetailChange('budget', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Number of Guests</label>
                                <input
                                    type="number"
                                    placeholder="How many people?"
                                    className="w-full p-2 text-sm border rounded-md"
                                    min="1"
                                    value={promptDetails.guests}
                                    onChange={(e) => handlePromptDetailChange('guests', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Interests & Preferences</label>
                                <textarea
                                    placeholder="e.g. beaches, hiking, family-friendly..."
                                    className="w-full p-2 text-sm border rounded-md"
                                    rows="2"
                                    value={promptDetails.interests}
                                    onChange={(e) => handlePromptDetailChange('interests', e.target.value)}
                                ></textarea>
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Dates (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 'August' or 'next month'"
                                    className="w-full p-2 text-sm border rounded-md"
                                    value={promptDetails.dates}
                                    onChange={(e) => handlePromptDetailChange('dates', e.target.value)}
                                />
                            </div>

                            <button
                                onClick={sendPrompt}
                                className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                                Get AI Recommendations
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center bg-white/70 backdrop-blur-md rounded-full
                                  shadow-lg border border-gray-100 pr-1
                                  hover:shadow-xl hover:bg-white/90 transition-all">
                        <button
                            className="p-3 bg-indigo-600 text-white rounded-full
                                hover:bg-indigo-700 transition-colors"
                            aria-label="Get AI Recommendations"
                            onClick={() => setShowPromptForm(true)}
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                        </button>
                        <span className="px-4 text-sm text-gray-700">Get AI Travel Recommendations</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Shop;