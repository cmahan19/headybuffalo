import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// ReCAPTCHA secret key
const RECAPTCHA_SECRET_KEY = "your-recaptcha-secret-key"; // Replace with your actual key

// Transporter for sending emails
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Example: Gmail SMTP
  port: 587,
  secure: false,
  auth: {
    user: "your-email@gmail.com", // Replace with your email
    pass: "your-email-password", // Replace with your email password or app-specific password
  },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate form fields
    const { name, email, subject, message, captchaToken } = body;
    if (!name || !email || !subject || !message || !captchaToken) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Verify the ReCAPTCHA token
    const captchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${captchaToken}`,
      { method: "POST" }
    );
    const captchaData = await captchaResponse.json();

    if (!captchaData.success) {
      return NextResponse.json({ error: "Captcha verification failed" }, { status: 400 });
    }

    // Send email
    const mailOptions = {
      from: email,
      to: "your-email@gmail.com", // Replace with your receiving email address
      subject: `New Contact Form Submission: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error handling contact form:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
