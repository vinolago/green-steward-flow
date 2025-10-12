import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getCurrentUser, logout } from "@/lib/mockAuth";
import { getActions, addAction } from "@/lib/mockData";
import { SubmissionForm } from "@/components/SubmissionForm";
import { MySubmissions } from "@/components/MySubmissions";
import { MyTokens } from "@/components/MyTokens";
import { Sprout, LogOut } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!user || user.role !== 'user') {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleRefresh = () => {
    setUser(getCurrentUser());
    setRefreshKey(prev => prev + 1);
  };

  if (!user) return null;

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
          <MyTokens userId={user.id} key={`tokens-${refreshKey}`} />
          <SubmissionForm userId={user.id} userName={user.name} onSubmit={handleRefresh} />
          <MySubmissions userId={user.id} key={`submissions-${refreshKey}`} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
