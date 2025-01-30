import croatiaImg from '../../assets/Croatia.jpg';
import singaporeImg from '../../assets/Singapore.jpg';
import romeImg from '../../assets/Rome.jpg';
import bahamasImg from '../../assets/Bahamas.jpg';
import toronto from '../../assets/Toronto.jpg';
import {ArrowRight} from "lucide-react";

const HomePageFeaturedSection = () => {
    // An array of objects, which represent individual locations. This array is mapped to create the components dynamically
    // Adding the webpage url to each object. This is used to redirect the user when the location/destination is selected
    const destinations = [
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
        }
    ];

    return (
        <div>
            <div className=" px-4">
                <h3 className="text-3xl font-semibold text-indigo-700 mb-6 justify-self-center">
                    Featured Destinations:
                </h3>

                <hr className="border-t-2 border-gray-300 my-4"/>

                <div className="pt-6 pb-6 flex justify-center overflow-x-auto relative w-full">
                    {/* First batch of images */}
                    <div className="flex space-x-6 pb-6">
                        {/* Duplicate the array more times to ensure smooth scrolling */}
                        {destinations.map((destination, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 w-96 bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl group"
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
            </div>
        </div>
    );
};

export default HomePageFeaturedSection;