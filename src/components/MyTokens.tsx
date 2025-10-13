import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface MyTokensProps {
  userId: string;
}

export const MyTokens = ({ userId }: MyTokensProps) => {
  const [totalTokens, setTotalTokens] = useState<number>(0);
  const [approvedCount, setApprovedCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchTokens = async () => {
    setLoading(true);

    // Fetch user’s total tokens
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("total_tokens")
      .eq("id", userId)
      .single();

    if (userError) console.error("Error fetching user tokens:", userError);

    // Fetch approved submissions count
    const { data: submissions, error: submissionsError } = await supabase
      .from("submissions")
      .select("id")
      .eq("user_id", userId)
      .eq("status", "approved");

    if (submissionsError) console.error("Error fetching submissions:", submissionsError);

    setTotalTokens(userData?.total_tokens || 0);
    setApprovedCount(submissions?.length || 0);
    setLoading(false);
  };

  useEffect(() => {
    fetchTokens();

    // 🔁 Real-time listener for submissions and user updates
    const channel = supabase
      .channel("realtime_tokens")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "submissions", filter: `user_id=eq.${userId}` },
        (payload) => {
          // Whenever a submission is approved or updated, re-fetch data
          if (payload.new?.status === "approved" || payload.old?.status === "approved") {
            fetchTokens();
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles", filter: `id=eq.${userId}` },
        () => {
          // Re-fetch if user's total_tokens change
          fetchTokens();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  if (loading) {
    return (
      <Card className="rounded-2xl bg-primary text-primary-foreground">
        <CardContent className="text-center p-6">
          <p>Loading tokens...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl bg-primary text-primary-foreground">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-6 w-6" />
          My GreenTokens
        </CardTitle>
        <CardDescription className="text-primary-foreground/80">
          Tokens earned from verified land care activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <div className="text-6xl font-bold mb-4">{totalTokens}</div>
          <p className="text-sm text-primary-foreground/80 mb-4">
            From {approvedCount} approved {approvedCount === 1 ? "action" : "actions"}
          </p>
          <Link to="/redeem">
            <Button variant="secondary" className="rounded-xl">
              Redeem Tokens
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
