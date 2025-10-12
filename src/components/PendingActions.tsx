import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle } from "lucide-react";

interface PendingActionsProps {
  onUpdate: () => void;
}

export const PendingActions = ({ onUpdate }: PendingActionsProps) => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const activityLabels: Record<string, string> = {
    tree_planting: "Tree Planting",
    fencing: "Fencing",
    composting: "Composting",
    erosion_control: "Erosion Control",
  };

  // ✅ Fetch all pending submissions
  const fetchPendingSubmissions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching pending submissions:", error);
    } else {
      setSubmissions(data || []);
    }
    setLoading(false);
  };

  // ✅ Approve submission and award token
  const handleApprove = async (actionId: string, userId: string) => {
    // Update submission status
    const { error: updateError } = await supabase
      .from("submissions")
      .update({ status: "approved" })
      .eq("id", actionId);

    if (updateError) {
      console.error("Error approving action:", updateError);
      toast({
        title: "Error",
        description: "Failed to approve submission",
        variant: "destructive",
      });
      return;
    }

    // Award 1 token to user
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("total_tokens")
      .eq("id", userId)
      .single();

    if (!userError && userData) {
      const newTotal = (userData.total_tokens || 0) + 1;
      const { error: tokenError } = await supabase
        .from("users")
        .update({ total_tokens: newTotal })
        .eq("id", userId);

      if (tokenError) {
        console.error("Error updating user tokens:", tokenError);
      }
    }

    toast({
      title: "Approved!",
      description: "User has been awarded 1 GreenToken",
    });

    await fetchPendingSubmissions();
    onUpdate();
  };

  // ✅ Reject submission
  const handleReject = async (actionId: string) => {
    const { error } = await supabase
      .from("submissions")
      .update({ status: "rejected" })
      .eq("id", actionId);

    if (error) {
      console.error("Error rejecting submission:", error);
      toast({
        title: "Error",
        description: "Failed to reject submission",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Rejected",
      description: "Submission has been rejected",
    });

    await fetchPendingSubmissions();
    onUpdate();
  };

  // ✅ Fetch + real-time updates
  useEffect(() => {
    fetchPendingSubmissions();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("realtime_pending_submissions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "submissions" },
        (payload) => {
          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE" ||
            payload.eventType === "DELETE"
          ) {
            fetchPendingSubmissions();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <Card className="rounded-2xl">
        <CardContent className="text-center p-6">Loading pending submissions...</CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Pending Verifications</CardTitle>
        <CardDescription>Review and approve land care submissions</CardDescription>
      </CardHeader>
      <CardContent>
        {submissions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No pending submissions
          </p>
        ) : (
          <div className="space-y-6">
            {submissions.map((submission) => (
              <div key={submission.id} className="border border-border rounded-xl p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <img
                      src={submission.photo_url}
                      alt="Activity"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        {activityLabels[submission.activity_type]}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Submitted by:
                        <span className="font-medium text-foreground">
                          {submission.user_name}
                        </span>
                      </p>
                    </div>

                    {submission.description && (
                      <div>
                        <p className="text-sm font-medium mb-1">Description:</p>
                        <p className="text-sm text-muted-foreground">{submission.description}</p>
                      </div>
                    )}

                    {submission.location && (
                      <p className="text-sm text-muted-foreground">
                        📍 Location: {submission.location}
                      </p>
                    )}

                    <p className="text-xs text-muted-foreground">
                      Submitted: {new Date(submission.created_at).toLocaleString()}
                    </p>

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={() => handleApprove(submission.id, submission.user_id)}
                        className="flex-1 rounded-xl"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(submission.id)}
                        variant="destructive"
                        className="flex-1 rounded-xl"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
