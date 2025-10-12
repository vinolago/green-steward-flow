import { getActions } from "@/lib/mockData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle } from "lucide-react";

interface MySubmissionsProps {
  userId: string;
}

export const MySubmissions = ({ userId }: MySubmissionsProps) => {
  const actions = getActions().filter(a => a.user_id === userId);

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

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>My Submissions</CardTitle>
        <CardDescription>Track the status of your land care submissions</CardDescription>
      </CardHeader>
      <CardContent>
        {actions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No submissions yet</p>
        ) : (
          <div className="space-y-4">
            {actions.map((action) => {
              const StatusIcon = statusConfig[action.status].icon;
              return (
                <div key={action.id} className="border border-border rounded-xl p-4 flex gap-4">
                  <img
                    src={action.photo_url}
                    alt="Activity"
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{activityLabels[action.activity_type]}</h3>
                      <Badge variant={statusConfig[action.status].variant} className="rounded-full">
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[action.status].label}
                      </Badge>
                    </div>
                    {action.description && (
                      <p className="text-sm text-muted-foreground mb-1">{action.description}</p>
                    )}
                    {action.location && (
                      <p className="text-sm text-muted-foreground">📍 {action.location}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(action.created_at).toLocaleDateString()}
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
