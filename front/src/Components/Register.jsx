
// dipak code 

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/register', form);
      toast.success('Registration successful! Redirecting to login...', {
        position: 'top-center',
        autoClose: 2000,
      });
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      console.error('Registration failed:', err);
      toast.error('Registration failed. Please try again.', {
        position: 'top-center',
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="flex flex-col min-h-screen bg-[#0A192F] text-white">
        <div className="w-full p-4 flex-grow flex items-center justify-center">
          <div className="bg-[#112240] shadow-lg rounded-lg max-w-md w-full p-9">
            <h2 className="text-3xl font-bold text-center text-[#64FFDA] mb-6">Create Account</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-[#E6F1FF] mb-1">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  placeholder="Enter username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-2 border border-[#64FFDA] rounded-lg bg-[#1C2B43] text-white focus:outline-none focus:ring-2 focus:ring-[#64FFDA]"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#E6F1FF] mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-2 border border-[#64FFDA] rounded-lg bg-[#1C2B43] text-white focus:outline-none focus:ring-2 focus:ring-[#64FFDA]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-[#64FFDA] text-[#0A192F] font-semibold rounded-lg hover:bg-[#08e7ba] transition"
              >
                Register
              </button>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Register;
