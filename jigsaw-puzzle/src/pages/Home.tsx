import "../styles/pages.scss";
import MainLayout from "../layouts/MainLayout.tsx";
import { MODAL_TYPES, useGlobalModalContext } from "../helpers/GlobalModal.tsx";
import { IMAGES } from "../lib/images.ts";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../lib/consts.ts";

function Home() {
  const navigate = useNavigate();
  const { showModal } = useGlobalModalContext();
  const handleHowToPlay = () => {
    showModal(MODAL_TYPES.HTP);
  };
  const handlePlayGame = () => {
    navigate(ROUTES.GAME);
  };
  const handleExit = () => {
    console.log("Exit Clicked");
    // showModal(MODAL_TYPES.EXIT_GAME);
  };

  return (
    <MainLayout className="common-page main-bg">
      <div className="common-content">
        <div className="home-content-wrapper">
          <img src={IMAGES.Logo} alt="Logo" className="gs-logo" />
          <img src={IMAGES.ChutkiGs} alt="ChutkiGs" className="chutki-gs" />
          <div className="button-section">
            <img
              src={IMAGES.ExitIcon}
              alt="ExitIcon"
              className="exit-icon"
              onClick={handleExit}
            />
            <img
              src={IMAGES.PlayIcon}
              alt="PlayIcon"
              className="play-icon"
              onClick={handlePlayGame}
            />
          </div>
          <button className="btn white" onClick={handleHowToPlay}>
            How to play?
          </button>
        </div>
      </div>
    </MainLayout>
  );
}

export default Home;
