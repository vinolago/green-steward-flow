import { useState } from "react";
import { getActions, updateActionStatus, addToken } from "@/lib/mockData";
import { updateUserTokens } from "@/lib/mockAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle } from "lucide-react";

interface PendingActionsProps {
  onUpdate: () => void;
}

export const PendingActions = ({ onUpdate }: PendingActionsProps) => {
  const [actions, setActions] = useState(getActions().filter(a => a.status === 'pending'));
  const { toast } = useToast();

  const activityLabels = {
    tree_planting: "Tree Planting",
    fencing: "Fencing",
    composting: "Composting",
    erosion_control: "Erosion Control",
  };

  const handleApprove = (actionId: string, userId: string) => {
    const action = updateActionStatus(actionId, 'approved');
    if (action) {
      addToken({
        user_id: userId,
        action_id: actionId,
        value: 1
      });

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.id === userId);
      if (user) {
        updateUserTokens(userId, user.total_tokens + 1);
      }

      toast({
        title: "Approved!",
        description: "User has been awarded 1 GreenToken",
      });

      setActions(getActions().filter(a => a.status === 'pending'));
      onUpdate();
    }
  };

  const handleReject = (actionId: string) => {
    updateActionStatus(actionId, 'rejected');
    toast({
      title: "Rejected",
      description: "Submission has been rejected",
    });
    setActions(getActions().filter(a => a.status === 'pending'));
    onUpdate();
  };

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Pending Verifications</CardTitle>
        <CardDescription>Review and approve land care submissions</CardDescription>
      </CardHeader>
      <CardContent>
        {actions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No pending submissions</p>
        ) : (
          <div className="space-y-6">
            {actions.map((action) => (
              <div key={action.id} className="border border-border rounded-xl p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <img
                      src={action.photo_url}
                      alt="Activity"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        {activityLabels[action.activity_type]}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Submitted by: <span className="font-medium text-foreground">{action.user_name}</span>
                      </p>
                    </div>
                    {action.description && (
                      <div>
                        <p className="text-sm font-medium mb-1">Description:</p>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                    )}
                    {action.location && (
                      <p className="text-sm text-muted-foreground">
                        📍 Location: {action.location}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Submitted: {new Date(action.created_at).toLocaleString()}
                    </p>
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={() => handleApprove(action.id, action.user_id)}
                        className="flex-1 rounded-xl"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(action.id)}
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
