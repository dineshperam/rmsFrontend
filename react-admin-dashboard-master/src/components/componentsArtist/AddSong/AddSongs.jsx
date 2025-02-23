import { useState } from "react";
import Header from "../../common/Header/Header";
import ApiService from "../../../service/ApiService";
import { toast } from "react-toastify";

const AddSong = () => {
  const [song, setSong] = useState({
    title: "",
    releaseDate: "",
    collaborators: "",
    genre: "",
  });

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const artistId = ApiService.getUserId();
  const today = new Date().toISOString().split("T")[0];

  const genres = ["Pop", "Rock", "Jazz", "Folk", "Classical"];

  const validateField = (name, value) => {
    let errorMsg = "";

    if (name === "title") {
      if (!value.trim()) {
        errorMsg = "Title is required.";
      } else if (!/^[A-Za-z\s]+$/.test(value)) {
        errorMsg = "Title can only contain alphabets and spaces.";
      }
    } else if (name === "releaseDate") {
      if (!value) {
        errorMsg = "Release date is required.";
      } else if (value > today) {
        errorMsg = "Release date cannot be in the future.";
      }
    } else if (name === "genre" && !value) {
      errorMsg = "Genre is required.";
    }

    return errorMsg;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Prevent invalid input for title before setting state
    if (name === "title" && !/^[A-Za-z\s]*$/.test(value)) {
      return;
    }

    // Update song state and validate field on change
    setSong((prevSong) => ({
      ...prevSong,
      [name]: value,
    }));

    // Set errors for the field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields on submit
    const newErrors = {
      title: validateField("title", song.title),
      releaseDate: validateField("releaseDate", song.releaseDate),
      genre: validateField("genre", song.genre),
    };

    setErrors(newErrors);

    // If any error message exists, do not submit the form
    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    const response = await ApiService.addSong(song, artistId);
    setMessage(response.message);

    if (response.success) {
      setSong({
        title: "",
        releaseDate: "",
        collaborators: "",
        genre: "",
      });
      toast.success("Song Added Successfully");
      setErrors({});
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10 min-h-screen">
      <Header title="Add Song" />
      <main className="mx-auto py-6 px-4 lg:px-8">
        {message && (
          <p
            className={`text-center text-sm font-semibold p-2 rounded ${
              message.includes("successfully") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="title" className="block text-lg">
              Title:
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={song.title}
              onChange={handleChange}
              className="w-full p-2 text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            {errors.title && <p className="text-red-600 text-sm">{errors.title}</p>}
          </div>
          <div>
            <label htmlFor="releaseDate" className="block text-lg">
              Release Date:
            </label>
            <input
              id="releaseDate"
              type="date"
              name="releaseDate"
              value={song.releaseDate}
              onChange={handleChange}
              required
              max={today}
              className="w-full p-2 text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            {errors.releaseDate && <p className="text-red-600 text-sm">{errors.releaseDate}</p>}
          </div>
          <div>
            <label htmlFor="collaborators" className="block text-lg">
              Collaborators:
            </label>
            <input
              id="collaborators"
              type="text"
              name="collaborators"
              value={song.collaborators}
              onChange={handleChange}
              className="w-full p-2 text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label htmlFor="genre" className="block text-lg">
              Genre:
            </label>
            <select
              id="genre"
              name="genre"
              value={song.genre}
              onChange={handleChange}
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
