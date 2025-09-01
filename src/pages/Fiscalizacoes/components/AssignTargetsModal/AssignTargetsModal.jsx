"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./AssignTargetsModal.module.css";
import { api } from "../../../../services/api";


export function AssignTargetsModal({ isOpen, onClose, targetIds, onSuccess }) {
  const [teams, setTeams] = useState([]);
  const [teamId, setTeamId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carrega equipes quando o modal abre
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await api.get("/team");
        setTeams(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError("Erro ao carregar equipes.");
      }
    };

    if (isOpen) {
      fetchTeams();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teamId || targetIds.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      await api.post(`/team/${teamId}/assign-targets`, { targetIds });
      onSuccess();
      onClose();
    } catch (err) {
      const message = err.response?.data?.message || "Erro ao atribuir alvos.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop escuro */}
      <div className={styles.backdrop} onClick={onClose}></div>

      {/* Conteúdo do modal */}
      <div className={styles.modalWrapper}>
        <div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className={styles.title}>Atribuir Alvos à Equipe</h3>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Selecionar Equipe</label>
              <select
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                className={styles.select}
                required
              >
                <option value="">Selecione uma equipe</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
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
                {loading ? "Atribuindo..." : "Atribuir"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>,
    document.body
  );
}