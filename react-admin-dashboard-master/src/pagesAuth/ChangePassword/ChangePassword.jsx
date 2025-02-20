import { useState, useEffect } from "react";
import { FaLock, FaEye, FaEyeSlash, FaUser, FaKey } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const [data, setData] = useState({
    username: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [otpButtonDisabled, setOtpButtonDisabled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("changePasswordUser");
    if (storedUsername) {
      setData((prevData) => ({ ...prevData, username: storedUsername }));
    }
  }, []);

  const handleChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const requestOtp = async () => {
    setLoadingOtp(true);
    setOtpButtonDisabled(true);
    try {
      await axios.post("http://localhost:8080/user/forgotPassword", {
        username: data.username,
      });
      setOtpSent(true);
      toast.success("OTP sent to your registered email.");
    } catch (error) {
      console.error("Error sending OTP:", error.response ? error.response.data : error.message);
      toast.error("Failed to send OTP.");
      setOtpButtonDisabled(false);
    }
    setLoadingOtp(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (data.newPassword !== data.confirmPassword) {
        toast.error("Passwords do not match!");
      return;
    }
    setLoadingSubmit(true);
    try {
      const response = await axios.put("http://localhost:8080/user/updatePassword", {
        username: data.username,
        otp: data.otp,
        newPassword: data.newPassword,
      });
      if (response.status === 200) {
        toast.success("Password changed successfully!");
        localStorage.removeItem("changePasswordUser");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password. " + (error.response ? error.response.data : ""));
    }
    setLoadingSubmit(false);
  };

  return (
    <div
      className="flex justify-center items-center h-screen w-screen bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('/23.png')" }}
    >
      <div className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-lg p-8 mx-4">
        <h2 className="text-center text-white text-2xl font-semibold mb-4">Change Password</h2>
        <p className="text-white text-sm text-center mb-4">
          {otpSent ? "Enter the OTP sent to your email and your new password." : "Enter your username to receive an OTP."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input */}
          <div className="relative flex items-center border border-white border-opacity-50 rounded-lg overflow-hidden">
            <span className="bg-white bg-opacity-20 px-3 py-2 text-white">
              <FaUser />
            </span>
            <input
              type="text"
              name="username"
              className="w-full bg-transparent border-none text-white placeholder-white placeholder-opacity-70 px-3 py-2 focus:outline-none"
              placeholder="Username"
              value={data.username}
              onChange={handleChange}
              disabled={otpSent}
              required
            />
          </div>

          {!otpSent ? (
            <button
              type="button"
              onClick={requestOtp}
            //   className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition"
              disabled={otpButtonDisabled}
              className={`w-full text-white py-3 px-4 rounded-lg transition-colors duration-200 font-medium text-lg shadow-md flex justify-center
                ${otpButtonDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {loadingOtp ? "Sending..." : "Request OTP"}
            </button>
          ) : (
            <>
              {/* OTP Input */}
              <div className="relative flex items-center border border-white border-opacity-50 rounded-lg overflow-hidden">
                <span className="bg-white bg-opacity-20 px-3 py-2 text-white">
                  <FaKey />
                </span>
                <input
                  type="text"
                  name="otp"
                  className="w-full bg-transparent border-none text-white placeholder-white placeholder-opacity-70 px-3 py-2 focus:outline-none"
                  placeholder="Enter OTP"
                  value={data.otp}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* New Password Input */}
              <div className="relative flex items-center border border-white border-opacity-50 rounded-lg overflow-hidden">
                <span className="bg-white bg-opacity-20 px-3 py-2 text-white">
                  <FaLock />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  className="w-full bg-transparent border-none text-white placeholder-white placeholder-opacity-70 px-3 py-2 focus:outline-none"
                  placeholder="New Password"
                  value={data.newPassword}
                  onChange={handleChange}
                  required
                />
                <span
                  className="absolute right-4 cursor-pointer text-white text-lg"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {/* Confirm Password Input */}
              <div className="relative flex items-center border border-white border-opacity-50 rounded-lg overflow-hidden">
                <span className="bg-white bg-opacity-20 px-3 py-2 text-white">
                  <FaLock />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  className="w-full bg-transparent border-none text-white placeholder-white placeholder-opacity-70 px-3 py-2 focus:outline-none"
                  placeholder="Confirm Password"
                  value={data.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <span
                  className="absolute right-4 cursor-pointer text-white text-lg"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {/* Submit Button */}
              <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition">
              {loadingSubmit ? "Updating..." : "Change Password"}
              </button>
            </>
          )}
        </form>

        {/* Back to Login */}
        <div className="text-center mt-4">
          <button onClick={() => navigate("/login")} className="text-white hover:underline">
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;