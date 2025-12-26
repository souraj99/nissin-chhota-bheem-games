import { useEffect, useState } from "react";
import "./SideMenu.scss";
import { MODAL_TYPES, useGlobalModalContext } from "../../helpers/GlobalModal";
import { IMAGES } from "../../lib/images";
import { EVENTS, trackEvent } from "../../lib/analytics";
// import { useAuthentication } from "../../hooks/useAuthentication";

interface NavOption {
  name: string;
  route: string;
  onClick: () => void;
  isDisable: boolean;
}

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
}

const SideMenu = ({ open, onClose }: SideMenuProps) => {
  const [navOptions, setNavOptions] = useState<NavOption[]>([]);
  const { showModal } = useGlobalModalContext();
  // const { isLoggedIn } = useAuthentication();

  useEffect(() => {
    setNavOptions([
      // {
      //   name: "WINNER LIST",
      //   route: "",
      //   onClick: () => {
      //     showModal(MODAL_TYPES.WINNER_LIST);
      //     trackEvent(EVENTS.WINNER_LIST);
      //     onClose();
      //   },
      //   isDisable: isLoggedIn ? false : true,
      // },
      {
        name: "TERMS & CONDITIONS",
        route: "",
        onClick: () => {
          showModal(MODAL_TYPES.TERMS);
          trackEvent(EVENTS.TERMS_AND_CONDITIONS);
          onClose();
        },
        isDisable: false,
      },
      {
        name: "HOW TO PARTICIPATE",
        route: "",
        onClick: () => {
          showModal(MODAL_TYPES.HTP);
          trackEvent(EVENTS.HOW_TO_PARTICIPATE);
          onClose();
        },
        isDisable: false,
      },

      {
        name: "CONTACT US",
        route: "",
        onClick: () => {
          showModal(MODAL_TYPES.CONTACT_US);
          trackEvent(EVENTS.CONTACT_US);
          onClose();
        },
        isDisable: false,
      },
    ]);
  }, []);

  return (
    <div className={`side-menu ${open ? "opened" : "closed"}`}>
      <div className="bg" onClick={onClose}></div>
      <div className="modal">
        <section className="side-menu-header">
          <img
            src={IMAGES.CloseBtn}
            alt="menu"
            onClick={onClose}
            className="menu"
          />
        </section>

        <div className="options">
          {navOptions.map(
            (item) =>
              !item.isDisable && (
                <div
                  className="option"
                  onClick={() => item.onClick && item.onClick()}
                  key={item.name}
                >
                  {item.name}
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
