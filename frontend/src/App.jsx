import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import Hero from ".//components/hero.jsx";
import Marketplace from "./pages/appriseMarketplace/marketplace";
import CustomerAccountManagement from "./pages/appriseMarketplace/customerAccountManagement";
import DestinationView from "./pages/appriseMarketplace/destinationView";
import Homepage from "./pages/homePage/homePage";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Homepage />} />  {/* Create a Home component */}
                <Route path="marketplace" element={<Marketplace />} />
                <Route path="customerAccountManagement" element={<CustomerAccountManagement />} />
                <Route path="destination-view" element={<DestinationView />} />
            </Routes>
        </Router>
    );
};

export default App;