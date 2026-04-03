import React from 'react';
import TaskCard from './TaskCard';

function TaskList({ tasks, taskOrder, thoughts, showReasoning }) {
  const rendered = new Set();
  const systemThoughts = thoughts.filter(t => t.task_id === null);
  const items = [];

  if (showReasoning && systemThoughts.length > 0) {
    items.push(
      <div key="system-thoughts" className="rounded-xl border border-gray-200 shadow-sm p-4 mb-4 bg-gray-50 italic text-gray-600 border-l-2 border-gray-300 pl-4">
        <h4 className="text-lg font-semibold mb-2 mt-6">System Reasoning:</h4>
        {systemThoughts.map((t, idx) => <p key={idx} className="text-sm">{t.thought}</p>)}
      </div>
    );
  }

  taskOrder.forEach(taskId => {
    if (rendered.has(taskId)) return;
    const task = tasks[taskId];
    const taskThoughts = thoughts.filter(t => t.task_id === taskId);
    if (task.parallel_group) {
      // Collect all tasks in the same parallel group
      const groupTasks = taskOrder.filter(id => tasks[id].parallel_group === task.parallel_group && !rendered.has(id));
      groupTasks.forEach(id => rendered.add(id));
      items.push(
        <div key={task.parallel_group} className="rounded-xl border border-gray-200 shadow-sm p-4 bg-gray-50 mb-4 border-l-2 border-gray-300 pl-4">
          <h4 className="text-lg font-semibold mb-2 mt-6">⚡ Parallel Tasks</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {groupTasks.map(id => (
              <div key={id}>
                <TaskCard task={tasks[id]} thoughts={thoughts.filter(t => t.task_id === id)} showReasoning={showReasoning} />
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      rendered.add(taskId);
      items.push(<TaskCard key={taskId} task={task} thoughts={taskThoughts} showReasoning={showReasoning} />);
    }
  });

  return <div className="space-y-4">{items}</div>;
}

export default TaskList;