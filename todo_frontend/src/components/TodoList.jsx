import React from 'react';
import TodoItem from './TodoItem';

/**
 * PUBLIC_INTERFACE
 * TodoList
 * Renders a list of TodoItem components.
 * Props:
 * - loading: boolean
 * - items: Array<{id, title, completed, created_at}>
 * - onToggle(id, completed)
 * - onUpdate(id, title)
 * - onDelete(id)
 */
export default function TodoList({ loading, items, onToggle, onUpdate, onDelete }) {
  if (loading) {
    return <p className="helper" aria-live="polite">Loading...</p>;
  }
  if (!items || items.length === 0) {
    return <p className="helper">No tasks yet. Add your first one!</p>;
  }
  return (
    <ul className="list" aria-label="Task list">
      {items.map(item => (
        <li key={item.id} className={`item ${item.completed ? 'completed' : ''}`}>
          <TodoItem
            item={item}
            onToggle={onToggle}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  );
}
