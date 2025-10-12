import { getCurrentUser } from "@/lib/mockAuth";
import { getTokens } from "@/lib/mockData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface MyTokensProps {
  userId: string;
}

export const MyTokens = ({ userId }: MyTokensProps) => {
  const user = getCurrentUser();
  const tokens = getTokens().filter(t => t.user_id === userId);

  return (
    <Card className="rounded-2xl bg-primary text-primary-foreground">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-6 w-6" />
          My GreenTokens
        </CardTitle>
        <CardDescription className="text-primary-foreground/80">
          Tokens earned from verified land care activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <div className="text-6xl font-bold mb-4">{user?.total_tokens || 0}</div>
          <p className="text-sm text-primary-foreground/80 mb-4">
            From {tokens.length} approved {tokens.length === 1 ? 'action' : 'actions'}
          </p>
          <Link to="/redeem">
            <Button variant="secondary" className="rounded-xl">
              Redeem Tokens
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
