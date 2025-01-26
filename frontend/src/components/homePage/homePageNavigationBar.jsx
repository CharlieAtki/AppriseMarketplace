import {useLocation, useNavigate} from 'react-router-dom';

const HomePageNavigationBar = ({ title, subtitle}) => {
    const location = useLocation(); // Get the current location (URL path)
    const navigate = useNavigate();

    // Function that compares the buttons path url and the current url
    // Used to improve user-feedback as if the url's match, the button is indigo rather than grey
    const getButtonClass = (path) => {
        return location.pathname === path
            // If truthy (the URL is the same as the buttons path, active state (change the colour)
            ? 'bg-indigo-700 text-white rounded-full shadow-2xl shadow-indigo-500/50 px-8 py-3 transform scale-110' // Active state
            // If falsy (the URL does not match the buttons path, inactive state (don's change the colour)
            : 'bg-gray-700 text-white rounded-full shadow-2xl shadow-gray-500/50 px-8 py-3 hover:bg-indigo-700 transition-all transform hover:scale-105'; // Inactive state
    };

    const handleSignIn = async () => {
        navigate('/customerAccountManagement');
    };

    return (
        <section className="flex justify-between items-center px-8 py-8 gap-x-4">
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
                {/* Using React client-side routing, if the button is pressed, route the user to / */}
                <button
                    onClick={handleSignIn}
                    className={getButtonClass("/customerAccountManagement")}>
                    Sign In
                </button>
            </div>
        </section>
    );
};

// Exporting the component, which can be used multiple times across the codebase
export default HomePageNavigationBar;