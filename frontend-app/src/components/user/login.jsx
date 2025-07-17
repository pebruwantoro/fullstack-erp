import { Link, useNavigate } from 'react-router-dom';
import { Login as apiLogin, MyProfile as userProfile } from '../../api/user.js';
import { alertError } from "../../lib/alert";
import { useState } from 'react';
import { useLocalStorage } from 'react-use';

export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [_, setToken] = useLocalStorage("token", "");
    const navigate = useNavigate();
    const [__, setRole] = useLocalStorage("role", "");

    async function handleSubmit(e) {
        e.preventDefault();

        const response = await apiLogin({email, password});
        const responseBody = await response.json();
        
        if (response.status === 200) {
            setToken(responseBody.data.token);
            setEmail('');
            setPassword('');
            await handleSetRole(responseBody.data.token);
            navigate('/dashboard');
        } else {
            await alertError(responseBody.message);
        }
    }

    async function handleSetRole(tokenUser) {
        const response = await userProfile(tokenUser)
        const responseBody = await response.json();
        
        if (response.status === 200) {
            setRole(responseBody.data.role);
        } else {
            await alertError(responseBody.message);
        }
    }

    return (
        <>
            <div className="animate-fade-in bg-white dark:bg-slate-800/80 p-8 rounded-xl shadow-lg dark:shadow-slate-900/50 border border-gray-200 dark:border-slate-700 backdrop-blur-sm w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-block p-3 bg-blue-600 dark:bg-blue-500 rounded-full mb-4">
                        <i className="fas fa-user-plus text-3xl text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">ERP System</h1>
                    <p className="text-gray-500 dark:text-gray-300 mt-2">Login account</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2"
                        >
                            Email
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i className="fas fa-user text-gray-400 dark:text-gray-500" />
                            </div>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                className="w-full pl-10 pr-3 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                placeholder="Enter your email"
                                required
                                value={email} onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i className="fas fa-lock text-gray-400 dark:text-gray-500" />
                            </div>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="w-full pl-10 pr-3 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                placeholder="Enter your password"
                                required
                                value={password} onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="mb-6">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                        >
                            <i className="fas fa-user mr-2" /> Login
                        </button>
                    </div>
                    <div className="text-center">
                        {/* Link text */}
                        <p className="text-gray-600 dark:text-gray-400">
                            Don't have an account? <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">Create an account</Link>
                        </p>
                    </div>
                </form>
            </div>
        </>
    );
}