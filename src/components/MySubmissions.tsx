import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle } from "lucide-react";

interface MySubmissionsProps {
  userId: string;
  refreshSignal?: number; // ✅ New prop to allow parent to trigger refresh
}

interface Submission {
  id: string;
  user_id: string;
  activity_type: string;
  description?: string;
  location?: string;
  photo_url: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export const MySubmissions = ({ userId, refreshSignal }: MySubmissionsProps) => {
  const [submissions, setActions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching actions:", error);
    } else {
      setActions(data || []);
    }

    setLoading(false);
  };

  // 🔁 Fetch on mount and whenever userId or refreshSignal changes
  useEffect(() => {
    fetchActions();
  }, [userId, refreshSignal]);

  // 🔄 Real-time listener
  useEffect(() => {
    const channel = supabase
      .channel("realtime-actions")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "actions",
          filter: `user_id=eq.${userId}`,
        },
        async () => {
          await fetchActions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const statusConfig = {
    pending: { icon: Clock, label: "Pending", variant: "secondary" as const },
    approved: { icon: CheckCircle, label: "Approved", variant: "default" as const },
    rejected: { icon: XCircle, label: "Rejected", variant: "destructive" as const },
  };

  const activityLabels = {
    tree_planting: "Tree Planting",
    fencing: "Fencing",
    composting: "Composting",
    erosion_control: "Erosion Control",
  };

  if (loading) {
    return (
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>My Submissions</CardTitle>
          <CardDescription>Loading your submissions...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>My Submissions</CardTitle>
        <CardDescription>Track the status of your land care submissions</CardDescription>
      </CardHeader>
      <CardContent>
        {submissions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No submissions yet</p>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => {
              const StatusIcon = statusConfig[submission.status].icon;
              return (
                <div key={submission.id} className="border border-border rounded-xl p-4 flex gap-4">
                  <img
                    src={submission.photo_url}
                    alt="Activity"
                    className="w-24 h-24 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = "/fallback-image.png"; // fallback in case image fails
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{activityLabels[submission.activity_type]}</h3>
                      <Badge variant={statusConfig[submission.status].variant} className="rounded-full">
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[submission.status].label}
                      </Badge>
                    </div>
                    {submission.description && (
                      <p className="text-sm text-muted-foreground mb-1">{submission.description}</p>
                    )}
                    {submission.location && (
                      <p className="text-sm text-muted-foreground">📍 {submission.location}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(submission.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
