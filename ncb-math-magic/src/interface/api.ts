export interface BaseResponse {
  statusCode: number;
  message: string;
}

export interface CreateUserPayload {
  masterKey?: string;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
  // ipInfo?: IpLookupData;
}

export interface CreateUserResponse extends BaseResponse {
  dataKey: string;
  userKey: string;
  isLoggedIn: number;
  brand: string;
  language: string;
}

export interface RegisterPayload {
  code: string;
  name: string;
  email: string;
  state: string;
  mobile: string;
}

export interface VerifyOtpResponse extends BaseResponse {
  accessToken: string;
  isTnUser: boolean;
  isWinner: boolean;
}

export interface RegisterResponse extends BaseResponse {
  accessToken: string;
}

export interface Equation {
  images: string[];
  total: number;
  characterValues: Record<string, number>;
}

export interface MathGameData {
  equations: Equation[];
}
export interface MAthGameResponse extends BaseResponse {
  data: MathGameData[];
}

export interface GameComplete extends BaseResponse {
  game_complete: number;
}
