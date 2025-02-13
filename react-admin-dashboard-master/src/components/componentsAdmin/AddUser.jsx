import { useState } from 'react';
import axios from 'axios';

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


    const handleChange = (event) => {
        setUser({
            ...user,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newUser = { ...user };
            await axios.post("http://localhost:8080/auth/register", newUser);
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
        } catch (error) {
            console.error("Error adding user:", error);
            setMessage("Failed to add user. Please try again.");
        }

    };

    const styles = {
        container: {
            margin: "30px auto",
            padding: "25px",
            borderRadius: "10px",
        },
        message: {
            textAlign: "center",
            color: message.includes("successfully") ? "green" : "red",
        },
        form: {
            display: "flex",
            flexDirection: "column",
            gap: "10px",
        },
        input: {
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            color:"#000000"
        },
        select: {
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            backgroundColor: "#fff",
            color : "#000"
        },
        button: {
            padding: "12px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
        },
        buttonHover: {
            backgroundColor: "#45a049",
        },
    };



    return (
        <div style={styles.container} className="flex-1 overflow-auto relative z-10 min-h-screen" >
            <main className=" mx-auto py-6 px-4 lg:px-8">
                {message && <p style={styles.message}>{message}</p>}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <label>FirstName</label>
                    <input type="text" name="firstName" placeholder="First Name" value={user.firstName} onChange={handleChange} required style={styles.input} />
                    <label>LastName</label>
                    <input type="text" name="lastName" placeholder="Last Name" value={user.lastName} onChange={handleChange} required style={styles.input} />
                    <label>Email</label>
                    <input type="email" name="email" placeholder="Email" value={user.email} onChange={handleChange} required style={styles.input} />
                    <label>Username</label>
                    <input type="text" name="username" placeholder="Username" value={user.username} onChange={handleChange} required style={styles.input} />

                    <label>Password</label>
                    <input type="password" name="password" placeholder="Password" value={user.password} onChange={handleChange} required style={styles.input} />
                    <label>Confirm Password</label>
                    <input type="password" name="passwordHash" placeholder="Confirm Password" value={user.passwordHash} onChange={handleChange} required style={styles.input} />
                    <lable>Mobile Number</lable>
                    <input type="text" name="mobileNo" placeholder="Mobile No" value={user.mobileNo} onChange={handleChange} required style={styles.input} />
                    <label>Address</label>
                    <input type="text" name="address" placeholder="Address" value={user.address} onChange={handleChange} required style={styles.input} />
                    <label>Role</label>
                    <select name="role" value={user.role} onChange={handleChange} required style={styles.select}>
                        <option value="">Select Role</option>
                        <option value="Artist">Artist</option>
                        <option value="Manager">Manager</option>
                        <option value="Admin">Admin</option>
                    </select><br/>
                    {message && <p style={styles.message}>{message}</p>}<br/>
                    <button type="submit" style={styles.button}>Add User</button><br/>
                    
                </form>
            </main>
        </div >
    );
};

export default AddUser;