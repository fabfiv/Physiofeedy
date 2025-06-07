import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken, isAuthenticated } from '../utils/auth';
import { auth } from '../../shared/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Feedback = () => {
  const [performance, setPerformance] = useState(null);
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/feedback_info')
      .then(res => {
        const rawFeedback = res.data.feedback;
        const entry = rawFeedback.split('Range of motion:').filter(Boolean)[0]?.trim();

        if (entry) {
          const [metricsPart, ...commentParts] = entry.split(';').map(s => s.trim());
          const metrics = metricsPart.split(',').map(m => parseInt(m.split(':')[1]) || 0);
          const avg = Math.round(metrics.reduce((a, b) => a + b, 0) / metrics.length);

          setPerformance(avg);
          setComments(commentParts);
        }
      });
  }, []);

  useEffect(() => {
    const fetchUser = async (token) => {
      try {
        await axios.get('http://localhost:8080/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        navigate('/');
      }
    };

    if (isAuthenticated()) {
      fetchUser(getToken());
    } else {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) navigate('/');
      });
      return () => unsubscribe();
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f4f8] to-white p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">🩺 Your Performance Summary</h2>

        {performance !== null ? (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-40 h-40">
                <CircularProgressbar
                  value={performance}
                  text={`${performance}%`}
                  styles={buildStyles({
                    pathColor: '#10B981',
                    textColor: '#111827',
                    trailColor: '#E5E7EB',
                    textSize: '18px',
                    pathTransitionDuration: 0.5,
                  })}
                />
              </div>
            </div>

            <div className="mb-6 text-center">
              <p className="text-lg font-medium text-gray-700">Overall Performance</p>
              <p className="text-sm text-gray-500">Based on range of motion, accuracy, and alignment</p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">📌 Therapist Feedback</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {comments.length > 0 ? comments.map((c, i) => <li key={i}>{c}</li>) : <li>No comments provided.</li>}
              </ul>
            </div>

            <div className="text-center mt-8 text-indigo-700 text-lg italic font-semibold">
              "Every small effort matters. Keep going, one step at a time!"
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">Fetching feedback...</p>
        )}
      </div>
    </div>
  );
};

export default Feedback;

