import React from 'react';

function FinalOutput({ finalOutput }) {
  if (!finalOutput) return null;

  const summary = finalOutput.summary || finalOutput;
  const citations = finalOutput.citations || [];

  return (
    <div className="bg-blue-50 border border-blue-300 rounded-xl shadow-sm p-6 mb-6">
      <h2 className="text-3xl font-bold text-blue-800 mb-4">Final Answer</h2>
      <div className="text-xl text-gray-800 mb-4 leading-relaxed">
        {summary}
      </div>
      {citations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-blue-700 mb-2">Citations:</h3>
          <ul className="list-disc list-inside text-base text-gray-700">
            {citations.map((citation, idx) => (
              <li key={idx}>{citation.title} ({citation.source}, p. {citation.page})</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FinalOutput;