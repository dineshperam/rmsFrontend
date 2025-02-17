import Header from "../common/Header";
import UpdateProfile from "../common/UpdateProfile";

const UpdateProfilePage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
			<Header title='Update Profile' />
			<main className='max-w-4xl mx-auto py-6 px-4 lg:px-8'>
				<UpdateProfile/>
				{/* <Security /> */}
			</main>
		</div>
	);
};
export default UpdateProfilePage;
