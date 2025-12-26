import { Form, Formik } from "formik";
import API from "../../api";
import { ERROR_IDS } from "../../api/utils.ts";
import { store } from "../../store/store.ts";
import { setAccessToken } from "../../store/slices/authSlice.ts";
import { OtpValidation } from "../../schema/validationSchema.ts";
import { useEffect, useRef, useState } from "react";
import { EVENTS, trackEvent } from "../../lib/analytics.ts";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../lib/consts.ts";

/**
 * OTP verification form component
 * Handles OTP input with auto-resend timer functionality
 */
const OtpForm = () => {
  const [resendTimer, setResendTimer] = useState(60);
  const timer = useRef<NodeJS.Timeout>();
  const navigate = useNavigate();

  const startTimer = () => {
    if (timer.current) clearInterval(timer.current);
    let time = 60;
    setResendTimer(time);
    timer.current = setInterval(() => {
      time--;
      setResendTimer(time);
      if (time <= 0 && timer.current) {
        clearInterval(timer.current);
      }
    }, 1000);
  };
  useEffect(() => {
    startTimer();
  }, []);

  const resendOtp = () => {
    if (resendTimer <= 0) {
      startTimer();
      API.resendOTP().catch((err) => {
        console.log(err);
      });
    }
  };

  useEffect(
    () => () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    },
    []
  );

  return (
    <Formik
      key="otp-form"
      initialValues={{
        otp: "",
      }}
      validationSchema={OtpValidation}
      onSubmit={(values, errors) => {
        API.verifyOTP(values.otp)
          .then((response) => {
            store.dispatch(setAccessToken(response.accessToken));
            trackEvent(EVENTS.VERIFY_OTP);
            trackEvent(EVENTS.SIGN_IN);
            navigate(ROUTES.THANK_YOU, { replace: true });
          })
          .catch((err) => {
            const { messageId, message } = err;
            switch (messageId) {
              case ERROR_IDS.INVALID_OTP:
              case ERROR_IDS.DEFAULT_ERR:
                errors.setErrors({
                  otp: message,
                });
                break;
              default:
                errors.setErrors({
                  otp: message,
                });
                break;
            }
          });
      }}
    >
      {({
        values,
        handleChange,
        handleSubmit,
        handleBlur,
        errors,
        touched,
      }) => {
        return (
          <Form onSubmit={handleSubmit} className="otp-form reg">
            <p className="title">Enter OTP</p>
            <div className="input-group otp-input">
              <div className="wrapper">
                <input
                  autoComplete="off"
                  type="tel"
                  onChange={handleChange}
                  value={values.otp}
                  name="otp"
                  maxLength={6}
                  onBlur={handleBlur}
                  placeholder="Enter Otp*"
                />
              </div>
              {errors.otp && touched.otp && (
                <p className="error">{errors.otp}</p>
              )}
            </div>
            <div className="flex-center timer-wrapper">
              {resendTimer > 0 && (
                <div className="timer flex-center">
                  <p>{resendTimer}</p>
                </div>
              )}
              <span className="otp-text">Didn’t receive passcode yet?</span>
              <span className="link" onClick={resendOtp}>
                Resend
              </span>
            </div>
            <button className="btn w-80" type="submit">
              Verify OTP
            </button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default OtpForm;
