// hooks/useAuth.ts
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData?.user) {
        navigate("/login");
        return;
      }

      const userId = userData.user.id;
      const email = userData.user.email;

      // 🔄 Fetch profile from 'profiles' table, not metadata
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, name")
        .eq("id", userId)
        .single();

      if (profileError || !profile) {
        console.error("Profile fetch failed:", profileError);
        navigate("/login");
        return;
      }

      // ✅ Set user with profile info
      const role = profile.role || "user";
      const name = profile.name || email;

      setUser({
        id: userId,
        name,
        email,
        role,
      });

      setLoading(false);
    };

    fetchUser();
  }, [navigate]);

  return { user, loading };
};
