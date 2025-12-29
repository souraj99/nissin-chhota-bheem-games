import { useNavigate } from "react-router-dom";
import { useGlobalModalContext } from "../../helpers/GlobalModal";
import Popup from "../../helpers/Popup";
import { IMAGES } from "../../lib/images";
import "./index.scss";
import { ROUTES } from "../../lib/consts";

const Htp = () => {
  const navigate = useNavigate();
  const { hideModal } = useGlobalModalContext();
  const onContinueClick = () => {
    hideModal();
    navigate(ROUTES.GAME);
  };
  return (
    <Popup modalBgClass="error-popup" hide={false} showCloseBtn={true}>
      <p className="htp-title">How to play?</p>
      <img src={IMAGES.Htp} alt="How to play" />
      <button className="btn m-auto" onClick={onContinueClick}>
        Continue
      </button>
    </Popup>
  );
};

export default Htp;
