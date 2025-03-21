// app/about/page.tsx
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Image Section */}
      <div className="relative mb-8">
        <img 
          src="/about-us.webp" 
          alt="Heady Buffalo Eco-friendly Products" 
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
        <div className="absolute inset-0 bg-black opacity-40 rounded-lg"></div>
      </div>
      
      {/* Heading Section */}
      <h1 className="text-4xl font-extrabold text-center text-green-700 mb-6">
        About Heady Buffalo
      </h1>

      {/* Mission Statement */}
      <p className="text-xl text-gray-800 mb-6 text-center">
        At Heady Buffalo, we are passionate about creating a positive change for the environment. Our eco-friendly and sustainable products 
        are designed to enhance your life while reducing your ecological footprint. We believe that style, quality, and sustainability can go hand in hand.
      </p>

      {/* Why Choose Us? Section */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Why Choose Heady Buffalo?</h2>
        <p className="text-lg text-gray-700 mb-4">
          Our products are sourced responsibly, and every purchase supports sustainable practices. When you shop with us, you're not just getting high-quality, eco-friendly items—you’re also contributing to global sustainability efforts. 
        </p>
        <ul className="list-disc list-inside text-left text-lg text-gray-700 mx-auto max-w-3xl">
          <li>Made with 100% recycled materials</li>
          <li>Supporting local artisans and small businesses</li>
          <li>Every purchase helps fund environmental initiatives</li>
          <li>Eco-friendly packaging and carbon-conscious shipping</li>
        </ul>
      </div>

      {/* Call to Action */}
      <div className="text-center py-8 bg-green-50 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Join the Movement Today</h3>
        <p className="text-lg text-gray-700 mb-4">
          Explore our products and be part of the change. Together, we can create a more sustainable future!
        </p>
        <a href="/shop" className="inline-block bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition duration-300">
          Shop Now
        </a>
      </div>

      {/* Testimonials Section */}
      <div className="text-center my-8">
        <h2 className="text-2xl font-bold text-green-600 mb-4">What Our Customers Are Saying</h2>
        <div className="flex justify-center space-x-8">
          <div className="w-1/3 p-4 bg-white shadow-lg rounded-lg">
            <p className="text-lg text-gray-700 italic">"I love the eco-friendly products from Heady Buffalo! They're stylish and make me feel like I'm making a difference!"</p>
            <p className="text-sm text-gray-500 mt-2">- Sarah, Eco-conscious Shopper</p>
          </div>
          <div className="w-1/3 p-4 bg-white shadow-lg rounded-lg">
            <p className="text-lg text-gray-700 italic">"Quality products that I can trust! Every purchase feels like I'm contributing to a greener world."</p>
            <p className="text-sm text-gray-500 mt-2">- Jason, Sustainable Living Advocate</p>
          </div>
        </div>
      </div>
      
      {/* Footer Section */}
      <div className="text-center py-8">
        <p className="text-sm text-gray-600">
          Thank you for supporting sustainable living! Connect with us on our social media to stay updated on new products and eco-friendly tips.
        </p>
        <div className="space-x-4 mt-4">
          <a href="https://facebook.com" className="text-blue-600 hover:text-blue-700">Facebook</a>
          <a href="https://instagram.com" className="text-pink-600 hover:text-pink-700">Instagram</a>
          <a href="https://twitter.com" className="text-blue-400 hover:text-blue-500">Twitter</a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
