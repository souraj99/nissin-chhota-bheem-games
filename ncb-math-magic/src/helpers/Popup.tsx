import { PropsWithChildren } from "react";
import { useGlobalModalContext } from "./GlobalModal.tsx";
import { IMAGES } from "../lib/images.ts";

export interface PopupProps extends PropsWithChildren {
  title?: string;
  modalBgClass?: string;
  className?: string;
  hide?: boolean;
  hideTitle?: boolean;
  showCloseBtn?: boolean;
}

export default function Popup(props: PopupProps) {
  const { hideModal } = useGlobalModalContext();

  return (
    <div className={`popup ${props.className || ""}`}>
      <div className="popup-bg"></div>
      <div className={`popup-modal ${props.modalBgClass || ""}`}>
        {props.hide && (
          <img
            src={props.showCloseBtn ? IMAGES.CloseBtn : IMAGES.BackBtn}
            alt="Popup close"
            className="closeBtn"
            onClick={() => {
              hideModal();
            }}
          />
        )}
        {!props.hideTitle && (
          <div className="header">{<p className="title">{props.title}</p>}</div>
        )}

        <div className="content">{props.children}</div>
      </div>
    </div>
  );
}
