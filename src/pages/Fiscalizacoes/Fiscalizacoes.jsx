"use client";
import { useContext, useMemo, useState } from "react";
import styles from "./Fiscalizacoes.module.css";
import { ButtonComponent } from "../../components/Button/Button";
import DashboardHeader from "../../components/Title/Title";
import { TargetTable } from "./components/TargetTable/TargetTable";
import { AssignTargetsModal } from "./components/AssignTargetsModal/AssignTargetsModal";
import Card from "../../components/Card/Card";
import { LuTarget } from "react-icons/lu";
import { IoCheckmark, IoPause, IoTime } from "react-icons/io5";
import { DataContext } from "../../context/DataContext";



export default function TargetsPage() {
  const [selectedTargetIds, setSelectedTargetIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { targets } = useContext(DataContext);

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


  const handleSelectionChange = (ids) => {
    setSelectedTargetIds(ids);
  };

  const handleAssign = () => {
    setIsModalOpen(false);
    window.location.reload()
  };

  return (
    <div className={styles.container}>
      {/* Cabeçalho */}
      <DashboardHeader
        title="Gestão de Alvos"
        subtitle="Selecione alvos e atribua a equipes para fiscalização"
      />
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
      </div>

      {/* Botão de ação */}
      <div className={styles.actions}>
        <ButtonComponent
          variant="blue"
          onClick={() => setIsModalOpen(true)}
          disabled={selectedTargetIds.length === 0}
        >
          Atribuir a Equipe ({selectedTargetIds.length})
        </ButtonComponent>
      </div>

      {/* Tabela de alvos */}
      <TargetTable onSelectionChange={handleSelectionChange} />

      {/* Modal de atribuição */}
      <AssignTargetsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        targetIds={selectedTargetIds}
        onSuccess={handleAssign}
      />
    </div>
  );
}