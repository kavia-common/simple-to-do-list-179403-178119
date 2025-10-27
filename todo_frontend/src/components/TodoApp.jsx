import React, { useEffect, useMemo, useState, useCallback } from 'react';
import TodoInput from './TodoInput';
import TodoList from './TodoList';
import { initDB, listTasks, addTask, updateTask, toggleComplete, deleteTask } from '../db/sqliteClient';

/**
 * PUBLIC_INTERFACE
 * TodoApp
 * Container component that initializes the local SQLite database (sql.js),
 * loads tasks, and wires CRUD operations. Displays loading and error states.
 */
export default function TodoApp() {
  const [loading, setLoading] = useState(true);
  const [dbReady, setDbReady] = useState(false);
  const [error, setError] = useState('');
  const [tasks, setTasks] = useState([]);

  // Initialize database on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await initDB();
        if (cancelled) return;
        setDbReady(true);
        const all = await listTasks();
        if (!cancelled) {
          setTasks(all);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) setError('Failed to initialize local database. ' + (e?.message || ''));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleAdd = useCallback(async (title) => {
    try {
      const row = await addTask(title);
      setTasks(prev => [row, ...prev]);
    } catch (e) {
      console.error(e);
      setError('Failed to add task.');
    }
  }, []);

  const handleToggle = useCallback(async (id, completed) => {
    try {
      await toggleComplete(id, completed);
      setTasks(prev => prev.map(t => (t.id === id ? { ...t, completed } : t)));
    } catch (e) {
      console.error(e);
      setError('Failed to update task.');
    }
  }, []);

  const handleUpdate = useCallback(async (id, title) => {
    try {
      await updateTask(id, title);
      setTasks(prev => prev.map(t => (t.id === id ? { ...t, title } : t)));
    } catch (e) {
      console.error(e);
      setError('Failed to edit task.');
    }
  }, []);

  const handleDelete = useCallback(async (id) => {
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (e) {
      console.error(e);
      setError('Failed to delete task.');
    }
  }, []);

  const subtitle = useMemo(() => {
    if (loading) return 'Loading your tasks...';
    if (!dbReady) return 'Database not ready';
    const remaining = tasks.filter(t => !t.completed).length;
    return remaining === 0 ? 'All tasks complete. Great job!' : `${remaining} task${remaining !== 1 ? 's' : ''} remaining`;
  }, [dbReady, loading, tasks]);

  return (
    <div className="card" role="region" aria-label="To-do Application">
      <div className="card-header">
        <h1 className="card-title">Your Tasks</h1>
        <p className="card-subtitle">{subtitle}</p>
      </div>
      <div className="card-body">
        {error ? <div className="error-banner" role="alert">{error}</div> : null}
        <TodoInput disabled={loading || !dbReady} onAdd={handleAdd} />
        <p className="helper">Tip: Click a title to edit. Press Enter to save, Esc to cancel.</p>
        <TodoList
          loading={loading}
          items={tasks}
          onToggle={handleToggle}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
