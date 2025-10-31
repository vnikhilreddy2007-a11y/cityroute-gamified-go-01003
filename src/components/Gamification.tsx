import { Card, CardContent } from "@/components/ui/card";
import { Star, Users, TrendingUp } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCountAnimation } from "@/hooks/useCountAnimation";

const stats = [
  {
    icon: Star,
    value: 50,
    suffix: "K+",
    label: "Points Earned",
    color: "text-accent",
  },
  {
    icon: Users,
    value: 10,
    suffix: "K+",
    label: "Active Contributors",
    color: "text-primary",
  },
  {
    icon: TrendingUp,
    value: 95,
    suffix: "%",
    label: "Accuracy Rate",
    color: "text-accent",
  },
];

const Gamification = () => {
  const { ref, isVisible } = useScrollAnimation(0.2);

  return (
    <section id="gamification" className="py-20 md:py-32" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Earn While You
                <span className="block bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                  Help Others
                </span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Every time you report a bus location or contribute to the community, 
                you earn points and unlock exclusive badges. Make commuting a game!
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Star className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Collect Badges</h3>
                  <p className="text-sm text-muted-foreground">
                    Unlock unique badges as you reach milestones and help your community.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Climb Leaderboards</h3>
                  <p className="text-sm text-muted-foreground">
                    Compete with friends and see who's the most helpful commuter in your city.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Build Community</h3>
                  <p className="text-sm text-muted-foreground">
                    Join a network of riders making public transport better for everyone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid gap-6">
            {stats.map((stat, index) => {
              const count = useCountAnimation(stat.value, 2000, isVisible);
              return (
                <Card
                  key={index}
                  className={`border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-card hover:-translate-x-2 group cursor-pointer ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">{count}{stat.suffix}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gamification;
