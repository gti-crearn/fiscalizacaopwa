"use client";
import { ButtonComponent } from "../Button/Button";
import styles from "./Title.module.css";


// Mapeamento de cores para o ButtonComponent
const colorClasses = {
  blue: "border-blue-600 text-blue-600 hover:bg-blue-50",
  green: "border-green-600 text-green-600 hover:bg-green-50",
  red: "border-red-600 text-red-600 hover:bg-red-50",
  gray: "border-gray-600 text-gray-600 hover:bg-gray-50",
};

export default function Title({ title, subtitle, actions = [] }) {
  return (
    <header className={styles.header}>
      {/* Título e Subtítulo */}
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      {/* Botões de ação */}
      <div className={styles.actions}>
        {actions.map((btn, i) => (
          <ButtonComponent
            key={i}
            onClick={btn.onClick}
            variant={btn.color}
           
          >
            {btn.icon}
            {btn.label}
          </ButtonComponent>
        ))}
      </div>
    </header>
  );
}