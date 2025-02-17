import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const MarketplaceNavigationBar = ({ title, subtitle }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const [businessDashboard, setBusinessDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);

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

    const handleLogOut = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/user-Auth/user-logout`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (response.ok) {
                navigate('/customerAccountManagement');
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
    const becomeABusiness = () => navigate('/become-a-business');

    return (
        <section className="flex justify-between items-center px-6 py-6 relative">
            {/* Title Section */}
            <div className="text-left">
                <h1 className="font-extrabold text-indigo-700 text-2xl md:text-4xl">
                    {title}
                </h1>
                <h4 className="text-gray-700 text-md md:text-xl">
                    {subtitle}
                </h4>
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
                                <div className="absolute top-full right-0 bg-white shadow-xl rounded-lg border border-gray-300 w-64 z-50 p-3 flex flex-col space-y-3">
                                    {loading ? (
                                        <p className="text-gray-600 text-center">Loading...</p>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => {
                                                    handleLogOut();
                                                    setMenuOpen(false);
                                                }}
                                                className="bg-gray-700 text-white rounded-xl shadow-md px-6 py-3 hover:bg-red-700 hover:shadow-lg transition-all transform hover:scale-105">
                                                Log Out
                                            </button>
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
                    <div className="absolute top-full right-0 bg-white shadow-xl rounded-lg border border-gray-300 w-64 z-50 p-3 flex flex-col space-y-3">
                        {loading ? (
                            <p className="text-gray-600 text-center">Loading...</p>
                        ) : (
                            <>
                                {businessDashboard ? (
                                    <button
                                        onClick={() => {
                                            businessDashboardRedirection();
                                            setMenuOpen(false);
                                        }}
                                        className={getButtonClass("/businessDashboard")}>
                                        Business Dashboard
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            becomeABusiness();
                                            setMenuOpen(false);
                                        }}
                                        className={getButtonClass("/become-a-business")}>
                                        Host Your Home?
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        bookingListViewRedirection();
                                        setMenuOpen(false);
                                    }}
                                    className={getButtonClass("/booking-list")}>
                                    {getButtonText()}
                                </button>
                                <button
                                    onClick={() => {
                                        handleLogOut();
                                        setMenuOpen(false);
                                    }}
                                    className="bg-gray-700 text-white rounded-xl shadow-md px-6 py-3 hover:bg-red-700 hover:shadow-lg transition-all transform hover:scale-105">
                                    Log Out
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default MarketplaceNavigationBar;