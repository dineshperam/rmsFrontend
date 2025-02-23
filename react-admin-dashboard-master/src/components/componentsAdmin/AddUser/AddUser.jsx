import { useState } from 'react';
import ApiService from '../../../service/ApiService';
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
        managerId: 0
    });

    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [loadingSubmit, setLoadingSubmit] = useState(false);

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
        setLoadingSubmit(true);
        const response = await ApiService.addUser(user);
        setMessage(response.message);

        if (response.success) {
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
                managerId: 0
            });
            setErrors({});
        }
        setLoadingSubmit(false);
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
                <form onSubmit={handleSubmit} style={styles.form}>
                    <label htmlFor="firstName">First Name *</label>
                    <input
                        id="firstName"
                        type="text"
                        name="firstName"
                        value={user.firstName}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />

                    <label htmlFor="lastName">Last Name *</label>
                    <input
                        id="lastName"
                        type="text"
                        name="lastName"
                        value={user.lastName}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />

                    <label htmlFor="email">Email *</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                    {errors.email && <span style={styles.error}>{errors.email}</span>}

                    <label htmlFor="username">Username *</label>
                    <input
                        id="username"
                        type="text"
                        name="username"
                        value={user.username}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                    {errors.username && <span style={styles.error}>{errors.username}</span>}

                    <label htmlFor="password">Password *</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                    {errors.password && <span style={styles.error}>{errors.password}</span>}

                    <label htmlFor="passwordHash">Confirm Password *</label>
                    <input
                        id="passwordHash"
                        type="password"
                        name="passwordHash"
                        value={user.passwordHash}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                    {errors.passwordHash && <span style={styles.error}>{errors.passwordHash}</span>}

                    <label htmlFor="mobileNo">Mobile Number *</label>
                    <input
                        id="mobileNo"
                        type="text"
                        name="mobileNo"
                        value={user.mobileNo}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                    {errors.mobileNo && <span style={styles.error}>{errors.mobileNo}</span>}

                    <label htmlFor="address">Address</label>
                    <input
                        id="address"
                        type="text"
                        name="address"
                        value={user.address}
                        onChange={handleChange}
                        style={styles.input}
                    />

                    <label htmlFor="role">Role *</label>
                    <select
                        id="role"
                        name="role"
                        value={user.role}
                        onChange={handleChange}
                        required
                        style={styles.select}
                    >
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

                    <button type="submit" style={styles.button} disabled={loadingSubmit || Object.values(errors).some(error => error !== "")}>
                        {loadingSubmit ? "Adding..." : "Add User"}
                    </button>

                </form>
            </main>
        </div>
    );
};

export default AddUser;
