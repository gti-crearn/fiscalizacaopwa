"use client";
import { useContext, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./AssignCoordinator.module.css";
import { api } from "../../../../services/api";
import { DataContext } from "../../../../context/DataContext";


export function AssignCoordinator({ isOpen, onClose, users, teamId }) {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { fetchTeamById } = useContext(DataContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError("Selecione um usuário.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.patch(`/team/${teamId}/coordinator`, {
        userId: Number(userId),
      });
      window.location.reload()
      onClose(); // Fecha o modal
    } catch (err) {
      const message =
        err.response?.data?.message || "Erro ao definir coordenador.";
      setError(message);
      console.error("Erro na API:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div className={styles.backdrop} onClick={onClose}></div>

      {/* Modal */}
      <div className={styles.modalWrapper}>
        <div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className={styles.title}>Definir Coordenador da Equipe</h3>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Selecionar Usuário</label>
              <select
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className={styles.select}
              >
                <option value="">Selecione um usuário</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.buttons}>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className={styles.cancelButton}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className={styles.submitButton}
              >
                {loading ? "Salvando..." : "Definir"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>,
    document.body
  );
}