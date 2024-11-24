import React from "react";
import { motion } from "framer-motion"; 

const NoteCard = ({ note, onNoteClick, handleTogglePin }) => {
  return (
    <motion.div
      key={note.id}
      className={`${
        note.isPinned ? "bg-yellow-100" : "bg-white"
      } relative border py-4 px-4 rounded-lg cursor-pointer hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden`} // Added overflow-hidden
      onClick={() => onNoteClick(note)}
      initial={{ opacity: 0, x: -100 }} 
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{ opacity: 0, x: -100 }}
      transition={{
        duration: 0.8, 
        scale: { duration: 0.5 }, 
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleTogglePin(note.id);
        }}
        className="absolute top-2 right-0 p-0 text-sm font-semibold rounded z-10"
      >
        <span
          className={`material-icons ${
            note.isPinned ? "text-yellow-500" : "text-gray-400"
          } transition-transform duration-300`}
        >
          push_pin
        </span>
      </button>

      <h3 className="font-bold text-xl break-words">{note.title}</h3>
      <p className="text-gray-600 text-lg break-words">{note.tagline}</p>
      <div className="text-lg break-words">{note.body}</div>
    </motion.div>
  );
};

export default NoteCard;
