import AccountSettingsSideBar from "../../components/appriseMarketplace/accountSettingsSideBar";
import AccountInfoInputForm from "../../components/appriseMarketplace/accountInfoInputForm";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

const AccountSettingsPage = () => {
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
        <div className="flex w-full h-screen bg-gray-50">

            {/* Sidebar */}
            <div className="bg-gray-50 flex-shrink-0 w-48 h-full">
                <AccountSettingsSideBar/>
            </div>

            {/* Details Input */}
            <div className="flex flex-col flex-grow overflow-y-auto bg-gray-50">
                <div className="max-w-screen-xl mx-auto w-full">
                    <AccountInfoInputForm/>
                </div>
            </div>
        </div>
    );
};

export default AccountSettingsPage;