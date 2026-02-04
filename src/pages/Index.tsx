import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BusTrackingMap from "@/components/BusTrackingMap";
import Features from "@/components/Features";
import Gamification from "@/components/Gamification";
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <BusTrackingMap />
        <Features />
        <Gamification />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
