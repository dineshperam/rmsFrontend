import { Lock } from "lucide-react";
import SettingSection from "./SettingSection";
import { useNavigate } from "react-router-dom";

const Security = () => {
	const navigate = useNavigate();
	return (
		<SettingSection icon={Lock} title={"Security"}>
			<div className='mt-4'>
				<button onClick={() => navigate("/update-profile")} // Redirect to update profile page
					className='bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded 
        transition duration-200
        '
				>
					Edit Profile
				</button>&nbsp;&nbsp;&nbsp;
				<button
					className='bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded 
        transition duration-200
        '
				>
					Change Password
				</button>
			</div>
		</SettingSection>
	);
};
export default Security;
