import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { Icon } from 'leaflet';

// Define a custom ship icon for the markers
const shipIcon = new Icon({
  iconUrl: 'https://image.flaticon.com/icons/png/512/584/584711.png', // Replace with a valid icon URL
  iconSize: [25, 25],
});

// Type for ship data
type ShipData = {
  mmsi: string;
  lat: number;
  lon: number;
  speed: number;
  course: number;
};

const AISStream: React.FC = () => {
  const [ships, setShips] = useState<ShipData[]>([]);
  const [status, setStatus] = useState<string>('Disconnected');
  const [errorDetails, setErrorDetails] = useState<string | null>(null); // New error state

  useEffect(() => {
    // WebSocket connection
    const ws = new WebSocket('wss://stream.aisstream.io/v0/stream');

    // Subscription message as per the example and your API key
    const subscriptionMessage = {
      Apikey: '0ed4d867bac584f11f0bace37a5a234a28de5c4c',  // Replace with your actual API key
      BoundingBoxes: [[[-90, -180], [90, 180]]], // Worldwide bounding box (adjust to your area if necessary)
      FiltersShipMMSI: [], // Optional, filter by specific MMSI
      FilterMessageTypes: ['PositionReport'], // Filter for position reports
    };

    // Handle WebSocket connection opening
    ws.onopen = () => {
      setStatus('Connected');
      console.log('WebSocket connection opened');
      ws.send(JSON.stringify(subscriptionMessage));
      console.log('Subscription message sent:', subscriptionMessage);
    };

    // Handle incoming messages
    ws.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
      const data = JSON.parse(event.data);

      // Example of extracting ship data (assuming the structure matches)
      if (data && data.lat && data.lon && data.mmsi) {
        const shipData: ShipData = {
          mmsi: data.mmsi,
          lat: data.lat,
          lon: data.lon,
          speed: data.sog || 0, // speed over ground
          course: data.cog || 0, // course over ground
        };

        setShips((prevShips) => {
          // Update the state to add or update ships based on their MMSI
          const existingShipIndex = prevShips.findIndex((ship) => ship.mmsi === shipData.mmsi);
          if (existingShipIndex !== -1) {
            // Update existing ship data
            const updatedShips = [...prevShips];
            updatedShips[existingShipIndex] = shipData;
            return updatedShips;
          }
          // Add new ship
          return [...prevShips, shipData];
        });
      }
    };

    // Handle WebSocket error
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setErrorDetails('WebSocket error: ' + error.message);
      setStatus('Error');
    };

    // Handle WebSocket close
    ws.onclose = (event) => {
      console.log('WebSocket connection closed', event);
      setErrorDetails('WebSocket closed with code: ' + event.code);
      setStatus('Disconnected');
    };

    // Cleanup WebSocket when the component unmounts
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <h2>AIS Stream - Status: {status}</h2>
      {errorDetails && <p style={{ color: 'red' }}>{errorDetails}</p>} {/* Show error details if any */}

      {/* Leaflet map to display ships */}
      <MapContainer
        center={[-29.85, 31.05]} // Center near Durban port
        zoom={10}
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Display ship markers */}
        {ships.map((ship) => (
          <Marker key={ship.mmsi} position={[ship.lat, ship.lon]} icon={shipIcon}>
            <Popup>
              <div>
                <p><strong>MMSI:</strong> {ship.mmsi}</p>
                <p><strong>Speed:</strong> {ship.speed} knots</p>
                <p><strong>Course:</strong> {ship.course}°</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default AISStream;