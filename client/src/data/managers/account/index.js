import getClient from "../../client";

const reqModal = async (func) => {
    try {
        const { status, data } = await func();
        if (status === 200) {
            return data;
        } else {
            return {
                status: false,
                msg: `request failed with code ${status}`,
            };
        }
    } catch (e) {
        return {
            status: false,
            msg: e.message,
        };
    }
};
export const checkAuth = () => {
    return reqModal(() => getClient().get("/checkAuth"));
};
export const login = (body) => {
    return reqModal(() => getClient().post("/login", body));
};

export const signup = (body) => {
    return reqModal(() => getClient().post("/signup", body));
};
