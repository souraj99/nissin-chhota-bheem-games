/* eslint-disable @typescript-eslint/no-unused-vars */

declare global {
  interface Window {
    _hsq?: unknown[];
    cds_pixel?: (clientId: string, payload: Record<string, unknown>) => void;
    gtag?: (...args: unknown[]) => void;
    fbq?: (action: string, event: string) => void;
  }
}

// todo: change PROJECT_PREFIX to your actual project prefix
const PROJECT_PREFIX = "_";

export enum EVENTS {
  GET_OTP = "GET_OTP",
  VERIFY_OTP = "VERIFY_OTP",
  TERMS_AND_CONDITIONS = "TERMS_AND_CONDITIONS",
  CONTACT_US = "CONTACT_US",
  SIGN_IN = "SIGN_IN",
  HOW_TO_PARTICIPATE = "HOW_TO_PARTICIPATE",
  WINNER_LIST = "WINNER_LIST",
}

type StringEventMap = {
  [key in keyof typeof EVENTS]?: string;
};

type HubspotEventMap = {
  [key in keyof typeof EVENTS]?: {
    name: string;
    properties: Record<string, unknown>;
  };
};

type ObjectEventMap = {
  [key in keyof typeof EVENTS]?: Record<string, unknown>;
};

const GA_EVENTS: StringEventMap = {
  [EVENTS.GET_OTP]: "GET_OTP",
  [EVENTS.VERIFY_OTP]: "VERIFY_OTP",
  [EVENTS.TERMS_AND_CONDITIONS]: "TERMS_AND_CONDITIONS",
  [EVENTS.CONTACT_US]: "CONTACT_US",
  [EVENTS.HOW_TO_PARTICIPATE]: "HOW_TO_PARTICIPATE",
  [EVENTS.WINNER_LIST]: "WINNER_LIST",
};

const HUBSPOT_EVENTS: HubspotEventMap = {
  [EVENTS.SIGN_IN]: {
    name: "pe5686032_perk_consumer_promo_aug_sep_2025",
    properties: {
      event_name: "Sign In",
    },
  },
};

const FLOODLIGHT_EVENTS: StringEventMap = {};

const FB_PIXEL_EVENTS: StringEventMap = {};

const CDS_PIXEL_EVENTS: ObjectEventMap = {
  // [EVENTS.HOME_PAGE_LOAD]: {
  //   event_type: "Page_view",
  //   event_sub_type: "Homepage_Landing",
  // },
};

const UPA_PIXEL_EVENTS: StringEventMap = {};

function trackHubspotEvent(
  event: { name: string; properties: Record<string, unknown> },
  additionalInfo?: Record<string, unknown>
): void {
  if (window._hsq) {
    const eventPayload = {
      name: event.name,
      properties: {
        ...event.properties,
        ...(additionalInfo || {}),
      },
    };

    console.log("[HubSpot] Tracking custom event:", eventPayload);

    window._hsq.push(["trackCustomBehavioralEvent", eventPayload]);
  } else {
    console.warn("[HubSpot] _hsq is not available on window.");
  }
}

function trackCdsPixelEvent(
  payload: Record<string, unknown> = {},
  additionalInfo?: Record<string, unknown>
): void {
  payload.brand_name = "Limca";

  if (window.cds_pixel) {
    window.cds_pixel(process.env.REACT_APP_CDP_CLIENT_ID || "", {
      ...payload,
      ...additionalInfo,
    });
  }
}

function trackFloodLightEvent(
  event: string,
  additionalInfo?: Record<string, unknown>
) {
  if (window.gtag) {
    window.gtag("event", "conversion", {
      allow_custom_scripts: true,
      send_to: event,
      ...(additionalInfo || {}),
    });
  }
}

function trackFbPixelEvent(
  event: string,
  _additionalInfo?: Record<string, unknown>
) {
  if (window.fbq) {
    window.fbq("track", event);
  }
}

function gtagTrackEvent(
  event: string,
  additionalInfo?: Record<string, unknown>
) {
  if (window.gtag) {
    window.gtag("event", PROJECT_PREFIX + event, additionalInfo);
  }
}

const trackUniversalPixelEvent = (
  event: string,
  _additionalInfo?: Record<string, unknown>
) => {
  try {
    // Removing and adding new universal pixel
    const pixelUrl = `https://insight.adsrvr.org/track/pxl/?adv=zuazor5&ct=${event}&fmt=3`;
    const existingPixels = document.querySelectorAll(`img[src="${pixelUrl}"]`);
    existingPixels.forEach((pixel: any) => pixel.parentNode.removeChild(pixel));

    // Create a new tracking pixel
    const img = new Image(1, 1); // Creates an image of 1x1 pixels
    img.src = pixelUrl;
    img.alt = "";
    img.style.borderStyle = "none";
    img.style.position = "absolute";
    img.style.opacity = "0";

    // adding the pixel image
    if (document.body.firstChild) {
      document.body.insertBefore(img, document.body.firstChild);
    } else {
      document.body.appendChild(img);
    }
  } catch (error) {
    console.error("Error Universal Pixel", error);
  }
};

interface TrackEventAdditionalInfo {
  common?: Record<string, unknown>;
  ga?: Record<string, unknown>;
  fl?: Record<string, unknown>;
  fbPixel?: Record<string, unknown>;
  cdsPixel?: Record<string, unknown>;
  upaPixel?: Record<string, unknown>;
  hubspot?: Record<string, unknown>;
}

export function trackEvent(
  event: EVENTS,
  additionalInfo?: TrackEventAdditionalInfo
) {
  const gaEvent = GA_EVENTS[event];
  const flEvent = FLOODLIGHT_EVENTS[event];
  const fbPixelEvent = FB_PIXEL_EVENTS[event];
  const cdsPixelEvent = CDS_PIXEL_EVENTS[event];
  const upaPixelEvent = UPA_PIXEL_EVENTS[event];
  const hubspotEvent = HUBSPOT_EVENTS[event];

  if (gaEvent && typeof gaEvent === "string") {
    gtagTrackEvent(gaEvent, {
      ...additionalInfo?.common,
      ...additionalInfo?.ga,
    });
  }
  if (flEvent && typeof flEvent === "string") {
    trackFloodLightEvent(flEvent, {
      ...additionalInfo?.common,
      ...additionalInfo?.fl,
    });
  }
  if (fbPixelEvent && typeof fbPixelEvent === "string") {
    trackFbPixelEvent(fbPixelEvent, {
      ...additionalInfo?.common,
      ...additionalInfo?.fbPixel,
    });
  }
  if (cdsPixelEvent && typeof cdsPixelEvent === "object") {
    trackCdsPixelEvent(cdsPixelEvent, {
      ...additionalInfo?.common,
      ...additionalInfo?.cdsPixel,
    });
  }
  if (upaPixelEvent && typeof upaPixelEvent === "string") {
    trackUniversalPixelEvent(upaPixelEvent, {
      ...additionalInfo?.common,
      ...additionalInfo?.upaPixel,
    });
  }
  if (
    hubspotEvent &&
    typeof hubspotEvent === "object" &&
    "name" in hubspotEvent
  ) {
    trackHubspotEvent(hubspotEvent, {
      ...additionalInfo?.common,
      ...additionalInfo?.hubspot,
    });
  }
}
