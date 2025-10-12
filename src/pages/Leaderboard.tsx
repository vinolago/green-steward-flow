import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, Trophy } from "lucide-react";

const Leaderboard = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]')
    .sort((a: any, b: any) => b.total_tokens - a.total_tokens);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <Sprout className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">GreenToken</h1>
          </Link>
          <div className="flex gap-2">
            <Link to="/login">
              <Button variant="outline" size="sm" className="rounded-xl">
                Log In
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="rounded-xl">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="rounded-2xl max-w-3xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Trophy className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-3xl">Leaderboard</CardTitle>
            <CardDescription>Top contributors to land restoration</CardDescription>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No users yet</p>
            ) : (
              <div className="space-y-3">
                {users.map((user: any, index: number) => {
                  const actions = JSON.parse(localStorage.getItem('actions') || '[]')
                    .filter((a: any) => a.user_id === user.id && a.status === 'approved');
                  
                  return (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl w-10 text-center">
                          {index < 3 ? medals[index] : `#${index + 1}`}
                        </span>
                        <div>
                          <h3 className="font-semibold">{user.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {actions.length} approved {actions.length === 1 ? 'action' : 'actions'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{user.total_tokens}</p>
                        <p className="text-xs text-muted-foreground">tokens</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Leaderboard;
