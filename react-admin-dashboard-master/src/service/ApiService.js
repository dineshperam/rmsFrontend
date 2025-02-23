import axios from "axios";
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";

export default class ApiService {
    static BASE_URL = "http://localhost:8080";
    static BASE_URL1 = "http://localhost:8181";
    static BASE_URL2 = "http://localhost:8185";
    static BASE_URL3 = "http://localhost:8183";
    static BASE_URL4 = "http://localhost:8184";
    static BASE_URL5 = "http://localhost:8184";
    static BASE_URL6 = "http://localhost:8182";
    static BASE_URL7 = "http://localhost:8182";
    static ENCRYPTION_KEY = "mint-dev-royalty";


    //encrypt data using cryptoJs
    static encrypt(data) {
        return CryptoJS.AES.encrypt(data, this.ENCRYPTION_KEY.toString());
    }

    //decrypt data using cryptoJs
    static decrypt(data) {
        const bytes = CryptoJS.AES.decrypt(data, this.ENCRYPTION_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    }

    // retreive the token
    static getToken() {
        const encryptedToken = localStorage.getItem("token");
        if (!encryptedToken) return null;
        return this.decrypt(encryptedToken);
    }

    static getIsFirstLogin() {
        return localStorage.getItem("isFirstLogin")
    }

    //save Role with encryption
    static saveRole(role) {
        const encryptedRole = this.encrypt(role);
        localStorage.setItem("role", encryptedRole)
    }

    // retreive the role
    static getRole() {
        const encryptedRole = localStorage.getItem("role");
        if (!encryptedRole) return null;
        return this.decrypt(encryptedRole);
    }

    static clearAuth() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.clear();
    }


    static getHeader() {
        const token = this.getToken();
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    }

    /**  AUTH && USERS API */

    static async registerUser(registerData) {
        const response = await axios.post(`${this.BASE_URL2}/auth/register`, registerData)
        return response.data;
    }


    static saveAuthData({ token, userId, role, isFirstLogin, managerId, isActive, expirationTime }) {
        localStorage.setItem("token", this.encrypt(token));
        localStorage.setItem("userId", this.encrypt(userId.toString()));
        localStorage.setItem("role", this.encrypt(role));
        localStorage.setItem("isFirstLogin", (isFirstLogin));
        localStorage.setItem("managerId", this.encrypt(managerId.toString())); // Convert number to string
        localStorage.setItem("isActive", (isActive));
        localStorage.setItem("expirationTime", (expirationTime))
    }

    static getIsActive() {
        return localStorage.getItem("isActive")

    }

    static getManagerId() {
        const encryptedManagerId = localStorage.getItem("managerId");
        return encryptedManagerId ? parseInt(this.decrypt(encryptedManagerId)) : null;
    }

    static getUserId() {
        const encryptedUserId = localStorage.getItem("userId");
        return encryptedUserId ? parseInt(this.decrypt(encryptedUserId)) : null;
    }

    static async updateUserProfile(userDetails) {
        try {
            const response = await axios.put(`${this.BASE_URL2}/user/update`, userDetails, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    }

    static async loginUser(loginData) {
        const response = await axios.post(`${this.BASE_URL2}/auth/login`, loginData);
        if (response.data.token) {
            this.saveAuthData(response.data); // Save token, userId, and role
        }
        return response.data;
    }

    static async getArtistWithStreamCounts() {
        const artistId = this.getUserId();
        if (!artistId) {
            console.error("User ID not found!");
            return [];
        }

        try {
            const response = await axios.get(`${this.BASE_URL6}/artist/searchByArtistId/${artistId}`, {
                headers: this.getHeader(),
            });

            let fetchedSongs = response.data || [];

            for (const song of fetchedSongs) {
                try {
                    const streamResponse = await axios.get(`${this.BASE_URL7}/stream/searchSongId/${song.songId}`, {
                        headers: this.getHeader(),
                    });
                    song.streamCount = streamResponse.data[0]?.streamCount || "NA";
                } catch (error) {
                    console.error(`Error fetching stream count for song ID ${song.songId}:`, error);
                    song.streamCount = "NA";
                }
            }

            return fetchedSongs;
        } catch (error) {
            console.error("Error fetching artist details:", error);
            return [];
        }
    }

    static async getTopArtistsByRevenue(managerId) {
        try {
            const token = this.getToken(); // Retrieve token from localStorage
            if (!token) {
                console.error("No token found. User might not be logged in.");
                return [];
            }

            const response = await axios.get(`${this.BASE_URL1}/insights/top-artists/${managerId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Ensure token is attached
                    "Content-Type": "application/json",
                },
            });

            return response.data;
        } catch (error) {
            console.error("Error fetching top artists by revenue:", error);
            return [];
        }
    }

    /** ================================
 * 🔹 PARTNERSHIPS API
 * ================================= */

    // ✅ Get list of managers
    static async getManagers() {
        try {
            const response = await axios.get(`${this.BASE_URL2}/user/getManagers`, { headers: this.getHeader() });
            return response.data;
        } catch (error) {
            console.error("Error fetching managers:", error);
            throw error;
        }
    }

    // // ✅ Fetch artist's assigned manager
    // static async getArtistManager(artistId) {
    //     try {
    //         const response = await axios.get(`${this.BASE_URL}/getArtistUnderManager/${artistId}`, { headers: this.getHeader() });
    //         return response.data;
    //     } catch (error) {
    //         console.error("Error fetching artist's manager:", error);
    //         throw error;
    //     }
    // }

    static async sendPartnershipRequest(artistId, managerId, percentage, durationMonths, comments) {
        try {
            const payload = { artistId, managerId, percentage, durationMonths, comments };
            console.log("Sending partnership request:", payload); // Debugging log
            const response = await axios.post(`${this.BASE_URL3}/partnerships/request`, payload, { headers: this.getHeader() });
            return response.data;
        } catch (error) {
            console.error("Error sending partnership request:", error);
            throw error;
        }
    }

    // ✅ Get pending partnership requests for a manager
    static async getManagerRequests(managerId) {
        try {
            const response = await axios.get(`${this.BASE_URL3}/partnerships/requests/${managerId}`, { headers: this.getHeader() });
            return response.data;
        } catch (error) {
            console.error("Error fetching manager requests:", error);
            throw error;
        }
    }

    // ✅ Get artist-partnership record
    static async getArtistPartnership(artistId) {
        try {
            const response = await axios.get(`${this.BASE_URL3}/partnerships/latest/${artistId}`, { headers: this.getHeader() });
            return response.data;
        } catch (error) {
            console.error("Error fetching manager requests:", error);
            throw error;
        }
    }

    // ✅ Accept or reject a partnership request
    static async respondToPartnershipRequest(requestId, status) {
        try {
            const response = await axios.put(`${this.BASE_URL3}/partnerships/respond/${requestId}?status=${status}`,
                {},  // Empty body, since status is sent as query param
                { headers: this.getHeader() }
            );
            return response.data;
        } catch (error) {
            console.error("Error responding to partnership request:", error.response || error);
            toast.error(error.response?.data?.message || "Failed to respond.");
            throw error;
        }
    }

    static async getRoyalties() {
        try {
            const response = await axios.get(`${this.BASE_URL4}/royalty/royaltyList`, {
                headers: this.getHeader(),
            });
            return response.data; // Axios automatically parses JSON
        } catch (error) {
            console.error("Error fetching royalties:", error);
            throw new Error("Failed to fetch royalties");
        }
    }

    static async getPendingPartnershipRequest(artistId) {
        try {
            const response = await axios.get(`${this.BASE_URL3}/partnerships/pending/${artistId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching pending partnership request:", error);
            throw error;
        }
    }

    static async getTotalSongs(managerId) {
        try {
            const response = await axios.get(`${this.BASE_URL1}/insights/total-songs/${managerId}`, { headers: this.getHeader() });
            return response.data;
        } catch (error) {
            console.error("Error fetching total songs:", error);
            throw error;
        }
    }

    static async getTotalStreams(managerId) {
        try {
            const response = await axios.get(`${this.BASE_URL1}/insights/total-streams/${managerId}`, { headers: this.getHeader() });
            return response.data;
        } catch (error) {
            console.error("Error fetching total streams:", error);
            throw error;
        }
    }

    static async getManagerRevenue(managerId) {
        try {
            const response = await axios.get(`${this.BASE_URL1}/insights/manager-revenue/${managerId}`, { headers: this.getHeader() });
            return response.data;
        } catch (error) {
            console.error("Error fetching manager revenue:", error);
            throw error;
        }
    }

    static async getTotalRevenue(managerId) {
        try {
            const response = await axios.get(`${this.BASE_URL1}/insights/total-revenue/${managerId}`, { headers: this.getHeader() });
            return response.data;
        } catch (error) {
            console.error("Error fetching total revenue:", error);
            throw error;
        }
    }

    static async payRoyalty(royaltyId, adminId) {
        try {
            const response = await axios.put(`${this.BASE_URL4}/royalty/payRoyalty/${royaltyId}/${adminId}`, {}, {
                headers: this.getHeader(),
            });
    
            return response.data; // ✅ Axios responses have data directly
        } catch (error) {
            throw new Error(error.response?.data?.message || "Failed to process payment"); 
        }
    }
    

    static async exportTransByUsersPDF(userId) {
        try {
            const response = await axios.get(`${this.BASE_URL5}/trans/exportPDF/${userId}`, {
                headers: this.getHeader(),
                responseType: "blob",
            });

            return response.data;
        } catch (error) {
            console.error("Error exporting transactions PDF:", error);
            throw error;
        }
    }

    static async exportTransByManagerPDF(managerId) {
        try {
            const response = await axios.get(`${this.BASE_URL5}/trans/exportPDF/manager/${managerId}`, {
                headers: this.getHeader(),
                responseType: "blob",
            });

            return response.data;
        } catch (error) {
            console.error("Error exporting manager transactions PDF:", error);
            throw error;
        }
    }

    static async exportPartnershipPDF(artistId) {
        try {
            const response = await axios.get(`${this.BASE_URL3}/partnerships/export-pdf-partner/${artistId}`, {
                headers: this.getHeader(),
                responseType: "blob",
            });

            return response.data;
        } catch (error) {
            console.error("Error exporting contract PDF:", error);
            throw error;
        }
    }

    static async requestOtp(username) {
        if (!username.trim()) {
            toast.error("Please enter your username.");
            return;
        }

        try {
            await axios.post(`${this.BASE_URL2}/user/forgotPassword`, { username });
            toast.success("OTP sent to your email!");
            return { success: true };
        } catch (error) {
            console.error("Error sending OTP:", error.response ? error.response.data : error.message);
            toast.error("Failed to send OTP. Please try again.");
            return { success: false };
        }
    }

    static async resetPassword(username, otp, newPassword, confirmPassword) {
        if (!otp.trim()) {
            toast.error("Please enter the OTP.");
            return;
        }
        if (!newPassword.trim()) {
            toast.error("Please enter a new password.");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        try {
            const response = await axios.put(`${this.BASE_URL2}/user/updatePassword`, {
                username,
                otp,
                newPassword,
            });

            toast.success(response.data || "Password successfully changed!");
            return { success: true };
        } catch (error) {
            console.error("Error resetting password:", error.response ? error.response.data : error.message);
            toast.error("Failed to reset password. " + (error.response ? error.response.data : ""));
            return { success: false };
        }
    }


    static async exportTransPDF() {
        try {
            const response = await axios.get(`${this.BASE_URL5}/trans/export-pdf`, {
                headers: this.getHeader(),
                responseType: "blob",
            });

            return response.data;
        } catch (error) {
            console.error("Error exporting transactions PDF:", error);
            throw error;
        }
    }


    /**AUTHENTICATION CHECKER */
    static logout() {
        this.clearAuth()
    }

    static isAuthenticated() {
        const token = this.getToken();
        return !!token;
    }

    static isManager() {
        const role = this.getRole();
        return role === "Manager";
    }

    static isArtist() {
        const role = this.getRole();
        return role === "Artist";
    }

    static isAdmin() {
        const role = this.getRole();
        return role === "Admin";
    }

    static async getLoggedInUsesInfo() {
        const response = await axios.get(`${this.BASE_URL2}/user/current`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async getManagerInfo() {
        const managerId = this.getManagerId();
        if (!managerId) {
            console.error("Manager ID not found in localStorage.");
            return null;
        }

        try {
            const response = await axios.get(`${this.BASE_URL2}/user/searchUser/${managerId}`, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching manager info:", error);
            return null;
        }
    }

    static async setSessionExpirationTimer() {
        const sessionDuration = 10000; // Session duration (10,000 ms)
        const loginTime = localStorage.getItem('expirationTime');

        if (!loginTime) {
            console.error("Login time not found in localStorage.");
            return;
        }

        const timeElapsed = Date.now() - parseInt(loginTime, 10);

        if (timeElapsed >= sessionDuration) {
            // If the session has expired, show custom dialog and log out
            this.showSessionExpiredDialog();
        } else {
            // Set timeout to trigger expiration after the remaining time
            setTimeout(() => {
                this.showSessionExpiredDialog();
            }, sessionDuration - timeElapsed);
        }
    }

    static async calculateRoyalties() {
        try {
            const response = await axios.get(`${this.BASE_URL4}/royalty/calculate`, { headers: this.getHeader() });
            return response.data;
        } catch (error) {
            console.error("Error calculating royalties:", error);
            throw error;
        }
    }

    static showSessionExpiredDialog() {
        const dialog = document.createElement('div');
        dialog.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center;">
                <div style="background: white; padding: 20px; border-radius: 5px; text-align: center;">
                    <h2>Session Expired</h2>
                    <p>Please log in again.</p>
                    <button id="session-expired-btn" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">Login</button>
                </div>
            </div>
        `;
        document.body.appendChild(dialog);

        document.getElementById("session-expired-btn").addEventListener("click", () => {
            this.clearSessionAndRedirect();
        });
    }

    static clearSessionAndRedirect() {
        localStorage.removeItem('expirationTime');
        localStorage.removeItem('role');
        localStorage.clear();
        window.location.href = "/login"; // Ensure navigation on session expiry
    }

    static async getActiveArtistsCount() {
        try {
            const response = await axios.get(`${this.BASE_URL1}/insights/active-artists-count`, { headers: this.getHeader() });
            return response.data;
        } catch (error) {
            console.error("Error fetching active artists count:", error);
            throw error;
        }
    }

    static async getActiveManagersCount() {
        try {
            const response = await axios.get(`${this.BASE_URL1}/insights/active-managers-count`, { headers: this.getHeader() });
            return response.data;
        } catch (error) {
            console.error("Error fetching active managers count:", error);
            throw error;
        }
    }

    static async getTotalRoyaltiesPaid() {
        try {
            const response = await axios.get(`${this.BASE_URL1}/insights/total-royalties-paid`, { headers: this.getHeader() });
            return response.data;
        } catch (error) {
            console.error("Error fetching total royalties paid:", error);
            throw error;
        }
    }

    static async getTotalStreamsCount() {
        try {
            const response = await axios.get(`${this.BASE_URL1}/insights/total-streams-count`, { headers: this.getHeader() });
            return response.data;
        } catch (error) {
            console.error("Error fetching total streams count:", error);
            throw error;
        }
    }

    static async getTop5Artists(year) {
        try {
            const response = await axios.get(`${this.BASE_URL1}/insights/top5artists?year=${year}`, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching top 5 artists:", error);
            throw error;
        }
    }

    static async addUser(user) {
        try {
            await axios.post(`${this.BASE_URL2}/auth/register`, user);
            return { success: true, message: "User added successfully" };
        } catch (error) {
            console.error("Error adding user:", error);
            return { success: false, message: "Failed to add user. Please try again." };
        }
    }

    static async fetchUsers() {
        try {
            const response = await axios.get(`${this.BASE_URL1}/insights/admin-getall-users`, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching users:", error);
            throw new Error("Failed to fetch users");
        }
    }

    static async toggleUserStatus(userId) {
        try {
            await axios.put(`${this.BASE_URL2}/user/updateStatus/${userId}`, {}, { headers: this.getHeader() });
            return { success: true };
        } catch (error) {
            console.error("Error updating user status:", error);
            throw new Error("Failed to update user status");
        }
    }

    static async fetchSongs() {
        try {
            const response = await axios.get(`${this.BASE_URL6}/artist/songsList`, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching songs:", error);
            throw new Error("Failed to fetch songs");
        }
    }

    static async fetchTransactions() {
        try {
            const response = await axios.get(`${this.BASE_URL5}/trans/showTrans`, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching transactions:", error);
            throw new Error("Failed to fetch transactions");
        }
    }

    static async fetchTop5Artists() {
        try {
            const response = await axios.get(`${this.BASE_URL1}/insights/top5artists-details`, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching top 5 artists:", error);
            throw new Error("Failed to fetch top 5 artists");
        }
    }

    static async fetchTop5Managers(selectedTimeRange) {
        try {
            const response = await axios.get(`${this.BASE_URL1}/insights/top5-managers-monthly?year=${selectedTimeRange}`, {
                headers: this.getHeader(),
            });

            const rawData = response.data;

            const transformedData = rawData.map(entry => {
                const newEntry = { month: entry.month };
                const managers = new Set();

                for (let i = 1; i <= 5; i++) { // Assuming top 5 managers at max
                    const nameKey = `manager${i}_name`;
                    const revenueKey = `manager${i}`;

                    if (entry[nameKey] && entry[revenueKey] !== undefined) {
                        newEntry[entry[nameKey]] = entry[revenueKey];
                        managers.add(entry[nameKey]);
                    }
                }

                return { data: newEntry, managers: Array.from(managers) };
            });

            return {
                revenueData: transformedData.map(item => item.data),
                managerKeys: Array.from(new Set(transformedData.flatMap(item => item.managers))),
            };

        } catch (error) {
            console.error("Error fetching top 5 managers:", error);
            throw new Error("Failed to fetch top 5 managers");
        }
    }

    static async fetchTop5ManagersTable(year) {
        try {
            const response = await axios.get(
                `${this.BASE_URL1}/insights/top5-managers-detailsTab?year=${year}`,
                { headers: this.getHeader() }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching top 5 managers:", error);
            throw new Error("Failed to fetch top 5 managers");
        }
    }

    static async fetchContactRequests() {
        try {
            const response = await axios.get(`${this.BASE_URL2}/api/contact/showContacts`);
            return response.data.filter((request) => request.status === "Pending");
        } catch (error) {
            console.error("Error fetching contact requests:", error);
            throw new Error("Failed to fetch contact requests");
        }
    }

    static async handleContactAction(contactId, action) {
        try {
            const adminId = this.getUserId();
            const url =
                action === "accept"
                    ? `${this.BASE_URL2}/api/contact/accept/${contactId}/${adminId}`
                    : `${this.BASE_URL2}/api/contact/reject/${contactId}`;

            const response = await axios.put(url);

            if (response.status === 200) {
                if (response.data === "Email already exists. Cannot create a new user.") {
                    toast.error(response.data); // Show error if email exists
                } else {
                    toast.success(`Request ${action}ed.`);
                    return true;
                }
            }
        } catch (error) {
            console.error(`Error ${action}ing request:`, error);
            toast.error(`Failed to ${action} request.`);
            return false;
        }
    }

    static async addSong(song, artistId) {
        try {
            const newSong = { ...song, artistId: artistId };
            await axios.post(`${this.BASE_URL6}/artist/addSong`, newSong, {
                headers: this.getHeader(),
            });
            return { success: true, message: "Song added successfully" };
        } catch (error) {
            console.error("Error adding song:", error);
            return { success: false, message: "Failed to add song. Please try again." };
        }
    }

    static async fetchSongsArtists() {
        try {
            const response = await axios.get(`${this.BASE_URL6}/artist/songsList`, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching songs:", error);
            throw new Error("Failed to fetch songs");
        }
    }

    static async fetchArtistSongs() {
        try {
            const artistId = this.getUserId();
            const response = await axios.get(`${this.BASE_URL7}/artist/searchByArtistId/${artistId}`, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching artist songs:", error);
            throw new Error("Failed to fetch songs");
        }
    }

    static async fetchTransactionsById() {
        try {
            const userId = this.getUserId();
            if (!userId) {
                console.error("User ID not found!");
                return [];
            }
            const response = await axios.get(`${this.BASE_URL5}/trans/showTransById/${userId}`, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching transactions:", error);
            throw new Error("Failed to fetch transactions");
        }
    }

    static async fetchGenreData(artistId) {
        try {
            if (!artistId) {
                console.error("Artist ID not provided!");
                return [];
            }
            const response = await axios.get(`${this.BASE_URL1}/insights/genre-count/${artistId}`);
            return response.data; // No need to use response.json() with axios
        } catch (error) {
            console.error("Error fetching genre data:", error);
            throw new Error("Failed to fetch genre data");
        }
    }

    static async fetchArtistSongsTop() {
        try {
            const artistId = this.getUserId();
            if (!artistId) {
                console.error("Artist ID not provided!");
                return [];
            }
            const response = await axios.get(`${this.BASE_URL1}/insights/top-songs-artist-table/${artistId}`, {
                headers: this.getHeader(),
            });
            return response.data; // No need to use response.json() with axios
        } catch (error) {
            console.error("Error fetching artist songs:", error);
            throw new Error("Failed to fetch artist songs");
        }
    }

    static async fetchTopSongs() {
        try {
            const artistId = this.getUserId();
            if (!artistId) {
                console.error("Artist ID not provided!");
                return [];
            }

            const response = await axios.get(`${this.BASE_URL1}/insights/top-songs/${artistId}`, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching top songs:", error);
            throw new Error("Failed to fetch top songs");
        }
    }

    static async fetchTransactionsArtists() {
        try {
            const userId = this.getManagerId();
            if (!userId) {
                console.error("User ID not found!");
                return [];
            }

            const response = await axios.get(`${this.BASE_URL5}/trans/showTransByManId/${userId}`, {
                headers: this.getHeader(),
            });

            return response.data; // Return fetched data
        } catch (error) {
            console.error("Error fetching transactions:", error);
            throw new Error("Failed to fetch transactions");
        }
    }

    static async exportTransactionsPDF() {
        try {
            const userId = this.getManagerId();
            if (!userId) {
                console.error("User ID not found!");
                return;
            }

            const response = await axios.get(`${this.BASE_URL5}/trans/exportPDF/manager/${userId}`, {
                headers: this.getHeader(),
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement("a");
            a.href = url;
            a.download = "transactions.pdf";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error exporting PDF:", error);
        }
    }

    static async fetchArtistsWithStreams(manId) {
        try {
            console.log("Fetching artists with headers:", this.getHeader());

            const artistsResponse = await axios.get(`${this.BASE_URL2}/user/getArtistUnderManager/${manId}`, {
                headers: this.getHeader(),
            });

            const artistsData = artistsResponse.data;
            if (!Array.isArray(artistsData)) throw new Error("Invalid artists data format");

            // Filter only artists
            const artists = artistsData.filter(user => user.role === "Artist");

            // Fetch total streams per artist
            const streamsResponse = await axios.get(`${this.BASE_URL1}/insights/total-streams-per-artist`, {
                headers: this.getHeader(),
            });

            const streamsData = streamsResponse.data;

            // Map artist data with streams
            return artists.map(artist => ({
                artist: `${artist.firstName} ${artist.lastName}`,
                streams: streamsData[artist.userid] || 0, // Default to 0 if no streams found
            }));
        } catch (error) {
            console.error("Error fetching artists with streams:", error);
            throw new Error("Failed to fetch artists with streams");
        }
    }

    static async fetchArtistsUnderManager(managerId) {
        try {
            if (!managerId) {
                console.error("Manager ID not provided!");
                return [];
            }
            const response = await axios.get(
                `${this.BASE_URL2}/user/getArtistUnderManager/${managerId}`,
                {
                    headers: this.getHeader(),
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching artists:", error);
            throw new Error("Failed to fetch artists");
        }
    }

    static async exportPartnershipPDFMan(artistId) {
        try {
            const response = await axios.get(
                `${this.BASE_URL3}/partnerships/export-pdf-partner/${artistId}`,
                {
                    headers: this.getHeader(),
                    responseType: "blob",
                }
            );

            const blob = new Blob([response.data], { type: "application/pdf" });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = `partnership_contract_${artistId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error exporting contract PDF:", error);
        }
    }

    static async fetchUserStats() {
        try {
            const activeUsersResponse = await axios.get(
                `${this.BASE_URL1}/insights/active-users-count`,
                { headers: this.getHeader() }
            );
            const totalUsersResponse = await axios.get(
                `${this.BASE_URL1}/insights/admin-allusers-count`,
                { headers: this.getHeader() }
            );

            return {
                activeUsers: activeUsersResponse.data,
                totalUsers: totalUsersResponse.data,
            };
        } catch (error) {
            console.error("Error fetching user stats:", error);
            throw new Error("Failed to fetch user stats");
        }
    }

    static async fetchStats(userId) {
        try {
            const [mySongs, myRevenue, myStreams] = await Promise.all([
                axios.get(`${this.BASE_URL1}/insights/mysongs/${userId}`, { headers: this.getHeader() }),
                axios.get(`${this.BASE_URL1}/insights/totalRevenuebyId/${userId}`, { headers: this.getHeader() }),
                axios.get(`${this.BASE_URL1}/insights/totalStreamsById/${userId}`, { headers: this.getHeader() })
            ]);

            return {
                mySongs: mySongs.data,
                myRevenue: myRevenue.data,
                myStreams: myStreams.data,
            };
        } catch (error) {
            console.error("Error fetching stats:", error);
            throw new Error("Failed to fetch statistics");
        }
    }

    static async updatePassword(username, otp, newPassword) {
        try {
            const response = await axios.put(`${this.BASE_URL2}/user/updatePassword`, {
                username,
                otp,
                newPassword,
            });

            if (response.status === 200) {
                toast.success("Password changed successfully!");
                return true;
            }
        } catch (error) {
            console.error("Error updating password:", error);
            toast.error("Failed to update password. " + (error.response ? error.response.data : ""));
            return false;
        }
    }

    static async submitContactForm(formData) {
        try {
            const response = await axios.post(`${this.BASE_URL2}/api/contact/submit`, formData, {
                headers: { "Content-Type": "application/json" },
            });

            if (response.status === 200) {
                toast.success("Your query has been submitted successfully.");
                return true;
            } else {
                toast.error("Error submitting the form. Please try again.");
                return false;
            }
        } catch (error) {
            console.error("Error connecting to the server:", error);
            toast.error("Error connecting to the server.");
            return false;
        }
    }

}