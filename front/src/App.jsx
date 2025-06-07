import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import Login from './Components/Login';
import Register from './Components/Register';
import Dashboard from './Components/Dashboard';
import TryNow from './Components/TryNow';
import Feedback from './Components/Feedback';
import About from './pages/About';
import Servies from "./pages/Services"
import ContactPage from './pages/Contact';
// import Header   from './Components/Header';



import {app} from "../shared/firebaseConfig"
import {  doc,setDoc,getFirestore } from "firebase/firestore";


const db = getFirestore(app);

// 🔹 Firestore Data Save Function
const saveToFirestore = async () => {
  try {
    await setDoc(doc(db, "cities", "LA"), {
      name: "satpur",
      state: " maha",
      country: "indai"
    });
    console.log("Data successfully saved to Firestore! ✅");
  } catch (error) {
    console.error("Error saving to Firestore ❌:", error);
  }
};


const App = () => (
 <>
 
 <Routes>

 <Route path="/" element={<Home />} />
 <Route path="/login" element={<Login />} />
 <Route path="/register" element={<Register />} />
 <Route path="/dashboard" element={<Dashboard />} />
 <Route path="/try-now" element={<TryNow />} />
 <Route path="/feedback" element={<Feedback />} /> 
 <Route path="/About" element={<About />} /> 
 <Route path="/Services" element={ <Servies/> } /> 
 <Route path="/Contact" element={ <ContactPage/> } /> 
 

</Routes>
 
 
 
 
 
 
 </>
);

export default App;




