/* eslint-disable react/prop-types */
import { useEffect, useState, createContext } from "react";
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [authentication, setAuthentication] = useState(false);
    const [user1, setUser] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem('token')
        const user = localStorage.getItem('user')
        if (token) { setAuthentication(true) }
        if (user) { setUser(JSON.parse(user)) }
    }, [])
    const login = (credential) => {
        setAuthentication(true)
        setUser(JSON.parse(credential))
    }
    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setAuthentication(false)
        setUser(null)
    }
    return (
        <AuthContext.Provider value={{ authentication, user1, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}