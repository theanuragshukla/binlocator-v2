import { Route, Routes } from "react-router-dom";
import Map from "./components/Map";
import Account from "./components/Account";
import Tune from "./components/Tune";
import AddBin from "./components/AddBin";
import HomeLayout from "./layouts/HomeLayout";
import { ROUTES } from "./constants";
import Signup from './components/Account/Signup'
import Login from './components/Account/Login'

export default function Router() {
    return (
        <Routes>
            <Route element={<HomeLayout />}>
                <Route path={ROUTES.LOCATE} element={<Map />} />
                <Route path={ROUTES.ADD} element={<AddBin />} />
                <Route path={ROUTES.TUNE} element={<Tune />} />
                <Route path={ROUTES.ACCOUNT} element={<Account />} />
                <Route path={ROUTES.LOGIN} element={<Login />} />
                <Route path={ROUTES.SIGNUP} element={<Signup />} />
            </Route>
        </Routes>
    );
}
