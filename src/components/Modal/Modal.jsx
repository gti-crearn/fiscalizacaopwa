"use client";
import { createPortal } from "react-dom";
import styles from "./Modal.module.css";

export function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop escuro */}
      <div className={styles.backdrop} onClick={onClose} />

      {/* Conteúdo da Modal */}
      <div
        className={styles.modalWrapper}
        role="dialog"
        aria-modal="true"
        aria-label="Modal"
      >
        <div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()} // Previne fechamento ao clicar dentro
        >
          {/* Botão de fechar */}
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Fechar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Conteúdo passado via children */}
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </>,
    document.body // Renderiza fora da árvore principal
  );
}