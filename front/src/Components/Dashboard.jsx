import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { getToken, removeToken, isAuthenticated } from '../utils/auth';
import { auth } from '../../shared/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';

import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [googleUser, setGoogleUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async (token) => {
      try {
        const response = await axios.get('http://localhost:8080/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    if (isAuthenticated()) {
      const token = getToken();
      fetchUserData(token);
    } else {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setGoogleUser(currentUser);
          fetchUserData(currentUser.uid);
        } else {
          navigate('/');
        }
      });

      return () => unsubscribe();
    }
  }, [navigate]);

  const logout = async () => {
    if (googleUser) {
      await signOut(auth);
    }

    await axios.post('http://localhost:8080/logout', {}, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    removeToken();
    navigate('/');
  };

  // Parse numeric feedback from text
  const parseFeedback = (text) => {
    const metrics = { range: 0, accuracy: 0, alignment: 0 };
    const match = text.match(/Range of motion: (\d+)%.*?Accuracy: (\d+)%.*?Alignment: (\d+)%/i);
    if (match) {
      metrics.range = parseInt(match[1]);
      metrics.accuracy = parseInt(match[2]);
      metrics.alignment = parseInt(match[3]);
    }
    return metrics;
  };

  // Aggregate history metrics for charts
  const getChartData = () => {
    if (!userData?.history?.length) return null;

    const labels = [];
    const rangeArr = [];
    const accuracyArr = [];
    const alignmentArr = [];

    userData.history.forEach((h, index) => {
      const { range, accuracy, alignment } = parseFeedback(h.feedback);
      labels.push(`Session ${index + 1}`);
      rangeArr.push(range);
      accuracyArr.push(accuracy);
      alignmentArr.push(alignment);
    });

    const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

    const barChart = {
      labels: ['Range of Motion', 'Accuracy', 'Alignment'],
      datasets: [
        {
          label: 'Average (%)',
          data: [
            avg(rangeArr).toFixed(1),
            avg(accuracyArr).toFixed(1),
            avg(alignmentArr).toFixed(1),
          ],
          backgroundColor: ['#64FFDA', '#5EEAD4', '#4ADE80'],
        },
      ],
    };

    const lineChart = {
      labels,
      datasets: [
        {
          label: 'Range of Motion (%)',
          data: rangeArr,
          borderColor: '#64FFDA',
          fill: false,
          tension: 0.2,
        },
        {
          label: 'Accuracy (%)',
          data: accuracyArr,
          borderColor: '#3B82F6',
          fill: false,
          tension: 0.2,
        },
        {
          label: 'Alignment (%)',
          data: alignmentArr,
          borderColor: '#EC4899',
          fill: false,
          tension: 0.2,
        },
      ],
    };

    return { barChart, lineChart };
  };

  return (
    <div className="min-h-screen w-full bg-[#0A192F] flex flex-col md:flex-row">
      {/* Sidebar (Desktop) */}
      <div className="hidden md:block md:w-64 bg-[#112240] shadow-lg p-6">
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

      {/* Topbar (Mobile & Tablet) */}
      <div className="md:hidden bg-[#112240] p-4 flex justify-between items-center shadow">
        <h2 className="text-xl font-bold text-[#64FFDA]">MyDashboard</h2>
        <div className="flex gap-4">
          <Link to="/try-now" className="text-[#E6F1FF] font-medium hover:text-[#64FFDA]">
            Try Now
          </Link>
          <button onClick={logout} className="text-red-400 hover:text-red-600 text-sm">
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 overflow-auto">
        <div className="bg-[#112240] p-4 sm:p-6 rounded-2xl shadow-lg">
          {loading ? (
            <div className="flex items-center gap-4">
              <img
                src="https://www.pngkit.com/png/detail/797-7975330_donna-picarro-dummy-avatar-png.png"
                alt="Dummy"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="h-6 bg-gray-400 w-32 animate-pulse rounded-md"></div>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <div className="flex items-center gap-3">
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
                    />
                  )}
                  <h2 className="text-xl font-bold text-[#64FFDA]">
                    Welcome, {googleUser ? googleUser.displayName : userData?.username || 'User'} 👋
                  </h2>
                </div>
                <Link to="/try-now">
                  <button className="mt-4 sm:mt-0 px-4 py-2 bg-[#64FFDA] text-[#0A192F] rounded-lg hover:bg-[#08e7ba] transition">
                    Try Now
                  </button>
                </Link>
              </div>

              <h3 className="text-lg font-semibold text-[#E6F1FF] mb-4">Your Exercise History</h3>

              {/* Charts */}
              {getChartData() && (
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Bar Chart */}
                  <div className="bg-[#0A192F] p-4 rounded-xl shadow">
                    <h4 className="text-[#64FFDA] font-semibold text-center mb-2">Average Performance</h4>
                    <Bar data={getChartData().barChart} />
                  </div>

                  {/* Line Chart */}
                  <div className="bg-[#0A192F] p-4 rounded-xl shadow">
                    <h4 className="text-[#64FFDA] font-semibold text-center mb-2">Progress Over Sessions</h4>
                    <Line data={getChartData().lineChart} />
                  </div>
                </div>
              )}

              <div className="grid gap-4">
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

