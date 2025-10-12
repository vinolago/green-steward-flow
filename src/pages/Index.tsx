import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/lib/mockAuth";
import Landing from "./Landing";

const Index = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    if (user) {
      navigate(user.role === 'verifier' ? '/verify' : '/dashboard');
    }
  }, [user, navigate]);

  if (user) return null;

  return <Landing />;
};

export default Index;
