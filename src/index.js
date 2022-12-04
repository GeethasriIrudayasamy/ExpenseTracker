import ReactDOM from "react-dom/client";
import { AuthContextProvider } from "./Store/AuthContext";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { ExpenseContextProvider } from "./Store/ExpenseContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <AuthContextProvider>
        <ExpenseContextProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ExpenseContextProvider>
    </AuthContextProvider>
);
