import L from "leaflet";

// Create custom icon factory
export const createCustomMarkerIcon = (color: string = "#3B95F6", isSelected: boolean = false) => {
  const size = isSelected ? 24 : 20;
  
  return L.divIcon({
    html: `
      <div style="
        position: relative;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
      ">
        <div style="
          width: ${size - 8}px;
          height: ${size - 8}px;
          background: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
    className: "custom-marker-icon",
  });
};

export const createClusterMarkerIcon = (count: number) => {
  const size = Math.min(30 + Math.log2(count) * 5, 60);
  return L.divIcon({
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: linear-gradient(135deg, #3B95F6, #9A4AFB);
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: white;
        font-weight: bold;
        font-size: ${Math.min(14, size / 2.5)}px;
        transition: all 0.2s ease;
      ">
        ${count}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    className: "cluster-marker-icon",
  });
};