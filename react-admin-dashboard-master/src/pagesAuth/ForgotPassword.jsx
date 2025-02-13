import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const styles = {
    container: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f4f4",
        zIndex: 1000,
    },
    card: {
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
        textAlign: "center",
        minWidth: "300px",
    },
    input: {
        width: "100%",
        padding: "10px",
        margin: "10px 0",
        border: "1px solid #ddd",
        borderRadius: "5px",
        color: "#000",
    },
    button: {
        width: "100%",
        padding: "12px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
    },
    errorMessage: {
        color: "red",
        marginTop: "10px",
    },
};

const ForgotPassword = () => {
    const [username, setUsername] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [otpSent, setOtpSent] = useState(false);

    const navigate = useNavigate();

    const requestOtp = async () => {
        if (!username.trim()) {
            toast.error("Please enter your username.", { position: "top-right", autoClose: 2000 });
            return;
        }
        try {
            await axios.post("http://localhost:8080/user/forgotPassword", { username });
            setOtpSent(true);
            toast.success("OTP sent to your email!", { position: "top-right", autoClose: 2000 });
        } catch (error) {
            console.error("Error sending OTP:", error.response ? error.response.data : error.message);
            toast.error("Failed to send OTP. Please try again.", { position: "top-right", autoClose: 3000 });
        }
    };

    const resetPassword = async () => {
        if (!otp.trim()) {
            toast.error("Please enter the OTP.", { position: "top-right", autoClose: 2000 });
            return;
        }
        if (!newPassword.trim()) {
            toast.error("Please enter a new password.", { position: "top-right", autoClose: 2000 });
            return;
        }
        try {
            const response = await axios.put("http://localhost:8080/user/updatePassword", {
                username,
                otp,
                newPassword
            });
            toast.success(response.data, { position: "top-right", autoClose: 2000 });
            setTimeout(() => navigate("/login"), 2500);
        } catch (error) {
            console.error("Error resetting password:", error.response ? error.response.data : error.message);
            toast.error("Failed to reset password. " + (error.response ? error.response.data : ""), {
                position: "top-right",
                autoClose: 3000
            });
        }
    };

    return (
        <div style={styles.container}>
            <ToastContainer />
            <div style={styles.card}>
                <h2>Forgot Password</h2>
                <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder="Username" 
                    style={styles.input}
                />
                {!otpSent && <button style={styles.button} onClick={requestOtp}>Send OTP</button>}
                {otpSent && (
                    <>
                        <input 
                            type="text" 
                            value={otp} 
                            onChange={(e) => setOtp(e.target.value)} 
                            placeholder="Enter OTP" 
                            style={styles.input}
                        />
                        <input 
                            type="password" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                            placeholder="New Password" 
                            style={styles.input}
                        />
                        <button style={styles.button} onClick={resetPassword}>Reset Password</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
