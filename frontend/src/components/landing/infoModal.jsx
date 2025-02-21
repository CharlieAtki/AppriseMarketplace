import React, { useEffect, useState } from 'react';

const InfoModal = () => {
    const [showModal, setShowModal] = useState(true);

    const closeModal = () => setShowModal(false);

    useEffect(() => {
    // If you want to show the modal when the component is mounted
    setShowModal(true);
    }, []);

    return (
        showModal && (
            <div className="fixed top-0 left-0 w-full p-4 bg-blue-600 text-white z-50">
                <div className="fixed top-0 left-0 w-full p-4 bg-indigo-600 text-white z-50">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="font-semibold text-lg">
                            This application is a personal project created for educational purposes only.
                            It serves as a demonstration of my technical capabilities in web development.
                            Please note that this is not an operational business,
                            and no real transactions or bookings can be made through this platform.
                        </p>
                        <button
                            onClick={closeModal}
                            className="mt-4 px-6 py-2 bg-gray-200 hover:bg-gray-300 text-indigo-800 font-semibold rounded-md"
                        >
                            Got it!
                        </button>
                    </div>
                </div>
            </div>
        )
    );
};

export default InfoModal