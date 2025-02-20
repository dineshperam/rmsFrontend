import { useState } from "react";
import { Mail, Key, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApiService from "../../service/ApiService";

const ForgotPassword = () => {
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpButtonDisabled, setOtpButtonDisabled] = useState(false);
  const navigate = useNavigate();

  const requestOtp = async () => {
    setLoading(true);
    setOtpButtonDisabled(true);
    const result = await ApiService.requestOtp(username);
    if (result.success) {
      setOtpSent(true);
    } else {
      setOtpButtonDisabled(false);
    }
    setLoading(false);
  };

  const resetPassword = async () => {
    setLoading(true);
    const result = await ApiService.resetPassword(username, otp, newPassword, confirmPassword);
    if (result.success) {
      setTimeout(() => navigate("/login"), 2000);
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!otpSent) {
      requestOtp();
    } else {
      resetPassword();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-cover bg-center px-4"
      style={{ backgroundImage: "url('/23.png')" }}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl"
      >
        <div className="mb-2">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Forgot Password</h2>
          {!otpSent ? (
            <>
              <p className="text-gray-600 text-center mb-8">
                Enter your username and we'll send an OTP to your registered email.
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden focus-within:border-blue-500 transition-colors">
                  <span className="px-4 py-3 text-gray-500 bg-gray-50 border-r border-gray-300">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full py-3 px-4 focus:outline-none text-gray-700"
                    required
                  />
                </div>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={otpButtonDisabled} 
                  className={`w-full text-white py-3 px-4 rounded-lg transition-colors duration-200 font-medium text-lg shadow-md flex justify-center
                  ${otpButtonDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                >
                  {loading ? <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div> : "Send OTP"}
                </motion.button>
              </form>
            </>
          ) : (
            <>
              <p className="text-gray-600 text-center mb-8">
                Enter the OTP sent to your email and your new password.
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden focus-within:border-blue-500 transition-colors mb-4">
                  <span className="px-4 py-3 text-gray-500 bg-gray-50 border-r border-gray-300">
                    <Key className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full py-3 px-4 focus:outline-none text-gray-700"
                    required
                  />
                </div>
                <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden focus-within:border-blue-500 transition-colors">
                  <span className="px-4 py-3 text-gray-500 bg-gray-50 border-r border-gray-300">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full py-3 px-4 focus:outline-none text-gray-700"
                    required
                  />
                </div>
                <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden focus-within:border-blue-500 transition-colors">
                  <span className="px-4 py-3 text-gray-500 bg-gray-50 border-r border-gray-300">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full py-3 px-4 focus:outline-none text-gray-700"
                    required
                  />
                </div>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  type="submit" 
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-lg shadow-md"
                >
                  Reset Password
                </motion.button>
              </form>
            </>
          )}
          <div className="text-center mt-6">
            <a href="/login" className="text-blue-600 hover:text-blue-800 transition-colors">
              Return to Login
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;