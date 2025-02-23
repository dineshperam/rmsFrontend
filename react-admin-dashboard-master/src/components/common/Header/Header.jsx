import { useNavigate } from "react-router-dom";
 
const Header = ({ title }) => {
 
    const navigate = useNavigate();
   
 
    return (
        <header className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-100">{title}</h1>
                     {/* Logo with navigation */}
                <img
                    src="/RM_Latest1.png"
                    alt="Logo"
                    className="h-8 cursor-pointer"
                    onClick={() => navigate("/home")}
                />
             
            </div>
        </header>
    );
};
 
export default Header;