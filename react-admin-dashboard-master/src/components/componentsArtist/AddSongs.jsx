import { useState } from "react";
import axios from "axios";
import Header from "../common/Header";

const AddSong = () => {
  const [song, setSong] = useState({
    title: "",
    releaseDate: "",
    collaborators: "",
  });

  const [message, setMessage] = useState("");
  const artistId = localStorage.getItem("artistId");

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  const handleChange = (event) => {
    setSong({
      ...song,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate release date (should not be in the future)
    if (song.releaseDate > today) {
      setMessage("Release date cannot be in the future.");
      return;
    }
    try {
      const newSong = { ...song, artistId: artistId };

      await axios.post("http://localhost:8080/artist/addSong", newSong);
      setMessage("Song added successfully!");
      setSong({
        title: "",
        releaseDate: "",
        collaborators: "",
      });
    } catch (error) {
      console.error("Error adding song:", error);
      setMessage("Failed to add song. Please try again.");
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10 min-h-screen">
      <Header title="Add Song" />
      <main className=" mx-auto py-6 px-4 lg:px-8">
        {message && (
          <p
            className={`text-center text-sm font-semibold p-2 rounded ${
              message.includes("successfully") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-lg">Title:</label>
            <input
              type="text"
              name="title"
              value={song.title}
              onChange={handleChange}
              required
              className="w-full p-2 text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-lg ">Release Date:</label>
            <input
              type="date"
              name="releaseDate"
              value={song.releaseDate}
              onChange={handleChange}
              max={today}
              required
              className="w-full p-2 text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-lg ">Collaborators:</label>
            <input
              type="text"
              name="collaborators"
              value={song.collaborators}
              onChange={handleChange}
              required
              className="w-full p-2 text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-200"
          >
            Add Song
          </button>
        </form>
      </main>
    </div>
  );
};

export default AddSong;
