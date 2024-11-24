import React, { useState } from "react";
import { Toaster } from "sonner";
import NotesGrid from "./NotesGrid";
import NoteModal from "./NoteModal";
import NoteForm from "./NoteForm";

const NotesApp = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);


  const updateNote = (updatedNote) => {
    setNotes((prevNotes) =>
      prevNotes
        .map((note) =>
          note.id === updatedNote.id ? updatedNote : note
        )
        .sort((a, b) => b.isPinned - a.isPinned || b.createdAt - a.createdAt)
    );
  };

  const deleteNote = (noteId) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
  };

  return (
    <div className=" container mx-auto p-4  min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
          NoteKeeper
        </h1>
        <NoteForm />
        <NotesGrid onNoteClick={setSelectedNote} />
        
      </div>

      {selectedNote && (
        <NoteModal
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
          onUpdate={updateNote}
          onDelete={deleteNote}
        />
      )}
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default NotesApp;
