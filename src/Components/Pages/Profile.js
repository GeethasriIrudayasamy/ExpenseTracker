import React, { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../Store/AuthRedux";
import UpdateForm from "./UpdateForm";
import classes from "./Profile.module.css";
import VerifyEmail from "./VerifyEmail";

let collectedData = {
    email: "",
    displayName: "",
    photoUrl: "",
};

const Profile = () => {
    const dispatch = useDispatch();
    const isAuth = useSelector((state) => state.auth.isAuthenticated);
    const isDark = useSelector((state) => state.theme.isDark);

    const idToken = localStorage.getItem("token");
    const [isComplete, setIsComplete] = useState(false);
    const [isVerified, setIsVerified] = useState(true);
    const [updateStatus, setUpdateStatus] = useState();

    const logoutHandler = () => {
        dispatch(authActions.logout());
    };

    const profileUpdateHandler = () => {
        setIsComplete(true);
    };

    const onCancelHandler = () => {
        setIsComplete(false);
    };

    const profileHandler = useCallback(() => {
        if (isAuth) {
            fetch(
                "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyDUoMFOCJaFQ1wLumx5e7zumhzHPtkCUc0",
                {
                    method: "POST",
                    body: JSON.stringify({
                        idToken: idToken,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
                .then(async (res) => {
                    if (res.ok) {
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
                    console.log(data.users[0].emailVerified);
                    if (!data.users[0].emailVerified) {
                        setIsVerified(false);
                    } else {
                        setIsVerified(true);
                    }
                    collectedData.email = data.users[0].email;
                    if (data.users[0].displayName && data.users[0].photoUrl) {
                        collectedData.displayName = data.users[0].displayName;
                        collectedData.photoUrl = data.users[0].photoUrl;
                        setUpdateStatus(true);
                    } else {
                        setUpdateStatus(false);
                    }
                })
                .catch((err) => {
                    alert(err.message);
                });
        }
    }, [isAuth, idToken]);

    useEffect(() => {
        profileHandler();
    }, [profileHandler]);

    return (
        <React.Fragment>
            <div className={isDark ? classes.start : classes["start_light"]}>
                <h3>Welcome to Expense Tracker!</h3>
                {!updateStatus && isVerified && (
                    <p
                        className={
                            isDark
                                ? classes.statement
                                : classes["statement_light"]
                        }
                    >
                        Your profile is incomplete
                        <button
                            className={
                                isDark
                                    ? classes.actionToggle
                                    : classes["actionToggle_light"]
                            }
                            onClick={profileUpdateHandler}
                        >
                            Complete now
                        </button>
                        <button
                            className={
                                isDark
                                    ? classes.actionButton
                                    : classes["actionButton_light"]
                            }
                            onClick={logoutHandler}
                        >
                            Logout
                        </button>
                    </p>
                )}
                {updateStatus && isVerified && (
                    <p
                        className={
                            isDark
                                ? classes.statement
                                : classes["statement_light"]
                        }
                    >
                        Your profile is Complete
                        <button
                            className={
                                isDark
                                    ? classes.actionToggle
                                    : classes["actionToggle_light"]
                            }
                            onClick={profileUpdateHandler}
                        >
                            Edit now
                        </button>
                        <button
                            className={
                                isDark
                                    ? classes.actionButton
                                    : classes["actionButton_light"]
                            }
                            onClick={logoutHandler}
                        >
                            Logout
                        </button>
                    </p>
                )}
            </div>
            {isComplete && isVerified && (
                <UpdateForm data={collectedData} onCancel={onCancelHandler} />
            )}
            {!isVerified && <VerifyEmail />}
            <Link to="/ExpenseTracker" style={{ textDecoration: "none" }}>
                <div
                    className={isDark ? classes.start : classes["start_light"]}
                >
                    <button
                        className={
                            isDark
                                ? classes.actionButton2
                                : classes["actionButton2_light"]
                        }
                    >
                        Expense Tracker
                    </button>
                </div>
            </Link>
        </React.Fragment>
    );
};

export default Profile;
