import { useEffect, useState } from "react";
import DashBoard from "./Dashboard";
import { ROUTES } from "../../constants";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../../data/managers/account";
const Account = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({
        name: "",
        email: "",
    });
    useEffect(() => {
        const verify = async () => {
            setLoading(true);
            const { status, data } = await checkAuth();
            if (status) {
                setUser(() => ({ ...data }));
            } else {
                navigate(ROUTES.LOGIN);
            }
            setLoading(false);
        };
        verify();
    }, []);
    return (
        <>
            <DashBoard user={user} loading={loading} />
        </>
    );
};

export default Account;
