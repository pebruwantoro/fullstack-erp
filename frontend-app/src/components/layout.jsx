import { Outlet } from 'react-router';
import Sidebar from './sidebar.jsx';
import ThemeToggle from './themeToggle.jsx';

export function Layout() {
  return (
    <>
      <div className="relative bg-gray-100 dark:bg-slate-900 min-h-screen flex items-center justify-center p-4 transition-colors duration-300">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <Outlet />
    </div>
    </>
  );
}

export function SideBarLayout({ children }) {
  const mainContentClasses = `flex-grow p-8 ${
    children ? 'overflow-auto' : 'flex items-center justify-center'
  }`;

  return (
    <div className="w-full flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white font-sans">
      <Sidebar />
      <main className={mainContentClasses}>
        {children ? children : (
          <div className="text-center text-gray-400 dark:text-gray-500">
            <i className="fas fa-desktop text-6xl mb-4"></i>
            <p>No content to display.</p>
          </div>
        )}
      </main>
    </div>
  );
}