import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import Marketplace from "./pages/appriseMarketplace/marketplace";
import CustomerAccountManagement from "./pages/appriseMarketplace/customerAccountManagement";
import DestinationView from "./pages/appriseMarketplace/destinationView";
import Homepage from "./pages/homePage/homePage";
import BusinessAccountManagement from "./pages/business/businessAccountManagement";
import BusinessDashboard from "./pages/business/businessDashboard";
import AnalyticsPage from "./pages/business/analyticsPage";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Homepage />} />  {/* Create a Home component */}
                <Route path="marketplace" element={<Marketplace />} />
                <Route path="customerAccountManagement" element={<CustomerAccountManagement />} />
                <Route path="destination-view" element={<DestinationView />} />
                <Route path="businessAccountManagement" element={<BusinessAccountManagement />} />
                <Route path="businessDashboard" element={<BusinessDashboard />} />
                <Route path="businessAnalytics" element={<AnalyticsPage />} />
            </Routes>
        </Router>
    );
};

export default App;