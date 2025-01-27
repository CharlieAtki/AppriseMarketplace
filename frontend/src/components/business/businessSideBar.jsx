import { Home, Settings, BarChart2, LogOut } from "lucide-react"; // Icons from Lucide
import { useNavigate } from "react-router-dom";

const BusinessSideBar = () => {
    const navigate = useNavigate();

     // Defining the environment variables
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const handleHomeRedirection = async () => {
        navigate('/businessDashboard');
    };

    const businessAnalyticsRedirection = async () => {
        navigate('/businessAnalytics');
    };

    const handleLogOut = async () => {
        try {
            // need to adjust the backend env variables - these are not used
            const response = await fetch(`${backendUrl}/api/business-Auth/business-logout`, {
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

    return (
        <div className="h-full bg-gradient-to-b from-indigo-600 to-indigo-800 p-6 text-white flex flex-col">
            {/* Sidebar Header */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-1">
                    Apprise Marketplace
                </h3>
                <p className="text-sm font-light text-indigo-200">
                    Dashboard
                </p>
            </div>
            {/* Navigation Links */}
            <nav className="flex-grow">
                <ul className="space-y-4">
                    <li>
                        <button
                            onClick={handleHomeRedirection}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-indigo-700 transition"
                        >
                            <Home size={20} />
                            <span>Home</span>
                        </button>
                    </li>
                    <li>
                        <button
                          onClick={businessAnalyticsRedirection}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-indigo-700 transition"
                        >
                          <BarChart2 size={20} />
                          <span>Analytics</span>
                        </button>
                    </li>
                    <li>
                        <a
                          href="#"
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-indigo-700 transition"
                        >
                          <Settings size={20} />
                          <span>Settings</span>
                        </a>
                    </li>
                </ul>
            </nav>

            {/* Logout Section */}
            <div className="mt-6">
                <button
                    onClick={handleLogOut}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-red-600 transition"
                >
                <LogOut size={20} />
                <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default BusinessSideBar;