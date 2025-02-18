import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings, Store } from "lucide-react";

const AccountSettingsSideBar = () => {
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(false);

    // Define environment variables
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const marketplaceRedirection = () => navigate('/marketplace');

    const accountSettingsRedirection = () => navigate('/account-settings');
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
                <p className="text-sm font-light text-indigo-200">Account Management</p>
            </div>

            {/* Navigation Links */}
            <nav className="flex-grow">
                <ul className="space-y-4">
                    <li>
                        <button
                            onClick={accountSettingsRedirection}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-indigo-700 transition"
                        >
                            <Settings size={20} />
                            {isExpanded && <span>Settings</span>}
                        </button>
                    </li>
                </ul>
            </nav>

            {/* Logout Section */}
            {/* When expanded, the text explaining the images will appear */}
            <div className="mt-6 space-y-4">
                <div>
                    <button
                        onClick={marketplaceRedirection}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        <Store size={20} />
                        {isExpanded && <span>Marketplace</span>}
                    </button>
                </div>
                <div>
                    <button
                        onClick={handleLogOut}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-red-600 transition"
                    >
                        <LogOut size={20} />
                        {isExpanded && <span>Logout</span>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountSettingsSideBar;