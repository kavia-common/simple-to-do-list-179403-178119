import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import * as db from './db/sqliteClient';
import App from './App';

// Mock db layer for fast tests
const tasks = [];
jest.spyOn(db, 'initDB').mockImplementation(async () => {});
jest.spyOn(db, 'listTasks').mockImplementation(async () => tasks.slice());
jest.spyOn(db, 'addTask').mockImplementation(async (title) => {
  const row = { id: Date.now(), title, completed: 0, created_at: Date.now() };
  tasks.unshift(row);
  return row;
});
jest.spyOn(db, 'toggleComplete').mockImplementation(async (id, completed) => {
  const t = tasks.find(x => x.id === id);
  if (t) t.completed = completed;
});
jest.spyOn(db, 'updateTask').mockImplementation(async (id, title) => {
  const t = tasks.find(x => x.id === id);
  if (t) t.title = title;
});
jest.spyOn(db, 'deleteTask').mockImplementation(async (id) => {
  const idx = tasks.findIndex(x => x.id === id);
  if (idx >= 0) tasks.splice(idx, 1);
});

test('renders input for adding tasks', async () => {
  render(<App />);
  const input = await screen.findByLabelText(/task title/i);
  expect(input).toBeInTheDocument();
});

test('adding a task updates the list', async () => {
  render(<App />);
  const input = await screen.findByLabelText(/task title/i);
  const addButton = screen.getByRole('button', { name: /add task/i });

  fireEvent.change(input, { target: { value: 'My Task' } });
  fireEvent.click(addButton);

  await waitFor(() => {
    expect(screen.getByText('My Task')).toBeInTheDocument();
  });
});

test('deleting a task removes it', async () => {
  render(<App />);
  const input = await screen.findByLabelText(/task title/i);
  const addButton = screen.getByRole('button', { name: /add task/i });

  fireEvent.change(input, { target: { value: 'To Remove' } });
  fireEvent.click(addButton);

  const itemText = await screen.findByText('To Remove');
  const deleteBtn = itemText.parentElement.querySelector('button[aria-label^="Delete"]');
  fireEvent.click(deleteBtn);

  await waitFor(() => {
    expect(screen.queryByText('To Remove')).not.toBeInTheDocument();
  });
});
