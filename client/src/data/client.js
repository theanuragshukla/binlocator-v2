import axios from "axios";

import { API_URL } from "../constants";

const setupClient = () => {
    const client = axios.create({
        baseURL: API_URL,
        withCredentials:true,
    });
    return client;
};

const getClient = () => setupClient();

export default getClient;
