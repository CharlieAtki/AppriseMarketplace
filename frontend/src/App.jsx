import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import Hero from ".//components/hero.jsx";
import Marketplace from "./pages/appriseMarketplace/marketplace";
import CustomerAccountManagement from "./pages/appriseMarketplace/customerAccountManagement";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Hero title={'Test'} subtitle={'Test'} />} />  {/* Create a Home component */}
                <Route path="marketplace" element={<Marketplace />} />
                <Route path="customerAccountManagement" element={<CustomerAccountManagement />} />
            </Routes>
        </Router>
    );
};

export default App;