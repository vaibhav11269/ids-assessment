import { Route, Routes } from "react-router-dom";
import LoginPage from "./components/registerAndLogin/login";
import SignupPage from "./components/registerAndLogin/signup";
import Dashboard from "./components/dashboard/dashboard";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    )
}
export default AppRoutes;