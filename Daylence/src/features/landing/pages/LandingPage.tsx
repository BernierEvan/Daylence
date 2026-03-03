import { useEffect, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";

export default function LandingPage() {
  return (
    <div className="landing-page">
      <Header />
        <Hero />
      <Footer />
    </div>
  );
}
