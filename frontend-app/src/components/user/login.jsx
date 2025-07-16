import { Link, useNavigate } from 'react-router-dom';
import { Login as apiLogin } from '../../api/user.js';
import { alertError } from "../../lib/alert";
import { useState } from 'react';
import { useLocalStorage } from 'react-use';

export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [_, setToken] = useLocalStorage("token", "");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        const response = await apiLogin({email, password});
        const responseBody = await response.json();
        
        if (response.status === 200) {
            setToken(responseBody.data.token);
            setEmail('');
            setPassword('');
            navigate('/dashboard');
        } else {
            await alertError(responseBody.message);
        }
    }

    return <>
        <div className="animate-fade-in bg-gray-800 bg-opacity-80 p-8 rounded-xl shadow-custom border border-gray-700 backdrop-blur-sm w-full max-w-md">
            <div className="text-center mb-8">
                <div className="inline-block p-3 bg-gradient rounded-full mb-4">
                    <i className="fas fa-user-plus text-3xl text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white">ERP System</h1>
                <p className="text-gray-300 mt-2">Login account</p>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                <label
                    htmlFor="email"
                    className="block text-gray-300 text-sm font-medium mb-2"
                >
                    Email
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-user text-gray-500" />
                    </div>
                    <input
                    type="text"
                    id="email"
                    name="email"
                    className="w-full pl-10 pr-3 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter your email"
                    required
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                </div>
                <div className="mb-4">
                <label
                    htmlFor="password"
                    className="block text-gray-300 text-sm font-medium mb-2"
                >
                    Password
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-lock text-gray-500" />
                    </div>
                    <input
                    type="password"
                    id="password"
                    name="password"
                    className="w-full pl-10 pr-3 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter you password"
                    required
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                </div>
                <div className="mb-6">
                <button
                    type="submit"
                    className="w-full bg-gradient text-white py-3 px-4 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 font-medium shadow-lg transform hover:-translate-y-0.5"
                >
                    <i className="fas fa-user mr-2" /> Login
                </button>
                </div>
                <div className="text-center">
                    <p className="text-gray-400">Don't have an account? <Link to="/register" className="text-blue-400 hover:text-blue-300">Create an account</Link></p>
                </div>
            </form>
        </div>
    </>
}