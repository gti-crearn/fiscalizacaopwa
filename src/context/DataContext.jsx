"use client";
import { createContext, useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";
import {
  carregarTeamDetalhado,
  carregarTodosTargets,
  carregarTodosTeams,
  carregarTodosUsers,
  salvarTargets,
  salvarTeamData,
  salvarTeamDetalhado,
  salvarUserData,
} from "../services/idb";

// Criação do Contexto com valores padrão
export const DataContext = createContext({
  userData: [],
  isOffline: false,
  targets: [],
  teams: [],
  filters: {},
  setFilters: () => {},
  loading: false,
  fetchTargets: async () => {},
  fetchTeams: async () => {
    console.warn("fetchTeams chamado fora do Provider");
  },
  fetchTeamById: async (id) => {
    console.warn("fetchTeamById chamado fora do Provider", id);
    return null;
  },
});

// Provider
export function DataProvider({ children }) {
  const { user } = useAuth();

  const [userData, setUserData] = useState([]);
  const [isOffline, setIsOffline] = useState(false);
  const [targets, setTargets] = useState([]);
  const [teams, setTeams] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);

  // Busca usuário logado (com fallback offline)
  async function getUser() {
    if (!user?.id) return;

    try {
      const { data } = await api.get(`/user/${user.id}`);
      const arr = Array.isArray(data) ? data : [data];
      setUserData(arr);
      await salvarUserData(arr);
      setIsOffline(false);
    } catch (error) {
      console.warn("Erro ao buscar usuário online, carregando offline:", error);
      const all = await carregarTodosUsers();
      const onlyThisUser = all.filter((u) => String(u.id) === String(user.id));
      setUserData(onlyThisUser);
      setIsOffline(true);
    }
  }

  // Busca alvos com filtros
  const fetchTargets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.numeroArt) params.append("numeroArt", filters.numeroArt);
      if (filters.teamId) params.append("teamId", filters.teamId);
      if (filters.status) params.append("status", filters.status);

      const response = await api.get("/target", { params });
      const data = Array.isArray(response.data) ? response.data : [];

      setTargets(data);
      await salvarTargets(data);
      setIsOffline(false);
    } catch (err) {
      console.error("Erro ao carregar alvos:", err);
      const offlineTargets = await carregarTodosTargets();
      setTargets(offlineTargets);
      setIsOffline(true);
    } finally {
      setLoading(false);
    }
  };

  // Busca equipes
  const fetchTeams = async () => {
    setLoading(true); // ✅ Adicionado: inicia loading
    try {
      const response = await api.get("/team");
      const data = Array.isArray(response.data) ? response.data : [];

      setTeams(data);
      await salvarTeamData(data); // ✅ Salva no IndexedDB
      setIsOffline(false);
    } catch (error) {
      console.error("Erro ao buscar equipes:", error);
      const offlineTeams = await carregarTodosTeams();
      setTeams(offlineTeams);
      setIsOffline(true);
    } finally {
      setLoading(false); // ✅ Finaliza loading
    }
  };

  // Carrega targets quando filtros mudam (com debounce)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchTargets();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [filters]);

  // Carregar dados ao montar e ao voltar online
  useEffect(() => {
    // Carrega dados ao montar
    getUser();
    fetchTeams();
    fetchTargets();

    // Atualiza ao voltar online
    const onOnline = () => {
      console.log("🌐 Conexão restaurada. Atualizando dados...");
      getUser();
      fetchTeams();
      fetchTargets();
    };

    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [user?.id]);

  // Carregar dados offline ao montar (se ainda não carregou)
  useEffect(() => {
    async function carregarOffline() {
      if (targets.length === 0) {
        const offlineTargets = await carregarTodosTargets();
        if (offlineTargets.length > 0) {
          setTargets(offlineTargets);
        }
      }

      if (teams.length === 0) {
        const offlineTeams = await carregarTodosTeams();
        if (offlineTeams.length > 0) {
          setTeams(offlineTeams);
        }
      }
    }
    carregarOffline();
  }, []);


  // Função para buscar equipe por ID (com detalhes)
  const fetchTeamById = async (teamId) => {
    try {
      setLoading(true);
      const response = await api.get(`/team/${teamId}/users`);
      const team = response.data;
  
      await salvarTeamDetalhado(team);
  
      // ✅ Removido: setTeams(...) → evita loop
      // Apenas o TeamPage precisa do detalhe, não o Dashboard
  
      return team;
    } catch (err) {
      console.error("Erro ao carregar equipe:", err);
      const offlineTeam = await carregarTeamDetalhado(teamId);
      if (offlineTeam) {
        setIsOffline(true);
        return offlineTeam;
      }
      throw new Error("Equipe não encontrada.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DataContext.Provider
      value={{
        userData,
        isOffline,
        fetchTeams,
        targets,
        teams, // ✅ Adicionado: agora os componentes conseguem acessar
        filters,
        setFilters,
        loading,
        fetchTeamById,
        fetchTargets,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}