import {useLocation, useNavigate} from 'react-router-dom';
import {useEffect, useState} from "react";

const MarketplaceNavigationBar = ({ title, subtitle}) => {
    const location = useLocation(); // Get the current location (URL path)
    const navigate = useNavigate();
    // Defining the environment variables
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const [businessDashboard, setBusinessDashboard] = useState(false); // Manages what UI the user sees depending on their role


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
                    setBusinessDashboard(result.userRole === "business"); // Set true if business
                }
            } catch (error) {
                console.error('Role check error', error);
            }
        };

        roleCheck();
    }, [backendUrl]); // Runs only when `backendUrl` changes

    const handleLogOut = async () => {
        try {
            // need to adjust the backend env variables - these are not used
            const response = await fetch(`${backendUrl}/api/user-Auth/user-logout`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
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

    // Define button text based on the current pathname
    // Allow the button to dynamically change text based on the current URL
    const getButtonText = () => {
        switch (location.pathname) {
            case "/booking-confirmation":
                return "View Your Bookings";
            case "/marketplace":
                return "View Your Bookings";
            case "/destination-view":
                return "Marketplace";
            default:
                return "Marketplace";
        }
    };

    // Button used to redirect the user to the business dashboard
    const businessDashboardRedirection = async () => {
        navigate('/businessDashboard');
    }

    const becomeABusiness = async () => {
        navigate('/become-a-business');
    }

    // Redirection handler to send the user
    const bookingListViewRedirection = async () => {
        if (location.pathname === '/booking-list') {
            navigate('/marketplace');
        } else if (location.pathname === '/marketplace') {
            navigate('/booking-list');
        } else if (location.pathname === '/destination-view') {
            navigate('/marketplace');
        } else if (location.pathname === '/booking-view') {
            navigate('/marketplace');
        } else {
            navigate('/booking-list');
        }
    };

    return (
        <section className="flex justify-between items-center px-6 py-6 gap-x-4">
            {/* Title on the left */}
            {/* sm:text-2xl - On small screens, the text is 2xl*/}
            {/* md:text-2xl - On medium screens, the text is 4xl*/}
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
                {businessDashboard ? ( // Ternary operator to adjust the buttons within the navigation bar depending on user role
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
            </div>
        </section>
    );
};

// Exporting the component, which can be used multiple times across the codebase
export default MarketplaceNavigationBar;