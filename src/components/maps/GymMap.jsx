import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const GymMap = ({ coordinates }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (!coordinates) return;

    const locationiqKey = 'pk.88f655e1c2a39a18eba810792c609ad0';

    if (!map.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: `https://tiles.locationiq.com/v3/streets/vector.json?key=${locationiqKey}`,
        center: [coordinates.coordinates[1], coordinates.coordinates[0]],
        zoom: 14
      });

      // Add marker
      const marker = new maplibregl.Marker({ 
        color: '#ff3547',
        draggable: true
      })
        .setLngLat([coordinates.coordinates[1], coordinates.coordinates[0]])
        .addTo(map.current);

      // Add navigation controls (zoom in/out, compass)
      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

      // Add fullscreen control
      map.current.addControl(new maplibregl.FullscreenControl(), 'top-right');

      // Add scale control
      map.current.addControl(new maplibregl.ScaleControl({
        maxWidth: 100,
        unit: 'metric'
      }), 'bottom-left');

      // Add popup for marker
      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false
      });

      marker.setPopup(popup.setHTML('<h3>Your Gym Location</h3>'));

      // Add geolocate control
      map.current.addControl(new maplibregl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }), 'top-right');

      // Add event listeners
      map.current.on('load', () => {
        map.current.resize();
      });

      marker.on('dragend', () => {
        const lngLat = marker.getLngLat();
        popup.setHTML(`<h3>Updated Location</h3>
          <p>Lat: ${lngLat.lat.toFixed(4)}<br />
          Lng: ${lngLat.lng.toFixed(4)}</p>`);
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [coordinates]);

  return (
    <div 
      ref={mapContainer} 
      style={{ 
        width: '100%', 
        height: '400px',
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative'
      }} 
    />
  );
};

export default GymMap;