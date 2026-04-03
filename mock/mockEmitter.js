// Function to load events from JSON files
async function loadEvents(type) {
  const response = await fetch(`/mock/fixtures/${type}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load ${type}.json`);
  }
  return response.json();
}

// Function to load success events
function loadSuccessEvents() {
  return loadEvents('run_success');
}

// Function to load error events
function loadErrorEvents() {
  return loadEvents('run_error');
}

// Function to play events sequentially with random delays
function playEvents(events, callback, abortController) {
  let i = 0;
  let timeoutId;
  const emitNext = () => {
    if (abortController.signal.aborted) return;
    if (i < events.length) {
      callback(events[i]);
      i++;
      // Random delay between 800ms and 1200ms
      const delay = 800 + Math.random() * 400;
      timeoutId = setTimeout(emitNext, delay);
    }
  };
  emitNext();
  return () => {
    abortController.abort();
    if (timeoutId) clearTimeout(timeoutId);
  };
}

export { loadSuccessEvents, loadErrorEvents, playEvents };