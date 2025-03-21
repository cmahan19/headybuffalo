"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Header: React.FC = () => {
  const [userName, setUserName] = useState("Guest");
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  const router = useRouter();

  const navigateToHome = () => {
    router.push("/");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserName(formData.name || "Valued Customer");
    setIsSignUpOpen(false);
  };

  return (
    <>
      {/* Main Header */}
      <header className="bg-black shadow-md sticky top-0 z-50 min-h-[80px]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between flex-wrap">
          {/* Logo */}
          <div
            onClick={navigateToHome}
            className="flex items-center space-x-2 cursor-pointer"
            aria-label="Go to home page"
          >
            <img src="/logo.png" alt="Heady Buffalo Logo" className="h-16 w-auto" />
            <span className="text-xl font-bold text-white">Heady Buffalo</span>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            <Link href="/about" className="hidden md:flex text-white hover:text-gray-300">
              About Us
            </Link>

            {/* Account Section */}
            <button
              onClick={() => setIsSignUpOpen(true)}
              className="flex items-center text-white text-sm font-bold hover:text-gray-300 transition"
            >
              <span className="material-icons text-white mr-2">account_circle</span>
              Hello, {userName}
            </button>
          </div>
        </div>
      </header>

      {/* Sign Up Modal */}
      {isSignUpOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white p-6 rounded-lg shadow-xl w-96 z-50">
            <h2 className="text-lg font-bold mb-4 text-center">Sign Up</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Sign Up
              </button>
              <button
                type="button"
                className="w-full mt-2 bg-gray-300 text-black py-2 rounded-lg hover:bg-gray-400 transition"
                onClick={() => setIsSignUpOpen(false)}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
