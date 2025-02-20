import { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  
  const handleChange = (event) => {
    const { name, value } = event.target;
    setLoginDetails({ ...loginDetails, [name]: value });
    validateField(name, value);
  };
  
  const handleForgotPassword = () => {
    navigate("/forgot-password", {
      state: { email: loginDetails.email },
    });
  };
  
  const validateField = (name, value) => {
    let error = "";
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        error = "Email is required";
      } else if (!emailRegex.test(value)) {
        error = "Invalid email format";
      }
    }
    if (name === "password") {
      if (!value) {
        error = "Password is required";
      } else if (value.length < 6) {
        error = "Password must be at least 6 characters";
      }
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    
    const formErrors = {};
    Object.keys(loginDetails).forEach((key) => {
      validateField(key, loginDetails[key]);
      if (!loginDetails[key]) {
        formErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      }
    });
    if (Object.values(formErrors).some((error) => error)) {
      setErrors(formErrors);
      return;
    }
    
    try {
      const res = await ApiService.loginUser(loginDetails);
      
      if (res.status === 200) {
        if (!res.active) {
          showMessage("Account is inactive. Please contact support.");
          return;
        }
        
        ApiService.saveAuthData(res);
        setMessage(res.message);
        if (res.firstLogin) {
          navigate("/change-password");
        } else {
          redirectToDashboard(res.role);
        }
      } else {
        showMessage("Invalid credentials or inactive account.");
      }
    } catch (error) {
      showMessage(error.response?.data?.message || "Error logging in: " + error);
      console.log(error);
    }
  };
  
  const redirectToDashboard = (role) => {
    switch (role) {
      case "Artist":
        navigate("/artist-dashboard");
        break;
      case "Manager":
        navigate("/manager-dashboard");
        break;
      case "Admin":
        navigate("/admin-dashboard");
        break;
      default:
        showMessage("Unauthorized role. Contact support.");
    }
  };
  
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  return (
    <div
      className="flex justify-center items-center h-screen w-screen bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('/23.png')" }}
    >
      <div className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-lg p-8 mx-4">
        <h2 className="text-center text-white text-3xl font-semibold mb-6">Login</h2>

        {message && (
          <div className="mb-4 p-3 bg-red-500 bg-opacity-70 text-white rounded-lg text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleLogin}>
          {/* Email Input */}
          <div className="mb-5 flex flex-col">
            <div className="flex items-center border border-white border-opacity-50 rounded-lg overflow-hidden">
              <span className="bg-white bg-opacity-20 px-4 py-3 text-white">
                <FaEnvelope />
              </span>
              <input
                type="email"
                name="email"
                value={loginDetails.email}
                onChange={handleChange}
                className="w-full bg-transparent border-none text-white placeholder-white placeholder-opacity-70 px-4 py-3 focus:outline-none"
                placeholder="Email"
              />
            </div>
            {errors.email && (
              <span className="text-red-300 text-sm mt-1 pl-2">{errors.email}</span>
            )}
          </div>

          {/* Password Input with Eye Button */}
          <div className="mb-5 flex flex-col">
            <div className="relative flex items-center border border-white border-opacity-50 rounded-lg overflow-hidden">
              <span className="bg-white bg-opacity-20 px-4 py-3 text-white">
                <FaLock />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={loginDetails.password}
                onChange={handleChange}
                className="w-full bg-transparent border-none text-white placeholder-white placeholder-opacity-70 px-4 py-3 focus:outline-none"
                placeholder="Password"
              />
              <span
                className="absolute right-4 cursor-pointer text-white text-lg"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password && (
              <span className="text-red-300 text-sm mt-1 pl-2">{errors.password}</span>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-end text-white text-sm mb-5">
            <button 
              type="button" 
              onClick={handleForgotPassword} 
              className="hover:underline text-white bg-transparent border-none cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          {/* Login Button */}
          <button 
            type="submit" 
            className="w-full bg-pink-500 hover:bg-orange-400 text-white py-3 rounded-lg transition duration-300 font-medium text-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;