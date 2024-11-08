import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Debug() {
  const [dbStatus, setDbStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkDatabase = async () => {
      try {
        const response = await axios.get('http://localhost:5000/debug/db');
        setDbStatus(response.data);
      } catch (error) {
        setError(error.message);
      }
    };

    checkDatabase();
  }, []);

  return (
    <div className="p-4">
      <h2>Database Status</h2>
      {error && <div className="text-red-600">{error}</div>}
      {dbStatus && (
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(dbStatus, null, 2)}
        </pre>
      )}
    </div>
  );
}