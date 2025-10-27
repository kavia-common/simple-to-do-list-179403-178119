import React, { useEffect, useRef, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * TodoItem
 * Props:
 * - item: { id, title, completed }
 * - onToggle(id, completed)
 * - onUpdate(id, title)
 * - onDelete(id)
 */
export default function TodoItem({ item, onToggle, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(item.title);
  const inputRef = useRef();

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const save = () => {
    const next = val.trim();
    if (next && next !== item.title) {
      onUpdate?.(item.id, next);
    }
    setEditing(false);
  };

  const cancel = () => {
    setVal(item.title);
    setEditing(false);
  };

  return (
    <>
      <input
        className="checkbox"
        type="checkbox"
        checked={!!item.completed}
        onChange={(e) => onToggle?.(item.id, e.target.checked ? 1 : 0)}
        aria-label={`Mark ${item.title} as ${item.completed ? 'incomplete' : 'complete'}`}
      />
      {editing ? (
        <input
          ref={inputRef}
          className="input"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === 'Enter') save();
            if (e.key === 'Escape') cancel();
          }}
          aria-label="Edit task title"
        />
      ) : (
        <span
          className="title"
          tabIndex={0}
          role="textbox"
          aria-label={`Task: ${item.title}`}
          onClick={() => setEditing(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') setEditing(true);
          }}
        >
          {item.title}
        </span>
      )}
      <div className="actions">
        {!editing ? (
          <button
            className="btn secondary"
            onClick={() => setEditing(true)}
            aria-label={`Edit ${item.title}`}
          >Edit</button>
        ) : (
          <>
            <button className="btn" onClick={save} aria-label="Save edit">Save</button>
            <button className="btn secondary" type="button" onClick={cancel} aria-label="Cancel edit">Cancel</button>
          </>
        )}
        <button
          className="btn danger"
          onClick={() => onDelete?.(item.id)}
          aria-label={`Delete ${item.title}`}
        >Delete</button>
      </div>
    </>
  );
}
