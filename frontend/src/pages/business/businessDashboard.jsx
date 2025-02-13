import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import BusinessSideBar from "../../components/business/businessSideBar";
import CreateListing from "../../components/business/CreateListing";

const BusinessDashboard = () => {
    const navigate = useNavigate();
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

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
        <div className="flex w-full h-screen">
            {/* Sidebar */}
            <div className="bg-indigo-700 flex-shrink-0 w-48 h-full">
                < BusinessSideBar />
            </div>
             {/* Main Content */}
            <div className="flex flex-col flex-grow p-4 overflow-y-auto bg-gray-50">
                <div className="max-w-screen-lg mx-auto w-full">
                    <CreateListing />
                </div>
            </div>
        </div>
    )
}

export default BusinessDashboard;