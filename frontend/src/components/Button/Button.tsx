import React from "react";
import "./Button.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  label,
  variant = "primary",
  size = "medium",
  icon,
  className,
  ...props
}) => {
  return (
    <button className={`custom-button ${variant} ${size}`} {...props}>
      {icon && <span className="button-icon">{icon}</span>}
      {label}
    </button>
  );
};

/*
Exemplos de como usar:
<Button label="Adicionar" variant="primary" size="large" onClick={handleClick} />

<Button label="Cancelar" variant="secondary" size="small" />

<Button
  label="Salvar"
  variant="primary"
  size="medium"
  icon={<span className="material-symbols-outlined">save</span>}
  onClick={() => alert("Salvo!")}
/>
*/

export default Button;
