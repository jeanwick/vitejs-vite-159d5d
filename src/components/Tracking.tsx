import React, { useState } from 'react';
import axios from 'axios';

interface TrackingEvent {
  eventID: string;
  carrierBookingReference: string;
  [key: string]: any;
}

const Tracking: React.FC = () => {
  const [containerNumber, setContainerNumber] = useState<string>('');
  const [carrierBookingReference, setCarrierBookingReference] = useState<string>('');
  const [trackingData, setTrackingData] = useState<TrackingEvent[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrackingData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('https://mock.api-portal.hlag.com/v2/events/', {
        params: {
          carrierBookingReference,
          equipmentReference: containerNumber
        },
        headers: {
          'accept': 'application/json',
          'API-Version': '1',
          'X-IBM-Client-Id': 'your-client-id',
          'X-IBM-Client-Secret': 'your-client-secret'
        }
      });

      setTrackingData(response.data);
    } catch (err) {
      setError('Failed to fetch tracking data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrackingData();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Container Number:</label>
        <input type="text" value={containerNumber} onChange={(e) => setContainerNumber(e.target.value)} required />

        <label>Carrier Booking Reference:</label>
        <input
          type="text"
          value={carrierBookingReference}
          onChange={(e) => setCarrierBookingReference(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Track Container'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {trackingData && (
        <ul>
          {trackingData.map((event) => (
            <li key={event.eventID}>
              <strong>Event