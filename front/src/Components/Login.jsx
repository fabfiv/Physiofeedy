// dipak new code with firebase 

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from '../../shared/firebaseConfig';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { Toaster, toast } from 'react-hot-toast';
import Navbar from './Navbar';
import Footer from './Footer';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/login', form);
      localStorage.setItem('token', res.data.token);
      toast.success('🚀 Login Successful!', {
        style: {
          background: '#0A192F',
          color: '#64FFDA',
          border: '1px solid #64FFDA',
        },
        iconTheme: {
          primary: '#64FFDA',
          secondary: '#0A192F',
        },
      });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      toast.error('❌ Invalid username or password!', {
        style: {
          background: '#0A192F',
          color: '#FF6B6B',
          border: '1px solid #FF6B6B',
        },
        iconTheme: {
          primary: '#FF6B6B',
          secondary: '#0A192F',
        },
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      toast.success('🎉 Google Login Successful!', {
        style: {
          background: '#0A192F',
          color: '#64FFDA',
          border: '1px solid #64FFDA',
        },
        iconTheme: {
          primary: '#64FFDA',
          secondary: '#0A192F',
        },
      });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      toast.error('❌ Google Login Failed!', {
        style: {
          background: '#0A192F',
          color: '#FF6B6B',
          border: '1px solid #FF6B6B',
        },
        iconTheme: {
          primary: '#FF6B6B',
          secondary: '#0A192F',
        },
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      toast('👋 Signed out successfully!', {
        icon: '👋',
        style: {
          background: '#0A192F',
          color: '#64FFDA',
          border: '1px solid #64FFDA',
        },
      });
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  return (
    <>
      <Navbar />
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex flex-col min-h-screen bg-[#0A192F] text-white">
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="bg-[#112240] shadow-lg rounded-lg max-w-md w-full p-9">
            {user ? (
              <>
                <h2 className="text-2xl font-bold text-center text-[#64FFDA] mb-6">
                  Welcome, {user.displayName}!
                </h2>
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt="User"
                    width={80}
                    height={80}
                    className="rounded-full mx-auto mb-4"
                  />
                )}
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition mb-4"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-center text-[#64FFDA] mb-6">
                  Login
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#E6F1FF] mb-1">
                      Username
                    </label>
                    <input
                      name="username"
                      type="text"
                      placeholder="Enter username"
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg bg-[#1C2B43] text-white focus:outline-none focus:ring-2 focus:ring-[#64FFDA]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#E6F1FF] mb-1">
                      Password
                    </label>
                    <input
                      name="password"
                      type="password"
                      placeholder="Enter password"
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg bg-[#1C2B43] text-white focus:outline-none focus:ring-2 focus:ring-[#64FFDA]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#64FFDA] text-[#0A192F] font-semibold py-2 rounded-lg hover:bg-[#08e7ba] transition"
                  >
                    Log In
                  </button>
                </form>

                <div className="mt-6 flex items-center justify-center">
                  <span className="text-[#A8B2D1]">or</span>
                </div>

                <button
                  onClick={handleGoogleLogin}
                  className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition"
                >
                  Sign in with Google
                </button>

                <p className="mt-4 text-sm text-center text-[#A8B2D1]">
                  Don’t have an account?{' '}
                  <a href="/register" className="text-[#64FFDA] hover:underline">
                    Register
                  </a>
                </p>
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Login;



// // dipak code 
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { setToken } from '../utils/auth';
// import Navbar from './Navbar';
// import Footer from './Footer';

// const Login = () => {
//   const [form, setForm] = useState({ username: '', password: '' });
//   const navigate = useNavigate();

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://localhost:8080/login', form);
//       setToken(res.data.token);
//       navigate('/dashboard');
//     } catch (err) {
//       alert('Invalid credentials');
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="flex flex-col min-h-screen bg-[#0A192F] text-white">
//         <div className="w-full p-4 flex-grow flex items-center justify-center">
//           <div className="bg-[#112240] shadow-lg rounded-lg max-w-md w-full p-9">
//             <h2 className="text-3xl font-bold text-center text-[#64FFDA] mb-6">Login</h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-[#E6F1FF] mb-1">Username</label>
//                 <input
//                   name="username"
//                   type="text"
//                   placeholder="Enter username"
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-2 border rounded-lg bg-[#1C2B43] text-white focus:outline-none focus:ring-2 focus:ring-[#64FFDA]"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-[#E6F1FF] mb-1">Password</label>
//                 <input
//                   name="password"
//                   type="password"
//                   placeholder="Enter password"
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-2 border rounded-lg bg-[#1C2B43] text-white focus:outline-none focus:ring-2 focus:ring-[#64FFDA]"
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="w-full bg-[#64FFDA] text-[#0A192F] font-semibold py-2 rounded-lg hover:bg-[#08e7ba] transition"
//               >
//                 Log In
//               </button>
//             </form>
//             <p className="mt-4 text-sm text-center text-[#A8B2D1]">
//               Don’t have an account?{' '}
//               <a href="/register" className="text-[#64FFDA] hover:underline">
//                 Register
//               </a>
//             </p>
//           </div>
//         </div>
//         <Footer />
//       </div>
//     </>
//   );
// };

// export default Login;









// girish code 

// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { setToken } from '../utils/auth';
// import Navbar from './Navbar';
// import Footer from './Footer';

// const Login = () => {
//   const [form, setForm] = useState({ username: '', password: '' });
//   const navigate = useNavigate();

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://localhost:8080/login', form);
//       setToken(res.data.token);
//       navigate('/dashboard');
//     } catch (err) {
//       alert('Invalid credentials');
//     }
//   };

//   return (
//    <>
//    <Navbar/>
//    <div className="w-full p-4 h-full  mx-auto  items-center-safe ">
//       <div className="bg-gray-200 shadow-lg rounded-lg max-w-md w-7xl p-9 items-center-safe">
//         <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
//             <input
//               name="username"
//               type="text"
//               placeholder="Enter username"
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//             <input
//               name="password"
//               type="password"
//               placeholder="Enter password"
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition"
//           >
//             Log In
//           </button>
//         </form>
//         <p className="mt-4 text-sm text-center text-gray-600">
//           Don’t have an account?{' '}
//           <a href="/register" className="text-indigo-600 hover:underline">
//             Register
//           </a>
//         </p>
//       </div>
//     </div>
//     <Footer/>
   
//    </>
//   );
// };

// export default Login;












// // import React, { useState } from 'react';
// // import axios from 'axios';
// // import { useNavigate } from 'react-router-dom';
// // import { setToken } from '../utils/auth';

// // const Login = () => {
// //   const [form, setForm] = useState({ username: '', password: '' });
// //   const navigate = useNavigate();

// //   const handleChange = (e) =>
// //     setForm({ ...form, [e.target.name]: e.target.value });

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const res = await axios.post('http://localhost:8080/login', form);
// //       setToken(res.data.token);
// //       navigate('/dashboard');
// //     } catch (err) {
// //       alert('Invalid credentials');
// //     }
// //   };

// //   return (
// //     <form onSubmit={handleSubmit}>
// //       <h2>Login</h2>
// //       <input name="username" placeholder="Username" onChange={handleChange} />
// //       <input name="password" type="password" placeholder="Password" onChange={handleChange} />
// //       <button type="submit">Login</button>
// //     </form>
// //   );
// // };

// // export default Login;
