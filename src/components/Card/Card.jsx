import React from "react";
import styles from "./Card.module.css";

const colorMap = {
  blue: styles.blue,
  green: styles.green,
  yellow: styles.yellow,
  gray: styles.gray,
  sky:styles.sky
  };

export default function Card({ value, label, color, icon }) {
  return (
    <div className={styles.card}>
      <div>
        <h2 className={styles.value}>{value}</h2>
        <p className={styles.label}>{label}</p>
      </div>
      <div className={`${styles.icon} ${colorMap[color]}`}>{icon}</div>
    </div>
  );
}
