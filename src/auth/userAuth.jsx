import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/user.context";
import { useNavigate } from "react-router-dom";

export const UserAuth = ({ children }) => {
    const { user } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            if (!token || !user) {
                navigate('/login');
            }
            setLoading(false);
        };

        checkAuth();
    }, [user, token, navigate]); // Add proper dependencies

    if (loading) {
        return <div>Loading...</div>;
    }

    return children;
};