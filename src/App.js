import React from "react";
import { Route, Routes } from "react-router-dom";
import UpdateForm from "./Components/Pages/UpdateForm";
import SignUp from "./Components/Pages/SignUp";
import Profile from "./Components/Pages/Profile";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/updateDetails" element={<UpdateForm />} />
        </Routes>
    );
};

export default App;
