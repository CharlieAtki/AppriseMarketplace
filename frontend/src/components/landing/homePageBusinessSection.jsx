import toronto from "../../assets/Toronto.jpg";
import {useNavigate} from "react-router-dom";

const HomePageBusinessSection = () => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/businessAccountManagement')
    }

    return (
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
                        new opportunities. <br />
                        <br />
                        To register your business, click the button below.
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
    );
};

export default HomePageBusinessSection