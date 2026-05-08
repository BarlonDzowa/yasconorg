"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section
      id="newsletter"
      className="py-20 relative overflow-hidden bg-linear-to-t from-slate-900 to-slate-800"
     
    >
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/5 translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Stay Connected to Conservation
        </h2>
        <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
          Receive updates on our campaigns, event invitations, and conservation news directly to your inbox.
          Join thousands of Malawian youth making a difference.
        </p>

        {submitted ? (
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 text-white">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-xl font-bold mb-2">Thank you for subscribing!</h3>
            <p className="text-white/80">Welcome to the YASCON community. Together, let&apos;s grow a greener future!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 px-6 py-4 rounded-full bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d4a017] text-sm shadow-lg"
            />
            <button
              type="submit"
              className="bg-yellow-600 text-white font-bold px-8 py-4 rounded-full hover:bg-yellow-700 transition-all duration-300 shadow-lg whitespace-nowrap hover:-translate-y-0.5"
            >
              Get Updates
            </button>
          </form>
        )}

        <p className="text-white/50 text-xs mt-6">
          No spam. Unsubscribe anytime. Your data is safe with us.
        </p>
      </div>
    </section>
  );
}

