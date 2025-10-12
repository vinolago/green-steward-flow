import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Sprout } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient"; // ✅ new import

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!isSupabaseConfigured) {
      setLoading(false);
      toast({
        title: "Configuration error",
        description: "Supabase API key or URL is missing. Check your environment variables.",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (data?.user) {
      // Fetch user profile to get role if you have a 'profiles' table
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, name")
        .eq("id", data.user.id)
        .single();

      const role = profile?.role || "user";
      const name = profile?.name || email;

      toast({
        title: "Welcome back!",
        description: `Logged in as ${name}`,
      });

      navigate(role === "verifier" ? "/verify" : "/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {!isSupabaseConfigured && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg">
            Supabase is not configured. The app will not be able to authenticate.
          </div>
        </div>
      )}
      <Card className="w-full max-w-md rounded-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Sprout className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Log in to your GreenToken account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-xl"
              />
            </div>
            <Button type="submit" className="w-full rounded-xl" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </form>
          <p className="text-center mt-4 text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
