import { Route, Routes } from "react-router-dom";
import LoginPage from "./components/registerAndLogin/login";
import SignupPage from "./components/registerAndLogin/signup";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
        </Routes>
    )
}
export default AppRoutes;