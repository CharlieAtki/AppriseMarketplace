import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import {Menu, X, Rocket, Home, Calendar, DoorOpen, Settings} from "lucide-react";

const MarketplaceNavigationBar = ({ title, subtitle }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const [businessDashboard, setBusinessDashboard] = useState(null); // Manages the navBar view based on the users role
    const [currentUser, setCurrentUser] = useState(null); // Manages the current user loggedIn
    const [loading, setLoading] = useState(true); // Manages the loading state
    const [menuOpen, setMenuOpen] = useState(false); // Manages the menu state
    const [isExpanded, setIsExpanded] = useState(false); // Manages if a user is hovering over the NavBar Component

    const getButtonClass = (path) => {
        return location.pathname === path
            ? 'bg-gray-700 text-white rounded-xl shadow-md px-6 sm:px-8 py-3 transition-all transform scale-105'
            : 'bg-gray-700 text-white rounded-xl shadow-md px-6 sm:px-8 py-3 hover:bg-indigo-700 hover:shadow-lg transition-all transform hover:scale-105';
    };

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
                    setBusinessDashboard(result.user?.role === "business");
                } else {
                    setBusinessDashboard(false);
                }
            } catch (error) {
                console.error('Role check error', error);
                setBusinessDashboard(false);
            } finally {
                setLoading(false);
            }
        };

        roleCheck();
    }, [backendUrl]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/user-Auth/fetch-current-user`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'content-type': 'application/json',
                        'Accept': 'application/json',
                    },
                });

                // Waiting for the response
                const result = await response.json();

                if (!result || !result.success) {
                    console.error("Error: API did not return a valid user");
                }

                // Setting the useSate as the users object
                setCurrentUser(result.payload) // info used within the UI

            } catch (error) {
                console.error('Auth check error:', error);
            }
        }

        fetchUser();
    }, []);

    const handleLogOut = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/user-Auth/user-logout`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (response.ok) {
                navigate('/');
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Logout error', error);
        }
    };

    const getButtonText = () => {
        switch (location.pathname) {
            case "/booking-confirmation":
            case "/marketplace":
                return "View Your Bookings";
            case "/destination-view":
            case "/booking-view":
                return "Marketplace";
            case "/booking-details":
                return "View Your Bookings";
            default:
                return "Marketplace";
        }
    };

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

    const businessDashboardRedirection = () => navigate('/businessDashboard');

    // Api request to switch the users account role to a business - Uses the email stored within the session
    const becomeABusiness = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/business-Auth/become-a-business`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'content-type': 'application/json',
                    'Accept': 'application/json',
                }
            });

            const result = await response.json();

            if (!result || !result.success) {
                navigate('/');
            } else {
                navigate('/businessDashboard');
            }
        } catch (error) {
            console.error('Business Dashboard', error);
        }
    };

    const accountSettingsRedirection =  () => navigate('/account-settings');

    return (
        <section className="flex justify-between items-center px-6 py-6 relative">

            {/* Logo + Text Container */}
            <div className="flex justify-between items-center gap-x-8">
                {/* Logo */}
                <a href="/" className="group relative block w-fit" aria-label="Go to Homepage">
                    {/* Logo Container */}
                    <div className="relative transition-transform duration-300 group-hover:scale-110">
                        {/* Soft Glow Effect on Hover */}
                        <div
                            className="absolute inset-0 bg-indigo-200/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        {/* Logo Wrapper */}
                        <div className="relative bg-white/90 backdrop-blur-md rounded-full p-3 shadow-lg">
                            <img
                                src="https://res.cloudinary.com/dtjcj2krm/image/upload/t_1To1/v1740137665/Screenshot_2025-02-21_at_11.19.24_npmcgm.png"
                                alt="Apprise Logo"
                                className="h-12 w-12 drop-shadow-md"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </a>

                {/* Title Section */}
                <div className="text-left">
                    <h1 className="font-extrabold text-indigo-700 text-2xl md:text-4xl">
                        {title}
                    </h1>
                    <h4 className="text-gray-700 text-md md:text-xl">
                        {subtitle}
                    </h4>
                </div>
            </div>

            {/* Desktop Buttons */}
            <div className="hidden lg:flex space-x-4">
                {loading ? (
                    <div className="relative flex justify-center items-center">
                        <svg className="w-8 h-8 text-indigo-700 animate-spin" xmlns="http://www.w3.org/2000/svg"
                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <circle cx="12" cy="12" r="10" strokeWidth="4" className="text-gray-300"/>
                            <circle cx="12" cy="12" r="10" strokeWidth="4" strokeDasharray="63" strokeDashoffset="50"
                                    className="text-indigo-700"/>
                        </svg>
                    </div>
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
                            className={getButtonClass("/booking-list")}>
                            {getButtonText()}
                        </button>

                        <div>
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="text-indigo-700 focus:outline-none p-2 rounded-md hover:bg-gray-200 transition">
                                {menuOpen ? <X size={32} /> : <Menu size={32} />}
                            </button>

                            {/* Mobile Dropdown Menu */}
                            {menuOpen && (
                                <div className="absolute top-full right-0 bg-white shadow-xl rounded-xl border border-gray-200 w-64 z-50 p-2 flex flex-col space-y-2 animate-fade-in">
                                    {loading ? (
                                        <p className="text-gray-600 text-center">Loading...</p>
                                    ) : (
                                        <>
                                            <div className="py-2 px-4 text-sm text-gray-700">
                                                <p className="font-semibold text-gray-900">Signed in as</p>
                                                <p className="text-gray-600">{currentUser?.email || "Unknown Email"}</p>
                                            </div>

                                            {/* Separator */}
                                            <hr className="border-gray-300 my-2"/>

                                            {/* Settings */}
                                            <div>
                                                <button
                                                    onClick={() => {
                                                        accountSettingsRedirection();
                                                        setMenuOpen(false);
                                                    }}
                                                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none flex items-center gap-2"
                                                >
                                                    <Settings size={20}/> Settings
                                                </button>
                                            </div>

                                            {/* Separator */}
                                            <hr className="border-gray-300 my-2"/>

                                            {/* Log Out Button */}
                                            <div>
                                                <button
                                                    onClick={() => {
                                                        handleLogOut();
                                                        setMenuOpen(false);
                                                    }}
                                                    className="w-full px-4 py-2 text-sm text-white bg-gray-700 rounded-lg shadow-md hover:bg-red-600 focus:outline-none transform transition-all flex items-center gap-2"
                                                >
                                                    <DoorOpen size={20}/> Log Out
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden relative">
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="text-indigo-700 focus:outline-none p-2 rounded-md hover:bg-gray-200 transition">
                    {menuOpen ? <X size={32} /> : <Menu size={32} />}
                </button>

                {/* Mobile Dropdown Menu */}
                {menuOpen && (
                    <div className="absolute top-full right-0 bg-white shadow-xl rounded-xl border border-gray-200 w-64 z-50 p-2 flex flex-col space-y-2 animate-fade-in">
                        {loading ? (
                          <p className="text-gray-600 text-center">Loading...</p>
                        ) : (
                            <>
                                {/* Header for Business Options */}
                                <div className="py-2 px-4 text-sm text-gray-700">
                                    <p className="font-semibold text-gray-900">Signed in as</p>
                                    <p className="text-gray-600">{currentUser?.email || "Unknown Email"}</p>
                                </div>

                                {/* Separator */}
                                <hr className="border-gray-300 "/>

                                <div>
                                    {businessDashboard ? (
                                        <button
                                            onClick={() => {
                                                businessDashboardRedirection();
                                                setMenuOpen(false);
                                            }}
                                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none flex items-center gap-2"
                                        >
                                            <Rocket size={20}/> Business Dashboard
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                becomeABusiness();
                                                setMenuOpen(false);
                                            }}
                                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none flex items-center gap-2"
                                        >
                                            <Home size={20}/> Host Your Home?
                                        </button>
                                    )}
                                </div>

                                {/* Header for Booking */}
                                <div>
                                    <button
                                        onClick={() => {
                                            bookingListViewRedirection();
                                            setMenuOpen(false);
                                        }}
                                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none flex items-center gap-2"
                                    >
                                        <Calendar size={20}/> {getButtonText()}
                                    </button>
                                </div>

                                {/* Settings */}
                                <div>
                                    <button
                                        onClick={() => {
                                            accountSettingsRedirection();
                                            setMenuOpen(false);
                                        }}
                                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none flex items-center gap-2"
                                    >
                                        <Settings size={20}/> Settings
                                    </button>
                                </div>

                                {/* Separator */}
                                <hr className="border-gray-300 my-2"/>

                                {/* Log Out Button */}
                                <div>
                                    <button
                                        onClick={() => {
                                            handleLogOut();
                                            setMenuOpen(false);
                                        }}
                                        className="w-full px-4 py-2 text-sm text-white bg-gray-700 rounded-lg shadow-md hover:bg-red-600 focus:outline-none transform transition-all flex items-center gap-2"
                                    >
                                        <DoorOpen size={20}/> Log Out
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default MarketplaceNavigationBar;