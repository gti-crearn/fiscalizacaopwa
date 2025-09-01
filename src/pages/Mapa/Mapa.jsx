// src/pages/MapaPage.jsx
"use client";
import { useEffect, useState, Suspense, lazy } from "react";
import DashboardHeader from "../../components/Title/Title";
import { SafeMapContainer } from "./SafeMapContainer";


const MapContainer = lazy(() => import("react-leaflet").then((mod) => ({ default: mod.MapContainer })));
const MapClient = lazy(() => import("./MapClient"));

export default function MapaPage() {
  const [targets, setTargets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = sessionStorage.getItem("userTargets");
    if (saved) {
      try {
        setTargets(JSON.parse(saved));
      } catch (err) {
        console.error("Erro ao carregar targets do sessionStorage", err);
      }
    }
    setLoading(false);
  }, []);

  if (loading) return <p className="p-6 text-center">Carregando...</p>;
  if (targets.length === 0) return <div className="p-6 text-gray-500">Nenhum alvo para exibir no mapa.</div>;

  return (
    <div className="h-screen w-full">
      <DashboardHeader title="Mapa de Alvos" subtitle="Marcação dos alvos" />

      <Suspense fallback={<p className="p-6 text-center">Carregando mapa...</p>}>
        <SafeMapContainer
          center={[-14.235, -51.9253]}
          zoom={5}
          style={{ height: "calc(100vh - 70px)", width: "100%" }}
        >
          <MapContainer
            center={[-14.235, -51.9253]}
            zoom={5}
            style={{ height: "100%", width: "100%" }}
            whenCreated={(map) => {
              // Opcional: log para debug
              console.log("✅ Mapa criado:", map);
            }}
          >
            <MapClient targets={targets} />
          </MapContainer>
        </SafeMapContainer>
      </Suspense>
    </div>
  );
}