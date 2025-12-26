import { Route, Routes } from "react-router-dom";
import { ROUTES } from "../lib/consts";
import GetStart from "../pages/GetStart";
import SelectFrame from "../pages/SelectFrame";
import ClickPhoto from "../pages/ClickPhoto";
import DownloadPhoto from "../pages/DownloalPhoto";

export const AllRoutes = () => {
  return (
    <Routes key={location.pathname}>
      <Route path={ROUTES.HOME} element={<GetStart />} />
      <Route path={ROUTES.SELECT_FRAME} element={<SelectFrame />} />
      <Route path={ROUTES.CLICK_PHOTO} element={<ClickPhoto />} />
      <Route path={ROUTES.DOWNLOAD} element={<DownloadPhoto />} />
    </Routes>
  );
};
export default AllRoutes;
