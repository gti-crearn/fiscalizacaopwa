"use client";
import { useContext, useMemo, useState } from "react";
import styles from "./MinhasFiscalizacoes.module.css";
import DashboardHeader from "../../components/Title/Title";
import TableTarget from "./components/TargetTable/TableTarget";
import { AssignTargetsModal } from "../Fiscalizacoes/components/AssignTargetsModal/AssignTargetsModal";
import { DataContext } from "../../context/DataContext";
import Card from "../../components/Card/Card";
import { LuTarget } from "react-icons/lu";
import { IoCheckmark, IoPause, IoTime } from "react-icons/io5";



export default function TargetsPage() {
  const [selectedTargetIds, setSelectedTargetIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userData } = useContext(DataContext);

  const handleSelectionChange = (ids) => {
    setSelectedTargetIds(ids);
  };

  const handleAssign = () => {
      setIsModalOpen(false);
  };

    // Extrai todos os targets das equipes do usuário
    const allTargets = userData[0]?.teams?.flatMap(team => team.targets) || [];

     const { nao_iniciado, em_andamento, concluida } = useMemo(() => {
        return allTargets.reduce(
          (acc, t) => {
            const status = t.status?.toUpperCase();
            if (status === "NÃO INICIADA") acc.nao_iniciado += 1;
            else if (status === "EM ANDAMENTO") acc.em_andamento += 1;
            else if (status === "CONCLUÍDA") acc.concluida += 1;
            return acc;
          },
          { nao_iniciado: 0, em_andamento: 0, concluida: 0 }
        );
      }, [allTargets]);

  return (
    <div className={styles.container}>
      {/* Cabeçalho */}
      <DashboardHeader
        title="Meu Alvos"
        subtitle="Alvos vinculados a minha equipe"
      />

       <div className={styles.statsGrid}>
              <Card
                value={allTargets.length}
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

      {/* Tabela de alvos */}
      <TableTarget onSelectionChange={handleSelectionChange} />

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