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
      BoundingBoxes: [
        [
          [-29.8205, 30.9762],
          [-29.9626, 31.0822],
        ],
      ],
      FiltersShipMMSI: ['601972000'],
      FilterMessageTypes: ['PositionReport'],
    };

    ws.onopen = () => {
      setStatus('Connected');
      ws.send(JSON.stringify(subscriptionMessage));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now().toString(), message: JSON.stringify(data) },
      ]);
    };

    ws.onerror = () => setStatus('Error');
    ws.onclose = () => setStatus('Disconnected');

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <p>Status: {status}</p>
      <ul
        style={{
          maxHeight: '400px',
          overflowY: 'scroll',
          border: '1px solid gray',
          padding: '10px',
        }}
      >
        {messages.map((msg) => (
          <li key={msg.id}>{msg.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default AISStream;
