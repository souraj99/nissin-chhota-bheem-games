import "../styles/pages.scss";
import MainLayout from "../layouts/MainLayout.tsx";
import RegisterForm from "./registration/Register.tsx";
import { useEffect, useState } from "react";
import OtpForm from "./registration/Otp.tsx";
import { useGlobalModalContext } from "../helpers/GlobalModal.tsx";

function UserRegister() {
  const [showOtpForm, setShowOtpForm] = useState(false);
  const { hideModal } = useGlobalModalContext();
  useEffect(() => {
    hideModal(true);
  }, []);
  return (
    <MainLayout className="register-page">
      {showOtpForm ? (
        <OtpForm />
      ) : (
        <RegisterForm
          onSuccess={() => {
            setShowOtpForm(true);
          }}
        />
      )}
    </MainLayout>
  );
}

export default UserRegister;
