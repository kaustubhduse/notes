import React, { useEffect, useState } from "react";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../services/firebaseConfig"; // Replace with your Firebase config file path
import NoteCard from "./UI/NoteCard";

const NotesGrid = ({ onNoteClick }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const notesPerPage = 6; 
  // Maximum number of notes per page

  useEffect(() => {
    const notesCollection = collection(db, "notes");
    const unsubscribe = onSnapshot(
      notesCollection,
      (snapshot) => {
        const notesList = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt || { seconds: 0 }, 
          };
        });

        const sortedNotes = notesList.sort((a, b) => {
          if (a.isPinned === b.isPinned) {
            return b.createdAt.seconds - a.createdAt.seconds; 
          }
          return b.isPinned ? -1 : 1; 
        });

        setNotes(sortedNotes);
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to notes:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleTogglePin = async (noteId) => {
    try {
      const noteToToggle = notes.find((note) => note.id === noteId);
      if (!noteToToggle) return;

      const noteRef = doc(db, "notes", noteId);
      await updateDoc(noteRef, { isPinned: !noteToToggle.isPinned });
    } catch (error) {
      console.error("Error toggling pin status:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Separate pinned and unpinned notes
  const pinnedNotes = notes.filter((note) => note.isPinned);
  const unpinnedNotes = notes.filter((note) => !note.isPinned);


  const allNotes = [...pinnedNotes, ...unpinnedNotes];
  const startIndex = (currentPage - 1) * notesPerPage;
  const currentNotes = allNotes.slice(startIndex, startIndex + notesPerPage);
  const totalPages = Math.ceil(allNotes.length / notesPerPage);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {currentNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onNoteClick={onNoteClick}
            handleTogglePin={handleTogglePin}
          />
        ))}
      </div>

      <div className="flex justify-center mt-6 items-center space-x-2">
        {/* Previous Button */}
        <button
          onClick={() =>
            setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
          }
          disabled={currentPage === 1}
          className={`px-4 py-2 border rounded-full ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-white text-black hover:bg-yellow-300"
          } transition duration-300`}
        >
          <span className="material-icons">chevron_left</span>
        </button>

        {/* Page Indicators */}
        <div className="flex items-center space-x-1">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`w-8 h-8 flex items-center justify-center rounded-full border ${
                currentPage === index + 1
                  ? "bg-yellow-200 text-white font-semibold"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              } transition duration-300`}
            >
              <p className="text-black">{index + 1}</p>
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() =>
            setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className={`px-4 py-2 border rounded-full ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-white text-black hover:bg-yellow-300"
          } transition duration-300`}
        >
          <span className="material-icons">chevron_right</span>
        </button>
      </div>
    </div>
  );
};

export default NotesGrid;
