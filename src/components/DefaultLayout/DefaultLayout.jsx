import { Outlet } from "react-router-dom";
import styles from "./DefaultLayout.module.css";
import Navbar from "../Navbar/Navbar";

export default function DefaultLayout() {
  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}
