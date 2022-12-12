// import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import classes from "./VerifyEmail.module.css";

const VerifyEmail = () => {
    // const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const isDark = useSelector((state) => state.theme.isDark);
    const idToken = localStorage.getItem("token");
    const verifyEmailHandler = () => {
        setIsLoading(true);
        fetch(
            "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDUoMFOCJaFQ1wLumx5e7zumhzHPtkCUc0",
            {
                method: "POST",
                body: JSON.stringify({
                    requestType: "VERIFY_EMAIL",
                    idToken: idToken,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
            .then(async (res) => {
                if (res.ok) {
                    setIsLoading(false);
                    return res.json();
                } else {
                    const data = await res.json();
                    let errorMessage = "Authentication Failed";

                    if (data && data.error && data.message)
                        errorMessage = data.error.message;
                    throw new Error(errorMessage);
                }
            })
            .then((data) => {
                console.log(data);
                alert(
                    "Verification mail is sent to your email. Kindly confirm your email and refresh the page"
                );
            })
            .catch((err) => {
                alert(err.message);
            });
    };
    return (
        <div className={isDark ? classes.start : classes["start_light"]}>
            <p>Your email is not yet verified!</p>
            <button
                onClick={verifyEmailHandler}
                className={
                    isDark
                        ? classes.actionButton
                        : classes["actionButton_light"]
                }
            >
                {!isLoading ? "Verify Email" : "Sending Request"}
            </button>
        </div>
    );
};

export default VerifyEmail;
