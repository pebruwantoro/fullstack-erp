import {Outlet} from 'react-router';
import Sidebar from './sidebar.jsx';

export function Layout() {
  return <>
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen flex items-center justify-center p-4">
      <Outlet/>
    </div>
  </>
}

export function SideBarLayout({ children }) {
    const mainContentClasses = `flex-grow p-8 ${
        children ? 'overflow-auto' : 'flex items-center justify-center'
    }`;

    return (
        <div className="w-full flex h-screen overflow-hidden bg-gray-900 text-white font-sans">
            <Sidebar />
            <main className={mainContentClasses}>
                {children ? children : (
                    <div className="text-center text-gray-500">
                        <i className="fas fa-desktop text-6xl mb-4"></i>
                        <p>No content to display.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
