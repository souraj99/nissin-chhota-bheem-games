import { Route, Routes } from "react-router-dom";
import { ROUTES } from "../lib/consts";
import MagicOfMathGame from "../pages/MagicOfMathGame";

export const AllRoutes = () => {
  return (
    <Routes key={location.pathname}>
      <Route path={ROUTES.HOME} element={<MagicOfMathGame />} />
    </Routes>
  );
};
export default AllRoutes;
