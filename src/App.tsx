import React, { useRef, useEffect, useState, useCallback } from "react";
import { LngLatBounds, Map } from "mapbox-gl";
import "./App.css";
import { queryFeatures } from "@esri/arcgis-rest-feature-layer";
import { IEnvelope } from "@esri/arcgis-rest-types";

const accessToken =
  "pk.eyJ1IjoiZ2hvdGkxNDMiLCJhIjoiY2tyN3pyeG5pMjlmbDMwdGM4cXd0Ym9rZyJ9.o1jhOzwF0s07Aaq5WrS-_Q";

export default () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new Map({
      accessToken,
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v10",
      center: [lng, lat],
      zoom: zoom,
    });
  });

  const executeQuery = (bounds: IEnvelope) => {
    queryFeatures({
      url: "https://services6.arcgis.com/ssFJjBXIUyZDrSYZ/ArcGIS/rest/services/US_Airport/FeatureServer/0",
      geometry: bounds,
      geometryType: "esriGeometryEnvelope",
      spatialRel: "esriSpatialRelIntersects",
      f: "geojson",
      resultType: "tile",
      returnGeometry: true,
    }).then((response) => {
      map.current.getSource("airports").setData(response);
    });
  };

  const debounce = (callback, wait) => {
    let timeoutId = null;
    return (...args) => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        callback.apply(null, args);
      }, wait);
    };
  };

  const loadAirports = () => {
    if (!map.current) return; // wait for map to initialize
    var foo: LngLatBounds = map.current.getBounds();
    console.log(foo);
    var bar: IEnvelope = {
      xmin: foo.getWest(),
      ymin: foo.getSouth(),
      xmax: foo.getEast(),
      ymax: foo.getNorth(),
      spatialReference: {
        wkid: 4326,
      },
    };
    executeQuery(bar);
  };

  const debouncedLoadAirports = useCallback(debounce(loadAirports, 250), []);

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("moveend", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    map.current.on("moveend", loadAirports);
    map.current.on("move", debouncedLoadAirports);

    map.current.on("load", () => {
      // This code runs once the base style has finished loading.

      map.current.addSource("airports", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
        //data: "https://services6.arcgis.com/ssFJjBXIUyZDrSYZ/ArcGIS/rest/services/US_Airport/FeatureServer/0/query?f=pgeojson&where=1=1",
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
