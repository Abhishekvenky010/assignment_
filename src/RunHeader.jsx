import React, { useState, useEffect } from 'react';

function RunHeader({ query, status, startTime, duration }) {
  // eslint-disable-next-line react-hooks/purity
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    if (status === 'running') {
      const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
      return () => clearInterval(interval);
    }
  }, [status]);

  const elapsed = status === 'running' ? currentTime - startTime : (duration || 0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'bg-blue-500 text-white';
      case 'complete': return 'bg-green-500 text-white';
      case 'failed': return 'bg-red-500 text-white';
      case 'cancelled': return 'bg-gray-500 text-white';
      default: return 'bg-gray-300 text-black';
    }
  };

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rounded-xl border border-gray-200 shadow-sm p-4 mb-4">
      <div className="text-lg font-bold mb-2">{query}</div>
      <div className="flex items-center gap-4">
        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(status)}`}>
          {status}
        </span>
        <span className="text-sm">Elapsed: {formatTime(elapsed)}</span>
      </div>
    </div>
  );
}

export default RunHeader;