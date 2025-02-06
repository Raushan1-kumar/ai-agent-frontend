import { useNavigate } from "react-router-dom";
import axios from "../config/axios";
import { useState } from "react";

function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
 
     const handleSubmit = async(event) => {
         event.preventDefault();
          await axios.post('/user/register', { email, password })
             .then(response => {
                 console.log(response.data);
                navigate('/login');
                 // Handle successful login, e.g., redirect to another page or store token
             })
             .catch(error => {
                 console.error('There was an error logging in!', error);
                 // Handle login error, e.g., show error message to user
             });
     };
    return ( 
    <>
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-white mb-6">Register</h2>
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
                            onChange={(e)=>{setPassword(e.target.value)}}
                            id="password"
                            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Register
                    </button>
                </form>
                <p className="text-gray-400 mt-4">
                    Already have an account? <a href="/login" className="text-blue-500 hover:underline">sign in</a>
                </p>
            </div>
        </div>
    </> 
    );
}

export default Register;