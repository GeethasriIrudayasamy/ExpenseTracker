import React, { useRef, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { expActions } from "../../Store/ExpenseRedux";
import axios from "axios";
import ExpenseList from "./ExpenseList";
import classes from "./ExpenseForm.module.css";
import ToggleTheme from "../UI/Toggle";


const ExpenseForm = (props) => {
    const dispatch = useDispatch();
    const email = useSelector((state) => state.auth.email);
    const expenses = useSelector((state) => state.exp.expenses);
    const isPremium = useSelector((state) => state.exp.isPremium);
    const isDark = useSelector((state) => state.theme.isDark);
    const [premiumFeat, setPremiumFeat] = useState(false);
    const [expenseItems, setexpenseItems] = useState([]);

    console.log(expenses);

    const amountInputRef = useRef();
    const titleInputRef = useRef();
    const categoryInputRef = useRef();

    let content;

    const changePremiumFeat = () => {
        setPremiumFeat(true);
    };

    const getExpenseItemFromDb = useCallback(async () => {
        if (email) {
            const response = await fetch(
                `https://expense-tracker-6a2c4-default-rtdb.firebaseio.com/expense${email}.json`
            );

            let data = await response.json();

            if (data != null) {
                const expenseItems = [];
                let amount = 0;

                for (const key in data) {
                    let item = JSON.parse(data[key].expense);
                    amount = +amount + Number(item.amount);
                    expenseItems.push({
                        item: item,
                        _id: key,
                    });

                    setexpenseItems(expenseItems);
                    dispatch(expActions.addExpense(expenseItems));
                    dispatch(expActions.addPremium(amount));
                }
            } else {
                setexpenseItems([]);
            }
        }
    }, [email, dispatch]);

    const downloadHandler = () => {
        let blob = new Blob([makeCSV(expenses)]);
        let file = URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.download = "expenses.csv";
        a.href = file;
        a.click();
    };
    function makeCSV(expenses) {
        let arr = [];

        expenses.forEach((expense) => {
            let expenseArr = [];

            expenseArr.push(expense.item.category);
            expenseArr.push(expense.item.title);
            expenseArr.push(expense.item.amount);

            arr.push(expenseArr);
        });
        return arr.map((item) => item).join("\n");
    }

    useEffect(() => {
        getExpenseItemFromDb();
    }, [getExpenseItemFromDb]);

    const addItemHandler = useCallback(
        async (expenses) => {
            await axios
                .post(
                    `https://expense-tracker-6a2c4-default-rtdb.firebaseio.com/expense${email}.json`,
                    {
                        expense: JSON.stringify(expenses),
                    }
                )
                .then(() => {
                    getExpenseItemFromDb();
                });
        },
        [email, getExpenseItemFromDb]
    );

    const submitHandler = (event) => {
        event.preventDefault();
        const amount = amountInputRef.current.value;
        const title = titleInputRef.current.value;
        const category = categoryInputRef.current.value;
        const expense = {
            amount: amount,
            title: title,
            category: category,
            id: new Date().getTime(),
        };

        addItemHandler(expense);
        event.target.reset();
    };

    const removeItemHandler = async (item) => {
        const itemIdx = expenses.findIndex((i) => i.item.id === item.id);
        let existingItem = expenses[itemIdx];
        let userId = existingItem._id;

        await axios
            .delete(
                `https://expense-tracker-6a2c4-default-rtdb.firebaseio.com/expense${email}/${userId}.json`,
                {
                    method: "DELETE",
                }
            )
            .then(() => {
                getExpenseItemFromDb();
            });
    };

    const editHandler = (item) => {
        amountInputRef.current.value = item.amount;
        titleInputRef.current.value = item.title;
        categoryInputRef.current.value = item.category;
        removeItemHandler(item);
    };

    let expense;
    if (expenseItems.length > 0) {
        expense = expenseItems.map((item) => (
            <ExpenseList
                key={item._id}
                amount={item.item.amount}
                title={item.item.title}
                category={item.item.category}
                id={item.item.id}
                onEdit={() => {
                    editHandler(item.item);
                }}
                onRemove={() => {
                    removeItemHandler(item.item);
                }}
            />
        ));
    }
    if (expenseItems.length === 0) {
        content = (
            <div
                className={
                    isDark ? classes.expenses : classes["expenses_light"]
                }
                style={{ display: "block", textAlign: "center" }}
            >
                <h3
                    className={
                        isDark ? classes.statement : classes["statement_light"]
                    }
                >
                    No expense is found
                </h3>
            </div>
        );
    }
    if (expenseItems.length > 0) {
        content = (
            <div>
                {!isPremium && (
                    <div
                        className={
                            isDark
                                ? classes.expenses
                                : classes["expenses_light"]
                        }
                        style={{ display: "block" }}
                    >
                        <ul key={expenseItems.id} className={classes.ul}>
                            {expense}
                        </ul>
                    </div>
                )}
                {isPremium && (
                    <div
                        className={
                            isDark
                                ? classes.expenses
                                : classes["expenses_light"]
                        }
                    >
                        {!premiumFeat && (
                            <div>
                                <p
                                    className={
                                        isDark
                                            ? classes.statement
                                            : classes["statement_light"]
                                    }
                                >
                                    Your total expense amount exceeded Rs.10000
                                </p>
                                <button
                                    className={
                                        isDark
                                            ? classes.premium
                                            : classes["premium_light"]
                                    }
                                    onClick={changePremiumFeat}
                                >
                                    Add Premium
                                </button>
                            </div>
                        )}
                        {premiumFeat && (
                            <div>
                                <ToggleTheme />
                                <button
                                    className={
                                        isDark
                                            ? classes.premium
                                            : classes["premium_light"]
                                    }
                                    onClick={downloadHandler}
                                >
                                    Download File
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <React.Fragment>
            <form
                onSubmit={submitHandler}
                className={isDark ? classes.start : classes["start_light"]}
            >
                <div className={classes["new-expense__controls"]}>
                    <div
                        className={
                            isDark
                                ? classes["new-expense__control"]
                                : classes["new-expense__control_light"]
                        }
                    >
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            ref={titleInputRef}
                            required
                        />
                    </div>
                    <div
                        className={
                            isDark
                                ? classes["new-expense__control"]
                                : classes["new-expense__control_light"]
                        }
                    >
                        <label htmlFor="Amount">Amount</label>
                        <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            ref={amountInputRef}
                            required
                        />
                    </div>

                    <div
                        className={
                            isDark
                                ? classes["new-expense__control"]
                                : classes["new-expense__control_light"]
                        }
                    >
                        <label htmlFor="category">Category</label>
                        <select id="category" ref={categoryInputRef} required>
                            <option>Select One</option>
                            <option value="Food">Food</option>
                            <option value="Travel">Travel</option>
                            <option value="Education">Education</option>
                            <option value="Movies">Movies</option>
                            <option value="Health">Health</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>

                    <div
                        className={
                            isDark
                                ? classes["new-expense__control"]
                                : classes["new-expense__control_light"]
                        }
                    >
                        <button
                            className={
                                isDark
                                    ? classes["new-expense__actions"]
                                    : classes["new-expense__actions_light"]
                            }
                            type="submit"
                        >
                            Add Expense
                        </button>
                    </div>
                </div>
            </form>
            {content}
        </React.Fragment>
    );
};
export default ExpenseForm;
