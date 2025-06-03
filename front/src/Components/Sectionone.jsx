import React from "react";




const Sectionone = () => (
  <>
    <section className="py-16 bg-[#f7f9f8] shadow-inner, rounded-2xl shadow-2xl">
      <div className="max-w-6xl mx-auto text-center">
        <h3 className="text-4xl sm:text-3xl font-bold mb-12">
          How It <span className="text-blue-600">Works</span>
        </h3>
        
        <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-[#f3f9f7] rounded-lg shadow-lg border border-blue-500">
              <img src="/grapher.png" alt="Analyze Icon" width={120} height={120} className="mx-auto"/>
              <h3 className="text-xl font-semibold mt-4">Step 1: Video Capturing</h3>
              <p className="text-gray-950">Users select an exercise and begin their workout while the system records their movements.</p>
            </div>

            <div className="p-6  bg-[#f3f9f7]  rounded-lg shadow-lg border border-blue-500">
              <img src="/detection.jpeg" alt="Analyze Icon" width={120} height={120} className="mx-auto"/>
              <h3 className="text-xl font-semibold mt-4">Step 2: Object Detection</h3>
              <p className="text-gray-950">The system analyzes the recorded video, detecting key body joints using MediaPipe and Computer Vision.</p>
            </div>

            <div className="p-6 bg-[#f3f9f7]  rounded-lg shadow-lg border border-blue-500">
              <img src="/feebackk.jpg" alt="Analyze Icon" width={120} height={120} className="mx-auto"/>
              <h3 className="text-xl font-semibold mt-4">Step 3: Feedback Generation</h3>
              <p className="text-gray-950">Using OpenAI API, personalized feedback is generated to help users improve their exercise form.</p>
            </div>
        </div>
      </div>
    </section>
  </>
);

export default Sectionone;