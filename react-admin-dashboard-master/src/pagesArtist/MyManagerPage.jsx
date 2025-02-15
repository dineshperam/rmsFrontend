import Header from "../components/common/Header";
import Security from "../components/componentsAdmin/Security";
import MyManager from "../components/componentsArtist/MyManager";

const MyManagerPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
			<Header title='Settings' />
			<main className='max-w-4xl mx-auto py-6 px-4 lg:px-8'>
                <MyManager/>
				
				<Security />
			</main>
		</div>
	);
};
export default MyManagerPage;
