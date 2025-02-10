import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, ArrowLeft } from "lucide-react";
import MarketplaceNavigationBar from "../../components/appriseMarketplace/marketplaceNavigationBar";

const BookingSuccessPage = () => {
    const navigate = useNavigate();
    const { state } = useLocation();

    // Destructure the necessary properties from the state or set default values
    const {
        destination,
        checkInDate,
        checkOutDate,
        adults,
        children,
        totalGuests,
        totalPrice
    } = state || {};

    // Helper function to safely format dates
    const formatDate = (date) => {
        if (!date) return ''; // Return an empty string if date is undefined or null
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    // Check if destination exists before trying to render its properties
    if (!destination) {
        return <div>No booking details available.</div>;
    }

    return (
        <div>
            {/* Navigation Bar */}
            <div className="bg-gray-100">
                <MarketplaceNavigationBar title="Booking Confirmation" subtitle="Your booking was successful!" />
            </div>

            {/* Booking Confirmation Card */}
            <div className="p-6 flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white shadow-xl rounded-3xl p-8 max-w-2xl w-full text-center md:w-3/4 lg:w-1/2 transform transition-all hover:scale-105 hover:shadow-2xl">
                    <CheckCircle size={80} className="text-green-500 mx-auto" />
                    <h2 className="text-3xl font-bold text-gray-800 mt-6">Booking Confirmed!</h2>
                    <p className="text-lg text-gray-600 mt-3">Thank you for booking with us. Here are your booking details:</p>

                    {/* Render booking details if they are available */}
                    <div className="mt-6 text-left border-t border-gray-300 pt-6 text-lg">
                        <p><strong>Destination:</strong> {destination.name || 'N/A'}</p>
                        <p><strong>Check-In:</strong> {formatDate(checkInDate) || 'N/A'}</p>
                        <p><strong>Check-out:</strong> {formatDate(checkOutDate) || 'N/A'}</p>
                        <p><strong>Adults:</strong> {adults || 0}</p>
                        <p><strong>Children:</strong> {children || 0}</p>
                        <p><strong>Total Guests:</strong> {totalGuests || 0}</p>
                        <p><strong>Total Price:</strong> £{totalPrice || 0}</p>
                    </div>

                    <button
                        onClick={() => navigate("/marketplace")}
                        className="mt-8 bg-indigo-600 text-white py-3 px-6 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition-colors">
                        <ArrowLeft size={20} className="inline-block mr-2" /> Back to Marketplace
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingSuccessPage;
