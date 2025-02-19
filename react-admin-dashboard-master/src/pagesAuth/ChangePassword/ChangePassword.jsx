import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
    const [data, setData] = useState({
        username: "",
        otp: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [otpSent, setOtpSent] = useState(false);
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
        try {
            await axios.post("http://localhost:8080/user/forgotPassword", {
                username: data.username,
            });
            setOtpSent(true);
            alert("OTP sent to your registered email.");
        } catch (error) {
            console.error("Error sending OTP:", error.response ? error.response.data : error.message);
            alert("Failed to send OTP.");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (data.newPassword !== data.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await axios.put("http://localhost:8080/user/updatePassword", {
                username: data.username,
                otp: data.otp,
                newPassword: data.newPassword,
            });

            if (response.status === 200) {
                alert("Password changed successfully!");
                localStorage.removeItem("changePasswordUser");
                navigate("/login");
            }
        } catch (error) {
            console.error("Error updating password:", error);
            alert("Failed to update password. " + (error.response ? error.response.data : ""));
        }
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Change Password</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={data.username}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-black"
                        />
                    </div>

                    {!otpSent ? (
                        <button
                            type="button"
                            onClick={requestOtp}
                            className="w-full px-4 py-2 text-black bg-green-600 hover:bg-green-700 rounded-md transition-colors duration-200"
                        >
                            Send OTP
                        </button>
                    ) : (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">OTP</label>
                                <input
                                    type="text"
                                    name="otp"
                                    value={data.otp}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={data.newPassword}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={data.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 text-black rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors duration-200"
                            >
                                Change Password
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;