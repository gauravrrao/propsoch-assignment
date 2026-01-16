"use client";

// TODO:  When zooming out, property nodes overlap and become cluttered.
// Improve visual spacing for a better UI/UX.

import "leaflet/dist/leaflet.css";

// TODO : This import gives "window is not defined" error in the terminal. Fix it.
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import "leaflet-defaulticon-compatibility";


// TODO : Clicking a marker should ideally open the popup with the selected property details. Currently not implemented. Implement it.

import { JSX, useEffect, useRef, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import {
  LayersControl,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import { PropscoreRating } from "@/assets/PropsochRating";
import {
  cn,
  concatenateTypologies,
  formatDate,
  formatPrice,
  para,
} from "@/utils/helpers";
import { BudgetIcon } from "@/assets/budget-icon";
import { HouseIcon } from "@/assets/house-icon";
import { LocationIcon } from "@/assets/location-icon";
import { CalendarIcon } from "@/assets/utility";
import L, { Map as LeafletMap, Marker as LeafletMarker, Point } from "leaflet";
import { LocationType, projectListing, ProjectListingResponse } from "@/types/types";
import { Badge } from "./badge";
import { renderToString } from "react-dom/server";
import { useRouter } from "next/navigation";

// Define types for marker cluster
interface ClusterMarkerData {
  id: string;
  position: [number, number];
  count: number;
  projects: projectListing[];
}

interface MarkerClusterLayerProps {
  projects: projectListing[];
  onMarkerClick: (project: projectListing) => void;
  selectedProperty: projectListing | null;
}


export const renderIcon = (
  icon: JSX.Element,
  ariaLabel: string,
  transform = "translate(-8px, -4px)"
) =>
  `<div style="transform: ${transform}" aria-label="${ariaLabel}" role="button">${renderToString(
    icon
  )}</div>`;

function getOtherLocationIcon(
  label: string,
  isSelected: boolean,
  icon = true
): L.DivIcon {
  return L.divIcon({
    html: renderIcon(
      <Badge variant={"white"} className="w-max whitespace-nowrap">
        {label}
      </Badge>,
      label,
      isSelected ? "translate(-10px, -20px)" : "translate(-15px, -20px)"
    ),
    iconSize: isSelected ? [40, 40] : [30, 30],
    iconAnchor: isSelected ? [20, 40] : [15, 30],
    popupAnchor: [0, -30],
    className: isSelected ? "selected-marker" : "normal-marker",
  });
}

function getClusterIcon(count: number, zoomLevel: number): L.DivIcon {
  const size = Math.min(40 + count * 2, 60); // Dynamic size based on count
  return L.divIcon({
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: rgba(59, 130, 246, 0.9);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: ${Math.min(14 + count / 5, 16)}px;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        cursor: pointer;
      ">
        ${count}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    className: "cluster-marker",
  });
}

function MapClickHandler({ onClick }: { onClick: () => void }) {
  useMapEvents({
    click: () => onClick(),
  });
  return null;
}

function MapController({
  selectedLocation,
}: Readonly<{
  selectedLocation: Pick<LocationType, "lat" | "lon" | "name"> | null
}>) {
  const map = useMap();

  useEffect(() => {
    if (selectedLocation) {
      map.panTo([selectedLocation.lat, selectedLocation.lon], {
        animate: true,
        duration: 1.5,
      });
    }
  }, [selectedLocation, map]);

  return null;
}

// Custom hook for marker clustering
function useMarkerClustering(
  projects: projectListing[],
  mapZoom: number,
  clusterRadius: number = 100 // pixels
): { markers: ClusterMarkerData[]; individualMarkers: projectListing[] } {
  return useMemo(() => {
    if (mapZoom >= 14) {
      // Show individual markers when zoomed in
      return { markers: [], individualMarkers: projects };
    }

    const clusters: ClusterMarkerData[] = [];
    const processedIds = new Set<string | number>();
    const individualMarkers: projectListing[] = [];

    // Sort by latitude for better clustering
    const sortedProjects = [...projects].sort((a, b) => a.latitude - b.latitude);

    for (let i = 0; i < sortedProjects.length; i++) {
      const project = sortedProjects[i];
      if (processedIds.has(project.id)) continue;

      const cluster = [project];
      processedIds.add(project.id);

      // Find nearby projects
      for (let j = i + 1; j < sortedProjects.length; j++) {
        const otherProject = sortedProjects[j];
        if (processedIds.has(otherProject.id)) continue;

        // Calculate pixel distance based on zoom level
        const latDiff = Math.abs(project.latitude - otherProject.latitude);
        const lonDiff = Math.abs(project.longitude - otherProject.longitude);
        
        // Adjust threshold based on zoom level
        const threshold = (15 - mapZoom) * 0.002; // Dynamic threshold
        
        if (latDiff < threshold && lonDiff < threshold) {
          cluster.push(otherProject);
          processedIds.add(otherProject.id);
        }
      }

      if (cluster.length > 1) {
        // Calculate average position for cluster
        const avgLat = cluster.reduce((sum, p) => sum + p.latitude, 0) / cluster.length;
        const avgLon = cluster.reduce((sum, p) => sum + p.longitude, 0) / cluster.length;
        
        clusters.push({
          id: `cluster-${project.id}`,
          position: [avgLat, avgLon],
          count: cluster.length,
          projects: cluster,
        });
      } else {
        individualMarkers.push(project);
      }
    }

    return { markers: clusters, individualMarkers };
  }, [projects, mapZoom, clusterRadius]);
}

// Component to handle zoom-based clustering
function MarkerClusterLayer({
  projects,
  onMarkerClick,
  selectedProperty,
}:MarkerClusterLayerProps) {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());
  
  useEffect(() => {
    const updateZoom = () => setZoom(map.getZoom());
    map.on('zoomend', updateZoom);
    return () => {
      map.off('zoomend', updateZoom);
    };
  }, [map]);

  const { markers: clusters, individualMarkers } = useMarkerClustering(projects, zoom);

  // Handle cluster click - zoom in on cluster
  const handleClusterClick = useCallback((cluster: ClusterMarkerData) => {
    map.flyTo(cluster.position, zoom + 2, {
      duration: 1,
    });
  }, [map, zoom]);

  return (
    <>
      {/* Render clusters */}
      {clusters.map((cluster) => (
        <Marker
          key={cluster.id}
          position={cluster.position}
          icon={getClusterIcon(cluster.count, zoom)}
          eventHandlers={{
            click: () => handleClusterClick(cluster),
          }}
        >
          <Popup>
            <div className="p-2">
              <h4 className="font-bold mb-2">{cluster.count} Properties in this area</h4>
              <div className="max-h-60 overflow-y-auto">
                {cluster.projects.map((project) => (
                  <div
                    key={project.id}
                    className="p-2 border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => onMarkerClick(project)}
                  >
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-gray-600">{project.micromarket}</p>
                  </div>
                ))}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Render individual markers */}
      {individualMarkers.map((project) => (
        <Marker
          key={project.id}
          position={[project.latitude, project.longitude]}
          icon={getOtherLocationIcon(
            project.name,
            selectedProperty?.id === project.id
          )}
          eventHandlers={{
            click: () => onMarkerClick(project),
          }}
        />
      ))}
    </>
  );
}

export default function DiscoveryMap({
  projects,
}: { projects: projectListing[] }) {
  const [selectedLocation, setSelectedLocation] = useState<Pick<LocationType, "lat" | "lon" | "name"> | null>(
    null
  );
  const sectionRef = useRef(null);
  const [selectedProperty, setSelectedProperty] = useState<projectListing | null>(
    null
  );
  const [mapZoom, setMapZoom] = useState(12);
  const mapRef = useRef<LeafletMap | null>(null);
  const router = useRouter();

  // Initialize map ref
  const handleMapCreated = (map: LeafletMap) => {
    mapRef.current = map;
    map.on('zoomend', () => {
      setMapZoom(map.getZoom());
    });
  };

  // Handle marker click
  const handleMarkerClick = useCallback((project: projectListing) => {
    setSelectedLocation({
      lat: project.latitude,
      lon: project.longitude,
      name: project.name,
    });
    setSelectedProperty(project || null);
    
    // Scroll to corresponding element
    const el = document.querySelector(
      `[data-marker-id="${project?.id}"]`
    ) as HTMLElement | null;
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, []);

  // Handle popup navigation
  const handlePopupClick = useCallback((e: React.MouseEvent, project: projectListing) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/property/${project.slug}/${project.id}`);
  }, [router]);

  // useEffect(() => {
  //   if (selectedLocation) {
  //     const found = projects?.projects?.find(
  //       (prop: projectListing) => prop.name === selectedLocation.name
  //     );
  //     setSelectedProperty(found || null);
  //   }
  // }, [selectedLocation, projects]);

  return (
    <section
      ref={sectionRef}
      style={{ fontFamily: "Arial, sans-serif" }}
      className="flex aspect-auto h-full flex-col gap-4 overflow-hidden"
      aria-label="Project discovery via map"
    >
      {/* Zoom level indicator */}
      {/* <div className="absolute top-4 right-4 z-[1000] bg-white px-3 py-1 rounded-lg shadow-md text-sm">
        Zoom: {mapZoom.toFixed(1)}
      </div> */}

      {/* Map Container */}
      <div className="relative size-full overflow-hidden">
        <MapContainer
          center={[12.97, 77.59]}
          zoom={mapZoom}
          scrollWheelZoom={true}
          dragging={true}
          touchZoom={true}
          className="border-lightborder z-10 size-full rounded-lg border object-cover"
          aria-label="Map view"
          style={{ height: "530px", width: "1000px" }}
          // whenCreated={handleMapCreated}
        >
          <LayersControl position="bottomleft">
            <LayersControl.BaseLayer checked name="Street View">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="Satellite View">
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
            </LayersControl.BaseLayer>
          </LayersControl>
          
          <MapClickHandler onClick={() => setSelectedLocation(null)} />
          <MapController selectedLocation={selectedLocation} />

          {/* Marker Cluster Layer */}
          {projects?.length > 0 && (
            <MarkerClusterLayer
              projects={projects}
              onMarkerClick={handleMarkerClick}
              selectedProperty={selectedProperty}
            />
          )}

          {/* Selected Property Popup */}
          {selectedLocation && selectedProperty && (
            <Popup
              position={[selectedLocation.lat, selectedLocation.lon]}
              autoClose={false}
              closeOnClick={false}
              offset={[0, -20]}
              closeOnEscapeKey
              minWidth={400}
              closeButton
              // onClose={() => setSelectedProperty(null)}
            >
              <div 
                onClick={(e) => handlePopupClick(e, selectedProperty)}
                className="cursor-pointer"
              >
                <div className="flex w-full flex-col gap-3">
                  <Image
                    src={selectedProperty.image}
                    alt={selectedProperty.alt}
                    width={500}
                    height={500}
                    loading="lazy"
                    className={cn(
                      "aspect-video size-full rounded-lg object-cover transition-all duration-400 ease-in-out",
                      selectedProperty.projectStatus === "soldOut" &&
                        "grayscale"
                    )}
                  />
                  <h3
                    className={cn(
                      para({ size: "lg", color: "dark" }),
                      "font-semibold"
                    )}
                  >
                    {selectedProperty.name}
                  </h3>

                  <div className="flex flex-col gap-3 whitespace-nowrap">
                    <div className="flex w-full items-center justify-between">
                      <span
                        className={cn(
                          para({ color: "dark", size: "sm" }),
                          "flex w-full items-center gap-2"
                        )}
                      >
                        <LocationIcon width={20} height={20} />
                        <span>{selectedProperty.micromarket}</span>
                      </span>
                      <span
                        className={cn(
                          para({ color: "dark", size: "sm" }),
                          "flex w-full items-center justify-end gap-2"
                        )}
                      >
                        <PropscoreRating
                          rating={selectedProperty.propscore}
                          width={110}
                          height={24}
                          className="ml-auto w-max max-w-40"
                        />
                      </span>
                    </div>
                    <div className="flex w-full items-center justify-between gap-3">
                      <span
                        className={cn(
                          para({ color: "dark", size: "sm" }),
                          "flex w-full max-w-40 items-center gap-2 truncate"
                        )}
                      >
                        <BudgetIcon width={20} height={20} />
                        {formatPrice(selectedProperty.minPrice, false)} -{" "}
                        {formatPrice(selectedProperty.maxPrice, false)}
                      </span>
                      <span
                        className={cn(
                          para({ color: "dark", size: "sm" }),
                          "flex w-full items-center justify-end gap-2"
                        )}
                      >
                        <CalendarIcon height={20} width={20} />
                        {formatDate(selectedProperty.possessionDate)}
                      </span>
                    </div>
                    <div className="flex w-full items-center justify-between gap-3">
                      <span
                        className={cn(
                          para({ color: "dark", size: "sm" }),
                          "flex w-full max-w-40 items-center gap-2 truncate"
                        )}
                      >
                        <HouseIcon width={20} height={20} />
                        <span className="w-32 max-w-32 truncate">
                          {concatenateTypologies(selectedProperty.typologies)}
                        </span>
                      </span>
                      <span
                        className={cn(
                          para({ color: "dark", size: "sm" }),
                          "flex w-full items-center justify-end gap-2"
                        )}
                      >
                        {selectedProperty.minSaleableArea} -{" "}
                        {selectedProperty.maxSaleableArea} sqft
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-center text-sm text-blue-600 font-medium">
                    Click to view property details →
                  </div>
                </div>
              </div>
            </Popup>
          )}
        </MapContainer>
      </div>

      {/* Add CSS for better spacing */}
      <style jsx global>{`
        .leaflet-marker-icon {
          z-index: 1000 !important;
        }
        .selected-marker {
          z-index: 1001 !important;
        }
        .cluster-marker {
          z-index: 999 !important;
        }
        .leaflet-popup-content {
          margin: 16px !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        }
      `}</style>
    </section>
  );
}