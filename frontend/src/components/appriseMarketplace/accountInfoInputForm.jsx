import { Image } from "lucide-react";
import { useState } from "react";

const AccountInfoInputForm = ({ onListingSubmit }) => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const cloudinaryUrl = process.env.REACT_APP_CLOUDINARY_URL;
    const uploadPreset = process.env.REACT_APP_UPLOAD_PRESET;

    // Form state management
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        profilePicture: "",
        dateOfBirth: ""
    });

    // UI state management
    const [previewImage, setPreviewImage] = useState(null);
    const [errorMessages, setErrorMessages] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id === 'name' ? 'username' : id]: value
        }));
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Show preview
        setPreviewImage(URL.createObjectURL(file));

        // Upload to Cloudinary
        const imageFormData = new FormData();
        imageFormData.append("file", file);
        imageFormData.append("upload_preset", uploadPreset);

        try {
            const response = await fetch(cloudinaryUrl, {
                method: "POST",
                body: imageFormData,
            });

            const data = await response.json();
            if (data.secure_url) {
                setFormData(prev => ({
                    ...prev,
                    profilePicture: data.secure_url
                }));
            } else {
                setErrorMessages(prev => [...prev, "Error uploading image"]);
            }
        } catch (error) {
            console.error("Image upload failed:", error);
            setErrorMessages(prev => [...prev, "Error uploading image"]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;
        setIsSubmitting(true);
        setErrorMessages([]);
        setSuccessMessage("");

        // Only include changed fields in the update
        const updatedFields = {};
        Object.keys(formData).forEach(key => {
            if (formData[key] && formData[key].trim() !== "") {
                updatedFields[key] = formData[key];
            }
        });

        // Don't submit if no fields were changed
        if (Object.keys(updatedFields).length === 0) {
            setIsSubmitting(false);
            setErrorMessages(["No changes were made"]);
            return;
        }

        // Basic validation for email if it's being updated
        if (updatedFields.email && !/\S+@\S+\.\S+/.test(updatedFields.email)) {
            setErrorMessages(["Please enter a valid email address"]);
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/api/user-Auth/update-user-details`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify(updatedFields)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage("Profile updated successfully!");
                if (onListingSubmit) onListingSubmit();

                // Clear the form fields that were just updated
                setFormData(prev => {
                    const newFormData = { ...prev };
                    Object.keys(updatedFields).forEach(key => {
                        newFormData[key] = "";
                    });
                    return newFormData;
                });

                // Clear preview image if profile picture was updated
                if (updatedFields.profilePicture) {
                    setPreviewImage(null);
                }
            } else {
                setErrorMessages([data.message || "Error updating profile"]);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setErrorMessages(["There was an error while updating your profile. Please try again."]);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="flex flex-col w-full h-full border-2 border-gray-300 rounded-2xl hover:shadow-2xl transition-shadow duration-300 p-6 bg-white overflow-y-auto">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">
                Account Settings
            </h2>

            <hr className="border-t border-gray-300 my-4"/>

            {/* Success and Error Messages */}
            {successMessage && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
                    {successMessage}
                </div>
            )}
            {errorMessages.length > 0 && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                    {errorMessages.map((error, index) => (
                        <div key={index}>{error}</div>
                    ))}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
                {/* Profile Picture Section */}
                <div className="flex items-center space-x-4 mb-6">
                    <div
                        className="w-24 h-24 rounded-full overflow-hidden border flex items-center justify-center bg-gray-200">
                        {(previewImage || formData.profilePicture) ? (
                            <img
                                src={previewImage || formData.profilePicture}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <Image size={48} className="text-gray-500"/>
                        )}
                    </div>
                    <div>
                        <label htmlFor="profileImage" className="block text-sm font-semibold text-gray-700">
                            Profile Picture
                        </label>
                        <input
                            type="file"
                            id="profileImage"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="mt-2"
                        />
                    </div>
                </div>

                {/* Input Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                    {/* Name Input */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="mt-2 w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter your full name"
                        />
                    </div>

                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="mt-2 w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Date of Birth Input */}
                    <div>
                        <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-gray-700">
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            id="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            className="mt-2 w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-auto flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-6 py-3 bg-indigo-600 text-white rounded-lg transition-colors duration-300 w-full md:w-auto
                    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AccountInfoInputForm;