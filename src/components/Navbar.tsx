import { Button } from "@/components/ui/button";
import { Bus } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className={`sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ${
      scrolled ? "shadow-lg" : ""
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Bus className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              CityRoute
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('#features')} className="text-sm font-medium hover:text-primary transition-colors hover:scale-110 duration-200">
              Features
            </button>
            <button onClick={() => navigate('/gamification')} className="text-sm font-medium hover:text-primary transition-colors hover:scale-110 duration-200">
              Gamification
            </button>
            <button onClick={() => navigate('/pricing')} className="text-sm font-medium hover:text-primary transition-colors hover:scale-110 duration-200">
              Pricing
            </button>
            <button onClick={() => navigate('/rewards')} className="text-sm font-medium hover:text-primary transition-colors hover:scale-110 duration-200">
              Rewards
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button className="bg-gradient-to-r from-primary to-accent hover:shadow-hover hover:scale-105 transition-all duration-300">
              Download
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
