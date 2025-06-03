// dipak code 

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TryNow = () => {
  const [exercise, setExercise] = useState('arm_raise');
  const [stream, setStream] = useState(null);
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
    await axios.post('http://localhost:8080/analyze_video');
    navigate('/feedback');
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
            <option value="arm_raise">Arm Raise</option>
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
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
          >
            Analyze Video
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










// girish code 

// import React, { useState } from 'react';
// import axios from 'axios';
// import { getToken } from '../utils/auth';
// import { useNavigate } from 'react-router-dom';

// const TryNow = () => {
//   const [exercise, setExercise] = useState('arm_raise');
//   const [stream, setStream] = useState(null);
//   const navigate = useNavigate();

//   const startRecording = async () => {
//     await axios.post('http://localhost:8080/start_recording', { exercise });
//     setStream('http://localhost:8080/video_feed');
//   };

//   const stopRecording = async () => {
//     await axios.post('http://localhost:8080/stop_recording');
//     setStream(null);
//   };

//   const analyzeVideo = async () => {
//     await axios.post('http://localhost:8080/analyze_video');
//     navigate('/feedback');
//   };

//   return (
//     <div className="max-h-screen w-full bg-white p-6 flex flex-col gap-6">
//       <div className="max-w-5xl mx-auto bg-white shadow-md rounded-2xl p-6">
//         <h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 Try an Exercise</h2>

//         {/* Exercise Selector */}
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">Select Exercise</label>
//           <select
//             value={exercise}
//             onChange={(e) => setExercise(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
//           >
//             <option value="arm_raise">Arm Raise</option>
//             <option value="squat">Squat</option>
//           </select>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex flex-wrap gap-4 mb-6">
//           <button
//             onClick={startRecording}
//             className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//           >
//             Start Recording
//           </button>
//           <button
//             onClick={stopRecording}
//             className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//           >
//             Stop Recording
//           </button>
//           <button
//             onClick={analyzeVideo}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Analyze Video
//           </button>
//         </div>

//         {/* Camera Feed */}
//         {stream && (
//           <div className="border-4 border-gray-300 rounded-2xl overflow-hidden shadow-md max-w-4xl mx-auto">
//             <img
//               src={stream}
//               alt="Live Camera Feed"
//               className="w-full h-[600px] object-cover bg-black"
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TryNow;











// // import React, { useState } from 'react';
// // import axios from 'axios';
// // import { getToken } from '../utils/auth';
// // import { useNavigate } from 'react-router-dom';

// // const TryNow = () => {
// //   const [exercise, setExercise] = useState('arm_raise');
// //   const [stream, setStream] = useState(null);
// //   const navigate = useNavigate();

// //   const setExerciseHandler = async () => {
// //     await axios.post('http://localhost:8080/set_exercise', { exercise });
// //   };

// //   const startRecording = async () => {
// //     await axios.post('http://localhost:8080/start_recording', { exercise });
// //     setStream('http://localhost:8080/video_feed');
// //   };

// //   const stopRecording = async () => {
// //     await axios.post('http://localhost:8080/stop_recording');
// //     setStream(null);
// //   };

// //   const analyzeVideo = async () => {
// //     await axios.post('http://localhost:8080/analyze_video');
// //     navigate('/feedback');
// //   };

// //   return (
// //     <div>
// //       <h2>Try Now</h2>
// //       <select value={exercise} onChange={(e) => setExercise(e.target.value)}>
// //         <option value="arm_raise">Arm Raise</option>
// //         <option value="squat">Squat</option>
// //       </select>
// //       {/* <button onClick={setExerciseHandler}>Set Exercise</button> */}
// //       <button onClick={startRecording}>Start Recording</button>
// //       {stream && <img src={stream} alt="Camera Feed" />}
// //       <button onClick={stopRecording}>Stop Recording</button>
// //       <button onClick={analyzeVideo}>Analyze Video</button>
// //     </div>
// //   );
// // };

// // export default TryNow;
