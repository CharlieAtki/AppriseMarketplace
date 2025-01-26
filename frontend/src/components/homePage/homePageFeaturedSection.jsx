import croatiaImg from '../../assets/Croatia.jpg';
import singaporeImg from '../../assets/Singapore.jpg';
import romeImg from '../../assets/Rome.jpg';
import bahamasImg from '../../assets/Bahamas.jpg';
import toronto from '../../assets/Toronto.jpg';
import {ArrowRight} from "lucide-react";
import {useNavigate} from "react-router-dom";

const HomePageFeaturedSection = () => {
    const navigate = useNavigate();

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

    const handleButtonClick = () => {
        navigate('/businessAccountManagement')
    }

    return (
        <div>
            <div className=" px-4">
                <h3 className="text-3xl font-semibold text-indigo-700 mb-6 justify-self-center">
                    Featured Destinations:
                </h3>

                <hr className="border-t-2 border-gray-300 my-4"/>

                <div className="pt-6 pb-6 flex justify-center overflow-x-auto relative">
                    {/* First batch of images */}
                    <div className="flex space-x-6 pb-6">
                        {/* Duplicate the array more times to ensure smooth scrolling */}
                        {destinations.map((destination, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl group"
                            >
                                <div className="relative">
                                    <img
                                        src={destination.image}
                                        alt={destination.name}
                                        className="w-full h-56 object-cover"
                                    />
                                    <div
                                        className="absolute inset-0 bg-black opacity-20 group-hover:opacity-30 transition-opacity"></div>
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
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Break Point */}
                <hr className="border-t-2 border-gray-300 my-4"/>

                {/* Business Creation Section  */}
                <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 p-6">
                    {/* Left Section */}
                    <div className="flex flex-col items-center gap-6">
                        {/* Business Registration Card */}
                        <div
                            className="w-80 border border-gray-300 rounded-lg p-4 shadow-md bg-white hover:shadow-lg transition-shadow duration-300">
                            <h3 className="text-xl font-semibold text-indigo-700 mb-3 text-center">
                                Business Registration
                            </h3>
                            <p className="text-gray-600 text-sm text-center">
                                Start your business journey by registering your business and exploring
                                new opportunities.
                            </p>
                        </div>
                        <div>
                            <button
                                onClick={handleButtonClick}
                                className="bg-gray-700 text-white rounded-full shadow-2xl shadow-gray-500/50 px-6 py-3 hover:bg-indigo-700 transition-all transform hover:scale-105">
                                Create Business Account
                            </button>
                        </div>
                    </div>

                    {/* Destination Section */}
                    <div className="flex flex-col items-center gap-6">
                        <div
                            className="w-80 bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg overflow-hidden transform transition-all hover:scale-105">
                            <div className="relative">
                                <img
                                    src={toronto} /* Replace with an actual image source */
                                    alt="Destination"
                                    className="w-full h-40 object-cover"
                                />
                                <div
                                    className="absolute inset-0 bg-black opacity-20 hover:opacity-30 transition-opacity"></div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                                    Destination Name
                                </h3>
                                <p className="text-gray-600 text-sm text-center mb-3">
                                    Discover breathtaking experiences at this amazing destination.
                                </p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    <span className="bg-blue-50 text-indigo-500 px-2 py-1 rounded-full text-xs">
                                        Highlight 1
                                    </span>
                                    <span className="bg-blue-50 text-indigo-500 px-2 py-1 rounded-full text-xs">
                                        Highlight 2
                                    </span>
                                    <span className="bg-blue-50 text-indigo-500 px-2 py-1 rounded-full text-xs">
                                        Highlight 3
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-80 bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-md">
                            <h1 className="text-xl font-bold text-gray-800 mb-3 text-center">
                                Description
                            </h1>
                            <p className="text-gray-600 text-sm text-center">
                                At Apprise Marketplace you can advertise your holidays and locations to the masses.
                                As illustrated on the left, is a destination card. <br />

                                A destination card is the format our
                                marketplace will promote your holiday to customers all around the world.
                                This includes; the Name, Description and highlights <br />

                                Once you've decided to create a hosting account, please read to info on the right.

                            </p>
                        </div>
                    </div>
                </div>


                <hr className="border-t-2 border-gray-300 my-4"/>

            </div>

            {/* Services Section */}
            <div className="py-16" id="services">
                <div className="max-w-7xl mx-auto text-center">
                    <h3 className="text-3xl font-semibold text-indigo-700 mb-6">Our Services</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                            <h4 className="text-xl font-semibold text-indigo-700 mb-3">Booking</h4>
                            <p className="text-gray-600">Book your next adventure with ease through our platform.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                            <h4 className="text-xl font-semibold text-indigo-700 mb-3">Guided Tours</h4>
                            <p className="text-gray-600">Experience personalized guided tours at your destination.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                            <h4 className="text-xl font-semibold text-indigo-700 mb-3">Travel Insurance</h4>
                            <p className="text-gray-600">Ensure peace of mind with our travel insurance options.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contacts */}
            <div className="py-16" id="contact">
                <div className="max-w-7xl mx-auto text-center">
                    <h3 className="text-3xl font-semibold text-indigo-700 mb-6">Contact Us</h3>
                    <p className="text-lg text-gray-600 mb-4">Got questions or ready to book? Reach out to us!</p>
                    <button
                        className="bg-indigo-500 text-white py-3 px-6 rounded-lg hover:bg-indigo-600 transition-colors">
                        Get in Touch <ArrowRight size={20} className="inline ml-2"/>
                    </button>
                </div>
            </div>
            {/* Footer */}
            <footer className="bg-indigo-700 text-white p-6">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-lg">© 2025 Apprise Marketplace. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default HomePageFeaturedSection;