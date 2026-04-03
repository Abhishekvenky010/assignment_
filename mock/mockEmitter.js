// Import fixture data
import successEvents from './fixtures/run_success.json';
import errorEvents from './fixtures/run_error.json';

// Function to load success events
function loadSuccessEvents() {
  return Promise.resolve(successEvents);
}

// Function to load error events
function loadErrorEvents() {
  return Promise.resolve(errorEvents);
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