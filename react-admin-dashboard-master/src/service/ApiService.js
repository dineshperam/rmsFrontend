import axios from "axios";
import CryptoJS from "crypto-js";

export default class ApiService {
    static BASE_URL = "http://localhost:8080";
    static ENCRYPTION_KEY = "dinesh-dev-royalty";


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


    static saveAuthData({ token, userId, role, isFirstLogin, managerId,isActive }) {
        localStorage.setItem("token", this.encrypt(token));
        localStorage.setItem("userId", this.encrypt(userId.toString()));
        localStorage.setItem("role", this.encrypt(role));
        localStorage.setItem("isFirstLogin", (isFirstLogin));
        localStorage.setItem("managerId", this.encrypt(managerId.toString())); // Convert number to string
        localStorage.setItem("isActive",(isActive));
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


}