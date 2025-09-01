"use client";
import { useState } from "react";
import styles from "./AddUsersToTeamForm.module.css";
import { UserSelector } from "../UserSelector/UserSelector";
import { api } from "../../../../services/api";


export function AddUsersToTeamForm({ teamId, onCancel }) {
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedUserIds.length === 0) {
      alert("Selecione pelo menos um usuário.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.post(`/team/${teamId}/users`, { userIds: selectedUserIds });
      alert("Membros adicionados com sucesso!");
      onCancel(); // Fecha o modal
      window.location.reload();  // Atualiza a lista de membros
      setSelectedUserIds([]); // Limpa seleção
    } catch (err) {
      const message = err.response?.data?.message || "Erro ao adicionar membros.";
      setError(message);
      // alert(message);
      console.error("Erro ao adicionar membros:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div>
        <UserSelector onSelectedUsersChange={setSelectedUserIds} />

        {error && (
          <div className={styles.error}>{error}</div>
        )}

        <div className={styles.buttons}>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className={styles.cancelButton}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || selectedUserIds.length === 0}
            className={styles.submitButton}
          >
            {loading ? "Adicionando..." : `Adicionar (${selectedUserIds.length})`}
          </button>
        </div>
      </div>
    </form>
  );
}