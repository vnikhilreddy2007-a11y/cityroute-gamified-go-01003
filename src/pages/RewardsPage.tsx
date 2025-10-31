import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Award, Gift, History, Loader2, TrendingUp } from "lucide-react";

interface Reward {
  id: string;
  name: string;
  description: string;
  points_required: number;
  category: string;
}

interface Redemption {
  id: string;
  points_spent: number;
  redeemed_at: string;
  status: string;
  rewards: {
    name: string;
  };
}

const RewardsPage = () => {
  const [user, setUser] = useState<any>(null);
  const [points, setPoints] = useState(0);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUser(user);
    await loadData(user.id);
  };

  const loadData = async (userId: string) => {
    setLoading(true);
    
    // Load user points
    const { data: pointsData, error: pointsError } = await supabase
      .from("user_points")
      .select("points")
      .eq("user_id", userId)
      .maybeSingle();

    if (pointsError && pointsError.code !== "PGRST116") {
      console.error("Error loading points:", pointsError);
    } else if (!pointsData) {
      // Create initial points record
      await supabase
        .from("user_points")
        .insert({ user_id: userId, points: 0 });
      setPoints(0);
    } else {
      setPoints(pointsData.points);
    }

    // Load rewards
    const { data: rewardsData } = await supabase
      .from("rewards")
      .select("*")
      .eq("available", true)
      .order("points_required");

    if (rewardsData) setRewards(rewardsData);

    // Load redemption history
    const { data: redemptionsData } = await supabase
      .from("user_redemptions")
      .select("*, rewards(name)")
      .eq("user_id", userId)
      .order("redeemed_at", { ascending: false });

    if (redemptionsData) setRedemptions(redemptionsData as any);

    setLoading(false);
  };

  const handleRedeem = async (reward: Reward) => {
    if (points < reward.points_required) {
      toast({
        title: "Insufficient Points",
        description: `You need ${reward.points_required - points} more points to redeem this reward.`,
        variant: "destructive",
      });
      return;
    }

    setRedeeming(reward.id);

    // Create redemption
    const { error: redemptionError } = await supabase
      .from("user_redemptions")
      .insert({
        user_id: user.id,
        reward_id: reward.id,
        points_spent: reward.points_required,
      });

    if (redemptionError) {
      toast({
        title: "Redemption Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setRedeeming(null);
      return;
    }

    // Update points
    const newPoints = points - reward.points_required;
    const { error: updateError } = await supabase
      .from("user_points")
      .update({ points: newPoints })
      .eq("user_id", user.id);

    if (updateError) {
      toast({
        title: "Error",
        description: "Failed to update points.",
        variant: "destructive",
      });
    } else {
      setPoints(newPoints);
      toast({
        title: "Success!",
        description: `You've redeemed ${reward.name}!`,
      });
      loadData(user.id);
    }

    setRedeeming(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Points Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <Award className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Your Rewards</h1>
          </div>
          <Card className="max-w-md mx-auto bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Available Points</p>
                <p className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {points}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="rewards" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="rewards" className="gap-2">
              <Gift className="h-4 w-4" />
              Available Rewards
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4" />
              Redemption History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rewards">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rewards.map((reward) => {
                const canAfford = points >= reward.points_required;
                return (
                  <Card
                    key={reward.id}
                    className={`transition-all duration-300 hover:shadow-card hover:-translate-y-1 ${
                      !canAfford ? 'opacity-60' : ''
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-xl">{reward.name}</CardTitle>
                        <Badge variant={canAfford ? "default" : "secondary"}>
                          {reward.points_required} pts
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{reward.description}</p>
                    </CardHeader>
                    <CardContent>
                      <Button
                        className="w-full"
                        disabled={!canAfford || redeeming === reward.id}
                        onClick={() => handleRedeem(reward)}
                      >
                        {redeeming === reward.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Redeeming...
                          </>
                        ) : (
                          "Redeem Now"
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="history">
            {redemptions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No redemptions yet. Start earning and redeeming rewards!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {redemptions.map((redemption) => (
                  <Card key={redemption.id}>
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{redemption.rewards.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(redemption.redeemed_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">-{redemption.points_spent} pts</p>
                          <Badge variant={redemption.status === "pending" ? "secondary" : "default"}>
                            {redemption.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default RewardsPage;
