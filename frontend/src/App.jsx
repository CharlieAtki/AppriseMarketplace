import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import Hero from ".//components/hero.jsx";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Hero title={'Test'} subtitle={'Test'} />} />  {/* Create a Home component */}
            </Routes>
        </Router>
    );
};

export default App;