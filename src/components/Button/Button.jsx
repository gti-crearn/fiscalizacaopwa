import { forwardRef } from "react";
import styles from "./Button.module.css";

// Mapeamento de variantes para classes
const variantClasses = {
  green: styles.green,
  orange: styles.orange,
  blue: styles.blue,
  red: styles.red,
  gray: styles.gray,
  default: styles.default,
};

export const ButtonComponent = forwardRef(
  ({ variant, onClick, icon, width = "max", children, type = "button", disabled, ...props }, ref) => {
    const variantClass = variantClasses[variant] || variantClasses.default;
    const widthClass = width === "w-full" ? styles.widthFull : styles.widthMax;

    return (
      <button
        ref={ref}
        className={`${styles.button} ${variantClass} ${widthClass}`}
        onClick={onClick}
        type={type}
        disabled={disabled}
        {...props}
      >
        {icon}
        {children}
      </button>
    );
  }
);

