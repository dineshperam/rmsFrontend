import { useState } from 'react';
import axios from 'axios';
// import Header from '../common/Header';

const AddUser = () => {
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        mobileNo: '',
        address: '',
        role: '',
        password: '',
        passwordHash: '',
        managerId: 6
    });

    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    const validateField = (name, value) => {
        let error = "";

        if (name === "username" && value.length < 3) {
            error = "Username must be at least 3 characters.";
        }

        if (name === "password") {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(value)) {
                error = "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.";
            }
        }

        if (name === "passwordHash" && value !== user.password) {
            error = "Passwords do not match.";
        }

        if (name === "email") {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(value)) {
                error = "Invalid email format.";
            }
        }

        if (name === "mobileNo") {
            const mobileRegex = /^[0-9]{10}$/;
            if (!mobileRegex.test(value)) {
                error = "Mobile number must be exactly 10 digits.";
            }
        }

        if (name === "role" && !value) {
            error = "Role selection is required.";
        }

        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === "mobileNo") {
            if (!/^\d*$/.test(value)) return; // Allow only numbers
            if (value.length > 10) return; // Restrict to 10 digits
        }

        setUser({ ...user, [name]: value });
        validateField(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const hasErrors = Object.values(errors).some((error) => error !== "");
        if (hasErrors) return;

        try {
            await axios.post("http://localhost:8080/auth/register", user);
            setMessage("User added successfully");
            setUser({
                firstName: '',
                lastName: '',
                email: '',
                username: '',
                mobileNo: '',
                address: '',
                role: '',
                password: '',
                passwordHash: '',
            });
            setErrors({});
        } catch (error) {
            console.error("Error adding user:", error);
            setMessage("Failed to add user. Please try again.");
        }
    };

    const styles = {
        container: { margin: "30px auto", padding: "25px", borderRadius: "10px" },
        message: { textAlign: "center", color: message.includes("successfully") ? "green" : "red" },
        form: { display: "flex", flexDirection: "column", gap: "10px" },
        input: { padding: "10px", border: "1px solid #ddd", borderRadius: "5px", color: "#000" },
        select: { padding: "10px", border: "1px solid #ddd", borderRadius: "5px", backgroundColor: "#fff", color: "#000" },
        button: { padding: "12px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" },
        error: { color: "red", fontSize: "12px" },
        requiredNotice: { fontSize: "14px", fontWeight: "bold", marginTop: "10px" }
    };

    return (
        <div style={styles.container} className="flex-1 overflow-auto relative z-10 min-h-screen">
            {/* <Header title="Add User" /> */}
            <main className="mx-auto py-6 px-4 lg:px-8">
                {message && <p style={styles.message}>{message}</p>}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <label>First Name * </label>
                    <input type="text" name="firstName" value={user.firstName} onChange={handleChange} required style={styles.input} />

                    <label>Last Name * </label>
                    <input type="text" name="lastName" value={user.lastName} onChange={handleChange} required style={styles.input} />

                    <label>Email * </label>
                    <input type="email" name="email" value={user.email} onChange={handleChange} required style={styles.input} />
                    {errors.email && <span style={styles.error}>{errors.email}</span>}

                    <label>Username * </label>
                    <input type="text" name="username" value={user.username} onChange={handleChange} required style={styles.input} />
                    {errors.username && <span style={styles.error}>{errors.username}</span>}

                    <label>Password * </label>
                    <input type="password" name="password" value={user.password} onChange={handleChange} required style={styles.input} />
                    {errors.password && <span style={styles.error}>{errors.password}</span>}

                    <label>Confirm Password * </label>
                    <input type="password" name="passwordHash" value={user.passwordHash} onChange={handleChange} required style={styles.input} />
                    {errors.passwordHash && <span style={styles.error}>{errors.passwordHash}</span>}

                    <label>Mobile Number * </label>
                    <input type="text" name="mobileNo" value={user.mobileNo} onChange={handleChange} required style={styles.input} />
                    {errors.mobileNo && <span style={styles.error}>{errors.mobileNo}</span>}

                    <label>Address</label>
                    <input type="text" name="address" value={user.address} onChange={handleChange} style={styles.input} />

                    <label>Role * </label>
                    <select name="role" value={user.role} onChange={handleChange} required style={styles.select}>
                        <option value="">Select Role</option>
                        <option value="Artist">Artist</option>
                        <option value="Manager">Manager</option>
                        <option value="Admin">Admin</option>
                    </select>
                    <p style={styles.requiredNotice}>* Required fields</p>
                    {errors.role && <span style={styles.error}>{errors.role}</span>}

                    <br />
                    {message && <p style={styles.message}>{message}</p>}
                    <br />
                    
                    <button type="submit" style={styles.button} disabled={Object.values(errors).some(error => error !== "")}>
                        Add User
                    </button>
                    
                    
                </form>
            </main>
        </div>
    );
};

export default AddUser;
