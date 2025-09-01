// src/components/PendentesPage.jsx
import React, { useState, useEffect, useContext } from "react";
import styles from "./PendentesPage.module.css";

import { DataContext } from "../../context/DataContext";
import { api } from "../../services/api";
import { carregarFiscalizacoesOffline, removerFiscalizacaoOffline } from "../../services/idb";


export default function PendentesPage() {
  const [pendentes, setPendentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { targets: allTargets } = useContext(DataContext); // Todos os alvos do contexto

  // Carrega os dados offline
  const carregarPendentes = async () => {
    try {
      const lista = await carregarFiscalizacoesOffline();
      setPendentes(lista);
    } catch (err) {
      console.error("Erro ao carregar dados offline:", err);
    } finally {
      setLoading(false);
    }
  };

  // Envia um item para a API
  const enviarParaAPI = async (item) => {
    const formData = new FormData();
    formData.append("status", item.status);

    // Converte os blobs em arquivos
    item.fotos.forEach((foto) => {
      const blob = new Blob([foto.data], { type: foto.type });
      const file = new File([blob], foto.name || `foto-${item.targetId}-${Date.now()}.jpg`, {
        type: foto.type,
      });
      formData.append("files", file);
    });

    try {
      await api.put(`/target/${item.targetId}/status`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Remove do IndexedDB após sucesso
      await removerFiscalizacaoOffline(item.targetId);
      console.log(`✅ Enviado para API: targetId=${item.targetId}`);

      // Atualiza a lista local
      setPendentes((prev) => prev.filter((p) => p.targetId !== item.targetId));
    } catch (err) {
      console.error(`❌ Falha ao enviar targetId=${item.targetId}:`, err);
      throw err;
    }
  };

  // Sincroniza todos os pendentes
  const sincronizarOffline = async () => {
    if (!navigator.onLine) return;

    const itens = await carregarFiscalizacoesOffline();
    if (itens.length === 0) return;

    console.log(`🔄 Iniciando sincronização de ${itens.length} item(ns) offline...`);

    for (const item of itens) {
      try {
        await enviarParaAPI(item);
      } catch (err) {
        console.warn("Parando sincronização por falha de conexão ou erro no servidor.");
        break;
      }
    }
  };

  // Carregar dados ao montar
  useEffect(() => {
    carregarPendentes();
  }, []);

  // Sincronizar ao ficar online
  useEffect(() => {
    const handleOnline = () => {
      console.log("🌐 Voltou online. Iniciando sincronização...");
      sincronizarOffline();
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  // Sincroniza imediatamente se estiver online
  useEffect(() => {
    if (navigator.onLine) {
      sincronizarOffline();
    }
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <p>Carregando...</p>
      </div>
    );
  }

  if (pendentes.length === 0) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Fiscalizações Pendentes</h1>
        <p className={styles.subtitle}>
          Nenhuma atualização pendente de envio.
        </p>
        <div className={styles.empty}>
          <h3 className={styles.emptyTitle}>🎉 Tudo atualizado!</h3>
          <p>Todas as fiscalizações já foram enviadas ao servidor.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Fiscalizações Pendentes</h1>
      <p className={styles.subtitle}>
        Estes registros foram salvos offline e ainda não foram enviados ao servidor.
      </p>

      {pendentes.map((pendente) => {
        // Busca o target completo do contexto
        const targetCompleto = allTargets.find(t => t.id === Number(pendente.targetId));

        // Define classe do status (do pendente)
        let statusClass = styles.statusNaoIniciada;
        if (pendente.status === "CONCLUÍDA") statusClass = styles.statusConcluida;
        if (pendente.status === "EM ANDAMENTO") statusClass = styles.statusEmAndamento;

        return (
          <div key={pendente.targetId} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                {/* Dados do contexto */}
                {targetCompleto ? `ART: ${targetCompleto.numeroArt}` : `Alvo #${pendente.targetId}`}
              </h3>
              <span className={`${styles.statusBadge} ${statusClass}`}>
                {/* Status do pendente (offline) */}
                {pendente.status}
              </span>
            </div>

            <div className={styles.info}>
              <p>
                <strong>Proprietário:</strong>{" "}
                {targetCompleto?.nomeProprietario || "–"}
              </p>
              <p>
                <strong>Empresa:</strong>{" "}
                {targetCompleto?.empresa || "–"}
              </p>
              <p>
                <strong>Endereço:</strong>{" "}
                {targetCompleto?.enderecoObra || "–"}
              </p>
              <p>
                <strong>Data:</strong>{" "}
                {new Date(pendente.timestamp).toLocaleString("pt-BR")}
              </p>
              <p>
                <strong>Fotos:</strong> {pendente.fotos.length}
              </p>
            </div>

            {/* Miniaturas */}
            <div className={styles.photos}>
              {pendente.fotos.map((foto, index) => {
                const blob = new Blob([foto.data], { type: foto.type });
                const url = URL.createObjectURL(blob);
                return (
                  <img
                    key={index}
                    src={url}
                    alt={`Foto ${index + 1}`}
                    className={styles.photo}
                    onLoad={() => URL.revokeObjectURL(url)}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Função auxiliar (adicione no mesmo arquivo ou em idb.js)
// async function removerFiscalizacaoOffline(targetId) {
//   const db = await getDB();
//   const tx = db.transaction("fiscalizacoes", "readwrite");
//   await tx.objectStore("fiscalizacoes").delete(targetId);
//   await tx.done;
// }