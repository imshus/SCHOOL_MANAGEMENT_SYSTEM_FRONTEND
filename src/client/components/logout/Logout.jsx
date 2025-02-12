/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext";

const Logout = () => {
    const { logout } = useContext(AuthContext)

    useEffect(() => {
        logout();
        Navigate('/login')
    })
};
export default Logout;