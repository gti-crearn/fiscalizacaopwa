// src/components/ButtonLink.jsx
import React from "react";
import { Link } from "react-router-dom";
import styles from "./Link.module.css";

const variantClasses = {
  green: styles.green,
  orange: styles.orange,
  blue: styles.blue,
  red: styles.red,
  gray: styles.gray,
  default: styles.default,
};

const widthClasses = {
  max: styles.widthMax,
  full: styles.widthFull,
};

export function ButtonLink({ to, nome, variant = "default", width = "max", icon, disabled = false, ...props }) {
  const variantClass = variantClasses[variant] || variantClasses.default;
  const widthClass = widthClasses[width] || widthClasses.max;

  const className = `${styles.button} ${variantClass} ${widthClass}`;

  if (disabled) {
    return (
      <span className={className} aria-disabled="true">
        {icon}
        {nome}
      </span>
    );
  }

  return (
    <Link to={to} className={className} {...props}>
      {icon}
      {nome}
    </Link>
  );
}