import { Form, Formik } from "formik";
import React from "react";
import { RegisterValidation } from "../../schema/validationSchema.ts";
import {
  MODAL_TYPES,
  useGlobalModalContext,
} from "../../helpers/GlobalModal.tsx";
import CheckBox from "../../components/checkBox/CheckBox.tsx";
import API from "../../api";
import { ERROR_IDS } from "../../api/utils.ts";
import {
  alphabetRegex,
  alphaNumericRegex,
  handleInputChange,
  numberRegex,
} from "../../lib/validationUtils.ts";
import { IMAGES } from "../../lib/images.ts";
import { EVENTS, trackEvent } from "../../lib/analytics.ts";

interface RegisterFormProps {
  onSuccess: () => void;
}

/**
 * Registration form component
 * Collects user information and validates before sending OTP
 */
const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const { showModal } = useGlobalModalContext();
  // const { data, loading } = useFetchData<StatesResponse>("states");

  return (
    <Formik
      key="register-form"
      initialValues={{
        code: "",
        name: "",
        email: "",
        state: "",
        mobile: "",
        agree1: false,
      }}
      validationSchema={RegisterValidation}
      onSubmit={(values, { setErrors }) => {
        if (!values.agree1) {
          setErrors({
            agree1: "Please agree to the Terms & Conditions",
          });
          return;
        }

        API.register(values)
          .then(() => {
            onSuccess();
            trackEvent(EVENTS.GET_OTP);
          })
          .catch((err) => {
            const { messageId, message } = err;
            const fieldMap: Record<string, keyof typeof values> = {
              [ERROR_IDS.INVALID_MOBILE]: "mobile",
              [ERROR_IDS.INVALID_CODE]: "code",
              [ERROR_IDS.INVALID_EMAIL]: "email",
              [ERROR_IDS.INVALID_NAME]: "name",
              [ERROR_IDS.INVALID_STATE]: "state",
            };
            const errorField = fieldMap[messageId] || "state";
            setErrors({ [errorField]: message });
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
        setFieldValue,
      }) => (
        <Form onSubmit={handleSubmit} className="register-form">
          <p className="title">Registration</p>
          <div className="input-group ">
            <input
              autoComplete="off"
              type="text"
              name="code"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const sanitized = handleInputChange(event, alphaNumericRegex);
                handleChange({
                  target: { name: "code", value: sanitized.trim() },
                });
              }}
              value={values.code.toUpperCase().trim()}
              onBlur={handleBlur}
              minLength={6}
              maxLength={15}
              placeholder="Unique Code*"
            />

            {touched.code && errors.code && (
              <p className="error">{errors.code}</p>
            )}
          </div>
          <p className="code-help-text">
            To find the unique code{" "}
            <span onClick={() => showModal(MODAL_TYPES.CODE)}> click here</span>
          </p>
          <div className="input-group ">
            <input
              autoComplete="off"
              type="text"
              name="name"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const sanitized = handleInputChange(event, alphabetRegex);
                handleChange({
                  target: { name: "name", value: sanitized },
                });
              }}
              value={values.name}
              onBlur={handleBlur}
              placeholder="Name*"
            />

            {!errors.code && touched.name && errors.name && (
              <p className="error">{errors.name}</p>
            )}
          </div>
          <div className="input-group">
            <div className="wrapper">
              <input
                autoComplete="off"
                type="email"
                name="email"
                onChange={handleChange}
                value={values.email}
                onBlur={handleBlur}
                placeholder="Email id*"
              />
            </div>
            {!errors.code && !errors.name && touched.email && errors.email && (
              <p className="error">{errors.email}</p>
            )}
          </div>
          <div className="input-group">
            <div className="wrapper">
              <input
                autoComplete="off"
                type="tel"
                name="mobile"
                maxLength={10}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const sanitized = handleInputChange(event, numberRegex);
                  handleChange({
                    target: { name: "mobile", value: sanitized },
                  });
                }}
                value={values.mobile}
                onBlur={handleBlur}
                placeholder="Mobile number*"
              />
            </div>
            {!errors.code &&
              !errors.name &&
              !errors.email &&
              touched.mobile &&
              errors.mobile && <p className="error">{errors.mobile}</p>}
          </div>

          <div className="input-group arrow-after">
            <div className="img-wrapper">
              {values.state ? (
                <img
                  src={IMAGES.Down_Arrow_Lite}
                  alt="down-arrow"
                  className="down-arrow"
                />
              ) : (
                <img
                  src={IMAGES.Down_Arrow}
                  alt="down-arrow"
                  className="down-arrow"
                />
              )}
              <select
                name="state"
                className={`${values.state ? "selected" : ""}`}
                onBlur={handleBlur}
                onChange={(e) => {
                  const selectedState = e.target.value;
                  handleChange(e);
                  if (selectedState !== "Tamil Nadu") {
                    setFieldValue("answer", "");
                  }
                }}
                value={values.state}
              >
                <option value="" label="State*" />
                {/* {data?.stateData.map((state) =>
                  typeof state === "string" ? (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ) : (
                    <option key={state.stateName} value={state.stateKey}>
                      {state.stateKey}
                    </option>
                  )
                )} */}
              </select>
            </div>
            {!errors.code &&
              !errors.name &&
              !errors.email &&
              !errors.mobile &&
              touched.state &&
              errors.state && (
                <p className="error" style={{ marginBottom: ".5rem" }}>
                  {errors.state}
                </p>
              )}
          </div>

          <div
            className="input-group flex-center  checkbox gs-container"
            style={{ alignItems: "baseline" }}
          >
            <CheckBox
              name="agree1"
              id="agree1"
              onBlur={() => handleBlur}
              onChange={(checked) =>
                handleChange({
                  target: {
                    name: "agree1",
                    value: checked,
                  },
                })
              }
            />
            <p className="agree">
              I accept the
              <span
                onClick={() => {
                  showModal(MODAL_TYPES.TERMS);
                  trackEvent(EVENTS.TERMS_AND_CONDITIONS);
                }}
                className="u-line"
              >
                Terms & Conditions and Privacy Policy
              </span>{" "}
              . I also consent to receive marketing and promotional messages
              from Mondelez about its products and offers.
            </p>
          </div>

          {!errors.code &&
            !errors.name &&
            !errors.email &&
            !errors.mobile &&
            !errors.state &&
            touched.agree1 &&
            !values.agree1 && <p className="error">{errors.agree1}</p>}

          <button className="btn btn-primary reg-btn w-80" type="submit">
            GET OTP
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;
