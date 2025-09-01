import { useEffect, useState, useContext } from "react";
import { NavLink, useParams } from "react-router-dom";
import { LuUsers } from "react-icons/lu";
import { IoIosList, IoMdPersonAdd } from "react-icons/io";
import { CiViewList } from "react-icons/ci";
import { IoInformationCircleOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";

import styles from "./TeamId.module.css";
import { Modal } from "../../components/Modal/Modal";
import { ButtonComponent } from "../../components/Button/Button";
import { AddUsersToTeamForm } from "./components/AddUsersToTeamForm/AddUsersToTeamForm";
import { DataContext } from "../../context/DataContext"; // ✅ Importe o contexto
import { FiEye } from "react-icons/fi";
import { formatCNPJ } from "../../utils/formatDate";
import { ButtonLink } from "../../components/Link/Link";

export default function TeamPage() {
  const { id } = useParams();
  const { fetchTeamById } = useContext(DataContext); // ✅ Usando do contexto
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Carrega a equipe usando o contexto
  useEffect(() => {
    const loadTeam = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const teamData = await fetchTeamById(id);
        if (teamData) {
          setTeam(teamData);
        } else {
          throw new Error("Equipe não encontrada");
        }
      } catch (err) {
        console.warn("Erro ao carregar equipe online e offline:", err);

        try {
          const offlineTeam = await carregarTeamDetalhado(id);
          if (offlineTeam) {
            setTeam(offlineTeam);
            return;
          }
        } catch (dbErr) {
          console.error("Erro ao ler do IndexedDB:", dbErr);
        }

        setError("Equipe não encontrada, mesmo offline.");
      } finally {
        setLoading(false);
      }
    };

    loadTeam();
  }, [id]); // 👈 só depende do id


  if (loading) {
    return <p className={styles.loading}>Carregando equipe...</p>;
  }

  if (error) {
    return <p className={`${styles.error} ${styles.loading}`}>{error}</p>;
  }

  if (!team) {
    return <p className={styles.loading}>Equipe não encontrada.</p>;
  }

  return (
    <div className={styles.container}>
      {/* Nome da Equipe */}
      <div className={styles.teamHeader}>
        <span
          className={styles.teamBadge}
          style={{ backgroundColor: team.color }}
        >
          {team.name}
        </span>
      </div>

      {/* Informações da Equipe */}
      <div className={styles.card}>
        <div className={styles.cardTitle}>
          <IoInformationCircleOutline size={20} />
          <h2>Informações da Equipe</h2>
        </div>

        <div className={styles.infoGrid}>
          <div>
            <p className={styles.label}>Nome:</p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span
                style={{
                  display: "inline-block",
                  width: "1rem",
                  height: "1rem",
                  borderRadius: "9999px",
                  backgroundColor: team.color,
                  border: "1px solid #d1d5db",
                }}
              ></span>
              <span>{team.name}</span>
            </div>
          </div>

          <div>
            <p className={styles.label}>Status:</p>
            <span
              className={`${styles.statusBadge} ${team.status === "ATIVO" ? styles.bgGreen : styles.bgRed
                }`}
            >
              {team.status === "ATIVO" ? "ATIVO" : "INATIVO"}
            </span>
          </div>

          <div>
            <p className={styles.label}>Criada em:</p>
            <p className={styles.value}>{formatDate(team.createdAt)}</p>
          </div>

          <div>
            <p className={styles.label}>Última atualização:</p>
            <p className={styles.value}>{formatDate(team.updatedAt)}</p>
          </div>
        </div>
      </div>

      {/* Membros da Equipe */}
      <div className={styles.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className={styles.cardTitle}>
            <LuUsers />
            <h2>Membros da Equipe</h2>
          </div>

          <ButtonComponent
            variant="blue"
            onClick={() => setIsModalOpen(true)}
          >
            <IoMdPersonAdd size={18} />
            Vincular
          </ButtonComponent>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Email</th>
                <th>Criado em</th>
              </tr>
            </thead>
            <tbody>
              {team.users.length === 0 ? (
                <tr>
                  <td colSpan="4" className={styles.emptyRow}>
                    Nenhum membro nesta equipe.
                  </td>
                </tr>
              ) : (
                team.users.map((user) => (
                  <tr key={user.id}>
                    <td style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <FaRegUser />
                      {user.name} ({user.username})
                    </td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${user.role === "USER"
                          ? styles.bgBlue100
                          : user.role === "SUPERVISOR"
                            ? styles.bgPurple100
                            : styles.bgGray100
                          }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td>{user.email}</td>
                    <td>{formatDate(user.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alvos Atribuídos */}
      <div className={styles.card}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className={styles.cardTitle}>
            <IoIosList size={18} />
            <h2>Alvos Atribuídos</h2>
          </div>

          <ButtonLink to="/view/alvos" nome="Vincular" variant="green" width="max" icon={<IoIosList size={18} />} />
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ART</th>
                <th>Tipo ART</th>
                <th>Empresa</th>
                <th>Proprietário</th>
                <th>Profissional</th>
                <th>Endereço</th>
                <th>Status</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {team.targets.map((target, index) => (
                <tr key={index}>
                  <td style={{ fontWeight: "500" }}>{target.numeroArt}</td>
                  <td>{target.tipoArt}</td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{target?.empresa}</div>
                    <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{formatCNPJ(target?.cnpj)}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{target.nomeProprietario}</div>
                    {/* <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{formatCNPJ(target?.cnpj)}</div> */}
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{target.nomeProfissional}</div>
                    {/* <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{formatCNPJ(target?.cnpj)}</div> */}
                  </td>
                  <td>{target.enderecoObra}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${target.status === "CONCLUÍDA"
                        ? styles.bgGreen
                        : target.status === "EM ANDAMENTO"
                          ? styles.bgYellow
                          : target.status === "NÃO INICIADA"
                            ? styles.bgBlue
                            : styles.bgGray
                        }`}
                    >
                      {target.status}
                    </span>
                  </td>
                  <td>
                    <NavLink to={`/view/target/${target.id}`}
                      /* onClick={() => handleView(target)} */
                      className={styles.actionButton}
                      title="Ver detalhes"
                    >
                      <FiEye size={16} />
                    </NavLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div style={{ minWidth: "400px", padding: "1rem" }}>
          <h1 className="text-xl font-bold text-gray-800">Adicionar Membros {team.name}</h1>
          <p className="text-gray-600 mb-4">
            Selecione os usuários que deseja adicionar à equipe.
          </p>

          <AddUsersToTeamForm
            teamId={Number(id)}
            onCancel={handleCancel}

          />
        </div>
      </Modal>
    </div>
  );
}