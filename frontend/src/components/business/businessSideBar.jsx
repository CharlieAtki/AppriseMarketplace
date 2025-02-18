import { useNavigate } from "react-router-dom";
import { BarChart2, Home, LogOut, Settings, Store } from "lucide-react";

const AccountSettingsSideBar = ({ isExpanded, setIsExpanded }) => {
    const navigate = useNavigate();

    // Define environment variables
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const handleHomeRedirection = () => navigate('/businessDashboard');
    const businessAnalyticsRedirection = () => navigate('/businessAnalytics');
    const marketplaceRedirection = () => navigate('/marketplace');

    const handleLogOut = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/business-Auth/business-logout`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (response.ok) {
                console.log("Logout successful");
                navigate('/');
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Logout error', error);
        }
    };

    // The CSS below means that when the sidebar is hovered over, it will expand
    return (
        <div
            className={`h-full bg-gradient-to-b from-indigo-600 to-indigo-800 text-white flex flex-col transition-all duration-300 ${
                isExpanded ? "w-48 p-6" : "w-16 p-4"
            }`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            {/* Sidebar Header */}
            <div className={`mb-8 transition-opacity ${isExpanded ? "opacity-100" : "opacity-0 hidden"}`}>
                <h3 className="text-lg font-semibold">Apprise Marketplace</h3>
                <p className="text-sm font-light text-indigo-200">Business Management</p>
            </div>

            {/* Navigation Links */}
            <nav className="flex-grow">
                <ul className="space-y-4">
                    <li>
                        <button
                            onClick={() => navigate('/businessDashboard')}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-indigo-700 transition"
                        >
                            <Home size={20}/>
                            {isExpanded && <span>Home</span>}
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => navigate('/businessAnalytics')}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-indigo-700 transition"
                        >
                            <BarChart2 size={20}/>
                            {isExpanded && <span>Analytics</span>}
                        </button>
                    </li>
                    <li>
                        <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-indigo-700 transition">
                            <Settings size={20}/>
                            {isExpanded && <span>Settings</span>}
                        </button>
                    </li>
                </ul>
            </nav>

            {/* Logout Section */}
            <div className="mt-6 space-y-4">
                <div>
                    <button
                        onClick={() => navigate('/marketplace')}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        <Store size={20}/>
                        {isExpanded && <span>Marketplace</span>}
                    </button>
                </div>
                <div>
                    <button
                        onClick={async () => {
                            try {
                                await fetch(`${backendUrl}/api/business-Auth/business-logout`, {
                                    method: 'GET',
                                    headers: {'Content-Type': 'application/json'},
                                    credentials: 'include',
                                });
                                navigate('/');
                            } catch (error) {
                                console.error('Logout error', error);
                            }
                        }}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-red-600 transition"
                    >
                        <LogOut size={20}/>
                        {isExpanded && <span>Logout</span>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountSettingsSideBar;