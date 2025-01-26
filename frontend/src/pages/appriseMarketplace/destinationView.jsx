import {useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import MarketplaceNavigationBar from "../../components/appriseMarketplace/marketplaceNavigationBar";

const DestinationView = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    // The expression const { name, image, description, highlights } = state?.destination || {};
    // uses destructuring to extract values from the destination object within state.
    // The ?. (optional chaining) ensures that if state or destination is null or undefined, it won’t throw an error.
    // Instead, it defaults to an empty object ({}).
    // This means that if the object is missing or has missing properties,
    // the destructured variables (name, image, description, and highlights) will be undefined rather than causing an error.
    const { name, image, description, highlights } = state?.destination || {};

    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/user-unAuth/auth-check`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'content-type': 'application/json',
                        'Accept': 'application/json',
                    }
                });

                console.log('Auth check response:', response);
                const result = await response.json();
                console.log('Auth check result:', result);

                if (!result || !result.success) {
                    navigate('/customerAccountManagement');
                }
            } catch (error) {
                console.error('Auth check error:', error);
                navigate('/customerAccountManagement');
            }
        };

        checkLoginStatus();
    }, [navigate, backendUrl]);

    // This checks if destination is either null or undefined.
    // In other words, it evaluates to true if no destination (due to the !state) is selected or the state doesn't have a destination
    if (!state?.destination) {
        return <div>No destination selected.</div>;
    }

    return (
        <div className="p-6">
            <MarketplaceNavigationBar title="Apprise Marketplace" subtitle="Destination Details" />

            <div className="py-4 px-4 border-2 border-gray-300 rounded-2xl hover:shadow-2xl transition-shadow duration-300">
                <div className="w-full mx-auto">
                    {/* Heading Section */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-indigo-700">
                            {name}
                        </h2>
                        <button
                            onClick={() => navigate("/marketplace")}
                            className="text-gray-600 hover:text-indigo-700 flex items-center"
                        >
                            <ArrowLeft size={20} className="mr-2" />
                            Back to Marketplace
                        </button>
                    </div>

                    {/* Divider between the title and images */}
                    <hr className="border-t-2 border-gray-300 my-4"/>

                    {/* Image and Highlights section (Making it a HStack */}
                    <div className="flex items-start justify-between gap-8 p-2 h-screen">
                        {/* Main Image Section - Occupies 3/4 of the HStack */}
                        <div className="flex-[3] grid grid-cols-3 grid-rows-3 gap-4 h-full">
                            <div className="col-span-2 row-span-2">
                                <img
                                    src={image}
                                    alt={name}
                                    className="w-full h-full object-cover rounded-2xl"
                                />
                            </div>
                            <div className="col-span-1 row-span-1">
                                <img
                                    src={image}
                                    alt={name}
                                    className="w-full h-full object-cover rounded-2xl"
                                />
                            </div>
                            <div className="col-span-1 row-span-1">
                                <img
                                    src={image}
                                    alt={name}
                                    className="w-full h-full object-cover rounded-2xl"
                                />
                            </div>
                            <div className="col-span-3 row-span-3">
                                <img
                                    src={image}
                                    alt={name}
                                    className="w-full h-full object-cover rounded-2xl"
                                />
                            </div>
                        </div>

                        {/* Highlights Section - Occupies 1/4 of the HStack */}
                        <div className="flex-[1] flex flex-col h-full p-4 border-2 border-gray-300 rounded-2xl hover:shadow-2xl transition-shadow">
                            <div>
                                <h3 className="text-2xl font-semibold text-indigo-700 mb-3">
                                    Highlights
                                </h3>
                                <ul className="list-disc list-inside space-y-2 flex-grow">
                                    {highlights.map((highlight, index) => (
                                        <li key={index} className="text-gray-600 text-lg">
                                            {highlight}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <hr className="border-t-2 border-gray-300 my-4"/>
                            <div>
                                {/* Description Section */}
                                <h3 className="text-2xl font-semibold text-indigo-700 mb-3">
                                    Description
                                </h3>
                                <p className="text-gray-800 text-lg mb-6">
                                    {description}
                                </p>
                            </div>
                        </div>
                    </div>

                    <hr className="border-t-2 border-gray-300 my-4"/>

                    {/* Call to Action */}
                    <button
                        onClick={() => navigate("/booking")}
                        className="w-full bg-indigo-700 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors flex justify-center items-center"
                    >
                        Book Your Trip
                        <ArrowRight
                            className="ml-2 transform transition-transform"
                            size={20}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DestinationView;