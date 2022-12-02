import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";

import AuthContext from "./Store/AuthContext";
import SignUp from "./Components/Pages/SignUp";
import Profile from "./Components/Pages/Profile";
import VerifyEmail from "./Components/Pages/VerifyEmail";

const App = () => {
    const auth_ctx = useContext(AuthContext);
    let loggedIn = auth_ctx.isLoggedIn;

    return (
        <Routes>
            <Route path="/" element={<SignUp />} />
            <Route
                path="/profile"
                element={loggedIn ? <Profile /> : <SignUp />}
            />
            <Route
                path="/verify"
                element={loggedIn ? <VerifyEmail /> : <SignUp />}
            />
        </Routes>
    );
};

export default App;
