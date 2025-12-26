import React, { useState, createContext, useContext } from "react";
import popups from "../components/Popups";

export const MODAL_TYPES = {
  CONTACT_US: "CONTACT_US",
  TERMS: "TERMS_AND_CONDITIONS",
  HTP: "HTP",
  ERROR_POPUP: "ERROR_POPUP",
};

const MODAL_COMPONENTS = {
  [MODAL_TYPES.CONTACT_US]: popups.ContactUsPopup,
  [MODAL_TYPES.TERMS]: popups.TermsAndConditionsPopup,
  [MODAL_TYPES.HTP]: popups.Htp,
  [MODAL_TYPES.ERROR_POPUP]: popups.ErrorPopup,
};

interface ModalProps {
  hideModal?: (blockOnClose?: boolean) => void;
  [key: string]: unknown;
}

type ContextType = {
  showModal: (
    modalType: string,
    modalProps?: ModalProps,
    onClose?: () => void
  ) => void;
  hideModal: (blockOnClose?: boolean) => void;
  store: GlobalModalStore;
};

const initalState: ContextType = {
  showModal: () => {},
  hideModal: () => {},
  store: {
    modalType: "",
    modalProps: {},
    onClose: () => {},
  },
};

const GlobalModalContext = createContext(initalState);
export const useGlobalModalContext = () => useContext(GlobalModalContext);

interface GlobalModalStore {
  modalType: string;
  modalProps: ModalProps;
  onClose: () => void;
}
export const GlobalModal: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [store, setStore] = useState<GlobalModalStore>({
    modalType: "",
    modalProps: {},
    onClose: () => {},
  });
  const { modalType, modalProps } = store || {};

  const showModal = (
    modalType: string,
    modalProps: ModalProps = {},
    onClose: () => void = () => {}
  ) => {
    setStore({
      ...store,
      modalType,
      modalProps,
      onClose,
    });
  };

  const hideModal = (blockOnClose?: boolean) => {
    setStore({
      ...store,
      modalType: "",
      modalProps: {},
      onClose: () => {},
    });
    if (blockOnClose !== true) {
      store.onClose();
    }
  };

  const renderComponent = () => {
    const ModalComponent =
      MODAL_COMPONENTS[modalType as keyof typeof MODAL_COMPONENTS];
    if (!modalType || !ModalComponent) {
      return null;
    }
    return React.createElement(ModalComponent, { hideModal, ...modalProps });
  };

  return (
    <GlobalModalContext.Provider value={{ store, showModal, hideModal }}>
      {renderComponent()}
      {children}
    </GlobalModalContext.Provider>
  );
};
