
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth';

const TryNow = () => {
  const [exercise, setExercise] = useState('Arm Raises');
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const startRecording = async () => {
    await axios.post('http://localhost:8080/start_recording', { exercise });
    setStream('http://localhost:8080/video_feed');
  };

  const stopRecording = async () => {
    await axios.post('http://localhost:8080/stop_recording');
    setStream(null);
  };

  const analyzeVideo = async () => {
    try {
      setLoading(true);
      const token = getToken();
      await axios.post('http://localhost:8080/analyze_video', null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/feedback');
    } catch (error) {
      console.error("Analysis error:", error);
      alert("Error analyzing video. Please make sure you're logged in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-h-screen w-full bg-[#0A192F] p-6 flex flex-col gap-6">
      <div className="max-w-5xl mx-auto bg-[#112240] shadow-lg rounded-2xl p-6">
        <h2 className="text-3xl font-bold text-[#64FFDA] mb-4">🎯 Try an Exercise</h2>

        {/* Exercise Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#E6F1FF] mb-2">Select Exercise</label>
          <select
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            className="w-full p-3 border-2 border-[#64FFDA] bg-[#112240] text-[#E6F1FF] rounded-lg focus:ring-2 focus:ring-[#64FFDA] hover:bg-[#1C2B43]"
          >
            <option value="Arm Raises">Arm Raise</option>
            <option value="squat">Squat</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={startRecording}
            className="px-6 py-3 bg-[#64FFDA] text-[#0A192F] rounded-lg hover:bg-[#08e7ba] transition-all duration-300"
          >
            Start Recording
          </button>
          <button
            onClick={stopRecording}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
          >
            Stop Recording
          </button>
          <button
            onClick={analyzeVideo}
            disabled={loading}
            className={`px-6 py-3 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Analyzing...
              </>
            ) : (
              'Analyze Video'
            )}
          </button>
        </div>

        {/* Camera Feed */}
        {stream && (
          <div className="border-4 border-[#64FFDA] rounded-2xl overflow-hidden shadow-md max-w-4xl mx-auto">
            <img
              src={stream}
              alt="Live Camera Feed"
              className="w-full h-[600px] object-cover bg-black transition-all duration-300"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TryNow;

