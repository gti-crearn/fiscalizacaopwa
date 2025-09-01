// src/components/UserDropdown/UserDropdown.js
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "./UserDropdown.module.css";
import { useState } from "react";

export default function UserDropdown({ username }) {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className={styles.dropdown} onMouseLeave={() => setIsOpen(false)}>
      <button
        className={styles.dropdownButton}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <FaUserCircle /> {username || "Usuário"} ▾
      </button>

      {isOpen && (
        <ul className={styles.dropdownMenu}>
          <li>
            <button
              className={styles.dropdownItem}
              onClick={() => {
                setIsOpen(false);
                navigate("/view/perfil");
              }}
            >
              <FaUserCircle /> Perfil
            </button>
          </li>
          <li>
            <button
              className={styles.dropdownItem}
              onClick={handleLogout}
            >
              <FaSignOutAlt /> Sair
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}