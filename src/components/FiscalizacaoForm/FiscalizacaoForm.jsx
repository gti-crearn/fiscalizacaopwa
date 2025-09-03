// src/components/FiscalizacaoForm.jsx
"use client";
import React, { useContext, useState } from "react";
import { Camera } from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import { api } from "../../services/api";
import { carregarFiscalizacoesOffline, removerFiscalizacaoOffline, salvarFiscalizacaoOffline } from "../../services/idb";
import { ButtonComponent } from "../Button/Button";
import styles from "./FiscalizacaoForm.module.css";
import { FaCameraRetro } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import FormularioServicos from "../FormularioServicos/FormularioServicos";


export function FiscalizacaoForm({ targetId, onClose }) {
  const { user } = useAuth(); // Ajuste: contexto que tem o user
  const [status, setStatus] = useState("");
  const [photos, setPhotos] = useState([]);
  const [observacao, setObservacao] = useState(""); // Novo campo
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isOnline] = useState(navigator.onLine);
  const [respostas, setRespostas] = useState([]);




  // Preview URLs
  const previewUrls = photos.map((file) => URL.createObjectURL(file));

  React.useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };

  }, [photos]);

  // Captura da câmera
  const handleTakePhoto = (dataUri) => {
    fetch(dataUri)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], `photo-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        setPhotos((prev) => [...prev, file]);
      });

    setIsCameraOpen(false);
  };

  // Remover foto
  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const sendToAPI = async (data) => {
    const formData = new FormData();
    formData.append("status", data.status);
    formData.append("observacao", data.observacao || "");
    formData.append("userId", data.userId);

    // ✅ Envia o checklist como JSON string
    if (data.checklist && data.checklist.length > 0) {
      formData.append("checklist", JSON.stringify(data.checklist));
    }

    // ✅ Reconstrói os arquivos a partir dos blobs
    if (data.fotos) {
      data.fotos.forEach((fotoBlob) => {
        const file = new File([fotoBlob], `photo-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        formData.append("files", file);
      });
    }

    try {
      await api.put(`/target/${data.targetId}/status`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await removerFiscalizacaoOffline(data.targetId);
      console.log("✅ Enviado para API:", data.targetId);
    } catch (err) {
      console.error("❌ Falha ao enviar para API:", err);
      // Não re-salva aqui para evitar loop
    }
  };

  // Sincronizar ao ficar online
  React.useEffect(() => {
    const syncPending = async () => {
      if (!isOnline) return;

      const pendentes = await carregarFiscalizacoesOffline();
      for (const item of pendentes) {
        // ✅ Reconstrói as fotos como blobs
        const fotos = item.fotos.map((f) => new Blob([f.data], { type: f.type }));

        // ✅ Usa todos os campos salvos
        const data = {
          targetId: item.targetId,
          status: item.status,
          observacao: item.observacao,
          userId: item.userId,
          checklist: item.checklist,
          photos: fotos,
        };

        await sendToAPI(data);
      }
    };

    syncPending();
  }, [isOnline]);

  // Enviar formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Erro: Usuário não identificado.");
      return;
    }

    if (photos.length === 0) {
      alert("Adicione pelo menos uma foto.");
      return;
    }

    // ✅ Inclui o checklist (respostas) no formData
    const formData = {
      targetId,
      status,
      photos,
      observacao,
      userId: user.id,
      checklist: respostas, // ✅ Array de respostas do FormularioServicos
    };

    console.log("📦 formData completo:", formData); // 🔍 Debug

    if (isOnline) {
      await sendToAPI(formData);
      alert("Atualização enviada com sucesso!");
    } else {
      await salvarFiscalizacaoOffline(formData);
      alert("Dados salvos offline. Serão enviados quando estiver online.");
    }

    // Resetar
    setPhotos([]);
    setStatus("");
    setObservacao("");
    setRespostas([]); // opcional: limpar respostas
    onClose?.();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <h2 className={styles.title}>Atualizar Fiscalização #{targetId}</h2>

      {/* Status */}
      <div className={styles.field}>
        <label className={styles.label}>Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={styles.select}
          required
        >
          <option value="">Selecione</option>
          <option value="NÃO INICIADA">NÃO INICIADA</option>
          <option value="EM ANDAMENTO">EM ANDAMENTO</option>
          <option value="CONCLUÍDA">CONCLUÍDA</option>
        </select>
      </div>

      <FormularioServicos onRespostasChange={setRespostas} />
      {/* Fotos */}
      <div className={styles.field}>
        <label className={styles.label}>Fotos</label>

        {/* Câmera */}
        {!isCameraOpen ? (
          <button
            type="button"
            onClick={() => setIsCameraOpen(true)}
            className={styles.buttonCamera}
          >
            <FaCameraRetro size={16} /> Abrir Câmera
          </button>
        ) : (
          <div className={styles.cameraContainer}>
            <Camera
              onTakePhoto={handleTakePhoto}
              idealFacingMode="environment"
              isImageMirror={false}
            />
            <button
              type="button"
              onClick={() => setIsCameraOpen(false)}
              className={styles.buttonClose}
            >
              ❌ Fechar Câmera
            </button>
          </div>
        )}

        {/* Previews */}
        {previewUrls.length > 0 && (
          <div className={styles.previewContainer}>
            {previewUrls.map((url, index) => (
              <div key={index} className={styles.previewItem}>
                <img src={url} alt="Preview" className={styles.previewImage} />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className={styles.removeButton}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Observação */}
      <div className={styles.field}>
        <label className={styles.label}>Observação</label>
        <textarea
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          className={styles.textarea}
          placeholder="Descreva detalhes da fiscalização..."
          rows="4"
        />
      </div>

      {/* Botões */}
      <div className={styles.groupButton}>
        <ButtonComponent type="button" variant="gray" onClick={onClose}>
          Cancelar
        </ButtonComponent>
        <ButtonComponent
          variant="green"
          type="submit"
          disabled={photos.length === 0}
        >
          Salvar Atualização
        </ButtonComponent>
      </div>
    </form>
  );
}