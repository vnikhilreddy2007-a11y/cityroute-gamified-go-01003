import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star, Users, TrendingUp, Trophy, Zap } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCountAnimation } from "@/hooks/useCountAnimation";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const milestones = [
  { name: "Newcomer", points: 0 },
  { name: "Explorer", points: 100 },
  { name: "Contributor", points: 500 },
  { name: "Champion", points: 1000 },
  { name: "Legend", points: 2500 },
  { name: "Master", points: 5000 },
];

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
  const [userPoints, setUserPoints] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchUserPoints = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsAuthenticated(true);
        const { data } = await supabase
          .from('user_points')
          .select('points')
          .eq('user_id', user.id)
          .single();
        if (data) {
          setUserPoints(data.points);
        }
      }
    };
    fetchUserPoints();
  }, []);

  const getCurrentMilestone = (points: number) => {
    for (let i = milestones.length - 1; i >= 0; i--) {
      if (points >= milestones[i].points) {
        return { current: milestones[i], next: milestones[i + 1] || null };
      }
    }
    return { current: milestones[0], next: milestones[1] };
  };

  const displayPoints = userPoints ?? 500; // Demo points for non-authenticated users
  const { current, next } = getCurrentMilestone(displayPoints);
  const progressToNext = next 
    ? ((displayPoints - current.points) / (next.points - current.points)) * 100 
    : 100;

  return (
    <section id="gamification" className="py-20 md:py-32" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Your Points Card */}
        <Card className={`mb-12 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                  <Trophy className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Your Points</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {displayPoints}
                    </span>
                    <span className="text-muted-foreground">pts</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 max-w-md space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-accent" />
                    <span className="font-medium">{current.name}</span>
                  </div>
                  {next && (
                    <span className="text-muted-foreground">
                      Next: <span className="font-medium text-foreground">{next.name}</span>
                    </span>
                  )}
                </div>
                <Progress value={progressToNext} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{current.points} pts</span>
                  {next ? (
                    <span className="font-medium text-primary">
                      {next.points - displayPoints} pts to go
                    </span>
                  ) : (
                    <span className="font-medium text-accent">Max level reached!</span>
                  )}
                </div>
              </div>
            </div>
            {!isAuthenticated && (
              <p className="mt-4 text-xs text-muted-foreground text-center md:text-left">
                Sign in to track your real points and unlock rewards!
              </p>
            )}
          </CardContent>
        </Card>

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
