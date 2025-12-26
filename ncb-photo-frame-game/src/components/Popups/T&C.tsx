import Popup from "../../helpers/Popup";
import "./index.scss";

const TAndC = () => {
  return (
    <Popup
      className="contact-us-popup"
      title={"Terms & Conditions"}
      hide={true}
      showCloseBtn={false}
    >
      <p>Coming Soon...</p>
    </Popup>
  );
};

export default TAndC;
