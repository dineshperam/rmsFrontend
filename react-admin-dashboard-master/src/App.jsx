import { Route, Routes } from "react-router-dom";

import OverviewPageArtist from "./pagesArtist/OverviewPageArtist";
import OverviewPageAdmin from "./pagesAdmin/OverviewPageAdmin";
import Sidebar from "./components/common/Sidebar";
import AllTransPage from "./pagesAdmin/AllTransPage";
import AllSongsPage from "./pagesAdmin/AllSongsPage";
import ProfilePage from "./components/common/ProfilePage";
import ArtistSongsPage from "./pagesArtist/ArtistSongsPage";
import AddUser from "./components/componentsAdmin/AddUser";
import AddSong from "./components/componentsArtist/AddSongs";
import ArtistTrans from "./pagesArtist/ArtistTrans";
import LoginPage from "./pagesAuth/LoginPage"
import UsersPage from "./pagesAdmin/AllUsersPage";

function App() {
	return (
		<div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>
			{/* BG */}
			<div className='fixed inset-0 z-0'>
				<div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
				<div className='absolute inset-0 backdrop-blur-sm' />
			</div>

			<Sidebar />
			<Routes>

				{/* auth */}

				<Route path='/' element={<LoginPage />} />
				<Route path='/changePassword' element={<LoginPage />} />

				{/* admin */}
				
				<Route path='/adminDashboard' element={<OverviewPageAdmin />} />
				<Route path='/allUsers' element={<UsersPage />} />
				<Route path='/allTransactions' element={<AllTransPage />} />
				<Route path='/allSongs' element={<AllSongsPage />} />
				<Route path='/addUser' element={<AddUser />} />
				<Route path='/adminInfo' element={<ProfilePage />} />

				{/* artist */}
				<Route path="/artistDashboard" element={<OverviewPageArtist/>}/>
				<Route path="/artistSongs" element={<ArtistSongsPage/>}/>
				<Route path="/addSong" element={<AddSong/>}/>
				<Route path="/transactionHistory" element={<ArtistTrans/>}/>
					
			</Routes>
		</div>
	);
}

export default App;
