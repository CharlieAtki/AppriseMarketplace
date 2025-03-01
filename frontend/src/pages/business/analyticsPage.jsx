import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import BusinessSideBar from "../../components/business/businessSideBar";
import AreaChartComponent from "../../components/business/analyticsCharts/totalRevenueChart";

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
                    },
                });

                const result = await response.json();

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
        <div className="flex w-full h-screen border-gray-50">
            {/* Sidebar */}
             < BusinessSideBar isExpanded={isExpanded} setIsExpanded={setIsExpanded}/>

            {/* Main Content */}
            <div className="flex flex-col flex-grow p-6 bg-gray-50">
                <div className="max-w-2xl h-1/2 border border-gray-100 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6">
                    <h3 className="text-xl font-semibold text-gray-600 mb-2 text-center">Seasonal Booking Trends vs Occupancy Rate</h3>
                    < AreaChartComponent metricOne={"Total Revenue"} metricOneUnit={"GBP"} />
                </div>
            </div>

        </div>
    )
}

export default AnalyticsPage