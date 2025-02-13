import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";

const MarketplaceNavigationBar = ({ title, subtitle }) => {
    const location = useLocation(); // Get the current location (URL path)
    const navigate = useNavigate();
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const [businessDashboard, setBusinessDashboard] = useState(null); // null for loading state
    const [loading, setLoading] = useState(true); // Manage loading state while fetching role

    // Function that applies dynamic button styling
    const getButtonClass = (path) => {
        return location.pathname === path
            ? 'bg-indigo-700 text-white rounded-full shadow-2xl shadow-indigo-500/50 px-8 py-3 transform scale-110'
            : 'bg-gray-700 text-white rounded-full shadow-2xl shadow-gray-500/50 px-8 py-3 hover:bg-indigo-700 transition-all transform hover:scale-105';
    };

    // Fetch user role on component mount
    useEffect(() => {
        const roleCheck = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/user-unAuth/role-check`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });

                if (response.ok) {
                    const result = await response.json();
                    setBusinessDashboard(result.user?.role === "business"); // Set true if business
                } else {
                    setBusinessDashboard(false); // Default to false if no role found or error
                }
            } catch (error) {
                console.error('Role check error', error);
                setBusinessDashboard(false); // Default to false on error
            } finally {
                setLoading(false); // Set loading to false when the request is done
            }
        };

        roleCheck();
    }, [backendUrl]);

    const handleLogOut = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/user-Auth/user-logout`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result.message);
                navigate('/');
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Logout error', error);
        }
    };

    // Ensures the navbar adjusts its text depending on the webpage (conditions given)
    const getButtonText = () => {
        switch (location.pathname) {
            case "/booking-confirmation":
                return "View Your Bookings";
            case "/marketplace":
                return "View Your Bookings";
            case "/destination-view":
                return "Marketplace";
            case "/booking-details":
                return "View Your Bookings"
            default:
                return "Marketplace";
        }
    };

    // Ensures the navbar adjusts its redirection address depending on the webpage (conditions given)
    const bookingListViewRedirection = async () => {
        if (location.pathname === '/booking-list') {
            navigate('/marketplace');
        } else if (location.pathname === '/marketplace') {
            navigate('/booking-list');
        } else if (location.pathname === '/destination-view') {
            navigate('/marketplace');
        } else if (location.pathname === '/booking-view') {
            navigate('/marketplace');
        } else if (location.pathname === '/booking-details') {
            navigate('/booking-list');
        } else {
            navigate('/booking-list');
        }
    };

    const businessDashboardRedirection = async () => {
        navigate('/businessDashboard');
    }

    const becomeABusiness = async () => {
        navigate('/become-a-business');
    }

    return (
        <section className="flex justify-between items-center px-6 py-6 gap-x-4">
            {/* Title on the left */}
            <div className="text-left mr-auto">
                <h1 className="font-extrabold text-indigo-700 sm:text-2xl md:text-4xl">
                    {title}
                </h1>
                <h4 className="text-gray-700 sm:text-md md:text-xl">
                    {subtitle}
                </h4>
            </div>

            {/* Buttons on the right */}
            <div className="flex space-x-3.5 p-2">
                {loading ? (
                    <p>Loading...</p> // Show loading state while fetching role
                ) : (
                    <>
                        {businessDashboard ? (
                            <button
                                onClick={businessDashboardRedirection}
                                className={getButtonClass("/businessDashboard")}>
                                Business Dashboard
                            </button>
                        ) : (
                            <button
                                onClick={becomeABusiness}
                                className={getButtonClass("/become-a-business")}>
                                Host Your Home?
                            </button>
                        )}
                        <button
                            onClick={bookingListViewRedirection}
                            className={getButtonClass("/businessDashboard")}>
                            {getButtonText()}
                        </button>
                        <button
                            onClick={handleLogOut}
                            className="bg-gray-700 text-white rounded-full shadow-2xl shadow-gray-500/50 px-8 py-3 hover:bg-red-600 transition-all transform hover:scale-105">
                            Log Out
                        </button>
                    </>
                )}
            </div>
        </section>
    );
};

export default MarketplaceNavigationBar;