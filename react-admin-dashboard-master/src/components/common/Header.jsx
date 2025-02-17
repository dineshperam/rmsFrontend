import { useEffect, useState } from "react";
import ApiService from "../../service/ApiService";

const Header = ({ title }) => {
    const [fullName, setFullName] = useState("");
    const [role, setRole] = useState("");

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const userData = await ApiService.getLoggedInUsesInfo();
                const userRole = ApiService.getRole(); // Fetch role

                console.log("User Data:", userData, "Role:", userRole); // Debugging

                if (userData && userData.firstName && userData.lastName) {
                    setFullName(`${userData.firstName} ${userData.lastName}`);
                } else {
                    setFullName("User");
                }

                setRole(userRole);
            } catch (error) {
                console.error("Error fetching user details:", error);
                setFullName("User");
            }
        };

        fetchUserDetails();
    }, []);

    // Define role-based icons with bigger size
    const renderRoleBadge = () => {
        if (role === "Admin") {
            return <span className="text-yellow-400 text-2xl ml-3">👑</span>;
        } else if (role === "Artist") {
            return (
                <span className="ml-3 w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white text-lg font-bold">
                    A
                </span>
            );
        } else if (role === "Manager") {
            return (
                <span className="ml-3 w-8 h-8 flex items-center justify-center rounded-full bg-green-500 text-white text-lg font-bold">
                    M
                </span>
            );
        }
        return null;
    };

    return (
        <header className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-100">{title}</h1>
                <div className="text-gray-300 font-medium flex items-center">
                    Hello, {fullName}
                    {renderRoleBadge()}
                </div>
            </div>
        </header>
    );
};

export default Header;
