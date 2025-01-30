import {useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import MarketplaceNavigationBar from "../../components/appriseMarketplace/marketplaceNavigationBar";
import { Calendar, Clock, Users, DollarSign, Briefcase, ArrowLeft } from 'lucide-react';


const DestinationBookingPage = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    // The expression const { name, image, description, highlights } = state?.destination || {};
    // uses destructuring to extract values from the destination object within state.
    // The ?. (optional chaining) ensures that if state or destination is null or undefined, it won’t throw an error.
    // Instead, it defaults to an empty object ({}).
    // This means that if the object is missing or has missing properties,
    // the destructured variables (name, image, description, and highlights) will be undefined rather than causing an error.
    const { name, image, description, highlights } = state?.destination || {};
    const selectedDestination = state?.destination || {};

    const backendUrl = process.env.REACT_APP_BACKEND_URL;

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

    // This checks if destination is either null or undefined.
    // In other words, it evaluates to true if no destination (due to the !state) is selected or the state doesn't have a destination
    if (!state?.destination) {
        return <div>No destination selected.</div>;
    }

    return (
        <div className="p-4">
            <MarketplaceNavigationBar title="Apprise Marketplace" subtitle="Destination Details"/>
            {/* Image + Booking input section */}
            <div className="border-2 border-gray-300 rounded-2xl hover:shadow-2xl transition-shadow duration-300 p-4">
                {/* Heading Section */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-indigo-700">
                        {name}
                    </h2>
                    <button
                        onClick={() => navigate("/destination-view", { state: {destination: selectedDestination} })}
                        className="text-gray-600 hover:text-indigo-700 flex items-center"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        Back to Destination View
                    </button>
                </div>
                <div className="grid grid-rows-[auto,1fr] gap-4">
                    {/* Large Image Grid */}
                    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Main large image - increased height */}
                        <div className="col-span-1 md:col-span-2 h-[650px]">
                            <img
                                src={image}
                                alt={name}
                                className="w-full h-full object-cover rounded-2xl"
                            />
                        </div>
                        {/* Side images container */}
                        <div className="hidden md:flex md:col-span-1 flex-col gap-4">
                            <div className="flex-1">
                                <img
                                    src={image}
                                    alt={name}
                                    className="w-full h-full object-cover rounded-2xl"
                                />
                            </div>
                            <div className="flex-1">
                                <img
                                    src={image}
                                    alt={name}
                                    className="w-full h-full object-cover rounded-2xl"
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="border-2 border-gray-200 rounded-2xl" />

                    {/* Destination Details & Booking Section  */}
                    <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-8 p-2 h-auto lg:h-screen">
                        {/* Customer Details Input section */}
                        <div
                            className="flex-[1] flex flex-col h-auto lg:h-full p-4 border-2 border-gray-300 rounded-2xl hover:shadow-2xl transition-shadow">
                            <h2 className="text-3xl font-bold text-indigo-700">
                                Booking Details:
                            </h2>

                            {/* Date Selection */}
                            <div className="mt-6">
                                <label className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                                    <Calendar className="w-5 h-5"/>
                                    Select Dates
                                </label>
                                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-600">Check-in</label>
                                        <input
                                            type="date"
                                            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600">Check-out</label>
                                        <input
                                            type="date"
                                            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Time Selection */}
                            <div className="mt-6">
                                <label className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                                    <Clock className="w-5 h-5"/>
                                    Preferred Time
                                </label>
                                <select
                                    className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                                    <option>Select time slot</option>
                                    <option>Morning (9 AM - 12 PM)</option>
                                    <option>Afternoon (12 PM - 4 PM)</option>
                                    <option>Evening (4 PM - 8 PM)</option>
                                </select>
                            </div>

                            {/* Group Size */}
                            <div className="mt-6">
                                <label className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                                    <Users className="w-5 h-5"/>
                                    Number of Guests
                                </label>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <div>
                                        <label className="block text-sm text-gray-600">Adults</label>
                                        <select
                                            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                                            {[1, 2, 3, 4, 5, 6].map(num => (
                                                <option key={num} value={num}>{num}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600">Children</label>
                                        <select
                                            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                                            {[0, 1, 2, 3, 4].map(num => (
                                                <option key={num} value={num}>{num}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Services Selection */}
                            <div className="mt-6">
                                <label className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                                    <Briefcase className="w-5 h-5"/>
                                    Additional Services
                                </label>
                                <div className="mt-2 space-y-2">
                                    <label className="flex items-center space-x-2">
                                        <input type="checkbox"
                                               className="rounded text-indigo-600 focus:ring-indigo-500"/>
                                        <span className="text-gray-700">Airport Transfer (£50)</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input type="checkbox"
                                               className="rounded text-indigo-600 focus:ring-indigo-500"/>
                                        <span className="text-gray-700">Guided Tour (£75)</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input type="checkbox"
                                               className="rounded text-indigo-600 focus:ring-indigo-500"/>
                                        <span className="text-gray-700">Equipment Rental (£25)</span>
                                    </label>
                                </div>
                            </div>

                            {/* Price Summary */}
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between text-lg font-semibold text-gray-700">
                                    <span className="flex items-center gap-2">
                                        <DollarSign className="w-5 h-5"/>
                                        Total Estimate:
                                    </span>
                                    <span>
                                        £299.99
                                    </span>
                                </div>
                            </div>

                            {/* Book Now Button */}
                            <button
                                className="mt-6 w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                                Book Now
                            </button>
                        </div>
                        {/* Destination Features Section */}
                        <div className="flex-[1] flex flex-col h-auto lg:h-full p-4 border-2 border-gray-300 rounded-2xl hover:shadow-2xl transition-shadow">
                                <h2 className="text-3xl font-bold text-indigo-700">
                                    What This Place Offers:
                                </h2>
                        </div>
                        {/* Host Information Section */}
                        <div className="flex-[1] flex flex-col h-auto lg:h-full p-4 border-2 border-gray-300 rounded-2xl hover:shadow-2xl transition-shadow">
                            <h2 className="text-3xl font-bold text-indigo-700">
                                Host Details
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DestinationBookingPage;