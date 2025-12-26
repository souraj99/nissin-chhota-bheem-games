import * as Yup from "yup";

const RegisterValidation = Yup.object().shape({
  code: Yup.string()
    .required("Please enter the unique code")
    .matches(/^[a-zA-Z0-9]+$/, "Please enter a valid unique code")
    .min(6, "Please enter a valid unique code")
    .max(15, "Please enter a valid unique code"),
  name: Yup.string()
    .required("Please enter your name")
    .min(2, "Name must be at least 2 characters long"),
  email: Yup.string()
    .required("Please enter your email")
    .matches(
      /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,6}$/,
      "Please enter a valid email address"
    )
    .email("Please enter a valid email address"),
  state: Yup.string().required("Please enter your state"),
  // answer: Yup.string().when("state", {
  //   is: (val: string) => val === "Tamil Nadu",
  //   then: (schema) =>
  //     schema
  //       .required("Please enter your answer")
  //       .min(10, "Answer must be at least 10 characters")
  //       .max(200, "Answer must be 200 characters or fewer"),
  //   otherwise: (schema) => schema.notRequired(),
  // }),
  mobile: Yup.string()
    .required("Please enter a 10-digit number")
    .matches(/^[56789][0-9]{9}$/, "Please enter a valid 10-digit number"),

  agree1: Yup.boolean()
    .oneOf([true], "Please agree to the Terms & Conditions")
    .required("Please agree to the Terms & Conditions"),
});

const OtpValidation = Yup.object().shape({
  otp: Yup.string()
    .required("Please enter a valid otp")
    .matches(/^[0-9]{6}$/, "Please enter a valid otp"),
});

export { RegisterValidation, OtpValidation };
