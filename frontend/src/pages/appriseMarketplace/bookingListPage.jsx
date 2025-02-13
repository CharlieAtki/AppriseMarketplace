import MarketplaceNavigationBar from "../../components/appriseMarketplace/marketplaceNavigationBar";
import {useEffect, useState} from "react";
import {Calendar, Users, MapPin, Search, PoundSterling} from "lucide-react";
import {useNavigate} from "react-router-dom";

const BookingListPage = () => {
    const [bookingFetchError, setBookingFetchError] = useState(false); // Error useState used to manage the booking fetch useEffect
    const [bookings, setBookings] = useState([]); // Array holding the listings
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true); // Loading State


    const navigate = useNavigate();
    const backendUrl = process.env.REACT_APP_BACKEND_URL; // fetching the backend URL from the .env file


    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true); // Initialise the loader whilst fetching from the database

                const response = await fetch(`${backendUrl}/api/business-Auth/fetch-bookings`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'content-type': 'application/json',
                        'Accept': 'application/json',
                    }
                });

                const result = await response.json();
                setBookings(result);

                // Check if result.payload is an array
                if (!result.success || !Array.isArray(result.payload)) {
                    console.error("Error: API did not return a valid bookings array");
                    setBookingFetchError(true);
                    setBookings([]); // Set to empty array to prevent crash
                    return;
                }

                // Formatting the booking so the mapped elements contain only the data below
                // The information is contained within the useSate, which is defined above
                const formattedBookings = result.payload.map(booking => {
                    return {
                        id: booking.id || "",
                        destinationName: booking.destinationName || "Unknown Destination ",
                        arrivalDate: booking.arrivalDate || "",
                        leavingDate: booking.leavingDate || "",
                        numGuests: booking.numGuests || 0,
                        totalPrice: booking.totalPrice || 0,
                        currency: booking.currency || "GBP",
                        bookingStatus: booking.bookingStatus || "Pending"
                    }
                });

                setBookings(formattedBookings); // Updates the useSate with the formatted bookings

            } catch (error) {
                console.error('Auth check error:', error);
            } finally {
                setLoading(false); // Stop the loading animation now the data has been fetched
            }
        };

        fetchBookings();
    }, [backendUrl]);

    const formatDate = (date) => {
        if (!date) return ''; // Return an empty string if date is undefined or null
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    // Filter destinations based on search query (case-insensitive)
    // Allows the user to search for specific destinations
    const filteredBookings = Array.isArray(bookings) ?
        (searchQuery
            ? bookings.filter(destination =>
                destination.destinationName.toLowerCase().includes(searchQuery.trim().toLowerCase())
            )
            : bookings)
        : [];

    return (
        <div className="p-6">
            <MarketplaceNavigationBar title={"Bookings View"} subtitle={"Where your bookings are displayed"}/>

            {/* Buttons on the right */}
            <div className="py-6 px-4 border-2 border-gray-300 rounded-2xl shadow-lg">

                {/* Title */}
                <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Search Bookings</h2>

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

                {/* Break Point */}
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
                ) : filteredBookings.length === 0 ? (
                    // Fallback if no bookings are found
                    <p className="text-center text-gray-500 text-lg py-10">
                        No bookings found.
                    </p>
                ) : (
                    // Show Bookings if data is available
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-6">
                        {filteredBookings.map((booking, index) => (
                            <div
                                key={index}
                                className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-2xl transition-shadow"
                            >
                                {/* Destination Name */}
                                <h3 className="text-xl font-semibold text-indigo-700 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-indigo-500"/>
                                    {booking.destinationName || 'N/A'}
                                </h3>

                                <div className="mt-4 space-y-3 text-gray-700">
                                    {/* Check-In Date */}
                                    <p className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-gray-500"/>
                                        <strong>Check-In:</strong> {formatDate(booking.arrivalDate) || 'N/A'}
                                    </p>

                                    {/* Check-Out Date */}
                                    <p className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-gray-500"/>
                                        <strong>Check-Out:</strong> {formatDate(booking.leavingDate) || 'N/A'}
                                    </p>

                                    {/* Total Guests */}
                                    <p className="flex items-center gap-2">
                                        <Users className="w-5 h-5 text-gray-500"/>
                                        <strong>Total Guests:</strong> {booking.numGuests || 0}
                                    </p>

                                    {/* Total Price */}
                                    <p className="flex items-center gap-2 text-lg font-semibold text-green-600">
                                        <PoundSterling className="w-5 h-5 text-green-500"/>
                                        £{booking.totalPrice || 0}
                                    </p>

                                    <hr className="border-2 border-gray-300 rounded-2xl shadow-lg"/>

                                    <button
                                        type="button"
                                        onClick={() => navigate('/booking-details', {state: {booking}})}
                                        className="w-full p-2 rounded-lg shadow-2xl text-white bg-gray-700 hover:bg-indigo-700 transition-all transform hover:scale-105"
                                    >
                                        More Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingListPage;

