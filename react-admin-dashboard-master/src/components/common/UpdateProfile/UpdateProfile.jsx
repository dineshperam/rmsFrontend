import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import ApiService from "../../../service/ApiService";
import SettingSection from "../../componentsAdmin/Security/SettingSection";

const UpdateProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        mobileNo: "",
        address: "",
        role: "",
        managerId: "", // Read-only field
    });
    const [message, setMessage] = useState(null);

    // Fetch user details on component mount
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userInfo = await ApiService.getLoggedInUsesInfo();
                setUser(userInfo);
            } catch (error) {
                showMessage(error.response?.data?.message || "Error fetching user info.");
            }
        };
        fetchUserInfo();
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    // Handle profile update
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const updatedData = {
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                mobileNo: user.mobileNo,
                address: user.address,
            };

            console.log("Updating profile with data:", updatedData);

            const updatedUserInfo = await ApiService.updateUserProfile(updatedData);
            setUser(updatedUserInfo); // Update the UI with new data
            showMessage("Profile updated successfully!", "success");

            // Redirect to admin profile after 2 seconds
            setTimeout(() => navigate("/myInfo"), 2000);
        } catch (error) {
            showMessage(error.response?.data?.message || "Error updating profile.");
        }
    };

    // Show message function
    const showMessage = (msg, type = "error") => {
        setMessage({ text: msg, type });
        setTimeout(() => setMessage(null), 4000);
    };

    return (
        <SettingSection icon={Lock} title="Update Profile">
            <div className="flex flex-col items-center p-6">
                {message && (
                    <div
                        className={`p-3 mb-4 rounded-md border ${
                            message.type === "success"
                                ? "bg-green-100 text-green-600 border-green-400"
                                : "bg-red-100 text-red-600 border-red-400"
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="w-full max-w-lg bg-gray-800 p-6 rounded-md shadow-md">
                    <ProfileInput label="Username" value={user.username} readOnly />
                    <ProfileInput label="Email" name="email" value={user.email} onChange={handleChange} />
                    <ProfileInput label="First Name" name="firstName" value={user.firstName} onChange={handleChange} />
                    <ProfileInput label="Last Name" name="lastName" value={user.lastName} onChange={handleChange} />
                    <ProfileInput label="Phone Number" name="mobileNo" value={user.mobileNo} onChange={handleChange} />
                    <ProfileInput label="Address" name="address" value={user.address} onChange={handleChange} />
                    <ProfileInput label="Role" value={user.role} readOnly />
                    <ProfileInput label="Manager ID" value={user.managerId} readOnly />

                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded w-full transition duration-200"
                    >
                        Update Profile
                    </button>
                </form>
            </div>
        </SettingSection>
    );
};

// Reusable Input Component
const ProfileInput = ({ label, name, value, onChange, readOnly = false }) => (
    <div className="mb-4">
        <label className="block text-white mb-2">{label}</label>
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
            className={`w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none ${
                readOnly ? "opacity-50 cursor-not-allowed" : ""
            }`}
        />
    </div>
);

export default UpdateProfile;
