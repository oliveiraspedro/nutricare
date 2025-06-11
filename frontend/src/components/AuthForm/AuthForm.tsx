import React, { ReactNode } from "react";
import "./AuthForm.css";
import logo from "../../assets/img/NutriCare_Logo_2.webp";

interface AuthFormProps {
  buttonText: string;
  alternateText: string;
  alternateLinkText: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onBottomLinkClick?: () => void;
  buttonId?: string;
  linkTo: string;
  children: ReactNode;
  isDisabled: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({
  buttonText,
  alternateText,
  alternateLinkText,
  onSubmit,
  onBottomLinkClick,
  buttonId,
  linkTo,
  children,
  isDisabled,
}) => {
  return (
    <div className="auth-form-container">
      <img src={logo} alt="Logo" id="logo" />
      <form onSubmit={onSubmit}>
        {children}
        <div className="auth-form-container-button">
          <button id={buttonId} type="submit" disabled={isDisabled}>
            {buttonText}
          </button>
        </div>
      </form>
      <p>
        {alternateText}{" "}
        <a href={linkTo} onClick={onBottomLinkClick}>
          {alternateLinkText}
        </a>
      </p>
    </div>
  );
};

export default AuthForm;