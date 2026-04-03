const initialState = {
  run: {
    id: null,
    query: "",
    status: "idle",
    startTime: null,
    duration: 0,
    finalOutput: null
  },
  tasks: {},
  taskOrder: [],
  thoughts: []
};

function reducer(state, action) {
  switch (action.type) {
    case 'run_started':
      return {
        ...state,
        run: {
          ...state.run,
          id: action.run_id,
          query: action.query,
          status: 'running',
          startTime: Date.now()
        }
      };
    case 'agent_thought': {
      const newThought = {
        task_id: action.task_id || null,
        thought: action.thought
      };
      if (state.thoughts.find(t => t.thought === action.thought && t.task_id === newThought.task_id)) {
        return state;
      }
      return {
        ...state,
        thoughts: [...state.thoughts, newThought]
      };
    }
    case 'task_spawned': {
      if (state.tasks[action.task_id]) return state; // Prevent duplicates
      const newTask = {
        id: action.task_id,
        label: action.label,
        agent: action.agent,
        status: 'pending',
        toolCalls: [],
        toolResults: [],
        outputs: [],
        history: [{ status: 'pending', time: Date.now() }],
        error: null,
        message: null,
        parallel_group: action.parallel_group || null,
        depends_on: action.depends_on || []
      };
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.task_id]: newTask
        },
        taskOrder: [...state.taskOrder, action.task_id]
      };
    }
    case 'tool_call': {
      const taskForCall = state.tasks[action.task_id];
      const newCall = { name: action.tool, input_summary: action.input_summary, timestamp: action.timestamp };
      if (taskForCall.toolCalls.find(c => c.timestamp === action.timestamp)) return state;
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.task_id]: {
            ...taskForCall,
            toolCalls: [...taskForCall.toolCalls, newCall]
          }
        }
      };
    }
    case 'tool_result': {
      const taskForResult = state.tasks[action.task_id];
      const newResult = { output_summary: action.output_summary, timestamp: action.timestamp };
      if (taskForResult.toolResults.find(r => r.timestamp === action.timestamp)) return state;
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.task_id]: {
            ...taskForResult,
            toolResults: [...taskForResult.toolResults, newResult]
          }
        }
      };
    }
    case 'partial_output': {
      const taskForOutput = state.tasks[action.task_id];
      const newOutput = { content: action.content, is_final: action.is_final, timestamp: action.timestamp };
      if (taskForOutput.outputs.find(o => o.timestamp === action.timestamp)) return state;
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.task_id]: {
            ...taskForOutput,
            outputs: [...taskForOutput.outputs, newOutput]
          }
        }
      };
    }
    case 'task_update': {
      const task = state.tasks[action.task_id];
      // Prevent invalid transitions: complete/cancelled cannot change status
      if (task.status === 'complete' || task.status === 'cancelled') {
        return state;
      }
      const newHistory = [...task.history, { status: action.status, time: Date.now() }];
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.task_id]: {
            ...task,
            status: action.status,
            history: newHistory,
            error: action.error !== undefined ? action.error : task.error,
            message: action.message !== undefined ? action.message : task.message
          }
        }
      };
    }
    case 'run_complete': {
      const duration = Date.now() - state.run.startTime;
      return {
        ...state,
        run: {
          ...state.run,
          status: 'complete',
          duration,
          finalOutput: action.output
        }
      };
    }
    case 'run_error':
      return {
        ...state,
        run: {
          ...state.run,
          status: 'failed',
          error: action.error
        }
      };
    default:
      return state;
  }
}

export { initialState, reducer };