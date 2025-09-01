// src/components/FitBoundsClient.jsx
import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

// Corrige ícones do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/icons/marker-icon-2x.png",
  iconUrl: "/icons/marker-icon.png",
  shadowUrl: "/icons/marker-shadow.png",
});

// Função para criar ícone personalizado
const createCustomIcon = (color) => {
  return new L.Icon({
    iconUrl: `/${color}.png`,
    shadowUrl: "/icons/marker-shadow.png",
    iconAnchor: [12, 41],
  });
};

// ✅ Named export
export function FitBoundsClient({ targets }) {
  const map = useMap();

  useEffect(() => {
    if (!targets || targets.length === 0) return;

    const bounds = targets
      .map((t) => {
        const lat = parseFloat(t.latitude);
        const lng = parseFloat(t.longitude);
        return isNaN(lat) || isNaN(lng) ? null : [lat, lng];
      })
      .filter(Boolean);

    if (bounds.length > 0) {
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15,
        animate: true,
      });
    }
  }, [targets, map]);

  return null;
}

// ✅ Named export
export function MarkerWithPopup({ target }) {
  const { latitude, longitude, empresa, numeroArt, enderecoObra, telefoneProprietario, status } = target;

  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  if (isNaN(lat) || isNaN(lng)) return null;

  const statusUpper = status?.trim().toUpperCase();
  const color =
    statusUpper === "CONCLUÍDA"
      ? "green"
      : ["EM ANDAMENTO", "EM ATENDIMENTO"].includes(statusUpper)
      ? "yellow"
      : "gray";

  const customIcon = createCustomIcon(color);
  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <Marker position={[lat, lng]} icon={customIcon}>
      <Popup>
        <div className="text-sm">
          <h3 className="font-semibold">{empresa}</h3>
          <p><strong>ART:</strong> {numeroArt}</p>
          <p><strong>Endereço:</strong> {enderecoObra}</p>
          <p><strong>Telefone:</strong> {telefoneProprietario}</p>
          <p className="mt-2">
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">
              🌍 Ver no Google Maps
            </a>
          </p>
        </div>
      </Popup>
    </Marker>
  );
}