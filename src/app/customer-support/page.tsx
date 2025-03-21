"use client";

import React, { useState } from "react";

const CustomerSupport: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    console.log("Form Data Submitted:", formData);
    setFormSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  const faqItems = [
    {
      question: "How can I track my order?",
      answer: "You can track your order by logging into your account and visiting the 'Orders' section.",
    },
    {
      question: "What is the return policy?",
      answer:
        "We accept returns within 30 days of purchase for unused items in their original packaging. Please visit our Returns page for more details.",
    },
    {
      question: "How can I contact customer support?",
      answer: "You can fill out the contact form on this page or email us at support@headybuffalo.com.",
    },
  ];

  return (
    <main className="p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <h1 className="text-2xl font-bold text-center mb-6">Customer Support</h1>

      {/* Contact Form */}
      <section className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Get in Touch</h2>
        {formSubmitted ? (
          <p className="text-green-500 font-medium">
            Thank you for reaching out! We'll get back to you shortly.
          </p>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="message" className="block font-medium mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
              Submit
            </button>
          </form>
        )}
      </section>

      {/* FAQ Section */}
      <section className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <details key={index} className="border-b pb-2">
              <summary className="cursor-pointer font-medium text-gray-700">
                {item.question}
              </summary>
              <p className="text-sm text-gray-600 mt-2">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Additional Support Links */}
      <section className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Additional Support</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="/orders-returns"
              className="text-blue-500 hover:underline"
            >
              Orders and Returns
            </a>
          </li>
          <li>
            <a href="/about" className="text-blue-500 hover:underline">
              About Us
            </a>
          </li>
          <li>
            <a href="/privacy-policy" className="text-blue-500 hover:underline">
              Privacy Policy
            </a>
          </li>
        </ul>
      </section>
    </main>
  );
};

export default CustomerSupport;
