import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import BusinessSideBar from "../../components/business/businessSideBar";
import BusinessNavigationBar from "../../components/business/businessNavigationBar";
import AreaChartComponent from "../../components/business/areaChart";

const AnalyticsPage = () => {
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
        <div className="flex w-full h-screen ">
            {/* Sidebar */}
            <div className="bg-gray-50 flex-grow max-w-48">
                < BusinessSideBar isExpanded={isExpanded} setIsExpanded={setIsExpanded}/>
            </div>
            {/* Main Content */}
            <div className="flex flex-col flex-grow p-4 bg-gray-50">
                < BusinessNavigationBar title={"Business Dashboard"} subtitle={"Manage Your Business"}/>
                <h1>Analytics Page</h1>
                <div className="flex w-1/4 h-1/4 border-2 border-gray-200 rounded-2xl">
                    < AreaChartComponent metricOne={"Total Sales"} metricTwo={"Total Revenue"} metricOneUnit={"Units"} metricTwoUnit={"GBP"}/>
                </div>
            </div>
        </div>
    )
}

export default AnalyticsPage