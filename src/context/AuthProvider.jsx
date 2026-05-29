import { AuthContext } from "./AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";

const BASE = import.meta.env.VITE_BASE_URL;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
    const [isLoading, setIsLoading] = useState(true);

    // fetch user data helper
    const fetchMe = async (tokenData) => {
        const res = await axios.get(`${BASE}/auth/me`, {
            headers: {
                Authorization: `Bearer ${tokenData}`,
                Accept: "application/json",
            },
        });
        return res.data;
    };

    // on mount — restore session jika token ada di localStorage
    useEffect(() => {
        if (!token) {
            setIsLoading(false);
            return;
        }

        fetchMe(token)
            .then((json) => {
                if (json.success) {
                    setUser(json.data);
                    setIsLoggedIn(true);
                } else {
                    logout();
                }
            })
            .catch(() => logout())
            .finally(() => setIsLoading(false));
    }, []);

    const login = async (tokenData) => {
        console.log("tokenData:", tokenData); // cek apakah ada isinya
        localStorage.setItem("token", tokenData);
        setToken(tokenData);
        setIsLoggedIn(true);

        try {
            const json = await fetchMe(tokenData);
            if (json.success) setUser(json.data);
        } catch (err) {
            console.error("Failed to fetch user after login:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setIsLoggedIn(false);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider
            value={{ user, token, login, logout, isLoggedIn, isLoading }}
        >
            {children}
        </AuthContext.Provider>
    );
};