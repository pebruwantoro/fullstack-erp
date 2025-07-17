import { useTheme } from '../hooks/useTheme.jsx'; 
export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? (
                <i className="fas fa-moon text-lg" />
            ) : (
                <i className="fas fa-sun text-lg" />
            )}
        </button>
    );
}