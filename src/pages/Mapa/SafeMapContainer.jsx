// src/components/SafeMapContainer.jsx
import { useEffect, useRef, useState } from "react";

export function SafeMapContainer({ children, center, zoom, style }) {
  const containerRef = useRef(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Só renderiza após o primeiro ciclo de renderização
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Evita renderização até que seja seguro
  if (!shouldRender) {
    return <div ref={containerRef} style={style} />;
  }

  return (
    <div ref={containerRef} style={{ ...style, position: "relative" }}>
      {children}
    </div>
  );
}