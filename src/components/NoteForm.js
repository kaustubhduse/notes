import React, { useState } from "react";
import Button from "./UI/Button";
import { toast } from "sonner";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebaseConfig";

const NoteForm = () => {
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [body, setBody] = useState("");
  const [inputClicked, setInputClicked] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
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

    const note = {
      title: title.trim(),
      tagline: tagline.trim(),
      body: body.trim(),
      createdAt: serverTimestamp(),
    };

    const notesCollection = collection(db, "notes");

    try {
      await addDoc(notesCollection, note);
      toast.success("Note Added", {
        description: "Your note has been added successfully.",
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Failed to add note", {
        description: error.message,
      });
    }

    setTitle("");
    setTagline("");
    setBody("");
    setInputClicked(false); 
  };

  return (
    <div className="relative lg:ml-[30%]">
      {!inputClicked && (
        <input
          placeholder="Take a note..."
          onClick={() => setInputClicked(true)}
          className="shadow-md p-3 mb-6 w-[100%] boxsi border-2 border-gray-300 text-white placeholder-white placeholder:text-xl"
        />
      )}

      {inputClicked && (
        <>
          <div
            className="fixed inset-0"
            onClick={() => setInputClicked(false)}
          ></div>

          <form
            onSubmit={handleSubmit}
            className="relative z-10 shadow-xl mb-8 boxsi rounded-3xl "
          >
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title*"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={50}
                className="w-full p-3 focus:outline-none placeholder:text-lg placeholder:text-gray-500 text-lg  rounded-t-3xl "
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Tagline (Optional)"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                maxLength={100}
                className="w-full p-3 focus:outline-none placeholder:text-gray-500  "
              />
            </div>

            <div>
              <textarea
                placeholder="Content"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                maxLength={500}
                className="w-full p-3 focus:outline-none resize-none placeholder:text-gray-500"
              />
            </div>

            <div className="flex justify-between ">
              <Button type="submit" title="Add Note" />
              <Button title="Close" onClick={() => setInputClicked(false)} />
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default NoteForm;
