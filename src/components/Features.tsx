import { Card, CardContent } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import trackingIcon from "@/assets/feature-tracking.png";
import alertsIcon from "@/assets/feature-alerts.png";
import gamificationIcon from "@/assets/feature-gamification.png";

const features = [
  {
    icon: trackingIcon,
    title: "Real-Time Tracking",
    description: "See exactly where your bus is on a live map with crowdsourced location data from fellow riders.",
  },
  {
    icon: alertsIcon,
    title: "Smart Alerts",
    description: "Get notified about delays, route changes, and when your bus is approaching your stop.",
  },
  {
    icon: gamificationIcon,
    title: "Earn Rewards",
    description: "Collect points and badges by reporting bus locations and contributing to the community.",
  },
];

const Features = () => {
  const { ref, isVisible } = useScrollAnimation(0.2);

  return (
    <section id="features" className="py-20 md:py-32 bg-secondary/30" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Features That Make
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Your Commute Better
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to navigate public transport with confidence and have fun while doing it.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-card hover:-translate-y-2 group ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <CardContent className="p-8 space-y-4">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 p-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
