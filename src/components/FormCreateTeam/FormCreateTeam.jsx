"use client";
import { useState } from "react";
import styles from "./FormCreateTeam.module.css";
//import { toast } from "react-toastify";
import { IoMdAdd } from "react-icons/io";
import { api } from "../../services/api";
import { ButtonComponent } from "../Button/Button";

export function FormCreateTeam({ onTeamCreated, onClose }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post(
        "/team",
        { name },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
        }
      );
      alert("Equipe criada com sucesso!");
      onTeamCreated(); // Atualiza a lista
      onClose(); // Fecha o modal
    } catch (err) {
      const message = err.response?.data?.message || "Erro ao criar equipe.";
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Criar Nova Equipe</h2>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Nome da Equipe</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={styles.input}
            placeholder="Ex: Equipe 01"
          />
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
          <ButtonComponent
            variant="blue"
            type="submit"
            icon={<IoMdAdd size={18} />}
          >
            {loading ? "Criando..." : "Criar"}
          </ButtonComponent>
        </div>
      </form>
    </div>
  );
}