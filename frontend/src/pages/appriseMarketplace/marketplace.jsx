import { ArrowRight } from "lucide-react";
import MarketplaceNavigationBar from "../../components/appriseMarketplace/marketplaceNavigationBar"; // React Icons
import croatiaImg from '../../assets/Croatia.jpg';
import singaporeImg from '../../assets/Singapore.jpg';
import romeImg from '../../assets/Rome.jpg';
import bahamasImg from '../../assets/Bahamas.jpg';
import toronto from '../../assets/Toronto.jpg';
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";


const Shop = () => {
    const navigate = useNavigate();
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


    // An array of objects, which represent individual locations. This array is mapped to create the components dynamically
    // Adding the webpage url to each object. This is used to redirect the user when the location/destination is selected
    const destinations = [
        {
            name: "Croatia",
            image: croatiaImg,
            description: "Explore the stunning national parks",
            highlights: ["Plitvice Lakes", "Dubrovnik", "Coastal Beauty"]
        },
        {
            name: "Singapore",
            image: singaporeImg,
            description: "Discover urban wonders and cultural richness",
            highlights: ["Marina Bay Sands", "Gardens by the Bay", "Diverse Cuisine"]
        },
        {
            name: "Rome",
            image: romeImg,
            description: "Immerse yourself in ancient wonders",
            highlights: ["Colosseum", "Vatican City", "Roman Forum"]
        },
        {
            name: "Bahamas",
            image: bahamasImg,
            description: "Paradise beaches in the sun ",
            highlights: ["Pink Sands Beach", "Pig Beach", "CocoCay"]
        },
        {
            name: "Toronto",
            image: toronto,
            description: "City Break",
            highlights: ["CN Tower", "High Park", "Toronto Islands"]
        }
    ];

    return (
        <div className="p-6 ">
            <MarketplaceNavigationBar title="Apprise Marketplace" subtitle="Holidays Made Simple"/>

            <div className="py-6 px-4 border-2 border-gray-300 rounded-2xl hover:shadow-2xl transition-shadow duration-300">
                <div className="w-full mx-auto">
                    <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
                        Explore Destinations
                    </h2>

                    <div className="pt-6 pb-6 flex justify-center overflow-x-auto ">
                        <div className="flex space-x-6 pb-6">
                            {destinations.map((destination, index) => (
                                <div
                                    key={destination.name}
                                    className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl group"
                                >
                                    <div className="relative">
                                        <img
                                            src={destination.image}
                                            alt={destination.name}
                                            className="w-full h-56 object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black opacity-20 group-hover:opacity-30 transition-opacity"></div>
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                                            {destination.name}
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            {destination.description}
                                        </p>

                                        <div className="mb-4">
                                            <h4 className="text-sm font-medium text-gray-500 mb-2">Highlights:</h4>
                                            <div className="flex space-x-2">
                                                {destination.highlights.map((highlight) => (
                                                    <span
                                                        key={highlight}
                                                        className="bg-blue-50 text-indigo-500 px-2 py-1 rounded-full text-xs"
                                                    >
                                                        {highlight}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <button
                                            className="w-full flex items-center justify-center bg-indigo-700 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors group"
                                            onClick={() => {
                                                navigate('/destination-view', { state: { destination } });
                                            }}
                                        >
                                            Explore Destination
                                            <ArrowRight
                                                className="ml-2 group-hover:translate-x-1 transition-transform"
                                                size={20}
                                            />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Shop