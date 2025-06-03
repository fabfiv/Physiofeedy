// import React from 'react';
// import Navbar from './Navbar';
// const Header = () => (
//   <>
//     <header className='bg-white items-end'>
//       <Navbar/>
//       <div className='flex items-center gap-x-5'>
//         <section className='p-10 text-blue-600 text-justify'>
//           <div className='p-2 font-bold text-blue-600 text-4xl'>
//             <h2>Recover Faster With</h2>
//             <h2 className='text-black'>Smart PhysioFeedy</h2>
//           </div>
//           <p className='p-2 text-gray-800'>Personalized and affordable online Physiotherapy to help you regain strength without breaking the bank. Designed for modern recovery with AI-driven support.</p>
//         </section>
//         <img src="./h1.png" alt="" className=''/>
//       </div>
//     </header>
//   </>
// );

// export default Header;






import React from "react";
import Navbar from "../Components/Navbar"; // Adjust the path if needed
import { motion } from "framer-motion";

const StoreFrontHero = () => {
  const handleRedirect = () => {
    window.location.href = "/about";

    // add func if login then send to dashbord or go logi page
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-center min-h-screen px-6 md:px-16 py-12 space-y-8 md:space-y-0 md:space-x-12">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-green-300 text-transparent bg-clip-text">
              Smart Physiotherapy
            </span>
            <br /> Recover Faster, Move Better!
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-6">
            AI-powered physiotherapy to help you regain strength without breaking the bank. Personalized recovery plans for a healthier future.
          </p>
          <motion.button
            whileHover={{ scale: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleRedirect}
            className="px-6 py-3 text-lg font-bold  text-black rounded-lg border border-blue-400 hover:bg-blue-500 hover:text-white transition-all shadow-lg"
          >
            About Us
          </motion.button>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <img src="../../public/hero.png" alt="Hero" width={500} height={500} className="rounded-lg shadow-xl" />
        </div>
      </div>

      {/* How It Works Section */}
      <section className="py-16 bg-[#0d1b3d]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-12">
            How It <span className="text-blue-400">Works</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <motion.div whileHover={{ scale: 1.05 }} className="p-6 bg-[#0a2540] rounded-lg shadow-lg border border-blue-500">
              <img src="../../public/grapher.png" alt="Scan Icon" width={120} height={120} className="mx-auto" />
              <h3 className="text-xl font-semibold mt-4">Step 1: Video Capturing</h3>
              <p className="text-gray-300">Users select an exercise and begin their workout while the system records their movements.</p>
            </motion.div>

            {/* Step 2 */}
            <motion.div whileHover={{ scale: 1.05 }} className="p-6 bg-[#0a2540] rounded-lg shadow-lg border border-blue-500">
              <img src="../../public/9485406.png" alt="Analyze Icon" width={120} height={120} className="mx-auto" />
              <h3 className="text-xl font-semibold mt-4">Step 2: Object Detection</h3>
              <p className="text-gray-300">The system analyzes the recorded video, detecting key body joints using MediaPipe and Computer Vision.</p>
            </motion.div>

            {/* Step 3 */}
            <motion.div whileHover={{ scale: 1.05 }} className="p-6 bg-[#0a2540] rounded-lg shadow-lg border border-blue-500">
              <img src="../../public/gradient feedaback.png" alt="Feedback Icon" width={120} height={120} className="mx-auto" />
              <h3 className="text-xl font-semibold mt-4">Step 3: Feedback Generation</h3>
              <p className="text-gray-300">Using OpenAI API, personalized feedback is generated to help users improve their exercise form.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#0a1f44] py-8 antialiased md:py-16">
        <div className="mx-auto grid max-w-screen-xl px-4 pb-8 md:grid-cols-12 lg:gap-12 lg:pb-16 xl:gap-0">

          {/* Left Content */}
          <div className="content-center justify-self-start md:col-span-7 md:text-start">
            <h1 className="mb-6 text-4xl font-extrabold leading-none tracking-tight md:max-w-2xl md:text-5xl xl:text-6xl">
              <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-green-300 text-transparent bg-clip-text">
                Experience the Future of Health Tech!
              </span>
              <br /> Smart Physiotherapy at Your Hand
            </h1>

            <p className="mb-6 max-w-2xl text-gray-300 md:mb-12 md:text-lg lg:text-xl">
              Elevate your recovery with AI-powered physiotherapy solutions.
            </p>

            <a
              href="#"
              className="px-6 py-3 text-lg font-bold  bg-[#08e7ba] text-black rounded-lg border border-blue-400 hover:bg-blue-500 hover:text-white transition-all shadow-lg"
            >
              Get Started
            </a>
          </div>

          {/* Right Image */}
          <div className="hidden md:col-span-5 md:mt-0 md:flex">
            <img
              className="dark:hidden"
              src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/girl-shopping-list.svg"
              alt="Physiotherapy Illustration"
              width="500"
              height="400"
            />
            <img
              className="hidden dark:block"
              src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/girl-shopping-list-dark.svg"
              alt="Physiotherapy Illustration"
              width="500"
              height="400"
            />
          </div>

        </div>
      </section>
    </>
  );
};

export default StoreFrontHero;