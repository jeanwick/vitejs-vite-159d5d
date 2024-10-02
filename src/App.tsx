import React from 'react';
import AISStream from './components/AISStream';
import ForecastConfiguration from './components/ForecastConfiguration';
import Tracking from './components/Tracking';

const App: React.FC = () => {
  return (
    <div className="App" style={{ padding: '20px' }}>
      <h1>Tracking Application</h1>
      <div style={{ display: 'flex', justifyContent: 'space-around', gap: '20px' }}>
        {/* AIS Stream Section */}
        <div style={{ width: '30%' }}>
          <h2>AIS Stream</h2>
          <AISStream />
        </div>

        {/* Port Congestion Section */}
        <div style={{ width: '30%' }}>
          <h2>Port Congestion</h2>
          <ForecastConfiguration />
        </div>

        {/* Container Tracking Section */}
        <div style={{ width: '30%' }}>
          <h2>Container Tracking</h2>
          <Tracking />
        </div>
      </div>
    </div>
  );
};

export default App;