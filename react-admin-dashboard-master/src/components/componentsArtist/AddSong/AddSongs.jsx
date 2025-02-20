import { useState } from "react";
import Header from "../../common/Header/Header";
import ApiService from "../../../service/ApiService";

const AddSong = () => {
  const [song, setSong] = useState({
    title: "",
    releaseDate: "",
    collaborators: "",
    genre:""
  });
 
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const artistId = ApiService.getUserId();
 
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  const genres = ["Pop", "Rock", "Jazz", "Folk", "Classical"];

 
  const handleChange = (event) => {
    setSong({
      ...song,
      [event.target.name]: event.target.value,
    });
  };
 
  const validateForm = () => {
    let validationErrors = {};
    const today = new Date().toISOString().split("T")[0];

    if (!song.title.trim()) {
      validationErrors.title = "Title is required.";
    }

    if (!song.genre) {
      validationErrors.genre = "Genre is required.";
    }

    if (!song.releaseDate) {
      validationErrors.releaseDate = "Release date is required.";
    } else if (song.releaseDate > today) {
      validationErrors.releaseDate = "Release date cannot be in the future.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const response = await ApiService.addSong(song, artistId);
    setMessage(response.message);

    if (response.success) {
      setSong({
        title: "",
        releaseDate: "",
        collaborators: "",
        genre: "",
      });
      setErrors({});
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
            {errors.title && <p className="text-red-600 text-sm">{errors.title}</p>}
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
            {errors.releaseDate && <p className="text-red-600 text-sm">{errors.releaseDate}</p>}
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
          <div>
            <label className="block text-lg">Genre:</label>
            <select
              name="genre"
              value={song.genre}
              onChange={handleChange}
              required
              className="w-full p-2 text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select Genre</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
            {errors.genre && <p className="text-red-600 text-sm">{errors.genre}</p>}
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