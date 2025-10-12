import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Landing from "./Landing";
import { supabase } from "@/lib/supabaseClient";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) console.error(error);
      setUser(data?.user || null);
      setLoading(false);
    };

    getUser();

    // listen for login/logout changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!loading && user) {
      // if you store user role in metadata (e.g. during signup)
      const role = user.user_metadata?.role;
      navigate(role === "verifier" ? "/verify" : "/dashboard");
    }
  }, [user, loading, navigate]);

  if (loading) return null;

  return <Landing />;
};

export default Index;
