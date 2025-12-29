import Popup from "../../helpers/Popup";
import "./index.scss";

const CodePopup = () => {
  return (
    <Popup modalBgClass="error-popup" hide={true} showCloseBtn={true}>
      <p>Coming Soon...</p>
    </Popup>
  );
};

export default CodePopup;
