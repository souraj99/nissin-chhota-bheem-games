import "../styles/pages.scss";
import MainLayout from "../layouts/MainLayout.tsx";
import { IMAGES } from "../lib/images.ts";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../lib/consts.ts";

function GetStart() {
  const navigate = useNavigate();
  const handleStartClick = () => {
    navigate(ROUTES.SELECT_FRAME, { replace: true });
  };
  return (
    <MainLayout className="common-page">
      <div className="common-content">
        <h1 className="common-heading lh-65">
          <span className="heading-line heading-line-1">PIN YOUR</span>
          <br />
          <span className="heading-line heading-line-2">SNAP</span>
        </h1>
        <img
          src={IMAGES.GsGroupImg}
          alt="Get Started Group Image"
          className="get-start-group-img"
        />
        <button className="btn" onClick={handleStartClick}>
          Start
        </button>
        <button className="btn transparent color-white">Exit</button>
      </div>
    </MainLayout>
  );
}

export default GetStart;
