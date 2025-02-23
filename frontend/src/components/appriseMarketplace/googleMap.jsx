import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useState, useEffect, useRef, useCallback } from "react";
import { AlertCircle } from "lucide-react";

// Debounce function
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

const ListingMap = ({ lat, lng, address }) => {
    const [cachedLocation, setCachedLocation] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [hasError, setHasError] = useState(false);
    const mapRef = useRef(null);

    const googleMapsAPIKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: googleMapsAPIKey,
        libraries: ["places"],
    });

    useEffect(() => {
        if (!lat || !lng) {
            setHasError(true);
        } else {
            setHasError(false);
        }
    }, [lat, lng]);

    // Saving the parameters to cache to prevent many Google API Requests
    useEffect(() => {
        if (hasError) return;

        const cachedLatLng = JSON.parse(localStorage.getItem("cachedLatLng"));
        if (cachedLatLng && cachedLatLng.lat === lat && cachedLatLng.lng === lng) {
            setCachedLocation(cachedLatLng);
        } else {
            if (lat && lng) {
                setCachedLocation({ lat, lng });
                localStorage.setItem("cachedLatLng", JSON.stringify({ lat, lng }));
            }
        }
    }, [lat, lng, hasError]);

    const fetchMap = useCallback(
        debounce((newAddress) => {
            console.log(`Fetching map for ${newAddress}`);
            setIsFetching(false);
        }, 3000),
        []
    );

    useEffect(() => {
        if (hasError) return;
        if (address && address.trim() !== "") {
            setIsFetching(true);
            fetchMap(address);
        }
    }, [address, hasError, fetchMap]);

    const renderError = () => (
        <div className="w-full h-[400px] flex items-center justify-center bg-gray-50 rounded-md border border-gray-200">
            <div className="max-w-md p-4 text-center">
                <AlertCircle className="h-6 w-6 text-gray-500 mx-auto mb-2" />
                <h1 className="text-gray-500 font-semibold">
                    Unable to load the map. Please ensure latitude and longitude are provided correctly.
                </h1>
            </div>
        </div>
    );

    const renderLoadingAnimation = () => (
        <div className="w-full h-[400px] bg-gray-200 animate-pulse rounded-md">
            <div className="h-full bg-gray-300 rounded-md"></div>
        </div>
    );

    if (hasError) {
        return renderError();
    }

    if (isFetching || !isLoaded) {
        return renderLoadingAnimation();
    }

    if (!cachedLocation) {
        return renderError();
    }

    return (
        <div className="w-full h-[400px]" ref={mapRef}>
            {isLoaded ? (
                <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    center={{
                        lat: parseFloat(cachedLocation.lat),
                        lng: parseFloat(cachedLocation.lng),
                    }}
                    zoom={10}
                >
                    <Marker
                        position={{
                            lat: parseFloat(cachedLocation.lat),
                            lng: parseFloat(cachedLocation.lng),
                        }}
                    />
                </GoogleMap>
            ) : (
                renderError()
            )}
        </div>
    );
};

export default ListingMap;