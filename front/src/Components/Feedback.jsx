import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { useNavigate, Link } from 'react-router-dom';
import { getToken, removeToken, isAuthenticated } from '../utils/auth';
import { auth } from '../../shared/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Feedback = () => {
  const [feedback, setFeedback] = useState('');

  const [googleUser, setGoogleUser] = useState(null);
  const [loading, setLoading] = useState(true); // New loading state
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/feedback_info')
      .then(res => setFeedback(res.data.feedback));
  }, []);



  useEffect(() => {
    // Function to fetch user data based on authentication method
    const fetchUserData = async (token) => {
      try {
        const response = await axios.get('http://localhost:8080/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data); // Set user data
        setLoading(false); // Set loading to false after data is fetched
        navigate('/feedback'); // Redirect to dashboard
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



  return (
    <div className="h-full w-full bg-white p-6 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-indigo-600 mb-4 text-center">📋 Feedback Summary</h2>

        {feedback ? (
          <div className="text-gray-700 text-lg leading-relaxed border border-gray-200 p-6 rounded-xl bg-gray-50">
            {feedback}
          </div>
        ) : (
          <p className="text-gray-500 text-center">Fetching feedback...</p>
        )}
      </div>
    </div>
  );
};

export default Feedback;








// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const Feedback = () => {
//   const [feedback, setFeedback] = useState('');

//   useEffect(() => {
//     axios.get('http://localhost:8080/feedback_info')
//       .then(res => setFeedback(res.data.feedback));
//   }, []);

//   return (
//     <div>
//       <h2>Feedback</h2>
//       <p>{feedback}</p>
//     </div>
//   );
// };

// export default Feedback;
