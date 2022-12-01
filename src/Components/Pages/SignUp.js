import React, { useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Store/AuthContext";
import classes from "./SignUp.module.css";

const SignUp = () => {
    const emailInputRef = useRef();
    const passwordInputRef = useRef();
    const confirmPasswordInputRef = useRef();
    const auth_ctx = useContext(AuthContext);
    const [isLogin, setIsLogin] = useState(false);
    const navigate = useNavigate();

    const switchAuthModeHandler = () => {
        setIsLogin((prevState) => !prevState);
    };

    const submitHandler = (event) => {
        event.preventDefault();
        const enteredEmail = emailInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value;

        let url;

        if (!isLogin) {
            const confirmPassword = confirmPasswordInputRef.current.value;

            if (enteredPassword === confirmPassword) {
                url =
                    "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDUoMFOCJaFQ1wLumx5e7zumhzHPtkCUc0";
            } else {
                alert("Both passwords doesn't match");
            }
        } else {
            url =
                "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDUoMFOCJaFQ1wLumx5e7zumhzHPtkCUc0";
        }

        fetch(url, {
            method: "POST",
            body: JSON.stringify({
                email: enteredEmail,
                password: enteredPassword,
                returnSecureToken: true,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(async (res) => {
                if (res.ok) {
                    alert("Your profile is successfully updated!");
                    event.target.reset();
                    const data = await res.json();
                    auth_ctx.login(data.idToken);

                    navigate("/profile");
                    return data;
                } else {
                    await res.json();
                    let errorMessage = "Authentication failed!";
                    throw new Error(errorMessage);
                }
            })
            .then(() => {
                if (!isLogin) {
                    // alert("You have successfully signed up");
                    console.log("user has successfully signed up");
                } else {
                    // alert("You have successfully logged In");
                    console.log("user has successfully logged in");
                }
            })

            .catch((err) => {
                alert(err.message);
            });
    };

    return (
        <section className={classes.auth}>
            <h1>{isLogin ? "LOGIN" : "SIGN UP"}</h1>
            <p>Please enter the following credentials!</p>
            <form onSubmit={submitHandler}>
                <div className={classes.control}>
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="text"
                        id="email"
                        required
                        ref={emailInputRef}
                    />
                </div>
                <div className={classes.control}>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        required
                        ref={passwordInputRef}
                    />
                </div>
                {!isLogin && (
                    <div className={classes.control}>
                        <label htmlFor="confirmPassword">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            required
                            ref={confirmPasswordInputRef}
                        />
                    </div>
                )}
                <div className={classes.actions}>
                    {!isLogin && (
                        <div>
                            <button className={classes.actionButton}>
                                SignUp
                            </button>
                            <p>
                                Already have an account?{" "}
                                <button
                                    className={classes.actionToggle}
                                    onClick={switchAuthModeHandler}
                                >
                                    Login
                                </button>
                            </p>
                        </div>
                    )}
                    {isLogin && (
                        <div>
                            <button className={classes.actionButton}>
                                Login
                            </button>
                            <p>
                                Don't have an account?{" "}
                                <button
                                    className={classes.actionToggle}
                                    onClick={switchAuthModeHandler}
                                >
                                    SignUp
                                </button>
                            </p>
                        </div>
                    )}
                </div>
            </form>
        </section>
    );
};

export default SignUp;
