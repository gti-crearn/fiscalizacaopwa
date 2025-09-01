"use client";
import { useContext, useMemo, useState } from "react";
import { SiGooglemaps } from "react-icons/si";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import styles from "./TargetTable.module.css";
import { FiEdit3, FiEye, FiRefreshCw } from "react-icons/fi";
import { DataContext } from "../../../../context/DataContext";
import { ButtonComponent } from "../../../../components/Button/Button";
import { formatCNPJ } from "../../../../utils/formatDate";
import { useAuth } from "../../../../context/AuthContext";

export default function TableTarget() {
  const { userData } = useContext(DataContext);
  const { user } = useAuth()
  const navigate = useNavigate();
  const [loading] = useState(false); // Simulando loading (pode vir do contexto)


  // ✅ usar query string com react-router
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");

  // Extrai todos os targets das equipes do usuário
  const allTargets = userData[0]?.teams?.flatMap(team => team.targets) || [];

  const handleOpenMap = () => {
    // Salva os alvos no sessionStorage
    sessionStorage.setItem("userTargets", JSON.stringify(allTargets));
    navigate("/view/meus_alvos/mapa"); // Ajuste conforme sua rota
  };

  // Atualiza query string e estado
  const handleSearch = (value) => {
    setSearch(value);
    if (value) {
      setSearchParams({ q: value });
    } else {
      setSearchParams({});
    }
  };

  // 🔎 filtro por nome da equipe ou membro
  const filteredTargets = useMemo(() => {
    if (!search) return allTargets;

    return allTargets.filter((target) => {
      const targetNameNumeroArt = target.numeroArt
        .toLowerCase()
        .includes(search.toLowerCase());

      const teamNameNomeProfissional = target.nomeProfissional
        .toLowerCase()
        .includes(search.toLowerCase());

      const teamNameNomeProprietario = target.nomeProprietario
        .toLowerCase()
        .includes(search.toLowerCase());

      return targetNameNumeroArt || teamNameNomeProfissional || teamNameNomeProprietario;
    });
  }, [allTargets, search]);

  return (
    <div className={styles.container}>

      <div className={styles.card}>
        {/* Botão para abrir mapa */}
        <div className={styles.header}>
          {userData[0]?.teams.length > 0 && (
            <span>{`Bem-vindo, ${user?.name}! Você está na equipe ${userData[0]?.teams[0]?.name}`} </span>
          )}

          <ButtonComponent
            variant="blue"
            onClick={handleOpenMap}
            icon={<SiGooglemaps size={18} />}
          >
            Ver no Mapa
          </ButtonComponent>
        </div>

        {/* Tabela */}
        <div style={{ overflowX: "auto" }}>
          <div className={styles.filters}>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Art/Empresa/Proprietário</label>
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar por Art, Empresa, Proprietário ou Profissional "
                className={styles.filterInput}
              />
            </div>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ART</th>
                <th>Empresa</th>
                <th>Proprietário</th>
                <th>Profissional</th>
                <th>Endereço</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className={styles.loadingRow}>
                    Carregando...
                  </td>
                </tr>
              ) : filteredTargets.length === 0 ? (
                <tr>
                  <td colSpan={7} className={styles.emptyRow}>
                    Nenhum alvo encontrado com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredTargets.map((target) => {
                  const isAssigned = !!target.teamId;
                  return (
                    <tr
                      key={target.id}
                      className={`${styles.tableRow} ${isAssigned ? styles.assigned : ""}`}
                    >
                      <td>
                        <div style={{ fontWeight: 500, color: "#1f2937" }}>
                          {target.numeroArt}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>
                          {target.tipoArt}
                        </div>
                      </td>
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
                                ? styles.bgGray
                                : styles.bgGray
                            }`}
                        >
                          {target.status}
                        </span>
                      </td>
                      {/* <td>
                             {target.team ? (
                               <span
                                 className={styles.teamBadge}
                                 style={{
                                   backgroundColor: `${target.team.color}30`,
                                   color: target.team.color,
                                 }}
                               >
                                 {target.team.name}
                               </span>
                             ) : (
                               <span style={{ color: "#9ca3af" }}>Não vinculado</span>
                             )}
                           </td> */}
                      {/* Nova coluna de ações */}
                      <td>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <NavLink to={`/view/target/${target.id}`}
                            onClick={() => handleView(target)}
                            className={styles.actionButton}
                            title="Ver detalhes"
                          >
                            <FiEye size={16} />
                          </NavLink>
                          <button
                            onClick={() => handleReallocate(target)}
                            className={styles.actionButton}
                            title="Editar"
                          >
                            <FiEdit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleReallocate(target)}
                            className={styles.actionButton}
                            title="Realocar"
                          >
                            <FiRefreshCw size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}