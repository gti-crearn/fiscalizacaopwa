"use client";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./TargetDetailPage.module.css";
import { DataContext } from "../../context/DataContext";
import { ButtonComponent } from "../../components/Button/Button";
import { FiMapPin } from "react-icons/fi";
import { formatCNPJ, formatDateBR } from "../../utils/formatDate";
import { FiscalizacaoForm } from "../../components/FiscalizacaoForm/FiscalizacaoForm";
import { Modal } from "../../components/Modal/Modal";
import { carregarFiscalizacoesOffline } from "../../services/idb";



export default function TargetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { targets, loading: targetsLoading } = useContext(DataContext);
  const [target, setTarget] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendentes, setPendentes] = useState([]);



  // Carrega os dados offline pendentes de sincronização para api
  const carregarPendentes = async () => {
    try {
      const lista = await carregarFiscalizacoesOffline();
      setPendentes(lista);
    } catch (err) {
      console.error("Erro ao carregar dados offline:", err);
    }
  };
  useEffect(() => {
    carregarPendentes()
  }, [])

  const handleOpenMap = () => {
    if (!target) return;
    sessionStorage.setItem("userTargets", JSON.stringify([target]));
    navigate("/view/meus_alvos/mapa");
  };

  useEffect(() => {
    if (targetsLoading) {
      if (error !== null) setError(null);
      return;
    }

    if (!Array.isArray(targets)) {
      if (target !== null) setTarget(null);
      if (error !== "Nenhum dado disponível.") setError("Nenhum dado disponível.");
      return;
    }

    const encontrado = targets.find((item) => String(item.id) === String(id));

    if (encontrado) {
      if (target?.id !== encontrado.id) setTarget(encontrado);
      if (error !== null) setError(null);
    } else {
      if (target !== null) setTarget(null);
      if (error !== "Alvo não encontrado.") setError("Alvo não encontrado.");
    }
  }, [id, targets, targetsLoading]);

  const handleBack = () => navigate(-1);

  if (targetsLoading) return <p className={styles.loading}>Carregando...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!target) return <p className={styles.error}>Alvo não encontrado.</p>;

  return (
    <div className={styles.container}>
      <button onClick={handleBack} className={styles.backButton}>
        ← Voltar
      </button>

      <h1 className={styles.title}>{target?.empresa}</h1>
      <p className={styles.subtitle}>CNPJ:{formatCNPJ(target.cnpj)}</p>

      {/* Card de informações */}
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.icon}></span>
          <h2>Informações do Alvo</h2>
        </div>

        <div className={styles.grid}>
          <div className={styles.info}>
            <label>Proprietário</label>
            <p>{target.nomeProprietario}</p>
          </div>
          <div className={styles.info}>
            <label>CEP</label>
            <p>{target.cep}</p>
          </div>
          <div className={styles.info}>
            <label>Profissional responsável</label>
            <p>{target?.nomeProfissional}</p>
          </div>
          <div className={styles.info}>
            <label>Endereço</label>
            <p>{target.enderecoObra}</p>
          </div>
          <div className={styles.info}>
            <label>Data de Cadastro</label>
            <p>
              {target.createdAt
                ? formatDateBR(target.createdAt)
                : "-"}
            </p>
          </div>
          <div className={styles.info}>
            <label>Cidade</label>
            <p>{target.cidade}</p>
          </div>
          <div className={styles.info}>
            <label>Status</label>
            <span
              className={`${styles.statusBadge} ${target.status === "CONCLUÍDA"
                ? styles.bgGreen
                : target.status === "EM ANDAMENTO"
                  ? styles.bgYellow
                  : styles.bgGray
                }`}
            >
              {target.status}
            </span>
          </div>
          <div className={styles.info}>
            <label>Observação</label>
            <p>{target.observacaoART}</p>
          </div>

          {pendentes.length > 0 && (
            <Link to="/view/alvos_pendentes">Alvos pendentes ({pendentes.length}) </Link>
          )}

        </div>
        <div className={styles.groupButton}>
          <ButtonComponent
            variant="blue"
            onClick={handleOpenMap}
            icon={<FiMapPin size={18} />}
          >
            Ver no Mapa
          </ButtonComponent>
          <ButtonComponent onClick={() => setIsModalOpen(true)} >Fiscalizar </ButtonComponent>
        </div>
      </div>

      {/* Card de resultados */}
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.icon}></span>
          <h2>Resultado da Fiscalização</h2>
        </div>



        {target.status !== "NÃO INICIADA" && (
          <>
            {target?.targetHistory.map((history) => {
              return (
                <div className={styles.contentGrid} >
                  <div className={styles.grid}>
                    <div className={styles.info}>
                      <label>Fiscalizador</label>
                      <p>{history.name}</p>
                    </div>
                    <div className={styles.info}>
                      <label>Data</label>
                      <p>{formatDateBR(history.createdAt)}</p>
                    </div>
                    <div className={styles.info}>
                      <label>Observação</label>
                      <p>{history.observacao}</p>
                    </div>
                    <div className={styles.info}>
                      <label>Status</label>
                      <span
                        className={`${styles.statusBadge} ${history.newValue === "CONCLUÍDA"
                          ? styles.bgGreen
                          : history.newValue === "EM ANDAMENTO"
                            ? styles.bgYellow
                            : styles.bgGray
                          }`}
                      >
                        {history.newValue}
                      </span>
                    </div>
                    <div className={styles.info}>
                      <label>Anexos</label>
                      <div className={styles.anexos}>
                        {history.images?.length > 0 ? (
                          history.images.map((file, index) => {
                            const filePath = typeof file === "string" ? file : file.url || "";
                            const fileName =
                              typeof file === "string"
                                ? file.split("/").pop()
                                : file.name || "arquivo";

                            return (
                              <div key={index} className={styles.anexo}>
                                <a href={`${import.meta.env.VITE_API_URL}${filePath}`} rel="noopener noreferrer">
                                  <span className={styles.downloadIcon}> ⬇️ </span>
                                  Baixar Arquivo
                                </a>
                                {/*  <span className={styles.fileName}>{fileName}</span> */}
                              </div>
                            );
                          })
                        ) : (
                          <span>Nenhum anexo</span>
                        )}
                      </div>
                    </div>

                  </div>
                  {/* Checklists - Dados Estruturados */}
                  <div className={styles.info}>
                    <label>Checklists</label>
                    {history.checklists && history.checklists.length > 0 ? (
                      <table className={styles.checklistTable}>
                        <thead>
                          <tr>
                            <th>Serviço</th>
                            <th>ART</th>
                            <th>Empresa</th>
                            <th>Profissional</th>
                            <th>CNPJ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {history.checklists.map((item) => (
                            <tr key={item.id}>
                             
                              <td>
                                <div style={{ fontWeight: 500 }}>{item.servico}</div>
                                <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{item?.tipo} - {item?.modalidade}</div>
                              </td>

                              <td>{item.art || "-"}</td>
                              <td>{item.nomeEmpresa || "-"}</td>
                              <td>{item.nomeProfissional || "-"}</td>
                              <td>{item.cnpj ? formatCNPJ(item.cnpj) : "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <span>Nenhum checklist registrado.</span>
                    )}
                  </div>
                </div>

              )
            })
            }
          </>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <FiscalizacaoForm onClose={() => setIsModalOpen(false)} targetId={id} />
      </Modal>
    </div>
  );
}
