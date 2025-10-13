import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sprout, Shield, Trophy, Menu, X, Hand, CheckCircle, Globe } from "lucide-react";
import { useState } from "react";

// Local mobile menu component
const MobileMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        aria-label="Toggle menu"
        onClick={() => setOpen((v) => !v)}
        className="p-2 rounded-md"
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {open && (
        <div className="absolute left-4 right-4 mt-2 bg-card border border-border rounded-lg p-4 shadow-lg">
          <nav className="flex flex-col gap-3">
            <a href="#how" className="text-sm text-muted-foreground">How It Works</a>
            <Link to="/verify" className="text-sm text-muted-foreground">For Verifiers</Link>
            <Link to="/login" className="text-sm text-muted-foreground">Login</Link>
            <Link to="/signup">
              <Button size="sm" className="w-full rounded-xl">Sign Up</Button>
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
};

const Landing = () => {
  return (
  <div className="min-h-screen bg-background">
    {/* Navigation */}
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <Sprout className="h-8 w-8 text-primary" />
          <span className="text-lg font-bold">GreenToken</span>
        </Link>

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6">
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground">
              How It Works
            </a>
            <Link to="/verify" className="text-sm text-muted-foreground hover:text-foreground">
              For Verifiers
            </Link>
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">
              Login
            </Link>
            <Link to="/signup">
              <Button size="sm" className="rounded-xl">Sign Up</Button>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <MobileMenu />
        </div>
      </div>
    </header>

    {/* Main Content Area */}
    <main className="container mx-auto px-4 ">
      <div className="bg-card rounded-2xl p-8 ">

      
      {/* Hero Section */} 
      <section className="bg-gradient-to-b from-green-50 via-white to-white py-20">
      <div className="container mx-auto px-4 grid md:grid-cols-2 items-center gap-12">
        
        {/* Left Side: Text & CTA */}
        <div>
          <h1 className="text-5xl font-bold text-foreground mb-6 leading-tight">
            Turn land restoration into <span className="text-primary">real-world rewards</span>
          </h1>
          <p className="text-xl mb-6">
            GreenToken empowers everyday heroes who care for the land to prove their impact, earn recognition, and inspire others.  
            Snap a photo of your work, get it verified by the community, and collect tokens that celebrate your real-world actions.
          </p>
          <p className="text-base text-muted-foreground mb-6"> 
            Redeem tokens <span className="font-medium text-foreground">for seedlings, fertilizer discounts, airtime, and more.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="rounded-xl px-8 py-6 text-lg">
                Join now for free
              </Button>
            </Link>
            <Link to="/login" className="text-sm text-primary hover:underline">
              Already a member?
            </Link>
          </div>

          {/* Optional Social Proof */}
          <p className="mt-6 text-sm text-muted-foreground">
            🌱 Over 1,000 verified submissions and counting.
          </p>
        </div>

        {/* Right Side: Image */}
        {/* Right Side: Image */}
        <div className="relative flex items-center justify-center">
          <div className="relative bg-muted/30 backdrop-blur-md p-4 rounded-3xl shadow-xl border border-muted w-full max-w-md">
            <img
              src="/images/landcare.webp" // or change this to your preferred image
              alt="Community Land Care"
              className="rounded-2xl w-full object-contain"
            />

            {/* Decorative blob in background */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-100 rounded-full blur-2xl opacity-40 z-[-1]" />
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/30 rounded-full blur-2xl opacity-50 z-[-1]" />
          </div>
        </div>

      </div>
    </section>


        {/* How It Works Section */}
        <section id="how-it-works" className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-semibold text-foreground mb-6 text-center">
            Earn real rewards for every land restoration action you take.
          </h2>
          <p className="text-lg text-muted-foreground mb-10 text-center">
            GreenToken is a community-driven platform that rewards verified land care activities. 
            Submit proof of your restoration work, get it verified by our community, and earn GreenTokens 
            that recognize your environmental impact.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
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
        </section>

        {/* CTA Section */}
        <section className="text-center">
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
        </section>

      </div>
    </main>
    {/* Footer */}
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 items-center gap-4">
        <div className="flex items-center justify-center md:justify-start">
          <Link to="/" className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-primary" />
            <span className="font-semibold">GreenToken</span>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-0 md:space-x-6 text-center text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <a href="#how-it-works" className="hover:text-foreground">How It Works</a>
          <Link to="/contact" className="hover:text-foreground">Contact</Link>
        </div>

        <div className="flex justify-center md:justify-end text-sm text-muted-foreground">
          © 2025 GreenToken. Built for a greener future.
        </div>
      </div>
    </footer>
  </div>
);

};

export default Landing;
