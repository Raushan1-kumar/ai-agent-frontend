import { useState, useContext } from "react";
import axios from '../config/axios';
import { UserContext } from "../context/user.context"; 
import { useNavigate } from "react-router-dom";

function Login() {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const { setUser } = useContext(UserContext); 

  const navigate = useNavigate();
  const handleSubmit = async(event) => {
    event.preventDefault();
    try {
        const response = await axios.post('/user/login', { email, password });
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user); // This will now persist
        navigate('/');
    } catch (error) {
        console.error('There was an error logging in!', error);
    }
};
    return ( 
    <>
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-white mb-6">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-2" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            onChange={(e)=>{setEmail(e.target.value)}}
                            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-400 mb-2" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e)=>{setPassword(e.target.value)}}
                            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Login
                    </button>
                </form>
                <p className="text-gray-400 mt-4">
                    Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Create account</a>
                </p>
            </div>
        </div>
    </> 
    );
}

export default Login;