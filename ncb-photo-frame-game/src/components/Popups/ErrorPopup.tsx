import Popup from "../../helpers/Popup";
import "./index.scss";

interface ErrorPopupProps {
  message?: string;
  hideModal?: () => void;
}

const ErrorPopup = ({ message = "Something went wrong" }: ErrorPopupProps) => {
  return (
    <Popup modalBgClass="error-popup" hide={true} showCloseBtn={true}>
      <p>{message}</p>
    </Popup>
  );
};

export default ErrorPopup;
