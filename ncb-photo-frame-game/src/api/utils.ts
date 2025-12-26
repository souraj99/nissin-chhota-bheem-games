/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-plusplus */
/* eslint-disable new-cap */
/* eslint-disable no-param-reassign */
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { logoutUser } from "../lib/utils";
import API from ".";
import { MODAL_TYPES } from "../helpers/GlobalModal";

let globalShowModal: ((modalType: string, modalProps?: any) => void) | null =
  null;

export const setGlobalShowModal = (
  showModal: (modalType: string, modalProps?: any) => void
) => {
  globalShowModal = showModal;
};

export const fetchHandler = (response: any): Promise<any> => {
  const defaultResp = {
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
  };
  if (response.ok) {
    return response
      .json()
      .then((data: any) => {
        // the status was ok and there is a json body
        return Promise.resolve({ data, rawResp: response, ...defaultResp });
      })
      .catch((err: any) => {
        // the status was ok but there is no json body
        return Promise.resolve({
          data: err,
          rawResp: response,
          ...defaultResp,
        });
      });
  } else {
    return response
      .json()
      .catch((err: any) => {
        // the status was not ok and there is no json body
        return Promise.resolve({
          rawResp: response,
          data: err,
          ...defaultResp,
        });
      })
      .then((json: any) => {
        // the status was not ok but there is a json body
        return Promise.resolve({
          rawResp: response,
          data: json,
          ...defaultResp,
        });
      });
  }
};

export const fetchHandlerText = (response: any): Promise<any> => {
  const defaultResp = {
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
  };
  if (response.ok) {
    return response
      .text()
      .then((data: any) => {
        // the status was ok and there is a data
        return Promise.resolve({ data, rawResp: response, ...defaultResp });
      })
      .catch((err: any) => {
        // the status was ok but there is no data
        return Promise.resolve({
          data: err,
          rawResp: response,
          ...defaultResp,
        });
      });
  } else {
    return response
      .text()
      .catch((err: any) => {
        // the status was not ok and there is no data
        return Promise.resolve({
          rawResp: response,
          data: err,
          ...defaultResp,
        });
      })
      .then((text: any) => {
        // the status was not ok but there is a data
        return Promise.resolve({
          rawResp: response,
          data: text,
          ...defaultResp,
        });
      });
  }
};

export const responseHelper = (response: any): Promise<any> => {
  const { statusCode } = response.data;
  if (statusCode >= 200 && statusCode < 300) {
    return Promise.resolve(response.data);
  } else {
    return Promise.reject(response.data);
  }
};

export enum ERROR_IDS {
  INVALID_NAME = "name",
  INVALID_MOBILE = "mobile",
  INVALID_OTP = "otp",
  INVALID_EMAIL = "email",
  INVALID_CODE = "code",
  INVALID_STATE = "state",
  INVALID_ANSWER = "answer",
  DEFAULT_ERR = "error",
}

// Default catch function when API fails
export const defaultCatch = (err: any): Promise<any> => {
  const ignoreMessageKeys = [...Object.values(ERROR_IDS)];
  const { statusCode, message, messageId = "" } = err;
  const isOnline = API.getIsOnline();

  let errorMessage = "";

  if (typeof err === "string") {
    errorMessage = isOnline
      ? "Something went wrong, try again after some time"
      : "You are offline";
  } else if (!ignoreMessageKeys.includes(messageId)) {
    if (message === "Failed to fetch") {
      errorMessage = isOnline
        ? "Please check your network and try again"
        : "You are offline";
    } else if (statusCode === 401) {
      logoutUser();
      errorMessage = "Your session has been expired";
    } else {
      errorMessage =
        message || "Something went wrong, try again after some time";
    }
  }

  if (errorMessage && globalShowModal) {
    globalShowModal(MODAL_TYPES.ERROR_POPUP, { message: errorMessage });
  } else if (errorMessage) {
    // Fallback to toast if modal is not available
    toast.error(errorMessage);
  }

  return Promise.reject(err);
};
