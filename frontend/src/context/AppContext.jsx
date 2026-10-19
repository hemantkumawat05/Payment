import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import api, { BACKEND_URL } from "../apiIntercepter";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [sessionInfo, setSessionInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    async function fetchUser(showLoader = true) {
        if (showLoader) setLoading(true);
        try {
            const { data } = await api.get(`/api/user/myprofile`);
            setUser(data?.user || data);
            setSessionInfo(data?.sessionInfo || null);
            setIsAuth(true);
        } catch (error) {
            setUser(null);
            setSessionInfo(null);
            setIsAuth(false);
        } finally {
            if (showLoader) setLoading(false);
        }
    }

    useEffect(() => {
        fetchUser(true);
    }, []);

    async function logoutUser(navigate) {
        try {
            const response = await api.post(`/api/user/logout`);
            toast.success(response.data?.message || "Logged out successfully");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setIsAuth(false);
            setUser(null);
            setSessionInfo(null);
            if (navigate) {
                navigate("/login");
            }
        }
    }

    return (
        <AppContext.Provider
            value={{
                isAuth,
                setIsAuth,
                user,
                setUser,
                sessionInfo,
                setSessionInfo,
                loading,
                fetchUser,
                logoutUser,
                BACKEND_URL
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const AppData = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("AppData must be used within an AppProvider");
    }
    return context;
};