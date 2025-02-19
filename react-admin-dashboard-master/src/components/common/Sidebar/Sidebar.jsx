import { BarChart2, CirclePlus, DollarSign, List, LogOut, Menu, UserPen, UserPlus, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import ApiService from "../../../service/ApiService";

const SIDEBAR_ITEMS = {
	Admin: [
		{ name: "Overview", icon: BarChart2, color: "#6366f1", path: "/adminDashboard" },
		{ name: "Users", icon: Users, color: "#EC4899", path: "/allUsers" },
		{ name: "Transaction History", icon: DollarSign, color: "#10B981", path: "/allTransactions" },
		{ name: "Add Users", icon: Users, color: "#10B981", path: "/addUser" },
		{ name: "All Songs", icon: List, color: "#10B981", path: "/allSongs" },
		{ name: "Royalties", icon: DollarSign, color: "#10B981", path: "/royalties" },
		{ name: "Contact Requests", icon: UserPen, color: "#6EE7B7", path: "/contactRequests" },
		{ name: "Admin Profile", icon: UserPen, color: "#6EE7B7", path: "/myInfo" },

	],
	Manager: [
		{ name: "Overview", icon: BarChart2, color: "#6366f1", path: "/managerDashboard" },
		{ name: "List of all songs", icon: List, color: "#EC4899", path: "/all-Msongs" },
		{ name: "Artists Under Manager", icon: Users, color: "#EC4899", path: "/manager-artists" },
		{ name: "Artist's Transactions", icon: DollarSign, color: "#10B981", path: "/man-artist-trans" },
		{ name: "My Transactions", icon: DollarSign, color: "#10B981", path: "/manager-transactions" },
		{ name: "Partnership Requests", icon: Users, color: "#6EE7B7", path: "/manager-requests" },
		{ name: "Manager Profile", icon: UserPen, color: "#6EE7B7", path: "/myInfo" },
	],
	Artist: [
		{ name: "Overview", icon: BarChart2, color: "#6366f1", path: "/artistDashboard" },
		{ name: "Artist's Songs", icon: List, color: "#10B981", path: "/artistSongs" },
		{ name: "List of all songs", icon: List, color: "#10B981", path: "/allArtistSongs" },
		{ name: "Add Song", icon: CirclePlus, color: "#10B981", path: "/addSong" },
		{ name: "Transaction History", icon: DollarSign, color: "#10B981", path: "/transactionHistory" },
		{ name: "Partnerships", icon: UserPlus, color: "#6EE7B7", path: "/artist-requests" },
		{ name: "Manager's Profile", icon: Users, color: "#6EE7B7", path: "/my-manager-details" },
		{ name: "Artist's Profile", icon: UserPen, color: "#6EE7B7", path: "/myInfo" },
	],
};

const LOGOUT_ITEM = {
	name: "Logout",
	icon: LogOut,
	color: "#6EE7B7",
	path: "/",
};

const Sidebar = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [role, setRole] = useState(""); // Track user role dynamically

	// Fetch role on component mount and when authentication changes
	useEffect(() => {
		const fetchRole = () => {
			if (ApiService.isAuthenticated()) {
				if (ApiService.isAdmin()) {
					setRole("Admin");
				} else if (ApiService.isManager()) {
					setRole("Manager");
				} else if (ApiService.isArtist()) {
					setRole("Artist");
				} else {
					setRole("");
				}
			} else {
				setRole("");
			}
		};

		// Initial role fetch
		fetchRole();

		// Listen for storage updates in case role changes
		const handleStorageChange = () => fetchRole();
		window.addEventListener("storage", handleStorageChange);

		return () => {
			window.removeEventListener("storage", handleStorageChange);
		};
	}, []);

	const sidebarItems = SIDEBAR_ITEMS[role] || [];

	return (
		<motion.div
			className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
				isSidebarOpen ? "w-64" : "w-20"
			}`}
			animate={{ width: isSidebarOpen ? 256 : 80 }}
		>
			<div className='h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700'>
				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={() => setIsSidebarOpen(!isSidebarOpen)}
					className='p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit'
				>
					<Menu size={24} />
				</motion.button>

				<nav className='mt-8 flex-grow'>
					{sidebarItems.map((item) => (
						<Link key={item.path} to={item.path}>
							<motion.div className='flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2'>
								<item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
								<AnimatePresence>
									{isSidebarOpen && (
										<motion.span
											className='ml-4 whitespace-nowrap'
											initial={{ opacity: 0, width: 0 }}
											animate={{ opacity: 1, width: "auto" }}
											exit={{ opacity: 0, width: 0 }}
											transition={{ duration: 0.2, delay: 0.3 }}
										>
											{item.name}
										</motion.span>
									)}
								</AnimatePresence>
							</motion.div>
						</Link>
					))}
					<div onClick={ApiService.clearAuth}>
		<Link to={LOGOUT_ITEM.path}>
			<motion.div className='flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2'>
				<LOGOUT_ITEM.icon size={20} style={{ color: LOGOUT_ITEM.color, minWidth: "20px" }} />
				<AnimatePresence>
					{isSidebarOpen && (
						<motion.span
							className='ml-4 whitespace-nowrap'
							initial={{ opacity: 0, width: 0 }}
							animate={{ opacity: 1, width: "auto" }}
							exit={{ opacity: 0, width: 0 }}
							transition={{ duration: 0.2, delay: 0.3 }}
						>
							{LOGOUT_ITEM.name}
						</motion.span>
					)}
				</AnimatePresence>
			</motion.div>
		</Link>
	</div>
				</nav>
			</div>
		</motion.div>
	);
};

export default Sidebar;
