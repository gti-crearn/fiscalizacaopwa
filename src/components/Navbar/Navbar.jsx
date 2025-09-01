import { FaBars, FaHome, FaList, FaTachometerAlt, FaTimes, FaUserCircle, FaUsers } from "react-icons/fa";
import { RiMapPinUserFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useContext, useState } from "react";
import styles from "./Navbar.module.css";
import { SiGooglemaps } from "react-icons/si";
import { DataContext } from "../../context/DataContext";
import UserDropdown from "../UserDropdown/UserDropdown";


export default function Navbar() {
  const { user } = useAuth();

  console.log(user)
  const [menuOpen, setMenuOpen] = useState(false);
  const { targets } = useContext(DataContext);
  const handleOpenMap = () => {
    sessionStorage.setItem("userTargets", JSON.stringify(targets));
    window.location.href = "/view/alvos/mapa"
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logo}>
          {/* <img src="/logo.png" alt="Logo" style={{ height: "32px", width: "32px" }} /> */}
          <span>SF</span>
        </div>

        {/* Menu Desktop */}
        <div className={styles.navLinks}>
          <Link to="/view/dashboard" className={styles.navLink}>
            <FaTachometerAlt /> Dashboard
          </Link>
          {/*  <Link to="/" className={styles.navLink}>
              <FaHome /> Início
            </Link> */}
          <Link to="/view/alvos" className={styles.navLink}>
            <FaList /> Alvos
          </Link>
          <Link to="/view/meus_alvos" className={styles.navLink}>
            <RiMapPinUserFill size={20} /> Meus Alvos
          </Link>
          <button type="button" onClick={handleOpenMap} className={styles.button}>
            <SiGooglemaps /> Mapa
          </button>

        </div>

        {/* Usuário (Desktop) */}
        <div className={styles.userMenu}>
           <UserDropdown username={user?.name} />
        </div>

        {/* Botão Mobile */}
        <button
          className={styles.menuButton}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Menu Mobile */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <Link to="/" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
            <FaHome /> Início
          </Link>
          <Link to="/view/alvos" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
            <FaList /> Alvos
          </Link>
          <Link to="/view/meus_alvos" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
            <RiMapPinUserFill /> Meus Alvos
          </Link>
          <button type="button" onClick={handleOpenMap} className={styles.button}>
            <SiGooglemaps /> Mapa
          </button>
          <Link to="/view/dashboard" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
            <FaTachometerAlt /> Dashboard
          </Link>
          <div className={styles.userMenu}>
            <UserDropdown username={user?.name} />
          </div>
        </div>
      )}
    </nav>
  );
}