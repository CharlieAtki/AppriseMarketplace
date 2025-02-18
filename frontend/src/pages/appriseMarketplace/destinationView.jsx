import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {ArrowLeft, ArrowRight, MapPin, Users, Star, Briefcase, DollarSign, User, Image} from "lucide-react";
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
    const { business_id, name, image, description, highlights, price, country, city, maxGuests, servicesOffered } = state?.destination || {};
    const selectedDestination = state?.destination || {};

    const [ selectedDestinationHost, setSelectedDestinationHost ] = useState([]);

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

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/user-Auth/fetch-user`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'content-type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({_id: business_id}), // "_id" is the attribute / ID of the selected listing object
                });

                // Waiting for the response
                const result = await response.json();

                if (!result || !result.success) {
                    console.error("Error: API did not return a valid user");
                }

                // Setting the useSate as the users object
                setSelectedDestinationHost(result.payload) // info used within the UI

            } catch (error) {
                console.error('Auth check error:', error);
            }
        }

        fetchUser();
    }, []);

    // This checks if destination is either null or undefined.
    // In other words, it evaluates to true if no destination (due to the !state) is selected or the state doesn't have a destination
    if (!state?.destination) {
        return <div>No destination selected.</div>;
    }

    return (
        <div className="p-2">
            <MarketplaceNavigationBar title="Apprise Marketplace" subtitle="Destination Details" />

            <div className="p-4 border border-gray-300 rounded-2xl shadow-lg bg-white w-full lg:w-auto hover:shadow-2xl transition-shadow">
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
                            <ArrowLeft size={20} className="mr-2"/>
                            Back to Marketplace
                        </button>
                    </div>

                    {/* Divider between the title and images */}
                    <hr className="border border-gray-200 mb-4 rounded-2xl"/>

                    {/* Image and Highlights section (Making it a HStack */}
                    <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-8 h-auto lg:h-screen">
                        {/* Main Image Section - Occupies 3/4 of the HStack */}
                        <div className="flex-[5] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid-rows-3 gap-2 sm:gap-4 h-auto lg:h-full">
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
                        <div className="flex-[2] p-6 border border-gray-300 rounded-2xl shadow-lg bg-white w-full h-full lg:w-auto">

                            {/* Host Information */}
                            <div className="flex items-center space-x-4 mb-4">
                                <div
                                    className="w-16 h-16 rounded-full overflow-hidden border flex items-center justify-center bg-gray-200">
                                    {selectedDestinationHost?.profilePicture ? (
                                        <img src={selectedDestinationHost?.profilePicture}
                                             alt={selectedDestinationHost?.username || "Host"}
                                             className="w-full h-full object-cover"/>
                                    ) : (
                                        <Image size={28} className="text-gray-500"/>
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                                        <User className="w-5 h-5 text-indigo-700 mr-2"/>
                                        {selectedDestinationHost?.username || "Unknown Host"}
                                    </h2>
                                    <p className="text-gray-500 text-sm">{selectedDestinationHost?.email || "Email not available"}</p>
                                </div>
                            </div>

                            <hr className="border-t border-gray-300 my-4"/>

                            {/* Service Name */}
                            <div className="mb-4">
                                <h1 className="text-2xl font-bold text-indigo-700">{name}</h1>
                            </div>

                            <hr className="border-t border-gray-300 my-4"/>

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="text-xl sm:text-2xl font-semibold text-indigo-700 mb-3">Description</h3>
                                <p className="text-lg text-gray-700">{description}</p>
                            </div>

                            <hr className="border-t border-gray-300 my-4"/>

                            {/* Location & Max Guests */}
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center space-x-2">
                                    <MapPin className="w-5 h-5 text-indigo-700"/>
                                    <p className="text-lg text-gray-800">{city}, {country}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Users className="w-5 h-5 text-indigo-700"/>
                                    <p className="text-lg text-gray-800">{maxGuests} guests</p>
                                </div>
                            </div>

                            <hr className="border-t border-gray-300 my-4"/>

                            {/* Highlights */}
                            <div className="mb-6">
                                <h3 className="text-xl sm:text-2xl font-semibold text-indigo-700 mb-3 flex items-center">
                                    <Star className="w-5 h-5 text-indigo-700 mr-2"/>
                                    Highlights
                                </h3>
                                {highlights?.length > 0 ? (
                                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                                        {highlights.map((highlight, index) => (
                                            <li key={index} className="text-sm sm:text-lg">{highlight}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-600 text-sm sm:text-lg">No highlights available</p>
                                )}
                            </div>

                            <hr className="border-t border-gray-300 my-4"/>

                            {/* Services Offered */}
                            <div className="mb-6">
                                <h3 className="text-xl sm:text-2xl font-semibold text-indigo-700 mb-3 flex items-center">
                                    <Briefcase className="w-5 h-5 text-indigo-700 mr-2"/>
                                    Services Offered
                                </h3>
                                {Array.isArray(servicesOffered) && servicesOffered.length > 0 ? (
                                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                                        {servicesOffered.map((service, index) => (
                                            <li key={index} className="text-sm sm:text-lg">{service}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-600 text-sm sm:text-lg">No services listed</p>
                                )}
                            </div>

                            <hr className="border-t border-gray-300 my-4"/>

                            {/* Price Per Night */}
                            <div className="flex justify-between items-center mt-6">
                                <h3 className="text-xl sm:text-2xl font-semibold text-indigo-700 flex items-center">
                                    <DollarSign className="w-5 h-5 text-indigo-700 mr-2"/>
                                    Price Per Night
                                </h3>
                                <p className="text-xl font-semibold text-gray-700">
                                    {price ? `£${price.toFixed(2)}` : "Price not available"}
                                </p>
                            </div>

                        </div>
                    </div>

                    <hr className="border border-gray-200 my-4 rounded-2xl"/>

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
                                        host: selectedDestinationHost
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