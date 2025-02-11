import { useState, useEffect } from "react";
import ApiService from "../../service/ApiService";
import SettingSection from "./SettingSection";
import { User } from "lucide-react";

const ProfileAdmin = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await ApiService.getLoggedInUsesInfo();
        const filteredUser = {
          username: userInfo.username,
          email: userInfo.email,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          mobileNo: userInfo.mobileNo,
          address: userInfo.address,
          role: userInfo.role,
        };
        setUser(filteredUser);
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error fetching user info: " + error
        );
      }
    };
    fetchUserInfo();
  }, []);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage(null);
    }, 4000);
  };

  return (
    <SettingSection icon={User} title="Profile">
      <div className="flex flex-col items-center p-6">
        {message && (
          <div className="bg-red-100 text-red-600 p-3 mb-4 rounded-md border border-red-400">
            {message}
          </div>
        )}

        {user && (
          <div className="p-6 w-full max-w-lg text-white">
            <h1 className="text-2xl font-semibold text-white mb-4 text-center">
              Hello, {user.firstName} {user.lastName} 🥳
            </h1><br/>
            <div className="space-y-4 text-white">
              <ProfileItem label="Username" value={user.username} />
              <ProfileItem label="Email" value={user.email} />
              <ProfileItem label="Phone Number" value={user.mobileNo} />
              <ProfileItem label="Address" value={user.address} />
              <ProfileItem label="Role" value={user.role} />
            </div>
          </div>
        )}
      </div>
    </SettingSection>
  );
};

const ProfileItem = ({ label, value }) => (
  <div className="flex justify-between pb-2">
    <span className="text-lg text-white">{label}:</span>
    <span className="text-white text-lg">{value}</span>
  </div>
);

export default ProfileAdmin;
