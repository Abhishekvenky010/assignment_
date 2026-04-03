# Decisions

## Agent Thoughts Visibility

The decision was to hide agent thoughts by default behind a "Show Reasoning" toggle button, displaying them in subtle italic styling when enabled, with system-level thoughts above the task list and task-specific thoughts above individual cards. This focuses on the analyst user by providing optional transparency to understand the system's reasoning without cluttering the default view, allowing them to toggle visibility as needed for debugging or learning. This decision would be changed if user feedback indicates reasoning is always desired or if the toggle feels too hidden, suggesting a more prominent default display or integration into the main flow.

## Parallel Task Layout

The decision was to visually group tasks with the same parallel_group in a dedicated "Parallel Tasks" container with a light gray background, displaying them side-by-side in a 2-column grid to emphasize concurrency. This caters to the analyst user by making parallel execution clear at a glance, preventing the UI from appearing purely sequential and highlighting the system's efficiency in multitasking. This would be revisited if parallel groups frequently exceed two tasks, requiring a more flexible grid or list layout, or if users prefer a different visual metaphor for concurrency.

## Partial Outputs Handling

The decision was to display partial outputs as italicized streaming logs and final outputs as bold, highlighted green blocks. This design aids the analyst user by clearly distinguishing between ongoing progress and completed results, providing a sense of real-time activity while ensuring final answers stand out prominently. The decision might change if users find the styling confusing or if a different indicator (e.g., animations or icons) better conveys the streaming nature without relying on text formatting.

## Cancelled State Representation

The decision was to represent cancelled tasks in neutral gray, with a special yellow-highlighted message for "sufficient_data" cancellations stating "Stopped early — sufficient data collected," avoiding red error styling. This reassures the analyst user that cancellations are not failures but optimizations, promoting confidence in the system's resilience and efficiency. This would be adjusted if cancellations are rare or always indicate issues, warranting a more error-like treatment, or if additional cancellation reasons require distinct visual cues.

## Task Dependency Handling

The decision was to handle task dependencies logically in the state (via depends_on arrays) but display tasks in their spawned order, grouping parallels visually without explicit dependency arrows or graphs. This keeps the UI simple for the analyst user, allowing them to follow the execution flow sequentially while noting concurrent tasks, avoiding complexity that could overwhelm. This decision would change if workflows become highly interdependent with complex DAGs, necessitating a graph visualization or dependency indicators to prevent user confusion in understanding task relationships.</content>
<parameter name="filePath">DECISIONS.md