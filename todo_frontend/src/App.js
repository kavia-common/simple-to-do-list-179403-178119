import React from 'react';
import './App.css';
import TodoApp from './components/TodoApp';

// PUBLIC_INTERFACE
function App() {
  /** Root app renders the TodoApp. */
  return (
    <div className="App">
      <TodoApp />
    </div>
  );
}

export default App;
