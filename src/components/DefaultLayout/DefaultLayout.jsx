import { Outlet } from "react-router-dom";
import styles from "./DefaultLayout.module.css";
import Navbar from "../Navbar/Navbar";
import { useContext } from "react";
import { DataContext } from "../../context/DataContext";

export default function DefaultLayout() {
   const { isOnline } = useContext(DataContext);
  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.content}>
      <div className={`status-bar ${isOnline ? "online" : "offline"}`} style={{marginTop:"1rem",marginBottom:"1rem"}}>
          {isOnline ? "🟢 Conectado" : "🔴 Sem conexão"}
        </div>
        <Outlet />
      </main>
    </div>
  );
}
