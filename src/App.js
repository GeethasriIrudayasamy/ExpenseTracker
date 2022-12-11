import React from "react";
import { Route, Routes } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import SignUp from "./Components/Pages/SignUp";
import Profile from "./Components/Pages/Profile";
import VerifyEmail from "./Components/Pages/VerifyEmail";
import ForgotPassword from "./Components/Pages/ForgotPassword";
import ExpenseForm from "./Components/ExpenseTracker/ExpenseForm";
import { authActions } from "./Store/AuthRedux";

const App = () => {
    const dispatch = useDispatch();
    dispatch(authActions.setIsAuth());

    const isAuth = useSelector((state) => state.auth.isAuthenticated);

    return (
        <Routes>
            <Route path="/" element={<SignUp />} />
            <Route
                path="/profile"
                element={isAuth ? <Profile /> : <SignUp />}
            />
            <Route
                path="/verify"
                element={isAuth ? <VerifyEmail /> : <SignUp />}
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
                path="/ExpenseTracker"
                element={isAuth ? <ExpenseForm /> : <SignUp />}
            />
        </Routes>
    );
};

export default App;
