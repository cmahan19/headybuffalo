"use client";

import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import ReCAPTCHA from "react-google-recaptcha";

const ContactPage: React.FC = () => {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const formSchema = Yup.object().shape({
    name: Yup.string().required("Name is required").min(2, "Name is too short"),
    email: Yup.string().required("Email is required").email("Invalid email format"),
    subject: Yup.string().required("Subject is required"),
    message: Yup.string().required("Message is required").min(10, "Message is too short"),
  });

  const formik = useFormik({
    initialValues: { name: "", email: "", subject: "", message: "" },
    validationSchema: formSchema,
    onSubmit: async (values, { resetForm }) => {
      if (!captchaToken) {
        alert("Please verify the captcha");
        return;
      }

      setStatus("sending");

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, captchaToken }),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        resetForm();
        setCaptchaToken(null);
        setStatus("success");
      } catch (error) {
        setStatus("error");
      } finally {
        setTimeout(() => setStatus("idle"), 5000);
      }
    },
  });

  // Handle reCAPTCHA v3 token
  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Contact Us</h1>
      <p className="text-center text-gray-600 mb-8">
        Have questions or need help? Reach out using the form below.
      </p>

      <form
        onSubmit={formik.handleSubmit}
        className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-md"
      >
        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Your Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className={`mt-1 p-2 w-full border rounded-md shadow-sm ${
              formik.touched.name && formik.errors.name ? "border-red-500" : ""
            }`}
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Your Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={`mt-1 p-2 w-full border rounded-md shadow-sm ${
              formik.touched.email && formik.errors.email ? "border-red-500" : ""
            }`}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
          )}
        </div>

        {/* Subject */}
        <div className="mb-4">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            className={`mt-1 p-2 w-full border rounded-md shadow-sm ${
              formik.touched.subject && formik.errors.subject ? "border-red-500" : ""
            }`}
            value={formik.values.subject}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.subject && formik.errors.subject && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.subject}</p>
          )}
        </div>

        {/* Message */}
        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className={`mt-1 p-2 w-full border rounded-md shadow-sm ${
              formik.touched.message && formik.errors.message ? "border-red-500" : ""
            }`}
            value={formik.values.message}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.message && formik.errors.message && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.message}</p>
          )}
        </div>

        {/* Google reCAPTCHA v3 */}
        <div className="mb-6 text-center">
          <ReCAPTCHA
            sitekey="YOUR_RECAPTCHA_V3_SITE_KEY" // Replace with your actual reCAPTCHA v3 site key
            size="invisible" // reCAPTCHA v3 doesn't need user interaction
            onChange={handleCaptchaChange}
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={status === "sending" || !captchaToken}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          >
            {status === "sending" ? "Sending..." : "Send Message"}
          </button>
        </div>

        {/* Status Messages */}
        <div id="status-message" className="mt-4 text-center">
          {status === "success" && (
            <p className="text-green-600">Message sent successfully!</p>
          )}
          {status === "error" && (
            <p className="text-red-600">Failed to send message. Please try again.</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default ContactPage;
