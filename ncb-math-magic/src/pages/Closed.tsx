import "../styles/pages.scss";
import MainLayout from "../layouts/MainLayout.tsx";

function Closed() {
  return (
    <MainLayout className="register-page">
      <div className="register-form">
        <p className="title closed">
          Thank you for your interest. <br /> This promo is now over!
        </p>
      </div>
    </MainLayout>
  );
}

export default Closed;
