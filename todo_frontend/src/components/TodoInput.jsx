import React, { useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * TodoInput
 * Input row for adding new tasks.
 * Props:
 * - disabled: boolean
 * - onAdd(title: string): void
 */
export default function TodoInput({ disabled, onAdd }) {
  const [value, setValue] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const title = value.trim();
    if (!title) return;
    onAdd?.(title);
    setValue('');
  };

  return (
    <form className="input-row" onSubmit={submit} aria-label="Add task form">
      <label htmlFor="new-task" className="visually-hidden">New task</label>
      <input
        id="new-task"
        className="input"
        type="text"
        placeholder="Add a new task..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        aria-label="Task title"
      />
      <button className="btn" type="submit" disabled={disabled} aria-label="Add task">
        Add
      </button>
    </form>
  );
}
