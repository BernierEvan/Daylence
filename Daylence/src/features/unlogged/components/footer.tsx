import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-8">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Daylence. All rights reserved.</p>
        <a href="/privacy-policy" className="text-gray-400 hover:text-gray-200">Privacy Policy</a>
        <a href="/confidentiality" className="text-gray-400 hover:text-gray-200 ml-4">Confidentiality Policy</a>
      </div>
    </footer>
  );
}
