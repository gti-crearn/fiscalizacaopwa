"use client";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
} from "react";
import Cookies from "js-cookie";
import { api } from "../services/api";
import { jwtDecode } from "jwt-decode";

// Criando o Context
const AuthContext = createContext(undefined);

// Hook personalizado para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

// Provider do contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Verifica se já existe um token ao carregar o app
  useEffect(() => {
    const token = Cookies.get("authToken");
    const userData = Cookies.get("user");
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error("Erro ao parsear dados do usuário:", err);
        setUser(null);
      }
    }
    setLoading(false); // Finaliza o carregamento inicial
  }, []);

  const login = async (username, password) => {
    try {
      setError("");
      setLoading(true);

      const response = await api.post(
        "/auth/login",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const { access_token } = response.data;

      // Decodifica o JWT
      const decoded = jwtDecode(access_token);

      // Monta o objeto usuário
      const userData = {
        id: decoded.sub,
        email: decoded.email,
        username: decoded.username,
        name: decoded.name, // opcional
        roles: decoded.roles || [],
      };

      // Salva no cookie
      Cookies.set("authToken", access_token, { expires: 7 });
      Cookies.set("user", JSON.stringify(userData), { expires: 7 });

      setUser(userData);
      return { access_token, user: userData };
    } catch (err) {
      const message = err.response?.data?.message || "Erro ao fazer login";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const logout = () => {
    Cookies.remove("authToken");
    Cookies.remove("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;