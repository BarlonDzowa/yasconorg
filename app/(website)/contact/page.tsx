"use client";
import Image from "next/image";
import { FaPhoneSquareAlt } from "react-icons/fa";
import { RiWhatsappFill } from "react-icons/ri";
import { RiMailFill } from "react-icons/ri";

// Contact Us Page

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 mt-0.5">
      {/* Hero Section */}
      <section className="bg-[url(/team/river-forest.avif)] bg-cover bg-center  text-[#1a2e1a] text-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/Log.png"
              sizes="56px"
              alt="YASCON Logo"
              width={120}
              height={120}
              className="bg-white rounded-full p-2"
            />
          </div>

          <h1 className="text-4xl font-bold mb-4">Contact YASCON</h1>
          <p className="max-w-2xl mx-auto text-lg text-amber-200">
            Join us in protecting nature and restoring our environment. Reach
            out to collaborate, volunteer, or support our initiatives.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Get in Touch
          </h2>

          <div className="space-y-6 text-gray-700">
            <div className="flex items-center gap-4">
              <FaPhoneSquareAlt className="text-green-600 text-xl md:text-2xl " />
              <span>+265 (0) 885284321</span>
            </div>

            <div className="flex items-center gap-4">
              <RiWhatsappFill className="text-green-600 text-2xl" />
              <span>WhatsApp: +265 (0) 986818697</span>
            </div>

            <div className="flex items-center gap-4">
              <RiMailFill className="text-green-600 text-xl md:text-2xl" />
              <span>info@yascon.org</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Send Us a Message
          </h2>

          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Your phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Write your message..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

