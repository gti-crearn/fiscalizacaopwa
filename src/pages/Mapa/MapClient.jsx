// src/components/MapClient.jsx
import { TileLayer } from "react-leaflet";
import { FitBoundsClient, MarkerWithPopup } from "./FitBoundsClient";

export default function MapClient({ targets }) {
  return (
    <>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {targets.map((target) => (
        <MarkerWithPopup key={`marker-${target.id}`} target={target} />
      ))}
      <FitBoundsClient targets={targets} />
    </>
  );
}