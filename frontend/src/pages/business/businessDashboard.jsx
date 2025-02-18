import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import BusinessSideBar from "../../components/business/businessSideBar";
import CreateListing from "../../components/business/CreateListing";

const BusinessDashboard = () => {
    const navigate = useNavigate();
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    
    const [isExpanded, setIsExpanded] = useState(false); // Move state here

    // Logic for user authentication. This makes sure the user has loggedIn
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
                    navigate('/businessAccountManagement');
                }
            } catch (error) {
                console.error('Auth check error:', error);
                navigate('/businessAccountManagement');
            }
        };

        checkLoginStatus();
    }, [navigate, backendUrl]);

    return (
        <div className="flex w-full h-screen bg-gray-50">
            {/* Sidebar */}
            <BusinessSideBar isExpanded={isExpanded} setIsExpanded={setIsExpanded}/>

            {/* Main Content */}
            <div className="flex flex-col flex-grow overflow-y-auto bg-gray-50 transition-all duration-300">
                <div className="max-w-screen-xl mx-auto w-full p-6">
                    <CreateListing/>
                </div>
            </div>
        </div>
    )
}

export default BusinessDashboard;