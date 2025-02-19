import axios from "axios";
import CryptoJS from "crypto-js";

export default class ApiService {
    static BASE_URL = "http://localhost:8080";
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

    static getIsFirstLogin(){
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
        const response = await axios.post(`${this.BASE_URL}/auth/register`, registerData)
        return response.data;
    }


    static saveAuthData({ token, userId, role, isFirstLogin, managerId, isActive, expirationTime }) {
        localStorage.setItem("token", this.encrypt(token));
        localStorage.setItem("userId", this.encrypt(userId.toString()));
        localStorage.setItem("role", this.encrypt(role));
        localStorage.setItem("isFirstLogin", (isFirstLogin));
        localStorage.setItem("managerId", this.encrypt(managerId.toString())); // Convert number to string
        localStorage.setItem("isActive",(isActive));
        localStorage.setItem("expirationTime", (expirationTime))
    }    

    static getIsActive(){
        return localStorage.getItem("isActive")
    
    }

    static getManagerId(){
        const encryptedManagerId = localStorage.getItem("managerId");
        return encryptedManagerId ? parseInt(this.decrypt(encryptedManagerId)) : null;
    }
    
  static getUserId() {
        const encryptedUserId = localStorage.getItem("userId");
        return encryptedUserId ? parseInt(this.decrypt(encryptedUserId)) : null;
    }

    static async updateUserProfile(userDetails) {
        try {
            const response = await axios.put(`${this.BASE_URL}/user/update`, userDetails, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    }
          
    static async loginUser(loginData) {
        const response = await axios.post(`${this.BASE_URL}/auth/login`, loginData);
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
            const response = await axios.get(`${this.BASE_URL}/artist/searchByArtistId/${artistId}`, {
                headers: this.getHeader(),
            });

            let fetchedSongs = response.data || [];

            for (const song of fetchedSongs) {
                try {
                    const streamResponse = await axios.get(`${this.BASE_URL}/stream/searchSongId/${song.songId}`,{
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
    
            const response = await axios.get(`${this.BASE_URL}/insights/top-artists/${managerId}`, {
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
        const response = await axios.get(`${this.BASE_URL}/user/getManagers`, { headers: this.getHeader() });
        return response.data;
    } catch (error) {
        console.error("Error fetching managers:", error);
        throw error;
    }
}

// ✅ Fetch artist's assigned manager
static async getArtistManager(artistId) {
    try {
        const response = await axios.get(`${this.BASE_URL}/getArtistUnderManager/${artistId}`, { headers: this.getHeader() });
        return response.data;
    } catch (error) {
        console.error("Error fetching artist's manager:", error);
        throw error;
    }
}

static async sendPartnershipRequest(artistId, managerId, percentage, durationMonths, comments) {
    try {
        const payload = { artistId, managerId, percentage, durationMonths, comments };
        console.log("Sending partnership request:", payload); // Debugging log
        const response = await axios.post(`${this.BASE_URL}/partnerships/request`, payload, { headers: this.getHeader() });
        return response.data;
    } catch (error) {
        console.error("Error sending partnership request:", error);
        throw error;
    }
}

// ✅ Get pending partnership requests for a manager
static async getManagerRequests(managerId) {
    try {
        const response = await axios.get(`${this.BASE_URL}/partnerships/requests/${managerId}`, { headers: this.getHeader() });
        return response.data;
    } catch (error) {
        console.error("Error fetching manager requests:", error);
        throw error;
    }
}

// ✅ Get artist-partnership record
static async getArtistPartnership(artistId) {
    try {
        const response = await axios.get(`${this.BASE_URL}/partnerships/latest/${artistId}`, { headers: this.getHeader() });
        return response.data;
    } catch (error) {
        console.error("Error fetching manager requests:", error);
        throw error;
    }
}

// ✅ Accept or reject a partnership request
static async respondToPartnershipRequest(requestId, status) {
    try {
        const response = await axios.put(`${this.BASE_URL}/partnerships/respond/${requestId}?status=${status}`, 
            {},  // Empty body, since status is sent as query param
            { headers: this.getHeader() }
        );
        return response.data;
    } catch (error) {
        console.error("Error responding to partnership request:", error.response || error);
        alert(error.response?.data?.message || "Failed to respond.");
        throw error;
    }
}



    static async getRoyalties() {
    const response = await axios.get(`${this.BASE_URL}/royalty/royaltyList`, {
        headers: this.getHeader(),
    });
    if (!response.ok) {
        throw new Error("Failed to fetch royalties");
    }
    return await response.json();
}

static async getPendingPartnershipRequest(artistId) {
    try {
        const response = await axios.get(`/partnerships/pending/${artistId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching pending partnership request:", error);
        throw error;
    }
}

static async getTotalSongs(managerId) {
    try {
        const response = await axios.get(`${this.BASE_URL}/total-songs/${managerId}`, { headers: this.getHeader() });
        return response.data;
    } catch (error) {
        console.error("Error fetching total songs:", error);
        throw error;
    }
}

static async getTotalStreams(managerId) {
    try {
        const response = await axios.get(`${this.BASE_URL}/total-streams/${managerId}`, { headers: this.getHeader() });
        return response.data;
    } catch (error) {
        console.error("Error fetching total streams:", error);
        throw error;
    }
}

static async getManagerRevenue(managerId) {
    try {
        const response = await axios.get(`${this.BASE_URL}/manager-revenue/${managerId}`, { headers: this.getHeader() });
        return response.data;
    } catch (error) {
        console.error("Error fetching manager revenue:", error);
        throw error;
    }
}

static async getTotalRevenue(managerId) {
    try {
        const response = await axios.get(`${this.BASE_URL}/total-revenue/${managerId}`, { headers: this.getHeader() });
        return response.data;
    } catch (error) {
        console.error("Error fetching total revenue:", error);
        throw error;
    }
}

static async payRoyalty(royaltyId, adminId) {
    const response = await axios.put(`${this.BASE_URL}/royalty/payRoyalty/${royaltyId}/${adminId}`, {
        method: "PUT",
        headers: this.getHeader(),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to process payment");
    }

    return await response.json();
}

static async exportTransByUsersPDF(userId) {
    try {
        const response = await axios.get(`${this.BASE_URL}/trans/exportPDF/${userId}`, {
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
        const response = await axios.get(`${this.BASE_URL}/trans/exportPDF/manager/${managerId}`, {
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
        const response = await axios.get(`${this.BASE_URL}/partnerships/export-pdf-partner/${artistId}`, {
            headers: this.getHeader(),
            responseType: "blob",
        });

        return response.data;
    } catch (error) {
        console.error("Error exporting contract PDF:", error);
        throw error;
    }
}

static async exportTransPDF() {
    try {
        const response = await axios.get(`${this.BASE_URL}/trans/export-pdf`, {
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
    static logout(){
        this.clearAuth()
    }

    static isAuthenticated(){
        const token = this.getToken();
        return !!token;
    }

    static isManager(){
        const role = this.getRole();
        return role === "Manager";
    }

    static isArtist(){
        const role = this.getRole();
        return role === "Artist";
    }

    static isAdmin(){
        const role = this.getRole();
        return role === "Admin";
    }

    static async getLoggedInUsesInfo() {
        const response = await axios.get(`${this.BASE_URL}/user/current`, {
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
            const response = await axios.get(`${this.BASE_URL}/user/searchUser/${managerId}`, {
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
    
    

}