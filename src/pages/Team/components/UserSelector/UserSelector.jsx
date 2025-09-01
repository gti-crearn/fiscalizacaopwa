"use client";
import { useEffect, useState } from "react";
import styles from "./UserSelector.module.css";
import { api } from "../../../../services/api";


export function UserSelector({ onSelectedUsersChange }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Carregar usuários
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get("/user");
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (err) {
        setError("Erro ao carregar usuários.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filtrar usuários
  useEffect(() => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);

    if (filtered.length < users.length) {
      setSelectAll(false);
    }
  }, [searchTerm, users]);

  // Alternar seleção de um usuário
  const handleUserToggle = (userId) => {
    setSelectedUserIds((prev) => {
      const updated = prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId];
      return updated;
    });
  };

  // Selecionar/desselecionar todos
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUserIds([]);
    } else {
      const allIds = filteredUsers.map((u) => u.id);
      setSelectedUserIds(allIds);
    }
    setSelectAll(!selectAll);
  };

  // Notifica o componente pai sempre que a seleção mudar
  useEffect(() => {
    onSelectedUsersChange(selectedUserIds);
  }, [selectedUserIds, onSelectedUsersChange]);

  if (loading) return <p>Carregando usuários...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className={styles.container}>
      {/* Barra de busca */}
      <div className={styles.searchBar}>
        <div style={{ position: "relative", marginBottom: "0.75rem", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className={styles.selectAll}>
          <input
            type="checkbox"
            id="select-all"
            checked={selectAll}
            disabled={filteredUsers.length === 0}
            onChange={handleSelectAll}
          />
          <label htmlFor="select-all">
            Selecionar todos ({selectedUserIds.length} de {filteredUsers.length})
          </label>
        </div>
      </div>

      {/* Lista de usuários */}
      <div className={styles.list}>
        {filteredUsers.length === 0 ? (
          <p className={styles.emptyState}>
            {searchTerm
              ? `Nenhum usuário encontrado para "${searchTerm}".`
              : "Nenhum usuário disponível."}
          </p>
        ) : (
          <ul>
            {filteredUsers.map((user) => (
              <li key={user.id} className={styles.userItem}>
                <input
                  type="checkbox"
                  id={`user-${user.id}`}
                  checked={selectedUserIds.includes(user.id)}
                  onChange={() => handleUserToggle(user.id)}
                />
                <label htmlFor={`user-${user.id}`} className={styles.userLabel}>
                  <div className={styles.userName}>{user.name}</div>
                  <div className={styles.userInfo}>
                    <span>{user.email}</span>
                  </div>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Rodapé com contagem */}
      <div className={styles.footer}>
        {selectedUserIds.length} usuário(s) selecionado(s)
      </div>
    </div>
  );
}