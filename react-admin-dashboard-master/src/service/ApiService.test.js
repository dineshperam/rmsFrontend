// ApiService.test.js
import axios from "axios";
import ApiService from "./ApiService"; // Adjust the path to where your ApiService file is located
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";

// Mock axios and toast so that network calls and notifications are not actually performed.
jest.mock("axios");
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

// A helper function to simulate localStorage in tests
const localStorageMock = (() => {
  let store = {};
  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("ApiService", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe("Encryption/Decryption", () => {
    it("should encrypt and decrypt data correctly", () => {
      const data = "sampleData";
      const encrypted = ApiService.encrypt(data);
      const decrypted = ApiService.decrypt(encrypted.toString());
      expect(decrypted).toBe(data);
    });
  });

  describe("Token Handling", () => {
    it("getToken should return token if available", () => {
      const token = "mytoken";
      const encryptedToken = ApiService.encrypt(token).toString();
      localStorage.setItem("token", encryptedToken);
      expect(ApiService.getToken()).toBe(token);
    });

    it("getToken should return null if token is not in localStorage", () => {
      localStorage.removeItem("token");
      expect(ApiService.getToken()).toBeNull();
    });
  });

  describe("API calls", () => {
    it("registerUser should post to the correct endpoint and return response data", async () => {
      const registerData = { username: "user", password: "pass" };
      const responseData = { success: true };
      axios.post.mockResolvedValue({ data: responseData });

      const result = await ApiService.registerUser(registerData);
      expect(axios.post).toHaveBeenCalledWith(
        `${ApiService.BASE_URL2}/auth/register`,
        registerData
      );
      expect(result).toEqual(responseData);
    });

    it("loginUser should call axios.post, save auth data if token exists, and return response data", async () => {
      const loginData = { username: "user", password: "pass" };
      const responseData = {
        token: "logintoken",
        userId: 1,
        role: "Artist",
        isFirstLogin: "false",
        managerId: 2,
        isActive: "true",
        expirationTime: "1234567890",
      };
      axios.post.mockResolvedValue({ data: responseData });
      const saveAuthDataSpy = jest.spyOn(ApiService, "saveAuthData");

      const result = await ApiService.loginUser(loginData);
      expect(axios.post).toHaveBeenCalledWith(
        `${ApiService.BASE_URL2}/auth/login`,
        loginData
      );
      expect(saveAuthDataSpy).toHaveBeenCalledWith(responseData);
      expect(result).toEqual(responseData);
    });

    it("updateUserProfile should call axios.put with correct URL, data, and headers", async () => {
      const userDetails = { firstName: "John" };
      const responseData = { success: true };
      axios.put.mockResolvedValue({ data: responseData });

      // Ensure a token exists in localStorage so getHeader returns proper headers.
      localStorage.setItem("token", ApiService.encrypt("testtoken").toString());
      const expectedHeaders = ApiService.getHeader();

      const result = await ApiService.updateUserProfile(userDetails);
      expect(axios.put).toHaveBeenCalledWith(
        `${ApiService.BASE_URL2}/user/update`,
        userDetails,
        { headers: expectedHeaders }
      );
      expect(result).toEqual(responseData);
    });

    it("getArtistWithStreamCounts should fetch songs and then their stream counts", async () => {
      // Set a userId in localStorage so that getUserId() returns a value.
      localStorage.setItem("userId", ApiService.encrypt("1").toString());
      const songs = [{ songId: 10 }];
      // Simulate two axios.get calls: one for artist songs and one for stream count.
      axios.get.mockImplementation((url) => {
        if (url.includes("/artist/searchByArtistId/")) {
          return Promise.resolve({ data: songs });
        }
        if (url.includes("/stream/searchSongId/")) {
          return Promise.resolve({ data: [{ streamCount: 100 }] });
        }
      });

      const result = await ApiService.getArtistWithStreamCounts();
      expect(result).toHaveLength(1);
      expect(result[0].streamCount).toBe(100);
    });

    it("sendPartnershipRequest should post the correct payload and return response data", async () => {
      const artistId = 1;
      const managerId = 2;
      const percentage = 10;
      const durationMonths = 12;
      const comments = "Test request";
      const responseData = { success: true };
      axios.post.mockResolvedValue({ data: responseData });
      localStorage.setItem("token", ApiService.encrypt("testtoken").toString());

      const result = await ApiService.sendPartnershipRequest(
        artistId,
        managerId,
        percentage,
        durationMonths,
        comments
      );
      expect(axios.post).toHaveBeenCalledWith(
        `${ApiService.BASE_URL3}/partnerships/request`,
        { artistId, managerId, percentage, durationMonths, comments },
        { headers: ApiService.getHeader() }
      );
      expect(result).toEqual(responseData);
    });

    it("getLoggedInUsesInfo should call axios.get with correct endpoint and headers", async () => {
      const responseData = { id: 1, name: "User" };
      axios.get.mockResolvedValue({ data: responseData });
      localStorage.setItem("token", ApiService.encrypt("testtoken").toString());

      const result = await ApiService.getLoggedInUsesInfo();
      expect(axios.get).toHaveBeenCalledWith(
        `${ApiService.BASE_URL2}/user/current`,
        { headers: ApiService.getHeader() }
      );
      expect(result).toEqual(responseData);
    });
  });

  describe("Error Handling", () => {
    it("updateUserProfile should throw an error when axios.put fails", async () => {
      const userDetails = { firstName: "John" };
      const errorMessage = "Network Error";
      axios.put.mockRejectedValue(new Error(errorMessage));
      localStorage.setItem("token", ApiService.encrypt("testtoken").toString());

      await expect(ApiService.updateUserProfile(userDetails)).rejects.toThrow(errorMessage);
    });
  });
});
