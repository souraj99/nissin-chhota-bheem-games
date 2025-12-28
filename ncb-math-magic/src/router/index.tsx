import { Route, Routes } from "react-router-dom";
import { ROUTES } from "../lib/consts";
import MagicOfMathGame from "../pages/MagicOfMathGame";
import Home from "../pages/Home";

export const AllRoutes = () => {
  return (
    <Routes key={location.pathname}>
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.GAME} element={<MagicOfMathGame />} />
    </Routes>
  );
};
export default AllRoutes;
