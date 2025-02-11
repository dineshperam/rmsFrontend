import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../service/ApiService";

const LoginPage = () => {
  const navigate = useNavigate();

  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    setLoginDetails({
      ...loginDetails,
      [event.target.name]: event.target.value,
    });
  };

  const handleForgotPassword = () => {
    navigate("/forgotPassword", {
      state: { email: loginDetails.email },
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await ApiService.loginUser(loginDetails);
      console.log(res);

      if (res.status === 200 && res.active === true) {
        ApiService.saveToken(res.token);
        ApiService.saveRole(res.role);
        setMessage(res.message);

        if (res.firstLogin === 1) {
          navigate("/changePassword");
        } else {
          if (ApiService.isArtist()) {
            navigate("/artistDashboard");
          } else if (ApiService.isManager()) {
            navigate("/managerDashboard");
          } else if (ApiService.isAdmin()) {
            navigate("/adminDashboard");
          }
        }
      } else {
        showMessage("Invalid credentials or inactive account.");
      }
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error Logging in a User: " + error
      );
      console.log(error);
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

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

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={loginDetails.email}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={loginDetails.password}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <button onClick={handleLogin} style={styles.button}>Login</button>
        <br />
        {message && <p style={styles.errorMessage}>{message}</p>}
        <p
          onClick={handleForgotPassword}
          style={{
            color: "blue",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          <br />
          Forgot Password?
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
