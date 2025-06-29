import { NavLink } from 'react-router-dom';
import {
  FiHome,
  FiUser,
  FiSettings,
  FiLogOut,
  FiTruck,
  FiCalendar,
  FiCreditCard,
  FiBell,
  FiMap,
  FiGift,
  FiShield,
  FiDollarSign
} from 'react-icons/fi';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard Home', path: '/dashboard', icon: <FiHome /> },
    { name: 'Profile Info', path: '/dashboard/profile', icon: <FiUser /> },
    { name: 'Bookings & Appointments', path: '/dashboard/bookings', icon: <FiCalendar /> },
    { name: 'My Cars', path: '/dashboard/cars', icon: <FiTruck /> },
    { name: 'Payments', path: '/dashboard/payments', icon: <FiCreditCard /> },
    { name: 'AI Car Match', path: '/dashboard/recommendations', icon: <FiShield /> },
    { name: 'Offers & Deals', path: '/dashboard/offers', icon: <FiGift /> },
    { name: 'Documents & Legal', path: '/dashboard/documents', icon: <FiMap /> },
    { name: 'Notifications', path: '/dashboard/notifications', icon: <FiBell /> },
    { name: 'Security Settings', path: '/dashboard/security', icon: <FiSettings /> },
    { name: 'Logout', path: '/logout', icon: <FiLogOut /> },
  ];

  return (
    <aside className="w-64 bg-green-950 text-white min-h-screen p-4 shadow-xl hidden md:block">
      <div className="text-2xl font-bold mb-8 text-center">Justice Dashboard</div>
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-green-700 hover:shadow-lg ${
                  isActive ? 'bg-green-700 font-semibold' : 'bg-green-800'
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
