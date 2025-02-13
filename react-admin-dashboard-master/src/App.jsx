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
import { AdminRoute, ArtistRoute } from "./service/Guard";
import AddUsers from "./pagesAdmin/AddUsers";

function App() {
    const location = useLocation();
    const isAuthPage = ["/", "/login", "/changePassword", "/forgotPassword"].includes(location.pathname);
    const isAuthenticated = ApiService.isAuthenticated();

    return (
        <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
                <div className="absolute inset-0 backdrop-blur-sm" />
            </div>

            {/* Show Sidebar only after login */}
            {!isAuthPage && isAuthenticated && <Sidebar />}

            <Routes>
                {/* Auth Routes (No Sidebar) */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/changePassword" element={<ChangePassword />} />
                <Route path="/forgotPassword" element={<ForgotPassword />} />
                <Route path="/adminInfo" element={<ProfilePage /> } />

                {/* Admin Routes */}
                <Route path="/adminDashboard" element={<AdminRoute element={<OverviewPageAdmin />} />} />
                <Route path="/allUsers" element={<AdminRoute element={<UsersPage />} />} />
                <Route path="/allTransactions" element={<AdminRoute element={<AllTransPage />} />} />
                <Route path="/allSongs" element={<AdminRoute element={<AllSongsPage />} />} />
                <Route path="/addUser" element={<AdminRoute element={<AddUsers />} />} />
                

                {/* Artist Routes */}
                <Route path="/artistDashboard" element={<ArtistRoute element={<OverviewPageArtist />} />} />
                <Route path="/artistSongs" element={<ArtistRoute element={<ArtistSongsPage />} />} />
                <Route path="/addSong" element={<ArtistRoute element={<AddSong />} />} />
                <Route path="/transactionHistory" element={<ArtistRoute element={<ArtistTrans />} />} />

                {/* Redirect unknown routes */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
    );
}

export default App;
