import React, { useEffect, useState } from 'react';

type AISMessage = {
  id: string;
  message: string;
};

const AISStream: React.FC = () => {
  const [messages, setMessages] = useState<AISMessage[]>([]);
  const [status, setStatus] = useState<string>('Disconnected');

  useEffect(() => {
    const ws = new WebSocket('wss://stream.aisstream.io/v0/stream');

    const subscriptionMessage = {
      APIKey: '0ed4d867bac584f11f0bace37a5a234a28de5c4c',
      BoundingBoxes: [[[-29.8205, 30.9762], [-29.9626, 31.0822]]],
      FiltersShipMMSI: ['601972000'],
      FilterMessageTypes: ['PositionReport']
    };

    // When the WebSocket connection opens
    ws.onopen = () => {
      setStatus('Connected');
      ws.send(JSON.stringify(subscriptionMessage));
      console.log('WebSocket connection opened');
    };

    // On receiving messages from the WebSocket
    ws.onmessage = (event) => {
      console.log('Received message:', event.data);
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now().toString(), message: JSON.stringify(data) }
      ]);
    };

    // On WebSocket error
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setStatus('Error');
    };

    // When the WebSocket connection closes
    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setStatus('Disconnected');
    };

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <h2>AIS Stream</h2>
      <p>Status: {status}</p>
      <ul style={{ maxHeight: '400px', overflowY: 'scroll', border: '1px solid gray', padding: '10px' }}>
        {messages.map((msg) => (
          <li key={msg.id}>{msg.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default AISStream;