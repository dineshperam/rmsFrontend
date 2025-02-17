import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import OverviewPageArtist from "./pagesArtist/OverviewPageArtist";
import OverviewPageAdmin from "./pagesAdmin/OverviewPageAdmin";
import Sidebar from "./components/common/Sidebar";
import AllTransPage from "./pagesAdmin/AllTransPage";
import AllSongsPage from "./pagesAdmin/AllSongsPage";
import ProfilePage from "./components/common/ProfilePage";
import ArtistSongsPage from "./pagesArtist/ArtistSongsPage";
import AddSong from "./components/componentsArtist/AddSongs";
import ArtistTrans from "./pagesArtist/ArtistTrans";
import LoginPage from "./pagesAuth/LoginPage";
import UsersPage from "./pagesAdmin/AllUsersPage";
import ChangePassword from "./pagesAuth/ChangePassword";
import ForgotPassword from "./pagesAuth/ForgotPassword";
import ApiService from "./service/ApiService";
import { AdminRoute, ArtistRoute, ManagerRoute } from "./service/Guard";
import AddUsers from "./pagesAdmin/AddUsers";
import AllSongsPageArtist from "./pagesArtist/AllSongsPageArtists";
import ContactForm from "./pagesAuth/ContactForm";
import ContactRequestsPage from "./pagesAdmin/ContactRequestsPage";
import MyManagerPage from "./pagesArtist/MyManagerPage";
import OverviewPageManager from "./pagesManager/OverviewPageManager";
import ManagerArtistsPage from "./pagesManager/ManagerArtistsPage" 
import ManArtistTransPage from "./pagesManager/ManArtistTransPage"
import ManagerTransPage from "./pagesManager/ManagerTransPage"
import TopArtistsRevenue from "./components/componentsManager/TopArtistsRevenue"
import ManagerRequestsPage from "./pagesManager/ManagerRequestsPage"
import AllSongsPageManager from "./pagesManager/AllSongsPageManager";
import RoyaltiesPage from "./pagesAdmin/RoyaltiesPage";
import ArtistRequestsPage from "./pagesArtist/ArtistRequestsPage";
import UpdateProfilePage from "./components/common/UpdateProfilePage";


function App() {
    const location = useLocation();
    const isAuthPage = ["/", "/login", "/changePassword", "/forgotPassword","/contactForm"].includes(location.pathname);
    const isAuthenticated = ApiService.isAuthenticated();

    return (
        <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
            </div>

            {/* Show Sidebar only after login */}
            {!isAuthPage && isAuthenticated && <Sidebar />}

            <Routes>
                {/* Auth Routes (No Sidebar) */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/changePassword" element={<ChangePassword />} />
                <Route path="/forgotPassword" element={<ForgotPassword />} />
                <Route path="/myInfo" element={<ProfilePage /> } />
                <Route path="/contactForm" element={<ContactForm /> } />
                <Route path="/update-profile" element={<UpdateProfilePage/>}/>

                {/* Admin Routes */}
                <Route path="/adminDashboard" element={<AdminRoute element={<OverviewPageAdmin />} />} />
                <Route path="/allUsers" element={<AdminRoute element={<UsersPage />} />} />
                <Route path="/allTransactions" element={<AdminRoute element={<AllTransPage />} />} />
                <Route path="/allSongs" element={<AdminRoute element={<AllSongsPage />} />} />
                <Route path="/addUser" element={<AdminRoute element={<AddUsers />} />} />
                <Route path="/royalties" element={<AdminRoute element={<RoyaltiesPage />} />}/>
                <Route path="/contactRequests" element={<AdminRoute element={<ContactRequestsPage />} />} />

                {/* Artist Routes */}
                <Route path="/artistDashboard" element={<ArtistRoute element={<OverviewPageArtist />} />} />
                <Route path="/artistSongs" element={<ArtistRoute element={<ArtistSongsPage />} />} />
                <Route path="/allArtistSongs" element={<ArtistRoute element={<AllSongsPageArtist />} />} />
                <Route path="/addSong" element={<ArtistRoute element={<AddSong />} />} />
                <Route path="/transactionHistory" element={<ArtistRoute element={<ArtistTrans />} />} />
                <Route path="/artist-requests" element={<ArtistRoute element={<ArtistRequestsPage />} />} />
				<Route path="/my-manager-details" element={<MyManagerPage/>}/>
                

                {/*manager */}
				<Route path="/managerDashboard" element={<ManagerRoute element={<OverviewPageManager />} />}/>
                <Route path="/all-Msongs" element={<ManagerRoute element={<AllSongsPageManager />} />} />
                <Route path="/manager-artists" element={<ManagerRoute element={<ManagerArtistsPage />} />}/>
				<Route path="/man-artist-trans" element={<ManagerRoute element={<ManArtistTransPage />} />}/>
				<Route path="/manager-transactions" element={<ManagerRoute element={<ManagerTransPage />} />}/>
				<Route path="/top-artist-evenue" element={<ManagerRoute element={<TopArtistsRevenue />} />}/>
				<Route path="/manager-requests"element={<ManagerRoute element={<ManagerRequestsPage />} />}/>
                

                {/* Redirect unknown routes */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
    );
}

export default App;
