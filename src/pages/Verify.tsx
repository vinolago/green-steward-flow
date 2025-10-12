import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PendingActions } from "@/components/PendingActions";
import { Sprout, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const Verify = () => {
  const [user, setUser] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  // ✅ Fetch authenticated user on mount
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        navigate("/login");
        return;
      }

      // Optionally fetch profile from 'profiles' table if you store role there
      const { data: profile } = await supabase
        .from("profiles")
        .select("name, role")
        .eq("id", data.user.id)
        .single();

      if (!profile || profile.role !== "verifier") {
        navigate("/dashboard");
        return;
      }

      setUser({ ...data.user, ...profile });
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sprout className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">GreenToken - Verifier</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Verifier:{" "}
              <span className="font-medium text-foreground">{user.name}</span>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="rounded-xl"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <PendingActions key={refreshKey} onUpdate={handleRefresh} />
      </main>
    </div>
  );
};

export default Verify;
