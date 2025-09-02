"use client";
import { useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom"; // ✅ react-router-dom
import { FaLayerGroup } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import styles from "./Dashboard.module.css";
import Card from "../../components/Card/Card";
import { CardEquip } from "../../components/CardEquip/CardEquip";
import { FormCreateTeam } from "../../components/FormCreateTeam/FormCreateTeam";
import { Modal } from "../../components/Modal/Modal";
import Title from "../../components/Title/Title";
import { DataContext } from "../../context/DataContext";
import { formatDateBR } from "../../utils/formatDate";
import { LuTarget } from "react-icons/lu";
import { IoCheckmark, IoPause, IoTime } from "react-icons/io5";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { targets, teams, fetchTeams } = useContext(DataContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");

  // Atualiza query string e estado
  const handleSearch = (value) => {
    setSearch(value);
    if (value) {
      setSearchParams({ q: value });
    } else {
      setSearchParams({});
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const equipesAtivas = teams.filter((item)=>item.users.length > 0 && item.targets.length > 0 )

  // Contagem de status
  const { nao_iniciado, em_andamento, concluida } = useMemo(() => {
    return targets.reduce(
      (acc, t) => {
        const status = t.status?.toUpperCase();
        if (status === "NÃO INICIADA") acc.nao_iniciado += 1;
        else if (status === "EM ANDAMENTO") acc.em_andamento += 1;
        else if (status === "CONCLUÍDA") acc.concluida += 1;
        return acc;
      },
      { nao_iniciado: 0, em_andamento: 0, concluida: 0 }
    );
  }, [targets]);

  // 🔎 filtro por nome da equipe ou membro
  const filteredTeams = useMemo(() => {
    if (!search) return teams;

    return teams.filter((team) => {
      const teamNameMatch = team.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const userNameMatch = team.users?.some((user) =>
        user.name.toLowerCase().includes(search.toLowerCase())
      );

      return teamNameMatch || userNameMatch;
    });
  }, [teams, search]);

  const handleTeamCreated = () => {
    fetchTeams();
  };

  return (
    <main>
      {/* Seção de Estatísticas */}
      <div className={styles.headerContainer}>
        <Title
          title="Dashboard de Fiscalização"
          subtitle="Acompanhe o progresso das fiscalizações em tempo real"
        />
      </div>

      <div className={styles.statsGrid}>
        <Card
          value={targets.length}
          label="Total de Fiscalização"
          color="blue"
          icon={<LuTarget />}
        />
        <Card
          value={concluida}
          label="Concluídas"
          color="green"
          icon={<IoCheckmark />}
        />
        <Card
          value={em_andamento}
          label="Em Andamento"
          color="yellow"
          icon={<IoTime />}
        />
        <Card
          value={nao_iniciado}
          label="Não Iniciada"
          color="gray"
          icon={<IoPause />}
        />
        <Card
          value={equipesAtivas.length}
          label="Equipes Ativas"
          color="sky"
          icon={<FaLayerGroup />}
        />
      </div>

      {/* Seção de Equipes */}
      <div className={styles.headerContainer}>
        <Title
          title="Equipes"
          actions={[
            {
              label: "Nova Equipe",
              icon: <IoMdAdd size={20} />,
              onClick: () => setIsModalOpen(true),
              color: "blue",
            },
          ]}
        />
      </div>

      {/* 🔎 Campo de pesquisa */}
      <div className={styles.filters}>   

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Equipe ou Membro</label>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Busque por membro ou equipe"
            className={styles.filterInput}
          />
        </div>
      </div>

      <div className={styles.teamsGrid}>
        {filteredTeams.length === 0 ? (
          <p className={styles.emptyState}>Nenhuma equipe encontrada.</p>
        ) : (
          filteredTeams.map((team) => {
            const concluidos =
              team.targets?.filter(
                (t) => t.status?.trim().toUpperCase() === "CONCLUÍDA"
              ).length || 0;
            const total = team.targets?.length || 0;
            const completedPercentage =
              total > 0 ? Math.round((concluidos / total) * 100) : 0;

            return (
              <CardEquip
                key={team.id}
                name={team.name}
                status={team.status}
                color={team.color}
                members={team.users?.length || 0}
                goals={total}
                link={`/view/equipe/${team.id}`}
                updatedAt={formatDateBR(team.updatedAt)}
                completedPercentage={completedPercentage}
              />
            );
          })
        )}
      </div>

      {/* Modal de criação de equipe */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <FormCreateTeam
          onTeamCreated={handleTeamCreated}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </main>
  );
}
