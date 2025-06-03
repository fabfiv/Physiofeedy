

// dipak new code 
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { getToken, removeToken, isAuthenticated } from '../utils/auth';
import { auth } from '../../shared/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [googleUser, setGoogleUser] = useState(null);
  const [loading, setLoading] = useState(true); // New loading state
  const navigate = useNavigate();

  useEffect(() => {
    // Function to fetch user data based on authentication method
    const fetchUserData = async (token) => {
      try {
        const response = await axios.get('http://localhost:8080/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data); // Set user data
        setLoading(false); // Set loading to false after data is fetched
        navigate('/dashboard'); // Redirect to dashboard
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false); // Set loading to false in case of error
      }
    };

    // Check for token authentication first
    if (isAuthenticated()) {
      const token = getToken();
      fetchUserData(token); // Fetch user data using token
    } else {
      // If no token, check for Google authentication
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setGoogleUser(currentUser); // Set Google user
          fetchUserData(currentUser.uid); // Fetch user data using Google UID
        } else {
          navigate('/'); // Redirect to home if no user logged in
        }
      });

      // Cleanup Google authentication listener on component unmount
      return () => unsubscribe();
    }
  }, [navigate]); // Only run the effect on mount

  const logout = async () => {
    // If logged in with Google, sign out from Firebase
    if (googleUser) {
      await signOut(auth);
    }

    // Logout from backend
    await axios.post('http://localhost:8080/logout', {}, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    // Remove token and redirect to homepage
    removeToken();
    navigate('/');
  };

  return (
    <div className="h-full w-screen bg-[#0A192F] flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#112240] shadow-lg p-6 hidden md:block">
        <h2 className="text-2xl font-bold text-[#64FFDA] mb-6">MyDashboard</h2>
        <ul className="space-y-4">
          <li>
            <Link to="/dashboard" className="text-[#E6F1FF] font-medium hover:text-[#64FFDA]">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/try-now" className="text-[#E6F1FF] font-medium hover:text-[#64FFDA]">
              Try Now
            </Link>
          </li>
          <li>
            <button onClick={logout} className="text-red-500 hover:text-red-700">
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="bg-[#112240] p-6 rounded-2xl shadow-lg">
          {loading ? ( // Show loading state
            <div className="flex items-center gap-4">
              <img
                src="https://www.pngkit.com/png/detail/797-7975330_donna-picarro-dummy-avatar-png.png"
                alt="Dummy"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="h-6 bg-gray-400 w-32 animate-pulse"></div> {/* Dummy Name */}
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  {/* Google User Image */}
                  {googleUser && googleUser.photoURL ? (
                    <img
                      src={googleUser.photoURL}
                      alt="User"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <img
                      src="https://www.pngkit.com/png/detail/797-7975330_donna-picarro-dummy-avatar-png.png"
                      alt="Dummy"
                      className="w-12 h-12 rounded-full object-cover"
                    /> // Dummy Image for non-Google users
                  )}
                  {/* Username and Welcome Message */}
                  <h2 className="text-xl font-bold text-[#64FFDA]">
                    Welcome, {googleUser ? googleUser.displayName : userData?.username || "User"} 👋
                  </h2>
                </div>
                <Link to="/try-now">
                  <button className="mt-4 sm:mt-0 px-4 py-2 bg-[#64FFDA] text-[#0A192F] rounded-lg hover:bg-[#08e7ba] transition">
                    Try Now
                  </button>
                </Link>
              </div>

              <h3 className="text-lg font-semibold text-[#E6F1FF] mb-4">Your Exercise History</h3>
              <div className="grid gap-4 ">
                {userData?.history?.map((h, i) => (
                  <div key={i} className="bg-[#1C2B43] p-4 border rounded-lg shadow-sm">
                    <p className="font-semibold text-[#64FFDA]">{h.exercise_name}</p>
                    <p className="text-sm text-[#E6F1FF] mt-1">{h.feedback}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


// dipak code 

// import React, { useEffect, useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import axios from 'axios';
// import { getToken, removeToken, isAuthenticated } from '../utils/auth';

// const Dashboard = () => {
//   const [userData, setUserData] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!isAuthenticated()) return navigate('/');
//     axios.get('http://localhost:8080/dashboard', {
//       headers: { Authorization: `Bearer ${getToken()}` }
//     }).then(res => setUserData(res.data));
//   }, []);

//   const logout = async () => {
//     await axios.post('http://localhost:8080/logout', {}, {
//       headers: { Authorization: `Bearer ${getToken()}` }
//     });
//     removeToken();
//     navigate('/');
//   };

//   return (
//     <div className="h-full w-screen bg-[#0A192F] flex">
//       {/* Sidebar */}
//       <div className="w-64 bg-[#112240] shadow-lg p-6 hidden md:block">
//         <h2 className="text-2xl font-bold text-[#64FFDA] mb-6">MyDashboard</h2>
//         <ul className="space-y-4">
//           <li>
//             <Link to="/dashboard" className="text-[#E6F1FF] font-medium hover:text-[#64FFDA]">
//               Dashboard
//             </Link>
//           </li>
//           <li>
//             <Link to="/try-now" className="text-[#E6F1FF] font-medium hover:text-[#64FFDA]">
//               Try Now
//             </Link>
//           </li>
//           <li>
//             <button onClick={logout} className="text-red-500 hover:text-red-700">
//               Logout
//             </button>
//           </li>
//         </ul>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-6">
//         <div className="bg-[#112240] p-6 rounded-2xl shadow-lg">
//           {userData ? (
//             <>
//               <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
//                 <h2 className="text-xl font-bold text-[#64FFDA]">Welcome, {userData.username} 👋</h2>
//                 <Link to="/try-now">
//                   <button className="mt-4 sm:mt-0 px-4 py-2 bg-[#64FFDA] text-[#0A192F] rounded-lg hover:bg-[#08e7ba] transition">
//                     Try Now
//                   </button>
//                 </Link>
//               </div>

//               <h3 className="text-lg font-semibold text-[#E6F1FF] mb-4">Your Exercise History</h3>
//               <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
//                 {userData.history.map((h, i) => (
//                   <div key={i} className="bg-[#1C2B43] p-4 border rounded-lg shadow-sm">
//                     <p className="font-semibold text-[#64FFDA]">{h.exercise_name}</p>
//                     <p className="text-sm text-[#E6F1FF] mt-1">{h.feedback}</p>
//                   </div>
//                 ))}
//               </div>
//             </>
//           ) : (
//             <p className="text-[#E6F1FF]">Loading your data...</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


// girish code 

// import React, { useEffect, useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import axios from 'axios';
// import { getToken, removeToken, isAuthenticated } from '../utils/auth';

// const Dashboard = () => {
//   const [userData, setUserData] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!isAuthenticated()) return navigate('/');
//     axios.get('http://localhost:8080/dashboard', {
//       headers: { Authorization: `Bearer ${getToken()}` }
//     }).then(res => setUserData(res.data));
//   }, []);

//   const logout = async () => {
//     await axios.post('http://localhost:8080/logout', {}, {
//       headers: { Authorization: `Bearer ${getToken()}` }
//     });
//     removeToken();
//     navigate('/');
//   };

//   return (
//     <div className="h-full w-screen bg-gray-100 flex">
//       {/* Sidebar */}
//       <div className="w-64 bg-white shadow-md p-6 hidden md:block">
//         <h2 className="text-2xl font-bold text-indigo-600 mb-6">MyDashboard</h2>
//         <ul className="space-y-4">
//           <li>
//             <Link to="/dashboard" className="text-gray-700 font-medium hover:text-indigo-600">
//               Dashboard
//             </Link>
//           </li>
//           <li>
//             <Link to="/try-now" className="text-gray-700 font-medium hover:text-indigo-600">
//               Try Now
//             </Link>
//           </li>
//           <li>
//             <button onClick={logout} className="text-red-500 hover:text-red-700">
//               Logout
//             </button>
//           </li>
//         </ul>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-6">
//         <div className="bg-white p-6 rounded-2xl shadow">
//           {userData ? (
//             <>
//               <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
//                 <h2 className="text-xl font-bold text-gray-800">Welcome, {userData.username} 👋</h2>
//                 <Link to="/try-now">
//                   <button className="mt-4 sm:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
//                     Try Now
//                   </button>
//                 </Link>
//               </div>

//               <h3 className="text-lg font-semibold text-gray-700 mb-4">Your Exercise History</h3>
//               <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
//                 {userData.history.map((h, i) => (
//                   <div key={i} className="bg-gray-50 p-4 border rounded-lg shadow-sm">
//                     <p className="font-semibold text-gray-800">{h.exercise_name}</p>
//                     <p className="text-sm text-gray-600 mt-1">{h.feedback}</p>
//                   </div>
//                 ))}
//               </div>
//             </>
//           ) : (
//             <p className="text-gray-600">Loading your data...</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;











// // import React, { useEffect, useState } from 'react';
// // import { useNavigate, Link } from 'react-router-dom';
// // import axios from 'axios';
// // import { getToken, removeToken, isAuthenticated } from '../utils/auth';

// // const Dashboard = () => {
// //   const [userData, setUserData] = useState(null);
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     if (!isAuthenticated()) return navigate('/');
// //     axios.get('http://localhost:8080/dashboard', {
// //       headers: { Authorization: `Bearer ${getToken()}` }
// //     }).then(res => setUserData(res.data));
// //   }, []);

// //   const logout = async () => {
// //     await axios.post('http://localhost:8080/logout', {}, {
// //       headers: { Authorization: `Bearer ${getToken()}` }
// //     });
// //     removeToken();
// //     navigate('/');
// //   };

// //   return (
// //     <div>
// //       <h2>Dashboard</h2>
// //       {userData && (
// //         <>
// //           <p>Welcome, {userData.username}</p>
// //           <Link to="/try-now"><button>Try Now</button></Link>
// //           <h3>History:</h3>
// //           <ul>
// //             {userData.history.map((h, i) => (
// //               <li key={i}>{h.exercise_name} - {h.feedback}</li>
// //             ))}
// //           </ul>
// //         </>
// //       )}
// //       <button onClick={logout}>Logout</button>
// //     </div>
// //   );
// // };

// // export default Dashboard;
