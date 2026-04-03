import React from 'react';

function TaskCard({ task, thoughts = [], showReasoning }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'bg-blue-500 text-white';
      case 'complete': return 'bg-green-500 text-white';
      case 'failed': return 'bg-red-500 text-white';
      case 'cancelled': return 'bg-gray-500 text-white';
      default: return 'bg-gray-300 text-black';
    }
  };



  const renderLifecycle = () => {
    const hasRetry = task.history.some(h => h.status === 'failed');
    const isCancelled = task.status === 'cancelled';
    const isCancelledEarly = isCancelled && task.message === 'sufficient_data';
    const isPermanentFailure = task.status === 'failed' && !hasRetry;

    if (!hasRetry && !isCancelled && !isPermanentFailure) return null;

    let messages = [];

    if (hasRetry) {
      messages = [
        `❌ Failed: ${task.error}`,
        '🔄 Retrying...',
        task.status === 'running' ? '▶️ Running' : task.status === 'cancelled' ? '🟡 Stopped early — sufficient data collected' : `✅ ${task.status}`
      ];
    } else if (isCancelled) {
      messages = isCancelledEarly ? ['🟡 Stopped early — sufficient data collected'] : ['🟡 Cancelled'];
    } else if (isPermanentFailure) {
      messages = [`❌ Failed: ${task.error}`];
    }

    const bgColor = isCancelled ? (isCancelledEarly ? 'bg-yellow-100 border-yellow-500' : 'bg-gray-100 border-gray-500') : hasRetry ? 'bg-blue-100 border-blue-500' : 'bg-red-100 border-red-500';

    return (
      <div className={`mt-2 p-2 ${bgColor} border-l-4`}>
        <h4 className="text-sm font-semibold">Lifecycle:</h4>
        <ul className="list-none text-sm space-y-1">
          {messages.map((msg, idx) => (
            <div key={idx}>{msg}</div>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm">
      {showReasoning && thoughts.length > 0 && (
        <div className="mb-4 p-2 bg-gray-50 italic text-gray-600">
          <h4 className="font-semibold">Task Reasoning:</h4>
          {thoughts.map((t, idx) => <p key={idx} className="text-sm">{t.thought}</p>)}
        </div>
      )}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{task.label}</h3>
        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
          {task.status}{task.status === 'cancelled' && task.message ? ` - ${task.message}` : ''}
        </span>
      </div>
      <p className="text-gray-600 mb-4 text-sm">👤 {task.agent}</p>

      {task.status === 'failed' && task.error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-300 rounded">
          <strong>❌ Error:</strong> {task.error}
        </div>
      )}

      {renderLifecycle()}

      {task.toolCalls.length > 0 && (
        <div className="mb-4">
          <h4 className="text-md font-semibold mb-2">🔧 Tool Calls:</h4>
          <ul className="list-disc list-inside space-y-1">
            {task.toolCalls.map((call, idx) => (
              <li key={idx} className="text-sm">
                <strong>{call.name}:</strong> {call.input_summary}
              </li>
            ))}
          </ul>
        </div>
      )}

      {task.toolResults.length > 0 && (
        <div className="mb-4">
          <h4 className="text-md font-semibold mb-2">Tool Results:</h4>
          <ul className="list-disc list-inside space-y-1">
            {task.toolResults.map((result, idx) => (
              <li key={idx} className="text-sm">{result.output_summary}</li>
            ))}
          </ul>
        </div>
      )}

      {task.outputs.length > 0 && (
        <div className="mb-4">
          <h4 className="text-md font-semibold mb-2">📊 Outputs:</h4>
          <div className="space-y-2">
            {task.outputs.map((output, idx) => (
              <div key={idx} className={`p-2 rounded text-sm ${output.is_final ? 'bg-green-50 border border-green-200 font-bold' : 'bg-gray-50 italic'}`}>
                {output.content}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskCard;