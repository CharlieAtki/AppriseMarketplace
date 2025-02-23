import { useState, useMemo } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const CreateListing = ({ onListingSubmit }) => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const cloudinaryUrl = process.env.REACT_APP_CLOUDINARY_URL;
    const uploadPreset = process.env.REACT_APP_UPLOAD_PRESET;

    // Stores all the input fields required for the listing.
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        highlights: "",
        location: { country: "", city: "", address: "", lat: "", lng: "" },
        price: "",
        currency: "GBP",
        images: [],
        services_offered: "",
        max_guests: "",
    });

    const [previewMode, setPreviewMode] = useState(false); // Controls whether the form is in preview mode.
    const [errorMessages, setErrorMessages] = useState([]); // Stores any validation errors.
    const [successMessage, setSuccessMessage] = useState(""); // Displays success feedback to the user.
    const [disabled, setDisabled] = useState(false); // Manages the buffer of the listing submission

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ["places"]
    });

    // Create geocoder using useMemo to prevent unnecessary re-creation
    const geocoder = useMemo(() => {
        return isLoaded ? new window.google.maps.Geocoder() : null;
    }, [isLoaded]);

    // Function to handle address input and geocoding
    // Modified to handle all address fields
    const handleAddressChange = async (e) => {
        const { name, value } = e.target;

        // Update the form data first
        setFormData(prevState => ({
            ...prevState,
            location: {
                ...prevState.location,
                [name.split('.')[1]]: value
            }
        }));

        // Construct full address for geocoding
        const updatedFormData = {
            ...formData,
            location: {
                ...formData.location,
                [name.split('.')[1]]: value
            }
        };

        const fullAddress = `${updatedFormData.location.address}, ${updatedFormData.location.city}, ${updatedFormData.location.country}`.trim();

        // Only geocode if we have some address information
        if (fullAddress.length > 3) {
            try {
                const results = await geocoder.geocode({ address: fullAddress });

                if (results.results && results.results[0]) {
                    const { lat, lng } = results.results[0].geometry.location;

                    setFormData(prevState => ({
                        ...prevState,
                        location: {
                            ...prevState.location,
                            lat: lat(),
                            lng: lng()
                        }
                    }));
                }
            } catch (error) {
                console.error("Geocoding error:", error);
            }
        }
    };

    // Function to handle image upload
    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        const uploadedImages = [];

        for (let i = 0; i < files.length; i++) {
            const formData = new FormData();
            formData.append("file", files[i]);
            formData.append("upload_preset", uploadPreset); // Using the preset for unsigned uploads

            try {
                const response = await fetch(cloudinaryUrl, {
                    method: "POST",
                    body: formData,
                });

                const data = await response.json();
                if (data.secure_url) {
                    uploadedImages.push(data.secure_url); // Store image URL
                } else {
                    setErrorMessages([...errorMessages, "Error uploading image"]);
                }
            } catch (error) {
                console.error("Image upload failed:", error);
                setErrorMessages([...errorMessages, "Error uploading image"]);
            }
        }

        setFormData({ ...formData, images: uploadedImages });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("location.")) {
            const field = name.split(".")[1];
            setFormData({ ...formData, location: { ...formData.location, [field]: value } });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent multiple submissions
        if (disabled) {
            return;
        }
        setDisabled(true); // Disable button

        // Clear previous messages
        setErrorMessages([]);
        setSuccessMessage("");

        // Validation checks
        const errors = [];
        if (!formData.name) errors.push("Name is required");
        if (!formData.description) errors.push("Description is required");
        if (!formData.location.address) errors.push("Address is required");
        if (!formData.location.lat || !formData.location.lng) errors.push("Location (lat, lng) is required");
        if (!formData.price || formData.price <= 0) errors.push("Valid price is required");
        if (!formData.max_guests || formData.max_guests <= 0) errors.push("Valid max guests number is required");
        if (!formData.highlights) errors.push("At least one highlight is required");

        if (errors.length > 0) {
            setErrorMessages(errors);
            setDisabled(false); // Re-enable button (the input was falsy)
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/api/business-Auth/create-listing`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage("Listing created successfully!");
                setFormData({
                    name: "",
                    description: "",
                    highlights: "",
                    location: { country: "", city: "", address: "", lat: "", lng: "" },
                    price: "",
                    currency: "GBP",
                    images: [],
                    services_offered: "",
                    max_guests: "",
                });
                if (onListingSubmit) onListingSubmit();
            } else {
                console.error("Error response:", data);
                setErrorMessages([data.message || "Error creating listing"]);
            }
        } catch (error) {
            console.error("Error submitting listing:", error);
            setErrorMessages(["There was an error while submitting the form. Please try again."]);
        }

        // Adding a buffer to prevent multiple listing submissions by user.
        setTimeout(() => {
            setDisabled(false);
        }, 10000); // 10-second delay before re-enabling
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-indigo-700 mb-4">Create a New Listing</h1>

            <div className="border-2 border-gray-300 rounded-2xl hover:shadow-2xl transition-shadow duration-300 p-6 bg-white">
                {errorMessages.length > 0 && (
                    <div className="bg-red-100 text-red-600 p-4 mb-4 rounded">
                        <ul>
                            {errorMessages.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Success message - On successful submission */}
                {successMessage && (
                    <div className="bg-green-100 text-green-600 p-4 mb-4 rounded">
                        {successMessage}
                    </div>
                )}

                {/* Edit mode / Preview mode - Ternary operator */}
                {previewMode ? (
                    <div className="bg-gray-100 p-6 rounded-2xl">
                        <h2 className="text-2xl font-bold text-indigo-700 mb-4">Preview Your Listing</h2>
                        <div className="border-2 border-gray-300 rounded-2xl p-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="col-span-2 h-[400px]">
                                    <img
                                        src={formData.images[0] || "https://via.placeholder.com/500"}
                                        alt="Listing Preview"
                                        className="w-full h-full object-cover rounded-2xl"
                                    />
                                </div>
                                <div className="hidden md:flex md:col-span-1 flex-col gap-4">
                                    {formData.images.slice(1, 3).map((img, index) => (
                                        <img key={index} src={img} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4">
                                <h3 className="text-3xl font-bold text-indigo-700">{formData.name}</h3>
                                <p className="text-gray-600">{formData.location.city}, {formData.location.country}</p>
                                <p className="text-lg font-semibold text-gray-700 mt-2">{formData.highlights}</p>
                                <p className="text-gray-700 mt-2">{formData.description}</p>

                                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                    <p className="text-lg font-semibold text-gray-700">
                                        Price: {formData.currency} {formData.price}
                                    </p>
                                    <p className="text-gray-600">Max Guests: {formData.max_guests}</p>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-4">
                                <button onClick={() => setPreviewMode(false)}
                                    className="bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
                                    Edit Listing
                                </button>
                                <button onClick={handleSubmit}
                                    className="bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                                    Submit Listing
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <label className="text-lg font-semibold text-gray-700">Service Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="border p-2 rounded-lg"
                            placeholder="Enter service name"
                            required
                        />

                        <label className="text-lg font-semibold text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="border p-2 rounded-lg"
                            rows="3"
                            placeholder="Enter a short description"
                            required
                        />

                        <label className="text-lg font-semibold text-gray-700">Highlights (comma separated)</label>
                        <input
                            type="text"
                            name="highlights"
                            value={formData.highlights}
                            onChange={handleChange}
                            className="border p-2 rounded-lg"
                            placeholder="e.g. Free Snacks, Private Guide"
                            required
                        />

                        <label className="text-lg font-semibold text-gray-700">Services Offered (comma separated)</label>
                        <input
                            type="text"
                            name="services_offered"
                            value={formData.services_offered}
                            onChange={handleChange}
                            className="border p-2 rounded-lg"
                            placeholder="e.g. Snorkeling, City Tour"
                            required
                        />

                        <label className="text-lg font-semibold text-gray-700">Location</label>
                        <input
                            type="text"
                            name="location.country"
                            value={formData.location.country}
                            onChange={handleAddressChange}
                            className="border p-2 rounded-lg w-full"
                            placeholder="Country"
                            required
                        />
                        <input
                            type="text"
                            name="location.city"
                            value={formData.location.city}
                            onChange={handleAddressChange}
                            className="border p-2 rounded-lg w-full"
                            placeholder="City"
                        />

                        <input
                            type="text"
                            name="location.address"
                            value={formData.location.address}
                            onChange={handleAddressChange}
                            className="border p-2 rounded-lg w-full"
                            placeholder="Enter Address"
                        />

                        {/* Google Map */}
                        <div className="w-full h-[400px]">
                            {isLoaded ? (
                                <GoogleMap
                                    mapContainerStyle={{ width: "100%", height: "100%" }}
                                    center={{
                                        lat: parseFloat(formData.location.lat) || 51.5074,
                                        lng: parseFloat(formData.location.lng) || -0.1278
                                    }}
                                    zoom={13}
                                >
                                    {formData.location.lat && formData.location.lng && (
                                        <Marker
                                            position={{
                                                lat: parseFloat(formData.location.lat),
                                                lng: parseFloat(formData.location.lng)
                                            }}
                                        />
                                    )}
                                </GoogleMap>
                            ) : (
                                <p>Loading map...</p>
                            )}
                        </div>

                        <label className="text-lg font-semibold text-gray-700">Price</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="border p-2 rounded-lg w-full"
                            required
                        />

                        <label className="text-lg font-semibold text-gray-700">Max Guests</label>
                        <input
                            type="number"
                            name="max_guests"
                            value={formData.max_guests}
                            onChange={handleChange}
                            className="border p-2 rounded-lg w-full"
                            required
                        />

                        <label className="text-lg font-semibold text-gray-700">Upload Images</label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="border p-2 rounded-lg"
                            required
                        />

                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={() => setPreviewMode(true)}
                                className="bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Preview Listing
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateListing;