import { Route, Routes } from "react-router-dom";
import { ROUTES } from "../lib/consts";
import UserRegister from "../pages/UserReg";

export const AllRoutes = () => {
  return (
    <Routes key={location.pathname}>
      <Route path={ROUTES.HOME} element={<UserRegister />} />
    </Routes>
  );
};
export default AllRoutes;
