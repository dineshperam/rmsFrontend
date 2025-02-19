import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import OverviewPageArtist from "./pagesArtist/OverviewPageArtist/OverviewPageArtist";
import OverviewPageAdmin from "./pagesAdmin/OverviewPage/OverviewPageAdmin";
import Sidebar from "./components/common/Sidebar/Sidebar";
import AllTransPage from "./pagesAdmin/AllTransPage/AllTransPage";
import AllSongsPage from "./pagesAdmin/AllSongsPage/AllSongsPage";
import ProfilePage from "./components/common/Profile/ProfilePage";
import ArtistSongsPage from "./pagesArtist/ArtistSongsPage/ArtistSongsPage";
import AddSong from "./components/componentsArtist/AddSong/AddSongs";
import ArtistTrans from "./pagesArtist/ArtistTrans/ArtistTrans";
import LoginPage from "./pagesAuth/LoginPage/LoginPage";
import UsersPage from "./pagesAdmin/UsersPage/AllUsersPage";
import ChangePassword from "./pagesAuth/ChangePassword/ChangePassword";
import ForgotPassword from "./pagesAuth/ForgotPassword/ForgotPassword";
import ApiService from "./service/ApiService";
import { AdminRoute, ArtistRoute, ManagerRoute } from "./service/Guard";
import AddUsers from "./pagesAdmin/AddUsers/AddUsers";
import AllSongsPageArtist from "./pagesArtist/AllSongsPageArtist/AllSongsPageArtists";
import ContactForm from "./pagesAuth/ContactForm/ContactForm";
import ContactRequestsPage from "./pagesAdmin/ContactRequestsPage/ContactRequestsPage";
import MyManagerPage from "./pagesArtist/MyManagerPage/MyManagerPage";
import OverviewPageManager from "./pagesManager/OverviewPageManager/OverviewPageManager";
import ManagerArtistsPage from "./pagesManager/ManagerArtistsPage/ManagerArtistsPage"; 
import ManArtistTransPage from "./pagesManager/ManArtistTransPage/ManArtistTransPage";
import ManagerTransPage from "./pagesManager/ManagerTransPage/ManagerTransPage";
import TopArtistsRevenue from "./components/componentsManager/TopArtistsRevenue/TopArtistsRevenue"
import ManagerRequestsPage from "./pagesManager/ManagerRequestsPage/ManagerRequestsPage"
import AllSongsPageManager from "./pagesManager/AllSongsPageManager/AllSongsPageManager";
import RoyaltiesPage from "./pagesAdmin/RoyaltiesPage/RoyaltiesPage";
import ArtistRequestsPage from "./pagesArtist/ArtistRequestsPage/ArtistRequestsPage";
import UpdateProfilePage from "./components/common/UpdateProfile/UpdateProfilePage";
import LandingPage from "./components/common/LandingPage/LandingPage";
import Home from "./components/common/Home/Home";

import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";


function App() {
    const location = useLocation();
    const isAuthPage = ["/", "/login", "/changePassword", "/forgotPassword","/contactForm"].includes(location.pathname);
    const isAuthenticated = ApiService.isAuthenticated();
    useEffect(() => {
        AOS.init({ duration: 1000, once: true }); // Adjust duration if needed
      }, []);

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
                <Route path="/" element={<LandingPage />} />
                <Route path="/home" element={<Home />} />
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
