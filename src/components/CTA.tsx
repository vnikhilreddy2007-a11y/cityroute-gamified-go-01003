import { Button } from "@/components/ui/button";
import { Smartphone } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const CTA = () => {
  const { ref, isVisible } = useScrollAnimation(0.2);

  return (
    <section id="cta" className="py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-accent/10" ref={ref}>

      <div className="container mx-auto px-4">
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-accent p-12 md:p-16 lg:p-20 text-center transition-all duration-1000 hover:shadow-2xl ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          <div className="absolute inset-0 bg-grid-white/5 animate-pulse" />
          <div className="relative space-y-8">
            <div className="inline-flex items-center justify-center rounded-full bg-white/20 p-4 hover:bg-white/30 transition-all hover:scale-110 animate-bounce">
              <Smartphone className="h-8 w-8 text-primary-foreground" />
            </div>
            
            <div className="space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl md:text-5xl">
                Ready to Transform Your Commute?
              </h2>
              <p className="text-lg text-primary-foreground/90">
                Join thousands of riders who are making public transport better. 
                Download CityRoute today and start earning rewards!
              </p>
            </div>
            
            <div className="flex flex-col gap-4 sm:flex-row justify-center">
              <Button 
                size="lg" 
                className="bg-background text-foreground hover:bg-background/90 shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
              >
                Download for iOS
              </Button>
              <Button 
                size="lg" 
                className="bg-background text-foreground hover:bg-background/90 shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
              >
                Download for Android
              </Button>
            </div>
            
            <p className="text-sm text-primary-foreground/80">
              Available on iOS and Android • Free to download
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
