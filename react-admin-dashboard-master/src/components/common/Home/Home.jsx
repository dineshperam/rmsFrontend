import { FaChartLine, FaMoneyBillWave, FaFileContract } from "react-icons/fa";
import { FaGlobe } from "react-icons/fa";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-scroll";

const Home = () => {

  const featureList = [
    { title: "Automated Payment Processing", icon: <FaMoneyBillWave />, text: "Seamless and secure automated royalty payments to artists and rights holders." },
    { title: "Real-Time Earnings Dashboard", icon: <FaChartLine />, text: "Track your earnings with real-time data visualization and insights." },
    { title: "Transparent Revenue Tracking", icon: <FaFileContract />, text: "Full visibility into revenue streams, ensuring accountability and trust." },
    { title: "Global Royalty Standardization", icon: <FaGlobe />, text: "Unified royalty calculations and payments across multiple regions." }
  ];

  const artists = [
    { name: "A. R. Rahman", tenure: "1992 – Present", famousSongs: ["Jai Ho (2008)", "Kun Faya Kun (2011)"], totalAwards: "150+ (Academy Awards, Grammy Awards, National Film Awards, Filmfare Awards)", image: "50AR.jpg" },
    { name: "Arijit Singh", tenure: "2005 – Present", famousSongs: ["Kesariya (2022)", "Jhoome Jo Pathaan (2023)"], totalAwards: "100+", image: "33.jpg" },
    { name: "Shreya Ghoshal", tenure: "1998 – Present", famousSongs: ["Teri Meri", "Sun Raha Hai Na Tu"], totalAwards: "100+", image: "31S.jpg" },
    { name: "Yo Yo Honey Singh", tenure: "2005 – Present", famousSongs: ["Blue Eyes", "Lungi Dance"], totalAwards: "20+", image: "34.jpg" },
    { name: "Guru Randhawa", tenure: "2013 – Present", famousSongs: ["Lahore", "Suit Suit"], totalAwards: "10+", image: "35.jpg" },
    { name: "Pawan Kalyan", tenure: "1996 – Present", famousSongs: ["Ye Mera Jaha", "Kodakaa Koteswar Rao"], totalAwards: "10+ (Filmfare South and SIIMA Awards)", image: "36.webp" },
    { name: "Sonu Nigam", tenure: "1990 – Present", famousSongs: ["Abhi Mujh Mein Kahin", "Kal Ho Na Ho"], totalAwards: "70+ (Filmfare and National Awards)", image: "37.jpg" },
    { name: "Mohit Chauhan", tenure: "1998 – Present", famousSongs: ["Tum Se Hi", "Masakali"], totalAwards: "30+ (Filmfare and National Awards)", image: "38.webp" },
    { name: "Jubin Nautiyal", tenure: "2011 – Present", famousSongs: ["Raataan Lambiyan", "Lut Gaye"], totalAwards: "20+ (Filmfare and IIFA Awards)", image: "39.jpg" },
    { name: "Vishal Mishra", tenure: "2015 – Present", famousSongs: ["Kaise Hua", "Phir Bhi Tumko Chaahunga"], totalAwards: "15+", image: "40.jpg" },
    { name: "Anirudh Ravichander", tenure: "2011 – Present", famousSongs: ["Why This Kolaveri Di", "Arabic Kuthu"], totalAwards: "20+ (Filmfare South and SIIMA Awards)", image: "36A.jpg" },
    { name: "Benny Dayal", tenure: "2007 – Present", famousSongs: ["Badtameez Dil", "Omana Penne"], totalAwards: "15+ (Filmfare and Vijay Awards)", image: "38B.jpg" }
  ];

  useEffect(() => {
    AOS.init({ duration: 1000, once: true }); // Ensures smooth animation
  }, []);

  return (
    <>  
     {/* <div className="relative min-h-screen">
      {/* Background Image (Fixed) 
      <div className="fixed top-0 left-0 w-full h-full bg-cover bg-center bg-fixed z-[-1]" style={{ backgroundImage: "url('/background.jpg')" }}></div> */}

   

      {/* Navbar */}
      <nav className="fixed top-0 w-full flex justify-between items-center px-12 py-4 bg-gray-600 bg-opacity-20 backdrop-blur-md shadow-md text-white z-50">
        <div className="flex items-center">
          <img src="/RM_Latest1.png" alt="Royal Mint Logo" className="w-20" />
        </div>
        <ul className="flex space-x-6 font-semibold">
          <li>
            <Link to="services" smooth={true} duration={500} className="hover:text-orange-400 transition cursor-pointer">
              Services
            </Link>
          </li>
          <li>
            <Link to="about" smooth={true} duration={500} className="hover:text-orange-400 transition cursor-pointer">
              About
            </Link>
          </li>
          <li><a href="/login" className="hover:text-orange-400 transition">Login</a></li>
          <li>
            <Link to="contact" smooth={true} duration={500} className="hover:text-orange-400 transition cursor-pointer">
              Contact
            </Link>
          </li>
        </ul>
      </nav>

            {/* Hero Section */}
        <section className="relative w-full h-screen flex justify-center items-center">
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
           
          </h1>
        </section>

      {/* Our Features */}
      <section id="features" className="py-16 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-[#001F3F]">OUR FEATURES</h2>
          <p className="text-[#001F3F] max-w-md mx-auto my-4">
            Experience the best-in-class services designed to enhance your musical journey.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-10 mt-8">
            {featureList.map((feature, index) => (
              <div key={index} className="group bg-white p-6 rounded-lg shadow-lg text-center transform transition duration-500 hover:scale-105 hover:shadow-xl">
                <div className="text-5xl text-[#001F3F] mb-4 group-hover:rotate-12 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-xl text-[#001F3F] group-hover:text-[#001F3F] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-[#001F3F] text-sm mt-2 group-hover:text-[#001F3F] transition-colors">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* About Us */}
      <section id ="about" className="about py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center">
          
          {/* Image Section with Correct Left Fade-in */}
          <div className="w-full lg:w-1/2 flex justify-center" data-aos="fade-left">
            <img src="/about.png" alt="About Royal Mint" className="w-full max-w-lg h-auto object-cover" />
          </div>

          {/* About Us Information */}
          <div className="w-full lg:w-1/2 text-center lg:text-left px-4">
            <h2 className="text-4xl font-bold uppercase text-gray-800 leading-tight" data-aos="fade-up">
              ABOUT <span className="text-[#001F3F]">ROYAL MINT</span>
            </h2>
            <p className="text-lg text-gray-600 mt-6 leading-relaxed" data-aos="fade-up">
              Royal Mint is a pioneering platform designed to revolutionize the way artists, composers, and rights holders 
              receive their earnings. Our automated royalty management system ensures transparent, accurate, and seamless 
              royalty calculations, payments, and tracking.
            </p>
            <p className="text-lg text-gray-600 mt-4 leading-relaxed" data-aos="fade-up">
              We empower creators with real-time earnings dashboards, global payment standardization, and contract management tools 
              to ensure they get paid fairly and on time.
            </p>
            <p className="text-lg text-gray-600 mt-4 leading-relaxed" data-aos="fade-up">
              At Royal Mint, our mission is to simplify financial management for artists, providing them with the tools to focus on 
              what they do best—creating music that moves the world.
            </p>
          </div>

        </div>
      </div>
    </section>



      {/* Our Services */}
      <section id="services" className="text-center py-16 bg-[#001F3F] text-white">
  <h2 className="text-3xl font-bold">OUR SERVICES</h2>
  <p className="max-w-md mx-auto my-4">
    Discover the best services tailored for your royalty management needs.
  </p>
  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 px-10 mt-8">
    {[
      { img: "S1.png", title: "Royalty Calculation & Processing", desc: "Accurately compute royalties with automated reporting." },
      { img: "S2.png", title: "Contract & Rights Management", desc: "Streamline contract handling and intellectual property rights." },
      { img: "S3.png", title: "Revenue Tracking & Distribution", desc: "Monitor earnings and distribute payments efficiently." },
      { img: "S4.png", title: "Digital Asset Licensing", desc: "Manage licensing for music, books, films, and more." },
      { img: "S5.png", title: "Audit & Compliance Services", desc: "Ensure transparency with audit-ready financial reports." },
      { img: "S6.png", title: "Global Payment Solutions", desc: "Seamless royalty payments across multiple currencies." }
    ].map((service, index) => (
      <div key={index} className="bg-white text-black p-6 rounded-lg shadow-md text-center">
        <img src={service.img} alt={service.title} className="w-12 mx-auto mb-3" />
        <h3 className="font-bold text-lg">{service.title}</h3>
        <p className="text-sm">{service.desc}</p>
      </div>
    ))}
  </div>
</section>



      {/* Gallery */}
      <section className="text-center py-16 bg-[#001F3F] text-white">
  <h2 className="text-3xl font-bold">GALLERY</h2>
  <p className="text-white-600 max-w-md mx-auto my-4">Explore our vibrant music community.</p>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-10">
    {artists.map((artist, index) => (
      <div key={index} className="flip-card">
        {/* Flip Container */}
        <div className="flip-card-inner">
          
          {/* Front Side */}
          <div className="flip-card-front">
            <img 
              src={artist.image} 
              alt={artist.name} 
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Back Side */}
          <div className="flip-card-back">
            <h3 className="text-lg font-bold">{artist.name}</h3>
            <p className="text-sm">{artist.tenure}</p>
            <p className="text-xs text-gray-300">Famous Songs: {artist.famousSongs.join(", ")}</p>
            <p className="text-xs text-gray-300">Awards: {artist.totalAwards}</p>
          </div>
          
        </div>
      </div>
    ))}
  </div>
</section>


        {/* Contact Section */}
    <section id="contact" className="flex flex-wrap justify-center py-16 bg-white-800 text-[#001F3F]">
      <div className="w-full md:w-1/2 px-6">
        <img src="c1.png" alt="Contact" className="rounded-lg shadow-md" />
      </div>
      <div className="w-full md:w-1/2 px-6 mt-6 md:mt-0">
        <h2 className="text-3xl font-bold">Get In Touch</h2>
        <form className="mt-6 max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <input
          type="text"
          placeholder="First Name"
          className="w-full p-3 rounded-md bg-gray-100 text-black border border-gray-300 focus:ring-2 focus:ring-orange-400"
          required
        />
        {/* Last Name */}
        <input
          type="text"
          placeholder="Last Name"
          className="w-full p-3 rounded-md bg-gray-100 text-black border border-gray-300 focus:ring-2 focus:ring-orange-400"
          required
        />
      </div>

      {/* Email */}
      <input
        type="email"
        placeholder="Email"
        className="w-full p-3 mt-4 rounded-md bg-gray-100 text-black border border-gray-300 focus:ring-2 focus:ring-orange-400"
        required
      />

      {/* Mobile Number */}
      <input
        type="tel"
        placeholder="Mobile Number"
        className="w-full p-3 mt-4 rounded-md bg-gray-100 text-black border border-gray-300 focus:ring-2 focus:ring-orange-400"
        required
      />

      {/* Queries */}
      <textarea
        placeholder="Your Queries"
        rows="4"
        className="w-full p-3 mt-4 rounded-md bg-gray-100 text-black border border-gray-300 focus:ring-2 focus:ring-orange-400"
        required
      ></textarea>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 mt-4 rounded-md font-bold transition duration-300"
      >
        Send Message
      </button>
    </form>
      </div>
    </section>

        {/* footer */}
    <section className="bg-white-900 text-white py-28 mt-16 relative" style={{ backgroundImage: "url('/footer1.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        
        {/* Contact Section */}
        <div className="text-center md:text-left mb-6 md:mb-0">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full">
              <span className="text-purple-700">📞</span>
            </div>
            <div>
              <p className="text-gray-300">Phone</p>
              <p className="font-bold text-purple-400">9740659298</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 mt-4">
            <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full">
              <span className="text-purple-700">📧</span>
            </div>
            <div>
              <p className="text-gray-300">Email</p>
              <p className="font-bold text-purple-400">royalmint@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="text-center mb-6 md:mb-0">
          <h2 className="text-3xl mt-10 font-bold">Royal Mint</h2>
          <div className="flex space-x-4 mt-4">
            {/* <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full">
              <span className="text-purple-700">f</span>
            </div>
            <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full">
              <span className="text-purple-700">🐦</span>
            </div>
            <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full">
              <span className="text-purple-700">📸</span>
            </div>
            <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full">
              <span className="text-purple-700">⚽</span>
            </div> */}
          </div>
        </div>

        {/* Subscription Section */}
        <div className="text-center md:text-right">
          <h2 className="text-xl font-bold">Stay With Us</h2>
          <div className="flex mt-4">
            <input 
              type="email" 
              placeholder="Email" 
              className="px-4 py-2 rounded-l-md bg-gray-800 text-white focus:outline-none"
            />
            <button className="px-4 py-2 bg-white text-purple-700 rounded-r-md">✈️</button>
          </div>
        </div>
      </div>
    </section>
     
    </>
  );
};

export default Home;
