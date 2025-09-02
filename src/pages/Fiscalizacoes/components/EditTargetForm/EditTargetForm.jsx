"use client";
import { useState, useContext, useEffect } from "react";
import styles from "./EditTargetForm.module.css";
import { api } from "../../../../services/api";
import { DataContext } from "../../../../context/DataContext";
import { ButtonComponent } from "../../../../components/Button/Button";
import { MdEdit } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

export default function EditTargetForm({ target, onSuccess, onCancel }) {
    const { teams } = useContext(DataContext); // Vem do DataContext

    const [formData, setFormData] = useState({
        numeroArt: "",
        tipoArt: "",
        status: "",
        nomeProfissional: "",
        tituloProfissional: "",
        empresa: "",
        cnpj: "",
        contratante: "",
        nomeProprietario: "",
        telefoneProprietario: "",
        enderecoObra: "",
        capacidadeObra: "",
        teamId: "",
        latitude: "",
        longitude: "",
        observacao: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Preenche o formulário quando o target mudar
    useEffect(() => {
        if (target) {
            setFormData({
                numeroArt: target.numeroArt || "",
                tipoArt: target.tipoArt || "",
                status: target.status || "",
                nomeProfissional: target.nomeProfissional || "",
                tituloProfissional: target.tituloProfissional || "",
                empresa: target.empresa || "",
                cnpj: target.cnpj || "",
                contratante: target.contratante || "",
                nomeProprietario: target.nomeProprietario || "",
                telefoneProprietario: target.telefoneProprietario || "",
                enderecoObra: target.enderecoObra || "",
                capacidadeObra: target.capacidadeObra || "",
                teamId: target.teamId || "",
                latitude: target.latitude || "",
                longitude: target.longitude || "",
                observacao: target.observacao || "",
            });
        }
    }, [target]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // ✅ Converte teamId para número
            const payload = {
                ...formData,
                teamId: Number(formData.teamId), // ✅ Força ser número
            };

            await api.put(`/target/${target.id}`, payload);
            onSuccess();
        } catch (err) {
            const message = err.response?.data?.message || "Erro ao atualizar alvo.";
            setError(message);
            console.error("Erro ao atualizar:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!target) return <p>Carregando dados...</p>;

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>✏️ Editar Alvo</h2>

            {error && <p className={styles.error}>{error}</p>}

            <form onSubmit={handleSubmit} className={styles.grid}>
                {/* Coluna 1 */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Nº ART</label>
                    <input
                        type="text"
                        name="numeroArt"
                        value={formData.numeroArt}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Tipo ART</label>
                    <input
                        type="text"
                        name="tipoArt"
                        value={formData.tipoArt}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className={styles.select}
                        required
                    >
                        <option value="">Selecione</option>
                        <option value="NÃO INICIADA">NÃO INICIADA</option>
                        <option value="EM ANDAMENTO">EM ANDAMENTO</option>
                        <option value="CONCLUÍDA">CONCLUÍDA</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Nome do Profissional</label>
                    <input
                        type="text"
                        name="nomeProfissional"
                        value={formData.nomeProfissional}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Título Profissional</label>
                    <input
                        type="text"
                        name="tituloProfissional"
                        value={formData.tituloProfissional}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Empresa</label>
                    <input
                        type="text"
                        name="empresa"
                        value={formData.empresa}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>CNPJ</label>
                    <input
                        type="text"
                        name="cnpj"
                        value={formData.cnpj}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Contratante</label>
                    <input
                        type="text"
                        name="contratante"
                        value={formData.contratante}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>

                {/* Coluna 2 */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Nome do Proprietário</label>
                    <input
                        type="text"
                        name="nomeProprietario"
                        value={formData.nomeProprietario}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Telefone do Proprietário</label>
                    <input
                        type="text"
                        name="telefoneProprietario"
                        value={formData.telefoneProprietario}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Endereço da Obra</label>
                    <input
                        type="text"
                        name="enderecoObra"
                        value={formData.enderecoObra}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Capacidade da Obra</label>
                    <input
                        type="text"
                        name="capacidadeObra"
                        value={formData.capacidadeObra}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Equipe</label>
                    <select
                        name="teamId"
                        value={formData.teamId}
                        onChange={handleChange}
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

                <div className={styles.formGroup}>
                    <label className={styles.label}>Latitude</label>
                    <input
                        type="text"
                        name="latitude"
                        disabled
                        value={formData.latitude}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Longitude</label>
                    <input
                        type="text"
                        name="longitude"
                        disabled
                        value={formData.longitude}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Observação</label>
                    <textarea
                        name="observacao"
                        value={formData.observacao}
                        onChange={handleChange}
                        className={`${styles.input} ${styles.textarea}`}
                        rows={3}
                    />
                </div>
            </form>

            <div className={styles.buttons}>
                <ButtonComponent
                    type="button"
                    variant="gray"
                    icon={<IoMdClose size={18} />}
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancelar
                </ButtonComponent>
                <ButtonComponent
                    type="submit"
                    variant="blue"
                    icon={<MdEdit size={18} />}
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? "Salvando..." : "Salvar"}
                </ButtonComponent>
            </div>
        </div>
    );
}