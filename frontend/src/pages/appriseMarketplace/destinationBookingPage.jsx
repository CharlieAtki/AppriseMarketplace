import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import MarketplaceNavigationBar from "../../components/appriseMarketplace/marketplaceNavigationBar";
import {Calendar, Users, ArrowLeft, PoundSterling, User, MapPin, Star, Briefcase, DollarSign} from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const DestinationBookingPage = () => {
    const navigate = useNavigate();
    const { state } = useLocation();

    // The expression const { name, image, description, highlights } = state?.destination || {};
    // uses destructuring to extract values from the destination object within state.
    // The ?. (optional chaining) ensures that if state or destination is null or undefined, it won’t throw an error.
    // Instead, it defaults to an empty object ({}).
    // This means that if the object is missing or has missing properties,
    // the destructured variables (name, image, description, and highlights) will be undefined rather than causing an error.
    const { name, image, description, highlights, price, country, city, maxGuests, servicesOffered } = state?.destination || {};
    const selectedDestinationHost = state?.host || {};
    const selectedDestination = state?.destination || {};

    // UseSates for managing the different booking inputs
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [checkInDate, setCheckInDate] = useState("");
    const [checkOutDate, setCheckOutDate] = useState("");
    const [bookedDates, setBookedDates] = useState([]); // Default value as an empty array

    // UseSates for calculating total booking price
    const [totalPrice, setTotalPrice] = useState(0); // Total price state

    const isDateBooked = (date) => bookedDates.includes(date);

    const [errorMessage, setErrorMessage] = useState("");

    const listingId = state?.destination?._id || null;

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

    useEffect(() => {
        const fetchBookedDates = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/business-Auth/check-booking-availability?listingId=${listingId}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!response.ok) {
                    console.error('Error fetching booked dates');
                    return;
                }

                const data = await response.json();
                setBookedDates(data.bookedDates || []);
            } catch (error) {
                console.error('Booking availability check error:', error);
                setBookedDates([]);
            }
        };

        if (listingId) fetchBookedDates();
    }, [listingId, backendUrl]);

    // Price Calculator

    // UseEffect to dynamically update the calculated totalPrice of the service.
    // This needs updating to adjust for length of stay and total number of people
    useEffect(() => {
        // Recalculate price when guests change
        const totalGuests = adults + children;
        const basePrice = price || 0 // Set the base price (Not decided yet)
        setTotalPrice(basePrice * totalGuests);
    }, [adults, children, price]); //Dependencies ensure dynamic updates

    // Sending the booking details to the backend - Saving to the database
    const bookingSubmission = async () => {
        if (!checkInDate || !checkOutDate) {
            alert("Please select both check-in and check-out dates.");
            return;
        }

        const totalGuests = adults + children

        const requestBody = {
            listingId: selectedDestination?._id,
            destinationName: selectedDestination?.name,
            arrivalDate: checkInDate,
            leavingDate: checkOutDate,
            numGuests: totalGuests,
            totalPrice: totalPrice,
        };

        try {
            const response = await fetch(`${backendUrl}/api/business-Auth/create-booking`, {
                method: 'POST',
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            const result = await response.json();
            if (!response.ok) {
                alert(result.message || "Booking failed. Please try again.");
                return;
            }

            if (result.success) {
                // Pass all booking information as part of the state to the booking confirmation page
                // All the attributes below can be accessed in the specific webpage
                navigate('/booking-confirmation', {
                    state: {
                        destination: selectedDestination,
                        checkInDate,
                        checkOutDate,
                        adults,
                        children,
                        totalGuests,
                        totalPrice
                    }
                });
            }
        } catch (error) {
            console.error("Booking error:", error);
            alert("An error occurred. Please try again later.");
        }
    };

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

                <hr className="border-t-2 border-gray-300 my-4"/>

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
                    <div
                        className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-8 p-2 h-auto lg:h-screen">
                        {/* Destination Features Section */}
                        <div className="p-6 border border-gray-300 rounded-2xl shadow-lg bg-white w-full lg:w-auto">

                            {/* Host Information */}
                            <div className="flex items-center space-x-4 mb-4">
                                <img
                                    src={selectedDestinationHost?.profilePicture || "/default-avatar.png"}
                                    alt={selectedDestinationHost?.username || "Host"}
                                    className="w-14 h-14 rounded-full border border-gray-200"
                                />
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                                        <User className="w-5 h-5 text-indigo-700 mr-2"/>
                                        {selectedDestinationHost?.username || "Unknown Host"}
                                    </h2>
                                    <p className="text-gray-500 text-sm">{selectedDestinationHost?.email || "Email not available"}</p>
                                </div>
                            </div>

                            <hr className="border-t border-gray-300 my-4"/>

                            {/* Service Name */}
                            <div className="mb-4">
                                <h1 className="text-2xl font-bold text-indigo-700">{name}</h1>
                            </div>

                            <hr className="border-t border-gray-300 my-4"/>

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="text-xl sm:text-2xl font-semibold text-indigo-700 mb-3">Description</h3>
                                <p className="text-lg text-gray-700">{description}</p>
                            </div>

                            <hr className="border-t border-gray-300 my-4"/>

                            {/* Location & Max Guests */}
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center space-x-2">
                                    <MapPin className="w-5 h-5 text-indigo-700"/>
                                    <p className="text-lg text-gray-800">{city}, {country}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Users className="w-5 h-5 text-indigo-700"/>
                                    <p className="text-lg text-gray-800">{maxGuests} guests</p>
                                </div>
                            </div>

                            <hr className="border-t border-gray-300 my-4"/>

                            {/* Highlights */}
                            <div className="mb-6">
                                <h3 className="text-xl sm:text-2xl font-semibold text-indigo-700 mb-3 flex items-center">
                                    <Star className="w-5 h-5 text-indigo-700 mr-2"/>
                                    Highlights
                                </h3>
                                {highlights?.length > 0 ? (
                                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                                        {highlights.map((highlight, index) => (
                                            <li key={index} className="text-sm sm:text-lg">{highlight}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-600 text-sm sm:text-lg">No highlights available</p>
                                )}
                            </div>

                            <hr className="border-t border-gray-300 my-4"/>

                            {/* Services Offered */}
                            <div className="mb-6">
                                <h3 className="text-xl sm:text-2xl font-semibold text-indigo-700 mb-3 flex items-center">
                                    <Briefcase className="w-5 h-5 text-indigo-700 mr-2"/>
                                    Services Offered
                                </h3>
                                {Array.isArray(servicesOffered) && servicesOffered.length > 0 ? (
                                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                                        {servicesOffered.map((service, index) => (
                                            <li key={index} className="text-sm sm:text-lg">{service}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-600 text-sm sm:text-lg">No services listed</p>
                                )}
                            </div>

                            <hr className="border-t border-gray-300 my-4"/>

                            {/* Price Per Night */}
                            <div className="flex justify-between items-center mt-6">
                                <h3 className="text-xl sm:text-2xl font-semibold text-indigo-700 flex items-center">
                                    <DollarSign className="w-5 h-5 text-indigo-700 mr-2"/>
                                    Price Per Night
                                </h3>
                                <p className="text-xl font-semibold text-gray-700">
                                    {price ? `£${price.toFixed(2)}` : "Price not available"}
                                </p>
                            </div>

                        </div>

                        {/* Customer Details Input section */}
                        <div
                            className="flex-[2] flex flex-col h-auto w-full lg:h-full p-4 border-2 border-gray-300 rounded-2xl hover:shadow-2xl transition-shadow">
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
                                        <DatePicker
                                            selected={checkInDate}
                                            onChange={(date) => {
                                                setCheckInDate(date);
                                                if (isDateBooked(date.toISOString().split("T")[0])) {
                                                    setErrorMessage("Selected check-in date is unavailable.");
                                                } else {
                                                    setErrorMessage("");
                                                }
                                            }}
                                            excludeDates={bookedDates.map(date => new Date(date))}
                                            minDate={new Date()}
                                            className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholderText={"Add date"}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600">Check-out</label>
                                        <DatePicker
                                            selected={checkOutDate}
                                            onChange={(date) => {
                                                setCheckOutDate(date);
                                                if (isDateBooked(date.toISOString().split("T")[0])) {
                                                    setErrorMessage("Selected check-out date is unavailable.");
                                                } else {
                                                    setErrorMessage("");
                                                }
                                            }}
                                            excludeDates={bookedDates.map(date => new Date(date))}
                                            minDate={checkInDate ? new Date(checkInDate) : new Date()} // Check-out must be after check-in
                                            className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholderText={"Add date"}
                                        />

                                        {errorMessage && (
                                            <div
                                                className="mt-2 p-2 text-red-700 bg-red-100 border border-red-500 rounded-lg">
                                                {errorMessage}
                                            </div>
                                        )}
                                    </div>
                                </div>
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
                                            value={adults}
                                            onChange={(e) => setAdults(parseInt(e.target.value))}
                                            className="mt-1 w-full p-2 border border-gray-300 rounded-lg">
                                            {[1, 2, 3, 4, 5, 6].map(num => (
                                                <option key={num} value={num}>{num}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600">Children</label>
                                        <select
                                            value={children}
                                            onChange={(e) => setChildren(parseInt(e.target.value))}
                                            className="mt-1 w-full p-2 border border-gray-300 rounded-lg">
                                            {[0, 1, 2, 3, 4].map(num => (
                                                <option key={num} value={num}>{num}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Price Summary */}
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between text-lg font-semibold text-gray-700">
                                    <span className="flex items-center gap-2">
                                        <PoundSterling className="w-5 h-5"/>
                                        Total Estimate:
                                    </span>
                                    <span>
                                        £{totalPrice.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Book Now Button */}
                            <button
                                onClick={bookingSubmission}
                                className="mt-6 w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                                Book Now
                            </button>
                        </div>
                    </div>

                    <hr className="border-t border-gray-300"/>

                    {/* Host Information Section */}
                    <div
                        className="flex-[1] flex flex-col h-auto lg:h-full p-4 border-2 border-gray-300 rounded-2xl hover:shadow-2xl transition-shadow">
                        <h2 className="text-3xl font-bold text-indigo-700">
                            Host Details
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DestinationBookingPage;