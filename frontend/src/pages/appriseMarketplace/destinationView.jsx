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
    const { name, image, description, highlights, price, country, city, maxGuests, servicesOffered } = state?.destination || {};
    const selectedDestination = state?.destination || {};

    const backendUrl = process.env.REACT_APP_BACKEND_URL; // Fetching the backend URL from the env file

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
                    <div
                        className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-8 p-2 h-auto lg:h-screen">
                        {/* Main Image Section - Occupies 3/4 of the HStack */}
                        <div
                            className="flex-[3] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid-rows-3 gap-2 sm:gap-4 h-auto lg:h-full">
                            <div className="col-span-1 sm:col-span-2 row-span-2">
                                <img
                                    src={image}
                                    alt={name}
                                    className="w-full h-[150px] sm:h-[200px] lg:h-full object-cover rounded-2xl"
                                />
                            </div>
                            <div className="col-span-1 row-span-1">
                                <img
                                    src={image}
                                    alt={name}
                                    className="w-full h-[100px] sm:h-[150px] lg:h-full object-cover rounded-2xl"
                                />
                            </div>
                            <div className="col-span-1 row-span-1">
                                <img
                                    src={image}
                                    alt={name}
                                    className="w-full h-[100px] sm:h-[150px] lg:h-full object-cover rounded-2xl"
                                />
                            </div>
                            <div className="col-span-3 row-span-3">
                                <img
                                    src={image}
                                    alt={name}
                                    className="w-full h-[120px] sm:h-[180px] lg:h-full object-cover rounded-2xl"
                                />
                            </div>
                        </div>

                        {/* Information Panel */}
                        <div
                            className="flex-1 p-4 border-2 border-gray-300 rounded-2xl hover:shadow-2xl transition-shadow w-full h-full lg:w-auto">

                            {/* Service Name */}
                            <div className="mb-4">
                                <p className="text-2xl font-semibold text-indigo-700">{name}</p>
                            </div>

                            <hr className="border-t-2 border-gray-300 my-4"/>

                            {/* Description Section */}
                            <div className="mb-6">
                                <h3 className="text-xl sm:text-2xl font-semibold text-indigo-700 mb-3">Description</h3>
                                <p className="text-lg text-gray-700">{description}</p>
                            </div>

                            <hr className="border-t-2 border-gray-300 my-4"/>

                            {/* Location & Max Guests */}
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex flex-col">
                                    <p className="text-md sm:text-lg text-gray-600"><strong>Location:</strong></p>
                                    <p className="text-lg text-gray-800">{city}, {country}</p>
                                </div>
                                <div className="flex flex-col text-right">
                                    <p className="text-md sm:text-lg text-gray-600"><strong>Max Guests:</strong></p>
                                    <p className="text-lg text-gray-800">{maxGuests}</p>
                                </div>
                            </div>

                            <hr className="border-t-2 border-gray-300 my-4"/>

                            {/* Highlights Section */}
                            <div className="mb-6">
                                <h3 className="text-xl sm:text-2xl font-semibold text-indigo-700 mb-3">Highlights</h3>
                                {highlights && highlights.length > 0 ? (
                                    <ul className="list-disc list-inside space-y-2">
                                        {highlights.map((highlight, index) => (
                                            <li key={index}
                                                className="text-gray-600 text-sm sm:text-lg">{highlight}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-600 text-sm sm:text-lg">No highlights available</p>
                                )}
                            </div>

                            <hr className="border-t-2 border-gray-300 my-4"/>

                            {/* Services Offered Section */}
                            <div className="mb-6">
                                <h3 className="text-xl sm:text-2xl font-semibold text-indigo-700 mb-3">Services
                                    Offered</h3>
                                {Array.isArray(servicesOffered) && servicesOffered.length > 0 ? (
                                    <ul className="list-disc list-inside space-y-2">
                                        {servicesOffered.map((service, index) => (
                                            <li key={index} className="text-gray-600 text-sm sm:text-lg">{service}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-600 text-sm sm:text-lg">No services listed</p>
                                )}
                            </div>

                            <hr className="border-t-2 border-gray-300 my-4"/>

                            {/* Price Per Night Section */}
                            <div className="mt-6">
                                <h3 className="text-xl sm:text-2xl font-semibold text-indigo-700 mb-3">Price Per
                                    Night</h3>
                                <p className="text-xl font-semibold text-gray-700">{price ? `£${price.toFixed(2)}` : "Price not available"}</p>
                            </div>
                        </div>


                    </div>

                    <hr className="border-t-2 border-gray-300 my-4"/>

                    {/* Call to Action */}
                    {/* Passing the specific attributes to the next page, which are needed to create the booking doc */}
                    <button
                        className="w-full bg-indigo-700 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors flex justify-center items-center"
                        onClick={() => {
                            navigate('/booking-view',
                                {
                                    state: {
                                        destination: {
                                            ...selectedDestination,
                                            _id: selectedDestination._id,
                                            price: selectedDestination.price
                                        },
                                    },
                                });
                        }}
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