import React from 'react';
// import { Link } from 'react-router-dom';
// import Navbar from './Navbar';
import Header from './Header';
import Sectionone from './Sectionone';
import Footer from './Footer';
const Home = () => (
  <>
      <div className="flex flex-col min-h-screen w-screen">
        <Header className="bg-white shadow "></Header>
  
        <main className="flex-grow p-6">
   
        </main>
  
        <Footer className="bg-gray-200 text-center p-4"></Footer>
      </div>





    {/* <div className="flex flex-col min-h-screen">
      <Header />
      <Sectionone />
      <div className="mt-auto">
        <Footer />
      </div>
    </div> */}
  </>
);

export default Home;
