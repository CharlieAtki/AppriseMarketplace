import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, PoundSterling, MapPin, Users } from 'lucide-react';
import MarketplaceNavigationBar from "../../components/appriseMarketplace/marketplaceNavigationBar"; // Assuming you use feather icons

const BookingDetailsPage = () => {
    const { state } = useLocation();
    const booking = state?.booking; // Getting the booking data passed from the previous page

    if (!booking) {
        return (
            <div className="flex justify-center items-center h-screen text-center text-red-500">
                <p>Error: No booking details available!</p>
            </div>
        );
    }

    const formatDate = (date) => {
        if (!date) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    return (
        <div className="p-6 bg-gray-50 space-y-4">
            <MarketplaceNavigationBar title={"Booking Details"} subtitle={"Detailed Information About Your Booking"}/>

            <hr className="border-2 border-gray-300 rounded-2xl shadow-lg"/>

            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-6 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-indigo-700 text-center mb-8">Booking Details</h1>

                {/* Booking Details Container */}
                <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 w-full max-w-4xl space-y-6">
                    {/* Destination */}
                    <div className="flex items-center gap-2">
                        <MapPin className="w-6 h-6 text-indigo-500"/>
                        <h2 className="text-2xl font-semibold text-indigo-700">{booking.destinationName}</h2>
                    </div>

                    {/* Dates Section */}
                    <div className="space-y-4">
                        <p className="flex items-center gap-2 text-lg text-gray-700">
                            <Calendar className="w-5 h-5 text-gray-500"/>
                            <strong>Check-In:</strong> {formatDate(booking.arrivalDate)}
                        </p>
                        <p className="flex items-center gap-2 text-lg text-gray-700">
                            <Calendar className="w-5 h-5 text-gray-500"/>
                            <strong>Check-Out:</strong> {formatDate(booking.leavingDate)}
                        </p>
                    </div>

                    {/* Guest and Price Info */}
                    <div className="space-y-4">
                        <p className="flex items-center gap-2 text-lg text-gray-700">
                            <Users className="w-5 h-5 text-gray-500"/>
                            <strong>Total Guests:</strong> {booking.numGuests}
                        </p>
                        <p className="flex items-center gap-2 text-lg font-semibold text-green-600">
                            <PoundSterling className="w-5 h-5 text-green-500"/>
                            <strong>Total Price:</strong> {booking.currency} {booking.totalPrice.toFixed(2)}
                        </p>
                    </div>

                    {/* Booking Status */}
                    <div className="flex items-center gap-2">
                        <span className="px-4 py-2 rounded-lg text-white bg-gray-700">
                            <strong>Status:</strong> {booking.bookingStatus}
                        </span>
                    </div>

                    {/* Payment Details */}
                    {booking.paymentDetails && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-gray-700">Payment Details</h3>
                            <p className="text-lg text-gray-700">
                                <strong>Transaction ID:</strong> {booking.paymentDetails.transactionId || 'N/A'}
                            </p>
                            <p className="text-lg text-gray-700">
                                <strong>Payment Method:</strong> {booking.paymentDetails.paymentMethod || 'N/A'}
                            </p>
                            <p className="text-lg text-gray-700">
                                <strong>Paid Amount:</strong> {booking.paymentDetails.paidAmount || 0}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingDetailsPage;