import { Button } from "@/components/ui/button";
import { MapPin, Trophy } from "lucide-react";
import heroImage from "@/assets/hero-app-preview.png";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCountAnimation } from "@/hooks/useCountAnimation";

const Hero = () => {
  const { ref, isVisible } = useScrollAnimation(0.2);
  const userCount = useCountAnimation(10, 2000, isVisible);
  const pointCount = useCountAnimation(50, 2000, isVisible);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 md:py-32">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      <div className="container mx-auto px-4" ref={ref}>
        <div className={`grid gap-12 lg:grid-cols-2 lg:gap-16 items-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <MapPin className="h-4 w-4" />
              <span>Making Public Transport Reliable</span>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Never Miss Your
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Bus Again
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground md:text-xl">
              CityRoute uses crowdsourced data to show you exactly where your bus is, 
              when it'll arrive, and rewards you for helping the community.
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:shadow-hover transition-all duration-300">
                Download App
              </Button>
              <Button size="lg" variant="outline" className="border-primary/20 hover:border-primary/40">
                Learn More
              </Button>
            </div>
            
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-10 w-10 rounded-full border-2 border-background bg-gradient-to-br from-primary to-accent animate-pulse"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{userCount}K+ Active Users</span>
              </div>
              
              <div className="flex items-center gap-2 text-accent">
                <Trophy className="h-5 w-5 animate-bounce" />
                <span className="text-sm font-medium">{pointCount}K Points Earned</span>
              </div>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl group-hover:blur-2xl transition-all duration-500" />
            <img
              src={heroImage}
              alt="CityRoute App Preview"
              className="relative rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
