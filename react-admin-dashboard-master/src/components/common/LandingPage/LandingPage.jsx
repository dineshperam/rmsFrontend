import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate();

  const handleScreenClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      navigate("/home");
    }, 1300);
  };

  const handleContactClick = () => {
    if (window.location.pathname !== "/home") {
      navigate("/home");
      setTimeout(() => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      }, 500); // Delay to allow page transition
    } else {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Navbar */}
      <nav className="navbar fixed top-0 left-0 w-full flex justify-between items-center p-5 bg-opacity-20 backdrop-blur-md shadow-md z-50">
        <div className="logo">
          <img src="/RM_Latest1.png" alt="Royal Mint Logo" className="logo-img w-20 h-auto" />
        </div>
        <ul className="nav-links flex space-x-6 font-semibold">
          <li>
            <a href="/login" className="text-white hover:text-orange-400 transition duration-300">
              Login
            </a>
          </li>
          <li>
            <button onClick={handleContactClick} className="text-white hover:text-orange-400 transition duration-300 cursor-pointer">
              Contact
            </button>
          </li>
        </ul>
      </nav>

      {/* Landing Page Content */}
      <motion.div
        className="relative flex justify-center items-center h-full cursor-pointer"
        initial={{ y: 0 }}
        animate={isClicked ? { y: "-100vh" } : { y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.5 }}
        onClick={handleScreenClick}
      >
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/vidbg2.mp4" type="video/mp4" />
        </video>

        {/* Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50" />
      </motion.div>
    </div>
  );
}
