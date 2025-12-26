import React from "react";
import "./Skelton.scss";
import MainLayout from "../../layouts/MainLayout";

const Skelton: React.FC = () => {
  return (
    <MainLayout className="register-page skelton-page">
      <div className="register-skeleton">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-input" />
        <div className="skeleton skeleton-input" />
        <div className="skeleton skeleton-input" />
        <div className="skeleton skeleton-input" />
        <div className="skeleton skeleton-select" />
        {/* <div className="skeleton skeleton-captcha" /> */}
        {/* <div className="skeleton skeleton-checkbox" /> */}
        <div className="skeleton skeleton-button" />
      </div>
    </MainLayout>
  );
};

export default Skelton;
