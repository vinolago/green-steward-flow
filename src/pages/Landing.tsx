import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sprout, Shield, Trophy } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Sprout className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4">
            GreenToken
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Communities protecting land deserve recognition
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
            <h2 className="text-3xl font-semibold text-foreground mb-6">
              Rewarding Land Restoration Actions
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              GreenToken is a community-driven platform that rewards verified land care activities. 
              Submit proof of your restoration work, get it verified by our community, and earn GreenTokens 
              that recognize your environmental impact.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center p-6 bg-muted rounded-xl">
                <Sprout className="h-10 w-10 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Submit Proof</h3>
                <p className="text-sm text-muted-foreground">
                  Upload photos of your land care activities
                </p>
              </div>
              <div className="text-center p-6 bg-muted rounded-xl">
                <Shield className="h-10 w-10 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Get Verified</h3>
                <p className="text-sm text-muted-foreground">
                  Community verifiers review your submissions
                </p>
              </div>
              <div className="text-center p-6 bg-muted rounded-xl">
                <Trophy className="h-10 w-10 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Earn Tokens</h3>
                <p className="text-sm text-muted-foreground">
                  Receive GreenTokens for approved actions
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link to="/signup">
            <Button size="lg" className="text-lg px-8 py-6 rounded-xl">
              Join the movement
            </Button>
          </Link>
          <p className="mt-4 text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
