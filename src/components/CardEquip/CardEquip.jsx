"use client";

import { NavLink } from "react-router-dom";
import styles from "./CardEquip.module.css";
import { FiClock } from "react-icons/fi";

export function CardEquip({
  name,
  status,
  color,
  members = 0,
  goals = 0,
  completedPercentage = 0,
  link,
  updatedAt,
}) {
  // Define cor da barra de progresso
  const progressBarColor =
    completedPercentage === 100 ? styles.progressFull : styles.progressPartial;

  return (
    <NavLink to={link} className={styles.cardLink}>
      <div className={styles.card}>
        {/* Cabeçalho */}
        <div className={styles.header}>
          <span
            className={styles.nameBadge}
            style={{ backgroundColor: color }}
          >
            {name}
          </span>
          {/* Status comentado conforme original
          <span className={`${styles.statusBadge} ${status === "ATIVO" ? styles.statusActive : styles.statusInactive}`}>
            {status === "ATIVO" ? "Ativa" : "Inativa"}
          </span>
          */}
        </div>

        {/* Corpo */}
        <div className={styles.body}>
          <div className={styles.metrics}>
            <div>
              <p className={styles.metricValue}>{members}</p>
              <p className={styles.metricLabel}>Membros</p>
            </div>
            <div>
              <p className={styles.metricValue}>{goals}</p>
              <p className={styles.metricLabel}>Fiscalizações</p>
            </div>
            <div>
              <p className={styles.metricValue}>{completedPercentage}%</p>
              <p className={styles.metricLabel}>Concluído</p>
            </div>
          </div>

          {/* Barra de progresso */}
          <div className={styles.progressBarContainer}>
            <div
              className={`${styles.progressBar} ${progressBarColor}`}
              style={{ width: `${completedPercentage}%` }}
            ></div>
          </div>

          {/* Botão Detalhes (comentado)
          <button className={styles.detailsButton}>
            <svg className={styles.icon}>
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7S3.732 16.057 2.458 12z" />
            </svg>
            Detalhes
          </button>
          */}
        </div>

        {/* Rodapé */}
        <div className={styles.footer}>
          <FiClock size={16}/>
          Atualizado em {updatedAt}
        </div>
      </div>
    </NavLink>
  );
}