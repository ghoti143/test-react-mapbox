import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./App.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZ2hvdGkxNDMiLCJhIjoiY2tyN3pyeG5pMjlmbDMwdGM4cXd0Ym9rZyJ9.o1jhOzwF0s07Aaq5WrS-_Q";

export default () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v10",
      center: [lng, lat],
      zoom: zoom,
    });
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
    map.current.on("load", () => {
      // This code runs once the base style has finished loading.

      map.current.addSource("airports", {
        type: "geojson",
        data: "https://services6.arcgis.com/ssFJjBXIUyZDrSYZ/ArcGIS/rest/services/US_Airport/FeatureServer/0/query?f=pgeojson&where=1=1",
      });

      map.current.addLayer({
        id: "airports-circle",
        type: "circle",
        source: "airports",

        paint: {
          "circle-color": "hsla(0,0%,0%,0.75)",
          "circle-stroke-width": 1.5,
          "circle-stroke-color": "white",
        },
      });
    });
  });

  return (
    <div id="app">
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
};
