import { useLocalStorage } from "react-use";
import { Link, useNavigate, useLocation } from "react-router";
import { UserRole } from "../constant/constant";

export default function Sidebar() {
    const [_, setToken] = useLocalStorage("token");
    const [role, setRole] = useLocalStorage("role");
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        setToken('');
        setRole('');
        navigate('/login');
    };

    const menuItems = [
        { path: '/dashboard', icon: 'fa-box-open', label: 'Products' },
        { path: '/quotations', icon: 'fa-file-invoice-dollar', label: 'Quotations' },
    ];
    
    if(role === UserRole.SALES) {
        menuItems.push({ path: '/sales-orders', icon: 'fa-shopping-cart', label: 'Sales Orders' })
    }

    return (
        <aside className="w-64 bg-gray-800 p-6 flex flex-col flex-shrink-0">
            <div>
                <div className="flex items-center mb-10">
                    <i className="fas fa-cubes text-blue-400 text-3xl mr-3"></i>
                    <h1 className="text-xl font-bold">ERP System</h1>
                </div>
                <nav>
                    <ul>
                        {menuItems.map(item => (
                            <li key={item.path} className="mb-4">
                                <Link to={item.path} className={`flex items-center p-3 rounded-lg transition-colors ${
                                    location.pathname === item.path 
                                    ? 'bg-blue-500 bg-opacity-30 text-blue-300' 
                                    : 'text-gray-400 hover:bg-gray-700'
                                }`}>
                                    <i className={`fas ${item.icon} w-6`} />
                                    <span className={location.pathname === item.path ? 'font-semibold' : ''}>{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <div className="flex-grow"></div>
            <div>
                <button onClick={handleLogout} className="w-full flex items-center p-3 text-gray-400 hover:bg-gray-700 rounded-lg transition-colors text-left">
                    <i className="fas fa-sign-out-alt w-6" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}