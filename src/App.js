import React from "react";

import { Route, Routes } from "react-router-dom";
import SignUp from "./Components/Pages/SignUp";
import Profile from "./Components/Profile";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
        </Routes>
    );
};

export default App;
