import Header from "./Header";
import Security from "../componentsAdmin/Security";
import Profile from "./Profile";

const ProfilePage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
			<Header title='Settings' />
			<main className='max-w-4xl mx-auto py-6 px-4 lg:px-8'>
				<Profile />
				<Security />
			</main>
		</div>
	);
};
export default ProfilePage;
