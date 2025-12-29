import Popup from "../../helpers/Popup";
import "./index.scss";

const ContactUsPopup = () => {
  return (
    <Popup
      className="contact-us-popup"
      title={"Contact Us"}
      hide={true}
      showCloseBtn={false}
    >
      <p>Coming Soon...</p>
      {/* <p className="text1">For any queries, please contact us at</p>
      <p className="text2">
        Premier Sales Promotions Pvt. Ltd, Mitra Towers, Bangalore - 560001
      </p>
      <p className="text3">
        Email:{" "}
        <a href="mailto:feedback@bigcity.in" style={{ color: "yellow" }}>
          feedback@bigcity.in
        </a>
      </p> */}
    </Popup>
  );
};

export default ContactUsPopup;
