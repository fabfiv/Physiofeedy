import React from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const About = () => {
  return (
    <>
    <Navbar/>
      {/* Hero Section */}
      <section className="bg-[#0a1f44] text-white py-16 px-6 md:px-12">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            About Our Smart Physiotherapy Solution
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Our AI-powered physiotherapy system is designed to revolutionize rehabilitation by providing smart, accessible, and effective therapy solutions.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 bg-[#091a3c] px-6 md:px-12">
        <div className="container mx-auto max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-[#6ac9ad]">Our Mission</h2>
            <p className="text-gray-300 text-lg">
              Our mission is to leverage AI and smart technology to create personalized physiotherapy experiences.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden">
            <img
              src="/pexels-yankrukov-5793653.jpg"
              alt="AI Physiotherapy"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 bg-[#0a1f44] px-6 md:px-12">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-6 text-[#6ac9ad]">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {["AI-Powered Therapy", "Smart Monitoring", "User-Friendly Interface"].map((feature, index) => (
              <div key={index} className="bg-[#112b54] p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-3 text-[#6ac9ad]">{feature}</h3>
                <p className="text-gray-300">Providing cutting-edge solutions for better recovery and care.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="text-gray-300 bg-[#0a1f44] py-16">
        <div className="container px-5 mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-white mb-4">Our Key Points</h1>
            <p className="text-lg text-gray-400">
              Discover the cutting-edge features that make our AI-powered physiotherapy solution the future of health tech.
            </p>
          </div>

          <div className="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2">
            {[
              "AI-Powered Personalized Therapy",
              "Smart Motion Tracking & Feedback",
              "Real-Time Posture Correction",
              "24/7 Virtual Assistance",
              "Seamless Mobile & Web Integration",
              "Scientifically Backed Treatment Plans"
            ].map((point, index) => (
              <div key={index} className="p-2 sm:w-1/2 w-full">
                <div className="bg-[#112c66] rounded-lg flex p-4 h-full items-center shadow-md hover:shadow-lg transition">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    className="text-teal-300 w-6 h-6 flex-shrink-0 mr-4"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                    <path d="M22 4L12 14.01l-3-3"></path>
                  </svg>
                  <span className="title-font font-medium text-white">{point}</span>
                </div>
              </div>
            ))}
          </div>

          <a href="/team">
            <button className="flex mx-auto mt-12 text-white bg-[#6ac9ad] border-0 py-3 px-8 rounded-lg text-lg font-semibold transition hover:bg-[#57a592] hover:scale-105">
              Know About Developer
            </button>
          </a>
        </div>
      </section>

      {/* Security & Connectivity Plans */}
      <section className="text-gray-300 bg-[#0a1f44] py-24">
        <div className="container px-5 mx-auto flex flex-wrap">
          <div className="flex flex-wrap -m-4">
            {/* Security Plan */}
            <div className="p-4 lg:w-1/2 md:w-full">
              <div className="flex border-2 rounded-lg border-cyan-500 p-8 sm:flex-row flex-col hover:shadow-lg hover:shadow-cyan-500 transition-all">
                <div className="w-16 h-16 sm:mr-8 mb-4 inline-flex items-center justify-center rounded-full bg-cyan-500 text-black flex-shrink-0">
                  {/* Shield Icon */}
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l7 5v6c0 5.523-4.477 10-10 10S2 18.523 2 13V7l7-5z" />
                  </svg>
                </div>
                <div className="flex-grow">
                  <h2 className="text-white text-lg font-medium mb-3">Security Plan</h2>
                  <p className="leading-relaxed text-base">
                    Advanced security measures to protect your WiFi network from vulnerabilities and cyber threats.
                  </p>
                  <a className="mt-3 text-cyan-400 inline-flex items-center hover:text-green-400 transition-all" href="#">
                    Learn More
                  </a>
                </div>
              </div>
            </div>

            {/* Connectivity Plan */}
            <div className="p-4 lg:w-1/2 md:w-full">
              <div className="flex border-2 rounded-lg border-cyan-500 p-8 sm:flex-row flex-col hover:shadow-lg hover:shadow-cyan-500 transition-all">
                <div className="w-16 h-16 sm:mr-8 mb-4 inline-flex items-center justify-center rounded-full bg-cyan-500 text-black flex-shrink-0">
                  {/* Wifi Icon */}
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 16.5l.01-.01M2 8.82a16 16 0 0120 0M5 12.5a11 11 0 0114 0M8.5 16.5a6 6 0 017 0" />
                  </svg>
                </div>
                <div className="flex-grow">
                  <h2 className="text-white text-lg font-medium mb-3">Connectivity Plan</h2>
                  <p className="leading-relaxed text-base">
                    Optimize WiFi performance and stability with intelligent testing and real-time monitoring.
                  </p>
                  <a className="mt-3 text-cyan-400 inline-flex items-center hover:text-green-400 transition-all" href="#">
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

<Footer/>

    </>
  );
};

export default About;
