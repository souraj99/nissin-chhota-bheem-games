import {
  BaseResponse,
  CreateUserPayload,
  CreateUserResponse,
  RegisterPayload,
  RegisterResponse,
  VerifyOtpResponse,
} from "../interface/api";
import { decryptData, sendEncrytedData } from "./encrypt";
import { defaultCatch, fetchHandlerText, responseHelper } from "./utils";
import { getCookie, logoutUser } from "../lib/utils";
import { store } from "../store/store";
import { toast } from "react-toastify";

const jsonHeaders: { [key: string]: string } = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

class APIS {
  private showLoader: (loaderTitle?: string | undefined) => void = () => {};
  private hideLoader: (loaderTitle?: string | undefined) => void = () => {};
  private static instance: APIS | null = null;
  public instanceId = "TEST";
  private static activityTimer: NodeJS.Timeout;
  private isOnline = true;

  constructor(instanceId: string) {
    this.instanceId = instanceId;
    document.addEventListener("click", this.logActivity);
  }

  static getInstance() {
    return APIS.instance || (APIS.instance = new APIS("TEST NEW 1"));
  }

  setIsOnline(val: boolean) {
    this.isOnline = val;
  }
  getIsOnline() {
    return this.isOnline;
  }

  private logActivity() {
    // console.log("LOG", "ACTIVTY");
    clearTimeout(APIS.activityTimer);
    const auth = store.getState().auth;
    if (auth && auth.accessToken) {
      // console.log("LOG", "INACTIVITY TIMER STARTED", new Date());
      APIS.activityTimer = setTimeout(() => {
        // console.log("LOG", "LOGGING USER OUT", new Date());
        logoutUser();
        toast.info("Your session has been expired");
      }, 20 * 60 * 1000);
    }
  }

  initialize(
    showLoader: (loaderTitle?: string | undefined) => void,
    hideLoader: () => void
  ) {
    this.showLoader = showLoader;
    this.hideLoader = hideLoader;
  }

  async createUser(): Promise<CreateUserResponse> {
    const payload: CreateUserPayload = {};
    const state = store.getState();
    const { accessToken } = state.auth;
    // todo: change your-projectID to your actual project id
    const masterKey = getCookie("your-projectID-id");
    if (masterKey) {
      payload.masterKey = masterKey;
    }
    const headers = jsonHeaders;
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("utm_source")) {
      payload.utm_source = urlParams.get("utm_source");
    }
    if (urlParams.get("utm_medium")) {
      payload.utm_medium = urlParams.get("utm_medium");
    }
    if (urlParams.get("utm_campaign")) {
      payload.utm_campaign = urlParams.get("utm_campaign");
    }
    if (urlParams.get("utm_content")) {
      payload.utm_content = urlParams.get("utm_content");
    }
    if (urlParams.get("utm_term")) {
      payload.utm_term = urlParams.get("utm_term");
    }
    this.showLoader("Starting session...");
    return fetch(`${import.meta.env.VITE_API_BASE_URL}users`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    })
      .then(fetchHandlerText)
      .then(decryptData)
      .then(responseHelper)
      .catch(defaultCatch)
      .finally(this.hideLoader);
  }
  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    // console.log(payload);
    this.showLoader("Saving details...");
    return sendEncrytedData("users/register/", payload)
      .then(fetchHandlerText)
      .then(decryptData)
      .then(responseHelper)
      .catch(defaultCatch)
      .finally(this.hideLoader);
  }

  async verifyOTP(otp: string): Promise<VerifyOtpResponse> {
    this.showLoader("Verifying OTP...");
    return sendEncrytedData("users/verifyOTP/", { otp })
      .then(fetchHandlerText)
      .then(decryptData)
      .then(responseHelper)
      .catch(defaultCatch)
      .finally(this.hideLoader);
  }

  async resendOTP(): Promise<BaseResponse> {
    this.showLoader("Resending OTP...");
    return sendEncrytedData("users/resendOtp/", {})
      .then(fetchHandlerText)
      .then(decryptData)
      .then(responseHelper)
      .catch(defaultCatch)
      .finally(this.hideLoader);
  }
}
const API = APIS.getInstance();

export default API;
