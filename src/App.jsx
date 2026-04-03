import React, { useReducer, useEffect, useRef, useState } from 'react';
import { initialState, reducer } from './agentRunState';
import { loadSuccessEvents, loadErrorEvents, playEvents } from '../mock/mockEmitter';
import RunHeader from './RunHeader';
import TaskList from './TaskList';
import FinalOutput from './FinalOutput';

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showReasoning, setShowReasoning] = useState(false);
  const abortControllerRef = useRef();
  const currentFixtureRef = useRef('success');

  const startPlayback = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const events = currentFixtureRef.current === 'success' ? await loadSuccessEvents() : await loadErrorEvents();
    playEvents(events, (event) => dispatch(event), abortControllerRef.current);
  };

  useEffect(() => {
    startPlayback();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const toggleFixture = () => {
    currentFixtureRef.current = currentFixtureRef.current === 'success' ? 'error' : 'success';
    startPlayback();
  };

  // Log state to console on updates
  useEffect(() => {
    console.log('State updated:', state);
  }, [state]);

  if (state.run.status === 'idle') {
    return (
      <div className="p-4">
        <div className="flex gap-2 mb-4">
          <button onClick={toggleFixture} className="px-4 py-2 bg-blue-500 text-white rounded">Toggle Fixture</button>
          <button onClick={() => setShowReasoning(!showReasoning)} className="px-4 py-2 bg-gray-500 text-white rounded">
            {showReasoning ? 'Hide Reasoning' : 'Show Reasoning'}
          </button>
        </div>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-500 mb-4">Submit a query to start analysis</h2>
          <div className="max-w-md mx-auto bg-gray-100 p-4 rounded-lg">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-2">
        <button onClick={toggleFixture} className="px-4 py-2 bg-blue-500 text-white rounded">Toggle Fixture</button>
        <button onClick={() => setShowReasoning(!showReasoning)} className="px-4 py-2 bg-gray-500 text-white rounded">
          {showReasoning ? 'Hide Reasoning' : 'Show Reasoning'}
        </button>
      </div>
      {state.run.status === 'complete' && <FinalOutput finalOutput={state.run.finalOutput} />}
      <RunHeader query={state.run.query} status={state.run.status} startTime={state.run.startTime} duration={state.run.duration} />
      <h2 className="text-lg font-semibold mb-2 mt-6">Tasks</h2>
      <TaskList tasks={state.tasks} taskOrder={state.taskOrder} thoughts={state.thoughts} showReasoning={showReasoning} />
    </div>
  );
}

export default App
