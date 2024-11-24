import React from 'react';
import { Toaster } from 'sonner';
import NotesApp from './components/NotesApp';
import './App.css'; 

function App() {
  return (
    <div className="min-h-screen bg-custom-gradient">
      <NotesApp />
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;