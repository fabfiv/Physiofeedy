import React from "react";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";

const ContactPage = () => {
  return (
    <>
      <Navbar />

      <section className="bg-[#0A192F] text-white py-12">
        <div className="max-w-screen-md mx-auto px-6 lg:px-12">
          <h2 className="text-5xl font-bold text-center text-[#64FFDA] mb-6">
            Contact Us
          </h2>
          <p className="text-center text-lg text-[#A8B2D1] mb-10">
            Have questions? Need help? Just drop us a message, and we’ll get back to you as soon as possible.
          </p>

          <form action="#" className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-lg text-[#E6F1FF] mb-2">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 rounded-lg bg-[#112240] border border-[#64FFDA] text-white focus:ring-2 focus:ring-[#64FFDA] focus:outline-none"
                placeholder="name@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-lg text-[#E6F1FF] mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                className="w-full p-3 rounded-lg bg-[#112240] border border-[#64FFDA] text-white focus:ring-2 focus:ring-[#64FFDA] focus:outline-none"
                placeholder="What’s on your mind?"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-lg text-[#E6F1FF] mb-2">
                Your Message
              </label>
              <textarea
                id="message"
                rows="6"
                className="w-full p-3 rounded-lg bg-[#112240] border border-[#64FFDA] text-white focus:ring-2 focus:ring-[#64FFDA] focus:outline-none"
                placeholder="Write your message here..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#64FFDA] to-[#64FFBA] text-[#0A192F] font-semibold rounded-lg hover:opacity-90 transition duration-300 focus:outline-none focus:ring-4 focus:ring-[#64FFDA]"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default ContactPage;
