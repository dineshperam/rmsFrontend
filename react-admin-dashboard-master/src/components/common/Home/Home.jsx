import { FaChartLine, FaMoneyBillWave, FaFileContract, FaGlobe } from "react-icons/fa";
import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-scroll";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const featureList = [
    {
      title: "Automated Payment Processing",
      icon: <FaMoneyBillWave />,
      text: "Seamless and secure automated royalty payments to artists and rights holders."
    },
    {
      title: "Real-Time Earnings Dashboard",
      icon: <FaChartLine />,
      text: "Track your earnings with real-time data visualization and insights."
    },
    {
      title: "Transparent Revenue Tracking",
      icon: <FaFileContract />,
      text: "Full visibility into revenue streams, ensuring accountability and trust."
    },
    {
      title: "Global Royalty Standardization",
      icon: <FaGlobe />,
      text: "Unified royalty calculations and payments across multiple regions."
    }
  ];

  const artists = [
    {
      name: "A. R. Rahman",
      tenure: "1992 – Present",
      famousSongs: ["Jai Ho (2008)", "Kun Faya Kun (2011)"],
      totalAwards: "150+ (Academy Awards, Grammy Awards, National Film Awards, Filmfare Awards)",
      image: "50AR.jpg"
    },
    {
      name: "Arijit Singh",
      tenure: "2005 – Present",
      famousSongs: ["Kesariya (2022)", "Jhoome Jo Pathaan (2023)"],
      totalAwards: "100+",
      image: "33.jpg"
    },
    {
      name: "Shreya Ghoshal",
      tenure: "1998 – Present",
      famousSongs: ["Teri Meri", "Sun Raha Hai Na Tu"],
      totalAwards: "100+",
      image: "31S.jpg"
    },
    {
      name: "Yo Yo Honey Singh",
      tenure: "2005 – Present",
      famousSongs: ["Blue Eyes", "Lungi Dance"],
      totalAwards: "20+",
      image: "34.jpg"
    },
    {
      name: "Guru Randhawa",
      tenure: "2013 – Present",
      famousSongs: ["Lahore", "Suit Suit"],
      totalAwards: "10+",
      image: "35.jpg"
    },
    {
      name: "Pawan Kalyan",
      tenure: "1996 – Present",
      famousSongs: ["Ye Mera Jaha", "Kodakaa Koteswar Rao"],
      totalAwards: "10+ (Filmfare South and SIIMA Awards)",
      image: "36.webp"
    },
    {
      name: "Sonu Nigam",
      tenure: "1990 – Present",
      famousSongs: ["Abhi Mujh Mein Kahin", "Kal Ho Na Ho"],
      totalAwards: "70+ (Filmfare and National Awards)",
      image: "37.jpg"
    },
    {
      name: "Mohit Chauhan",
      tenure: "1998 – Present",
      famousSongs: ["Tum Se Hi", "Masakali"],
      totalAwards: "30+ (Filmfare and National Awards)",
      image: "38.webp"
    },
    {
      name: "Jubin Nautiyal",
      tenure: "2011 – Present",
      famousSongs: ["Raataan Lambiyan", "Lut Gaye"],
      totalAwards: "20+ (Filmfare and IIFA Awards)",
      image: "39.jpg"
    },
    {
      name: "Vishal Mishra",
      tenure: "2015 – Present",
      famousSongs: ["Kaise Hua", "Phir Bhi Tumko Chaahunga"],
      totalAwards: "15+",
      image: "40.jpg"
    },
    {
      name: "Anirudh Ravichander",
      tenure: "2011 – Present",
      famousSongs: ["Why This Kolaveri Di", "Arabic Kuthu"],
      totalAwards: "20+ (Filmfare South and SIIMA Awards)",
      image: "36A.jpg"
    },
    {
      name: "Benny Dayal",
      tenure: "2007 – Present",
      famousSongs: ["Badtameez Dil", "Omana Penne"],
      totalAwards: "15+ (Filmfare and Vijay Awards)",
      image: "38B.jpg"
    }
  ];


  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobileno: "",
    query: "",
    role: "Artist",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleRoleChange = (e) => {
    setFormData({ ...formData, role: e.target.value });
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
      case "firstname":
      case "lastname":
        if (!value.trim()) {
          newErrors[name] = "This field is required.";
        } else if (!/^[A-Za-z]+$/.test(value)) {
          newErrors[name] = "Only letters are allowed.";
        } else {
          delete newErrors[name];
        }
        break;
      case "email":
        if (!value.trim()) {
          newErrors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = "Enter a valid email address.";
        } else {
          delete newErrors.email;
        }
        break;
      case "mobileno":
        if (!value.trim()) {
          newErrors.mobileno = "Mobile Number is required.";
        } else if (!/^\d{10}$/.test(value)) {
          newErrors.mobileno = "Mobile Number must be 10 digits.";
        } else {
          delete newErrors.mobileno;
        }
        break;
      case "query":
        if (!value.trim()) {
          newErrors.query = "Query is required.";
        } else if (value.length < 10) {
          newErrors.query = "Query must be at least 10 characters long.";
        } else {
          delete newErrors.query;
        }
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const [status, setStatus] = useState(""); // "success" or "error"

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0 || isSubmitting) return;

    setIsSubmitting(true);
    setMessage("");
    setStatus(""); // reset status

    try {
      const response = await fetch("http://localhost:8185/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setMessage("Your query has been submitted successfully.");
        setFormData({ firstname: "", lastname: "", email: "", mobileno: "", query: "", role: "Artist" });
        setErrors({});
      } else {
        setStatus("error");
        setMessage("Error submitting the form. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Error connecting to the server.");
    }
    setIsSubmitting(false);
  };



  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 w-full flex justify-between items-center px-12 py-4 bg-gray-600 bg-opacity-20 backdrop-blur-md shadow-md text-white z-50">
        <div className="flex items-center">
          <img src="/RM_Latest1.png" alt="Royal Mint Logo" className="w-20" onClick={() => navigate("/home")} />
        </div>
        <ul className="flex space-x-6 font-semibold">
          <li>
            <Link
              to="about"
              smooth={true}
              duration={500}
              offset={-70}
              className="hover:text-orange-400 transition cursor-pointer"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="services"
              smooth={true}
              duration={500}
              offset={-70}
              className="hover:text-orange-400 transition cursor-pointer"
            >
              Services
            </Link>
          </li>
          <li>
            <a href="/login" className="hover:text-orange-400 transition">
              Login
            </a>
          </li>
          <li>
            <Link
              to="contact"
              smooth={true}
              duration={500}
              offset={-70}
              className="hover:text-orange-400 transition cursor-pointer"
            >
              Contact
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main Content Wrapper with Top Padding */}
      <div className="pt-20">
        {/* Hero Section */}
        <section id="hero" className="relative w-full h-screen flex justify-center items-center">
          <video
            className="absolute w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="homevid1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <h1 className="relative text-gray-300 text-[140px] font-bold text-center leading-tight transition-all duration-300 hover:text-transparent hover:stroke-effect">
            {/* Add hero text if needed */}
          </h1>
        </section>

        {/* Our Features Section */}
        <section id="features" className="min-h-screen flex items-center bg-gray-100 py-6 -mt-16">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold text-[#001F3F]">OUR FEATURES</h2>
            <p className="text-[#001F3F] max-w-md mx-auto my-4">
              Experience the best-in-class services designed to enhance your musical journey.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-10 mt-8">
              {featureList.map((feature, index) => (
                <div
                  key={index}
                  className="group bg-white p-6 rounded-lg shadow-lg text-center transform transition duration-500 hover:scale-105 hover:shadow-xl"
                >
                  <div className="text-5xl text-[#001F3F] mb-4 group-hover:rotate-12 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-xl text-[#001F3F] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-[#001F3F] text-sm mt-2 transition-colors">
                    {feature.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="min-h-screen flex items-center bg-gray-100 py-6 -mt-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center">
              {/* Image Section with AOS Fade-In */}
              <div className="w-full lg:w-1/2 flex justify-center" data-aos="fade-left">
                <img src="/about.png" alt="About Royal Mint" className="w-full max-w-lg h-auto object-cover" />
              </div>
              {/* About Information */}
              <div className="w-full lg:w-1/2 text-center lg:text-left px-4">
                <h2 className="text-4xl font-bold uppercase text-gray-800 leading-tight" data-aos="fade-up">
                  ABOUT <span className="text-[#001F3F]">ROYAL MINT</span>
                </h2>
                <p className="text-lg text-gray-600 mt-6 leading-relaxed" data-aos="fade-up">
                  Royal Mint is a pioneering platform designed to revolutionize the way artists, composers, and rights holders receive their earnings. Our automated royalty management system ensures transparent, accurate, and seamless royalty calculations, payments, and tracking.
                </p>
                <p className="text-lg text-gray-600 mt-4 leading-relaxed" data-aos="fade-up">
                  We empower creators with real-time earnings dashboards, global payment standardization, and contract management tools to ensure they get paid fairly and on time.
                </p>
                <p className="text-lg text-gray-600 mt-4 leading-relaxed" data-aos="fade-up">
                  At Royal Mint, our mission is to simplify financial management for artists, providing them with the tools to focus on what they do best—creating music that moves the world.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Services Section */}
        <section id="services" className="min-h-screen flex flex-col items-center justify-center bg-[#001F3F] text-white py-16">
          <h2 className="text-3xl font-bold">OUR SERVICES</h2>
          <p className="w-full text-center my-4 whitespace-nowrap overflow-hidden text-ellipsis">
            Discover the best services tailored for your royalty management needs.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 px-10 mt-8">
            {[
              {
                img: "S1.png",
                title: "Royalty Calculation & Processing",
                desc: "Accurately compute royalties with automated reporting."
              },
              {
                img: "S2.png",
                title: "Contract & Rights Management",
                desc: "Streamline contract handling and intellectual property rights."
              },
              {
                img: "S3.png",
                title: "Revenue Tracking & Distribution",
                desc: "Monitor earnings and distribute payments efficiently."
              },
              {
                img: "S4.png",
                title: "Digital Asset Licensing",
                desc: "Manage licensing for music, books, films, and more."
              },
              {
                img: "S5.png",
                title: "Audit & Compliance Services",
                desc: "Ensure transparency with audit-ready financial reports."
              },
              {
                img: "S6.png",
                title: "Global Payment Solutions",
                desc: "Seamless royalty payments across multiple currencies."
              }
            ].map((service, index) => (
              <div key={index} className="bg-white text-black p-6 rounded-lg shadow-md text-center">
                <img src={service.img} alt={service.title} className="w-12 mx-auto mb-3" />
                <h3 className="font-bold text-lg">{service.title}</h3>
                <p className="text-sm">{service.desc}</p>
              </div>
            ))}
          </div>
        </section>



        {/* Gallery Section */}
        <section id="gallery" className="min-h-screen flex flex-col items-center justify-center bg-[#001F3F] text-white py-16">
          <h2 className="text-4xl font-bold mb-6">GALLERY</h2>
          <p className="max-w-lg text-center mb-12 text-lg">Explore our vibrant music community.</p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-10 w-full">
            {artists.map((artist, index) => (
              <div key={index} className="flip-card w-full h-80 border-4 border-white shadow-lg rounded-lg">

                {/* Flip Container */}
                <div className="flip-card-inner relative w-full h-full transition-transform duration-500 ease-in-out transform hover:rotate-y-180">

                  {/* Front Side */}
                  <div className="flip-card-front absolute w-full h-full rounded-lg overflow-hidden">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => e.target.src = "/fallback.jpg"} // Show fallback if image is missing
                    />
                  </div>

                  {/* Back Side */}
                  <div className="flip-card-back absolute w-full h-full flex flex-col justify-center items-center bg-gray-800 text-center p-6 rounded-lg transform rotate-y-180">
                    <h3 className="text-2xl font-extrabold text-white">{artist.name}</h3>
                    <p className="text-lg text-gray-300 mt-2 font-semibold">{artist.tenure}</p>
                    <p className="text-lg font-semibold text-gray-200 mt-3">
                      🎵 <span className="text-orange-400">Songs:</span> {artist.famousSongs.join(", ")}
                    </p>
                    <p className="text-lg font-semibold text-gray-200 mt-2">
                      🏆 <span className="text-green-400">Awards:</span> {artist.totalAwards}
                    </p>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </section>



        {/* Contact Section */}
        <section id="contact" className="min-h-screen flex flex-wrap items-center justify-center bg-white text-[#001F3F] py-16">
          <div className="w-full md:w-1/2 px-6">
            <img src="c1.png" alt="Contact" className="rounded-lg shadow-md" />
          </div>

          <div className="w-full md:w-1/2 px-6 mt-6 md:mt-0">
            <h2 className="text-3xl font-bold text-center md:text-left md:ml-20">Get In Touch</h2>
            <form onSubmit={handleSubmit} className="mt-6 max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="w-full">
                  <input
                    type="text"
                    name="firstname"
                    placeholder="First Name"
                    value={formData.firstname}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md bg-gray-100 text-black border border-gray-300 focus:ring-2 focus:ring-orange-400"
                    required
                  />
                  {errors.firstname && <p className="text-red-500 text-sm mt-1">{errors.firstname}</p>}
                </div>

                {/* Last Name */}
                <div className="w-full">
                  <input
                    type="text"
                    name="lastname"
                    placeholder="Last Name"
                    value={formData.lastname}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md bg-gray-100 text-black border border-gray-300 focus:ring-2 focus:ring-orange-400"
                    required
                  />
                  {errors.lastname && <p className="text-red-500 text-sm mt-1">{errors.lastname}</p>}
                </div>
              </div>

              {/* Email */}
              <div className="w-full mt-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md bg-gray-100 text-black border border-gray-300 focus:ring-2 focus:ring-orange-400"
                  required
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Mobile Number */}
              <div className="w-full mt-4">
                <input
                  type="tel"
                  name="mobileno"
                  placeholder="Mobile Number"
                  value={formData.mobileno}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md bg-gray-100 text-black border border-gray-300 focus:ring-2 focus:ring-orange-400"
                  required
                />
                {errors.mobileno && <p className="text-red-500 text-sm mt-1">{errors.mobileno}</p>}
              </div>

              <div className="w-full mt-4">
                <label className="text-lg font-semibold">Role:</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center"><input type="radio" name="role" value="Artist" checked={formData.role === "Artist"} onChange={handleRoleChange} className="mr-2" /> Artist</label>
                  <label className="flex items-center"><input type="radio" name="role" value="Manager" checked={formData.role === "Manager"} onChange={handleRoleChange} className="mr-2" /> Manager</label>
                </div>
              </div>

              {/* Query */}
              <div className="w-full mt-4">
                <textarea
                  name="query"
                  placeholder="Your Queries"
                  value={formData.query}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md bg-gray-100 text-black border border-gray-300 focus:ring-2 focus:ring-orange-400"
                  required
                ></textarea>
                {errors.query && <p className="text-red-500 text-sm mt-1">{errors.query}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 mt-4 rounded-md font-bold transition duration-300"
              >
                {isSubmitting ? "Submitting..." : "Send Message"}
              </button>
            </form>
            {message && (
              <p className={`text-center mt-4 ${status === "error" ? "text-red-500" : "text-green-500"}`}>
                {message}
              </p>
            )}
          </div>
        </section>



        {/* Footer Section */}
        <section
          id="footer"
          className="min-h-[60vh] flex flex-col justify-between py-32 -mt-16 relative text-white"
          style={{
            backgroundImage: "url('/footer1.png')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">

            {/* Left Side - Contact Info & Address (Adjusted Text Size) */}
            <div className="text-center md:text-left mt-32">
              <div className="flex items-center space-x-3 justify-center md:justify-start">
                <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full">
                  <span className="text-purple-700 text-lg">📞</span>
                </div>
                <div>
                  <p className="text-gray-300 text-base md:text-lg font-medium">Phone</p>
                  <p className="font-bold text-white-400 text-lg md:text-xl">9740659298</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-5 justify-center md:justify-start">
                <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full">
                  <span className="text-purple-700 text-lg">📧</span>
                </div>
                <div>
                  <p className="text-gray-300 text-base md:text-lg font-medium">Email</p>
                  <p className="font-bold text-white-400 text-lg md:text-xl">royalmint@gmail.com</p>
                </div>
              </div>

              {/* Address - Adjusted Size */}
              <div className="mt-10 text-center md:text-left">
                <h2 className="text-lg md:text-xl font-semibold">Address</h2>
                <p className="text-gray-300 text-base md:text-lg max-w-xs mx-auto md:mx-0 leading-relaxed">
                  Dr.M.H, Marigowda Rd, Dairy Colony, Adugodi, Bengaluru, Karnataka 560029
                </p>
              </div>
            </div>


            {/* Right Side - Larger Logo (Now on Right) */}
            <div className="text-center md:text-right mb-6 md:mb-0 mt-40">
              <img src="/RM_Latest1.png" alt="Royal Mint Logo" className="w-48 h-auto" />
            </div>
          </div>

          {/* Copyright Section - Center Bottom */}
          <div className="absolute bottom-2 w-full text-center text-sm text-gray-300">
            © Copyright 2025 ROYALMINT. All rights reserved.
          </div>
        </section>




      </div>

      {/* Flip-Card CSS */}
      <style>{`
        .flip-card {
          perspective: 1000px;
        }
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        .flip-card:hover .flip-card-inner {
          transform: rotateY(180deg);
        }
        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
        }
        .flip-card-back {
          transform: rotateY(180deg);
        }
      `}</style>
    </>
  );
};

export default Home;
