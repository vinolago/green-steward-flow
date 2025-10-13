import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, LogOut, Gift, Leaf, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

const Redeem = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch user + profile from Supabase
  useEffect(() => {
    const fetchUser = async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData?.user) {
        navigate("/login");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("name, total_tokens, role")
        .eq("id", authData.user.id)
        .single();

      if (profileError || !profile) {
        navigate("/login");
        return;
      }

      setUser({ ...authData.user, ...profile });
      setLoading(false);
    };

    fetchUser();
    fetchUser();
  }, [navigate]);

  // ✅ Real-time listener for profile token updates
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel("realtime-profile-tokens")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          const newTokens = payload.new.total_tokens;
          setUser((prev: any) => ({ ...prev, total_tokens: newTokens }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const rewards = [
    {
      id: 1,
      name: "Seedling Voucher",
      cost: 1000,
      icon: Leaf,
      description: "Voucher for 5 native tree seedlings",
    },
    {
      id: 2,
      name: "Garden Tool Kit",
      cost: 1500,
      icon: ShoppingBag,
      description: "Basic tools for land restoration",
    },
    {
      id: 3,
      name: "Premium Compost",
      cost: 2500,
      icon: Gift,
      description: "20kg bag of organic compost",
    },
  ];

  const handleRedeem = async (reward: (typeof rewards)[0]) => {
    if (!user) return;

    const userTokens = Number(user.total_tokens || 0);

    if (userTokens < reward.cost) {
      toast({
        title: "Insufficient Tokens",
        description: `You need ${reward.cost - userTokens} more tokens.`,
        variant: "destructive",
      });
      return;
    }

    // Record the redemption in Supabase (which triggers automatic token deduction)
    const { error } = await supabase.from("redemptions").insert([
      {
        user_id: user.id,
        amount: reward.cost,
      },
    ]);

    if (error) {
      console.error("Error logging redemption:", error);
      toast({
        title: "Redemption Failed",
        description: "Something went wrong while redeeming your reward.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Reward Redeemed!",
      description: `You successfully redeemed ${reward.name} for ${reward.cost} tokens.`,
    });

  
  };


  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3">
            <Sprout className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">GreenToken</h1>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{user.total_tokens}</span> tokens
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-xl">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="rounded-2xl max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Redeem Your Tokens</CardTitle>
            <CardDescription>
              Convert your GreenTokens into real-world rewards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {rewards.map((reward) => {
                const Icon = reward.icon;
                const canAfford = user.total_tokens >= reward.cost;

                return (
                  <div
                    key={reward.id}
                    className={`border border-border rounded-xl p-6 text-center ${
                      !canAfford ? "opacity-50" : ""
                    }`}
                  >
                    <Icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="font-semibold text-lg mb-2">{reward.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
                    <p className="text-2xl font-bold text-primary mb-4">
                      {reward.cost} tokens
                    </p>
                    <Button
                      onClick={() => handleRedeem(reward)}
                      disabled={!canAfford}
                      className="w-full rounded-xl"
                    >
                      {canAfford ? "Redeem" : "Insufficient Tokens"}
                    </Button>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                More rewards coming soon! Keep earning tokens by submitting land care proofs.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Redeem;
