// pages/Dashboard.tsx
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sprout, LogOut } from "lucide-react";
import { signOutUser } from "@/lib/authHelpers";
import { SubmissionForm } from "@/components/SubmissionForm";
import { MySubmissions } from "@/components/MySubmissions";
import { MyTokens } from "@/components/MyTokens";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { set } from "date-fns";


const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0); // ✅ State to trigger refresh

  const handleLogout = async () => {
    await signOutUser();
    navigate("/login");
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1); // Increment to trigger refresh
    toast.success("Data submitted successfully!");
  };


  if (loading)
    return <div className="p-6 text-center">Loading...</div>;

  if (!user)
    return <div className="p-6 text-center">No user data available.</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sprout className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">GreenToken</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, <span className="font-medium text-foreground">{user.name}</span>
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-xl">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 max-w-6xl mx-auto">
          <MyTokens userId={user.id} />
          <SubmissionForm userId={user.id} userName={user.name} onSubmit={handleRefresh} />
          <MySubmissions userId={user.id} refreshSignal={refreshKey}/>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
