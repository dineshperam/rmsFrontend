import { useState } from "react";

const ContactForm = () => {
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        mobileno: "",
        query: "",
        role: "Artist",
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleChange = (e) => {
        setFormData({ ...formData, role: e.target.value });
    };

    const validateForm = () => {
        let newErrors = {};

        if (!formData.firstname.trim()) {
            newErrors.firstname = "First Name is required.";
        } else if (!/^[A-Za-z]+$/.test(formData.firstname)) {
            newErrors.firstname = "First Name must contain only letters.";
        }

        if (!formData.lastname.trim()) {
            newErrors.lastname = "Last Name is required.";
        } else if (!/^[A-Za-z]+$/.test(formData.lastname)) {
            newErrors.lastname = "Last Name must contain only letters.";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Enter a valid email address.";
        }

        if (!formData.mobileno.trim()) {
            newErrors.mobileno = "Mobile Number is required.";
        } else if (!/^\d{10}$/.test(formData.mobileno)) {
            newErrors.mobileno = "Mobile Number must be 10 digits.";
        }

        if (!formData.query.trim()) {
            newErrors.query = "Query is required.";
        } else if (formData.query.length < 10) {
            newErrors.query = "Query must be at least 10 characters long.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await fetch("http://localhost:8080/api/contact/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setMessage("Your query has been submitted successfully.");
                setFormData({ firstname: "", lastname: "", email: "", mobileno: "", query: "", role: "Artist" });
                setErrors({});
            } else {
                setMessage("Error submitting the form. Please try again.");
            }
        } catch (error) {
            setMessage("Error connecting to the server.");
        }
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Contact Us</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="firstname" placeholder="First Name" value={formData.firstname} onChange={handleChange} className="w-full text-black p-2 border rounded"/>
                {errors.firstname && <p className="text-red-500 text-sm">{errors.firstname}</p>}
                
                <input type="text" name="lastname" placeholder="Last Name" value={formData.lastname} onChange={handleChange} className="w-full text-black p-2 border rounded"/>
                {errors.lastname && <p className="text-red-500 text-sm">{errors.lastname}</p>}
                
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 text-black border rounded"/>
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                
                <input type="tel" name="mobileno" placeholder="Mobile No" value={formData.mobileno} onChange={handleChange} className="w-full p-2 text-black border rounded"/>
                {errors.mobileno && <p className="text-red-500 text-sm">{errors.mobileno}</p>}
                
                <div className="flex items-center gap-4">
                    <label className="font-semibold text-black">Role:</label>
                    <label className="flex items-center text-black">
                        <input type="radio" name="role" value="Artist" checked={formData.role === "Artist"} onChange={handleRoleChange} className="mr-2 "/> Artist
                    </label>
                    <label className="flex items-center text-black">
                        <input type="radio" name="role" value="Manager" checked={formData.role === "Manager"} onChange={handleRoleChange} className="mr-2 "/> Manager
                    </label>
                </div>
                
                <textarea name="query" placeholder="Your Query" value={formData.query} onChange={handleChange} className="w-full p-2 border rounded h-24 text-black"></textarea>
                {errors.query && <p className="text-red-500 text-sm">{errors.query}</p>}
                
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Submit</button>
            </form>
            {message && <p className="text-center mt-4 text-green-500">{message}</p>}
        </div>
        </div>
    );
};

export default ContactForm;
