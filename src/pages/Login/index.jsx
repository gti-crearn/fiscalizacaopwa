// src/components/Login.js
import React, { useState } from 'react';
import styles from './Login.module.css';
import { LogIn } from 'lucide-react';

import { useNavigate } from 'react-router-dom'; // Opcional: para redirecionar após login
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      // Após login bem-sucedido, redirecione (ex: para dashboard)
      navigate('/view/meus_alvos'); // Ajuste conforme sua rota
    } catch (err) {
      // Erro já é tratado no contexto, mas pode ser logado
      console.error('Falha no login:', err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>Entrar</h2>

        {/* Exibe erro se houver */}
        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>
              Nome de usuário
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
              placeholder="Digite seu usuário"
              disabled={loading}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="Digite sua senha"
              disabled={loading}
              required
            />
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? (
              'Carregando...'
            ) : (
              <>
                <LogIn size={20} /> Entrar
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;