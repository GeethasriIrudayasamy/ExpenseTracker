import React from "react";
import { useSelector } from "react-redux";
import Table from "react-bootstrap/Table";
import classes from "./ExpenseList.module.css";
import { BsFillTrashFill } from "react-icons/bs";
import { BsFillPencilFill } from "react-icons/bs";

const ExpenseList = (props) => {
    const isDark = useSelector((state) => state.theme.isDark);
    const removeItem = () => {
        props.onRemove(props);
    };
    const editHandler = () => {
        props.onEdit();
        removeItem();
    };
    return (
        <Table style={{ marginBottom: "1rem" }}>
            <tbody>
                <tr>
                    <th width="170" className={
                            isDark
                                ? classes["expense-item__category"]
                                : classes["expense-item__category_light"]
                        }>{props.category}</th>
                    <th width="300"className={
                            isDark
                                ? classes["expense-item__title"]
                                : classes["expense-item__title_light"]
                        }>{props.title}</th>
                    <th
                        width="200"
                        className={
                            isDark
                                ? classes["expense-item__price"]
                                : classes["expense-item__price_light"]
                        }
                    >{`Rs ${props.amount}`}</th>
                    <th width="50">
                        <BsFillPencilFill
                            className={
                                isDark
                                    ? classes.action
                                    : classes["action_light"]
                            }
                            onClick={editHandler}
                        />
                    </th>
                    <th>
                        <BsFillTrashFill
                            className={
                                isDark
                                    ? classes.action
                                    : classes["action_light"]
                            }
                            onClick={removeItem}
                        />
                    </th>
                </tr>
            </tbody>
        </Table>
    );
};

export default ExpenseList;
