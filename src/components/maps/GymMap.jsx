import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './GymMap.css';
const GymMap = ({ coordinates, isInteractive }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [userMarker, setUserMarker] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [showSteps, setShowSteps] = useState(false);

  // Add this new function
  const handleNavigateToGym = () => {
    if (routeInfo && userMarker) {
      const userLocation = userMarker.getLngLat();
      const gymLocation = [coordinates.coordinates[0], coordinates.coordinates[1]];
      // Open in Google Maps
      window.open(
        `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${gymLocation[1]},${gymLocation[0]}&travelmode=driving`,
        '_blank'
      );
    }
  };

  const getRoute = async (start, end) => {
    const locationiqKey = 'pk.88f655e1c2a39a18eba810792c609ad0';
    try {
      const response = await fetch(
        `https://us1.locationiq.com/v1/directions/driving/${start[0]},${start[1]};${end[0]},${end[1]}?key=${locationiqKey}&steps=true&alternatives=true&geometries=polyline&overview=full`
      );
      const data = await response.json();
      if (data.routes && data.routes[0]) {
        const distance = (data.routes[0].distance / 1000).toFixed(2); // Convert to km
        const duration = Math.round(data.routes[0].duration / 60); // Convert to minutes\ 
        const steps = data.routes[0].legs[0].steps;
        setRouteInfo({
          distance,
          duration,
          steps // Store steps for potential future use
        });
      }
      return data;
    } catch (error) {
      console.error('Error fetching route:', error);
      return null;
    }
  };

  const updateRoute = async (userLocation) => {
    const gymLocation = [coordinates.coordinates[0], coordinates.coordinates[1]];
    const routeData = await getRoute([userLocation.lng, userLocation.lat], gymLocation);
    if (routeData) {
      drawRoute(routeData);
    }
  };

  useEffect(() => {
    if (!coordinates) return;

    const locationiqKey = 'pk.88f655e1c2a39a18eba810792c609ad0';

    if (!map.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: `https://tiles.locationiq.com/v3/streets/vector.json?key=${locationiqKey}`,
        center: [coordinates.coordinates[0], coordinates.coordinates[1]],
        zoom: 14
      });

      // Add gym marker
      const gymMarker = new maplibregl.Marker({
        color: '#ff3547',
        draggable: false
      })
        .setLngLat([coordinates.coordinates[0], coordinates.coordinates[1]])
        .addTo(map.current);

      // Add popup for gym
      const gymPopup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false
      });
      gymMarker.setPopup(gymPopup.setHTML('<h3>Gym Location</h3>'));

      // Handle map clicks for user location
      map.current.on('click', (e) => {
        if (!isInteractive) return;

        // Remove existing user marker and route
        if (userMarker) {
          userMarker.remove();
          if (map.current.getSource('route')) {
            map.current.removeLayer('route');
            map.current.removeSource('route');
          }
          setRouteInfo(null);
        }
        // Add new user marker
        const newMarker = new maplibregl.Marker({
          color: '#3887be',
          draggable: true
        })
          .setLngLat([e.lngLat.lng, e.lngLat.lat])
          .addTo(map.current);
        // Add popup for user location
        const popup = new maplibregl.Popup({
          closeButton: false,
          closeOnClick: false
        });
        newMarker.setPopup(popup.setHTML('<h3>Your Location</h3>'));
        // Update route when marker is dragged
        newMarker.on('dragend', () => {
          const lngLat = newMarker.getLngLat();
          updateRoute(lngLat);
        });

        setUserMarker(newMarker);
        updateRoute(e.lngLat);
      });

      // Add existing controls
      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
      map.current.addControl(new maplibregl.FullscreenControl(), 'top-right');
      map.current.addControl(new maplibregl.ScaleControl({
        maxWidth: 100,
        unit: 'metric'
      }), 'bottom-left');

      // Add geolocate control with callback
      const geolocateControl = new maplibregl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      });

      geolocateControl.on('geolocate', (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        if (userMarker) {
          userMarker.remove();
        }

        const newMarker = new maplibregl.Marker({
          color: '#3887be',
          draggable: true
        })
          .setLngLat([lng, lat])
          .addTo(map.current);

        setUserMarker(newMarker);
        updateRoute({ lng, lat });
      });

      map.current.addControl(geolocateControl, 'top-right');
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [coordinates, isInteractive]);


  const mapStyles = {
    width: showSteps ? '70%' : '100%',
    height: '400px',
    pointerEvents: isInteractive ? 'auto' : 'none',
    touchAction: isInteractive ? 'auto' : 'none',
    userSelect: 'none'
  };
  const drawRoute = (routeData) => {
    try {
      // Remove existing route if it exists
      if (map.current.getSource('route')) {
        map.current.removeLayer('route');
        map.current.removeSource('route');
      }

      // Add new route source and layer
      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: routeData.routes[0].geometry
        }
      });

      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 5,
          'line-opacity': 0.75
        }
      });
    } catch (error) {
      console.error('Error drawing route:', error);
    }
  };
  return (
    <div className="map-container" style={{ display: 'flex', gap: '20px', position: 'relative' }}>
    <div ref={mapContainer} className="map-element" style={mapStyles} />
    {isInteractive && routeInfo && (
      <div className="navigation-panel">
        <div style={{ marginBottom: '15px', textAlign: 'center' }}>
            <p style={{ margin: '0 0 10px 0' }}>
              Distance to gym: {routeInfo.distance} km ({routeInfo.duration} mins by car)
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={handleNavigateToGym}
                style={{
                  backgroundColor: '#3887be',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>Open in Google Maps</span>
                <span style={{ fontSize: '18px' }}>↗</span>
              </button>
              <button
                onClick={() => setShowSteps(!showSteps)}
                style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {showSteps ? 'Hide Steps' : 'Show Steps'}
              </button>
            </div>
          </div>

          {showSteps && routeInfo.steps && (
          <div className="steps-container">
            <h4 style={{ margin: '0 0 10px 0' }}>Navigation Steps:</h4>
            <ol className="steps-list">
              {routeInfo.steps.map((step, index) => (
                <li key={index} className="step-item">
                  <div className="step-content">
                    {/* <span className="step-number">{index + 1}.</span> */}
                    <div>
                      <div className="step-name">{step.name}</div>
                      <div className="step-maneuver">
                        {step.maneuver?.modifier && `${step.maneuver.modifier}`}
                        {step.maneuver?.type && ` - ${step.maneuver.type}`}
                      </div>
                      {step.distance && (
                        <div className="step-distance">
                          {(step.distance / 1000).toFixed(1)} km
                          {step.duration && ` (${Math.round(step.duration / 60)} mins)`}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
        </div>
      )}
      {isInteractive && !routeInfo && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '10px',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: 0 }}>Click on the map or use location button to set your starting point</p>
        </div>
      )}
    </div>
  );
};

export default GymMap;