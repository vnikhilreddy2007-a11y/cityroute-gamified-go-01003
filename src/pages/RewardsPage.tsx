import { useEffect, useState } from "react";
import { getSafeErrorMessage } from "@/lib/error-messages";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy, Gift, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";

interface Reward {
  id: string;
  name: string;
  description: string;
  points_required: number;
  category: string;
}

interface Redemption {
  id: string;
  reward_id: string;
  points_spent: number;
  redeemed_at: string;
  status: string;
}

const RewardsPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      // Fetch user points
      const { data: pointsData, error: pointsError } = await supabase
        .from("user_points")
        .select("points")
        .eq("user_id", user.id)
        .maybeSingle();

      if (pointsError && pointsError.code !== 'PGRST116') throw pointsError;

      if (!pointsData) {
        // Create initial points entry
        const { error: insertError } = await supabase
          .from("user_points")
          .insert({ user_id: user.id, points: 500 }); // Start with 500 points for demo

        if (!insertError) {
          setUserPoints(500);
        }
      } else {
        setUserPoints(pointsData.points);
      }

      // Fetch available rewards
      const { data: rewardsData, error: rewardsError } = await supabase
        .from("rewards")
        .select("*")
        .eq("available", true)
        .order("points_required", { ascending: true });

      if (rewardsError) throw rewardsError;
      setRewards(rewardsData || []);

      // Fetch user redemptions
      const { data: redemptionsData, error: redemptionsError } = await supabase
        .from("user_redemptions")
        .select("*")
        .eq("user_id", user.id)
        .order("redeemed_at", { ascending: false });

      if (redemptionsError) throw redemptionsError;
      setRedemptions(redemptionsData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: getSafeErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (reward: Reward) => {
    if (!user) return;

    if (userPoints < reward.points_required) {
      toast({
        title: "Insufficient Points",
        description: `You need ${reward.points_required - userPoints} more points to redeem this reward.`,
        variant: "destructive",
      });
      return;
    }

    try {
      const newPoints = userPoints - reward.points_required;

      // Update user points
      const { error: updateError } = await supabase
        .from("user_points")
        .update({ points: newPoints })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      // Create redemption record
      const { error: redeemError } = await supabase
        .from("user_redemptions")
        .insert({
          user_id: user.id,
          reward_id: reward.id,
          points_spent: reward.points_required,
          status: "pending",
        });

      if (redeemError) throw redeemError;

      toast({
        title: "Reward Redeemed!",
        description: `You've successfully redeemed ${reward.name}.`,
      });

      fetchData(); // Refresh data
    } catch (error: any) {
      toast({
        title: "Error",
        description: getSafeErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      transport: "bg-primary/10 text-primary",
      food: "bg-accent/10 text-accent",
      merchandise: "bg-secondary text-secondary-foreground",
      service: "bg-muted text-muted-foreground",
    };
    return colors[category] || "bg-muted text-muted-foreground";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <Link to="/">
          <Button variant="ghost" className="mb-8 hover:translate-x-1 transition-transform">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        {/* Points Banner */}
        <Card className="mb-12 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">{userPoints} Points</h2>
                  <p className="text-muted-foreground">Available to redeem</p>
                </div>
              </div>
              <Button onClick={fetchData} variant="outline">
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Available Rewards */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Gift className="h-6 w-6" />
            Available Rewards
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rewards.map((reward) => {
              const canAfford = userPoints >= reward.points_required;
              return (
                <Card
                  key={reward.id}
                  className={`transition-all duration-300 hover:shadow-card ${
                    !canAfford ? "opacity-60" : "hover:-translate-y-1"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getCategoryColor(reward.category)}>
                        {reward.category}
                      </Badge>
                      <span className="text-lg font-bold text-primary">
                        {reward.points_required} pts
                      </span>
                    </div>
                    <CardTitle>{reward.name}</CardTitle>
                    <CardDescription>{reward.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => handleRedeem(reward)}
                      disabled={!canAfford}
                      className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-hover"
                    >
                      {canAfford ? "Redeem Now" : "Not Enough Points"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Redemption History */}
        {redemptions.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CheckCircle className="h-6 w-6" />
              Redemption History
            </h2>
            <div className="space-y-4">
              {redemptions.map((redemption) => {
                const reward = rewards.find((r) => r.id === redemption.reward_id);
                return (
                  <Card key={redemption.id}>
                    <CardContent className="flex items-center justify-between py-4">
                      <div>
                        <p className="font-semibold">{reward?.name || "Unknown Reward"}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(redemption.redeemed_at).toLocaleDateString()} •{" "}
                          {redemption.points_spent} points
                        </p>
                      </div>
                      <Badge
                        variant={redemption.status === "completed" ? "default" : "secondary"}
                      >
                        {redemption.status}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default RewardsPage;
