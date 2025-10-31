import Navbar from "@/components/Navbar";
import Gamification from "@/components/Gamification";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const GamificationPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <div className="container mx-auto px-4 pt-24 pb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-8 hover:translate-x-1 transition-transform">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
        <Gamification />
      </main>
      <Footer />
    </div>
  );
};

export default GamificationPage;
