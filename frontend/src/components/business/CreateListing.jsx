import { useState } from "react";

const CreateListing = ({ onListingSubmit }) => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    //  Stores all the input fields required for the listing.
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        highlights: "",
        location: { country: "", city: "", lat: "", lng: "" },
        price: "",
        currency: "USD",
        images: [],
        services_offered: "",
        max_guests: "",
        availability: [{ date: "", slots: "" }]
    });

    const [previewMode, setPreviewMode] = useState(false); // Controls whether the form is in preview mode.
    const [errorMessages, setErrorMessages] = useState([]); //  Stores any validation errors.
    const [successMessage, setSuccessMessage] = useState(""); // Displays success feedback to the user.
    const [disabled, setDisabled] = useState(false); // Manages the buffer of the listing submission


    // This function updates the formData when an input field changes.
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("location.")) {
            const field = name.split(".")[1];
            setFormData({ ...formData, location: { ...formData.location, [field]: value } });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };


    // The function updates the formData when the image input field changes 
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const readers = files.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(readers).then((imageUrls) => {
            setFormData({ ...formData, images: imageUrls });
        });
    };

    const handleAvailabilityChange = (index, field, value) => {
        const updatedAvailability = [...formData.availability];
        updatedAvailability[index][field] = value;
        setFormData({ ...formData, availability: updatedAvailability });
    };

    const addAvailability = () => {
        setFormData({
            ...formData,
            availability: [...formData.availability, { date: "", slots: "" }]
        });
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

        // Validation
        const errors = [];
        if (!formData.name) errors.push("Name is required");
        if (!formData.description) errors.push("Description is required");
        if (!formData.location.country) errors.push("Country is required");
        if (!formData.price || formData.price <= 0) errors.push("Valid price is required");
        if (!formData.max_guests || formData.max_guests <= 0) errors.push("Valid max guests number is required");
        if (!formData.highlights) errors.push("At least one highlight is required");
        if (!formData.availability[0].date || !formData.availability[0].slots) {
            errors.push("At least one availability slot is required");
        }

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

            console.log("Response status:", response.status);
            const data = await response.json();
            console.log("Response data:", data);

            if (response.ok) {
                setSuccessMessage("Listing created successfully!");
                setFormData({
                    name: "",
                    description: "",
                    highlights: "",
                    location: { country: "", city: "", lat: "", lng: "" },
                    price: "",
                    currency: "GBP",
                    images: [],
                    services_offered: "",
                    max_guests: "",
                    availability: [{ date: "", slots: "" }]
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
                                    <p className="text-gray-600">Available Dates:</p>
                                    <ul className="text-gray-600">
                                        {formData.availability.map((slot, index) => (
                                            <li key={index} className="mt-1">
                                                📅 {slot.date} - {slot.slots} Slots
                                            </li>
                                        ))}
                                    </ul>
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
                            onChange={handleChange}
                            className="border p-2 rounded-lg w-full"
                            placeholder="Country"
                            required
                        />
                        <input
                            type="text"
                            name="location.city"
                            value={formData.location.city}
                            onChange={handleChange}
                            className="border p-2 rounded-lg w-full"
                            placeholder="City"
                        />
                        <input
                            type="text"
                            name="location.lat"
                            value={formData.location.lat}
                            onChange={handleChange}
                            className="border p-2 rounded-lg w-full"
                            placeholder="Latitude"
                            required
                        />
                        <input
                            type="text"
                            name="location.lng"
                            value={formData.location.lng}
                            onChange={handleChange}
                            className="border p-2 rounded-lg w-full"
                            placeholder="Longitude"
                            required
                        />

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

                        <label className="text-lg font-semibold text-gray-700">Availability</label>
                        {formData.availability.map((slot, index) => (
                            <div key={index} className="flex gap-4">
                                <input
                                    type="date"
                                    value={slot.date}
                                    onChange={(e) => handleAvailabilityChange(index, 'date', e.target.value)}
                                    className="border p-2 rounded-lg flex-1"
                                />
                                <input
                                    type="number"
                                    value={slot.slots}
                                    onChange={(e) => handleAvailabilityChange(index, 'slots', e.target.value)}
                                    className="border p-2 rounded-lg w-24"
                                    placeholder="Slots"
                                />
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addAvailability}
                            className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg mt-2 hover:bg-gray-300 transition-colors"
                        >
                            Add More Dates
                        </button>

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