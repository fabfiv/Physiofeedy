import React from "react";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";

const Page = () => {
  return (
    <>
      <Navbar />

      <section className="bg-[#0A192F] text-white">
        <div className="gap-16 items-center py-12 px-6 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-20 lg:px-10">
          <div className="font-light text-[#A8B2D1] sm:text-lg">
            <h2 className="mb-4 text-5xl lg:text-6xl tracking-tight font-bold text-[#64FFDA]">
              Elevate Fitness with AI Intelligence
            </h2>
            <p className="mb-4 leading-relaxed text-lg lg:text-xl text-[#E6F1FF]">
              AI PhyBuddy is your <span className="font-semibold text-[#64FFDA]">ultimate AI-powered fitness companion</span>, designed to{" "}
              <span className="italic">personalize, optimize, and revolutionize</span> the way you train.
            </p>
            <p className="mb-4 leading-relaxed text-lg lg:text-xl text-[#E6F1FF]">
              With <span className="font-semibold text-[#64FFDA]">real-time posture analysis</span>, adaptive workout plans, and intelligent insights, our AI ensures{" "}
              <span className="italic">precision, efficiency, and safety</span> in every session.
            </p>
            <p className="leading-relaxed text-lg lg:text-xl text-[#E6F1FF]">
              <span className="font-semibold text-[#64FFDA]">Harness the power of AI</span> to track progress, correct form, and achieve peak performance—because the future of fitness is{" "}
              <span className="italic">smart, seamless, and science-driven</span>.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <img
              className="mt-4 w-[600px] h-[400px] lg:mt-10 rounded-lg shadow-lg border border-[#64FFDA] object-cover"
              src="https://plus.unsplash.com/premium_photo-1661779394380-e372d6a1f198?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Futuristic office setup"
            />

            <img
              className="mt-4 w-[600px] h-[400px] lg:mt-24 rounded-lg shadow-lg border border-[#64FFDA] object-cover"
              src="https://plus.unsplash.com/premium_photo-1661962597572-e0a140d8bc20?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Futuristic office setup"
            />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Page;
