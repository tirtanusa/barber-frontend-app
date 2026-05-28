import { AuthContext } from "./AuthContext";
import { useState, useEffect } from "react";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            setIsLoading(false);
            return;
        }

        fetch(`api/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        })
            .then((res) => res.json())
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
        setToken(tokenData);
        setIsLoggedIn(true);
        localStorage.setItem("token", tokenData);

        try {
            const res = await fetch(`api/me`, {
                headers: {
                    Authorization: `Bearer ${tokenData}`,
                    Accept: "application/json",
                },
            });
            const json = await res.json();
            if (json.success) setUser(json.data);
        } catch (err) {
            console.error(err);
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
