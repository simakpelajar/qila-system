import {
  BarChart2,
  ChartBarStacked,
  Menu,
  Settings,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  Users,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Api from "../../api";


const SIDEBAR_ITEMS = [
  {
    name: "Overview",
    icon: BarChart2,
    color: "#6366f1",
    href: "/user/overview-user",  // tambahkan slash di depan
  },
  {
    name: "Courses",
    icon: ShoppingBag,
    color: "#8B5CF6",
    href: "/user/course-user"     // tambahkan slash di depan
  },
  {
    name: "Raport Detail",
    icon: Users,
    color: "#EC4899",
    href: "/user/raport-user",    // tambahkan slash di depan
  },
  {
    name: "Logout",
    icon: LogOut,
    color: "#3B82F6",
    href: "/",
  },
];

const SidebarUser = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {

      await Api.post('/logout');

      localStorage.removeItem('token');
      toast.success("Logout berhasil");

    } catch (error) {
      console.error('Error during logout:', error);
      toast.error("Gagal logout");
    }
  };

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarOpen ? "w-64" : "w-20"
        }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className="h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
        >
          <Menu size={24} />
        </motion.button>

        <nav className="mt-8 flex-grow">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={item.name === "Logout" ? handleLogout : null}
              >
                <motion.div
                  className={`flex items-center p-4 text-sm font-medium rounded-lg transition-colors mb-2 ${isActive
                      ? 'bg-gray-700 text-white'
                      : 'hover:bg-gray-700/50 text-gray-300 hover:text-white'
                    }`}
                >
                  <item.icon
                    size={20}
                    style={{ color: isActive ? 'white' : item.color, minWidth: "20px" }}
                  />
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span
                        className="ml-4 whitespace-nowrap"
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
            );
          })}
        </nav>
      </div>
    </motion.div>
  );
};

export default SidebarUser;