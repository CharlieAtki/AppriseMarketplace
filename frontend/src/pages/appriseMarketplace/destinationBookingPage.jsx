import {useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import MarketplaceNavigationBar from "../../components/appriseMarketplace/marketplaceNavigationBar";

const DestinationBookingPage = () => {
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
            {/* Image + Booking input section */}
            <div className="h-screen grid grid-rows-2">
                {/* Large Image Grid - Limited to Half of the Screen Height */}
                <div className="flex-[3] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid-rows-2 gap-2 sm:gap-2 pb-4  h-[50vh]">
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
                </div>
                {/* Booking Inputs */}
                <div className="border-2 border-gray-200 rounded-2xl">
                    <h1>Booking inputs</h1>
                </div>
            </div>
        </div>
    );
};

export default DestinationBookingPage;