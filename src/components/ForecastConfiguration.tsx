import React, { useState, useEffect } from 'react';
import axios from 'axios';

type PortCode = 'ZADUR' | 'ZAZBA' | 'ZACPT';

const ForecastConfiguration: React.FC = () => {
  const [port, setPort] = useState<PortCode | ''>('');
  const [apiData, setApiData] = useState<any>(null);
  const [portDelays, setPortDelays] = useState<number>(0);
  const [sailingTime, setSailingTime] = useState<number>(30);
  const [totalLeadTime, setTotalLeadTime] = useState<number>(0);

  useEffect(() => {
    const fetchApiData = async () => {
      if (!port) return;

      try {
        const response = await axios.get(
          'https://api.sinay.ai/congestion/api/v1/congestion',
          {
            headers: {
              API_KEY: '6aee23aa-0a6e-4cf7-b801-3a88290c1c51',
              'Content-Type': 'application/json',
            },
            params: { portCode: port },
          }
        );

        setApiData(response.data);
      } catch (error) {
        console.error('Error fetching API congestion data:', error);
      }
    };

    fetchApiData();
  }, [port]);

  useEffect(() => {
    if (apiData) {
      const congestion = apiData.congestion || 0;
      setPortDelays(congestion);
      setTotalLeadTime(sailingTime + congestion);
    }
  }, [apiData, sailingTime]);

  return (
    <div>
      <label>Port of Discharge:</label>
      <select
        value={port}
        onChange={(e) => setPort(e.target.value as PortCode)}
      >
        <option value="">Select a Port</option>
        <option value="ZADUR">Durban (ZADUR)</option>
        <option value="ZAZBA">Coega (ZAZBA)</option>
        <option value="ZACPT">Cape Town (ZACPT)</option>
      </select>

      <div>
        <label>Sailing Time (days):</label>
        <input
          type="number"
          value={sailingTime}
          onChange={(e) => setSailingTime(Number(e.target.value))}
        />
      </div>

      <div>
        <label>Port Delays (days):</label>
        <input type="number" value={portDelays} readOnly />
      </div>

      {apiData && (
        <div>
          <h3>Predicted Congestion Data</h3>
          <p>Congestion: {apiData.congestion}%</p>
          <p>Total Lead Time: {totalLeadTime} days</p>
        </div>
      )}
    </div>
  );
};

export default ForecastConfiguration;
