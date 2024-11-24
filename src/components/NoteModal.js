import React, { useState, useEffect } from "react";
import { X, Save, Trash2 } from "lucide-react";
import { db } from "../services/firebaseConfig";
import { toast } from "sonner";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

const NoteModal = ({ note, onClose, onUpdate, onDelete }) => {
  const [title, setTitle] = useState(note.title);
  const [tagline, setTagline] = useState(note.tagline || "");
  const [body, setBody] = useState(note.body);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title Required", {
        description: "Please provide a title for your note.",
      });
      return;
    }

    if (title.length > 50) {
      toast.error("Title Too Long", {
        description: "Title must be 50 characters or less.",
      });
      return;
    }

    if (tagline.length > 100) {
      toast.error("Tagline Too Long", {
        description: "Tagline must be 100 characters or less.",
      });
      return;
    }

    if (body.length > 500) {
      toast.error("Note Body Too Long", {
        description: "Note body must be 500 characters or less.",
      });
      return;
    }

    try {
      const noteDocRef = doc(db, "notes", note.id);
      await updateDoc(noteDocRef, {
        title: title.trim(),
        tagline: tagline.trim(),
        body: body.trim(),
      });

      toast.success("Note updated successfully!");
      onUpdate({
        ...note,
        title: title.trim(),
        tagline: tagline.trim(),
        body: body.trim(),
      });

      onClose();
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to update the note. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      const noteDocRef = doc(db, "notes", note.id);
      await deleteDoc(noteDocRef);

      toast.success("Note deleted successfully!");
      onDelete(note.id);
      onClose();
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete the note. Please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      style={{
        animation: isOpen ? "zoomIn 0.5s ease-out" : "none",
      }}
    >
      <div
        className="bg-white rounded-lg w-full max-w-md mx-4 p-6 relative"
        style={{
          animation: isOpen ? "translateIn 0.5s ease-out" : "none",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Note</h2>

        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={50}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-purple-300"
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {title.length}/50 characters
            </p>
          </div>

          <div>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              maxLength={100}
              placeholder="Tagline (Optional)"
              className="w-full p-3 border rounded focus:ring-2 focus:ring-purple-300"
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {tagline.length}/100 characters
            </p>
          </div>

          <div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={500}
              className="w-full h-48 p-3 border rounded focus:ring-2 focus:ring-purple-300 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {body.length}/500 characters
            </p>
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={handleDelete}
            className="flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            <Trash2 size={18} className="mr-2" /> Delete
          </button>
          <button
            onClick={handleUpdate}
            className="flex items-center bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            <Save size={18} className="mr-2" /> Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;
