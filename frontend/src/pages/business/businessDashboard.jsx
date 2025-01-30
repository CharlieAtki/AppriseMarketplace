import BusinessNavigationBar from "../../components/business/businessNavigationBar";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import BusinessSideBar from "../../components/business/businessSideBar";
import AreaChartComponent from "../../components/business/areaChart";
import { motion } from "framer-motion"

const BusinessDashboard = () => {
    const navigate = useNavigate();
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.3 },
      },
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    };

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
            <div className="bg-indigo-700 flex-grow max-w-48">
                < BusinessSideBar />
            </div>
             {/* Main Content */}
            <div className="flex flex-col flex-grow p-4">
                <h1>Dashboard</h1>

            </div>
        </div>
    )
}

export default BusinessDashboard;