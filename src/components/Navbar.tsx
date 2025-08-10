import { Button } from "@/components/ui/button";
import { Gamepad2, Trophy, Users, Wallet, Settings, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-gaming rounded-lg flex items-center justify-center shadow-glow">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              MozArena
            </h1>
            <p className="text-xs text-muted-foreground">Gaming Community</p>
          </div>
        </div>

        {user ? (
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Tournaments
            </Button>
            <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-2">
              <Users className="w-4 h-4" />
              Find Players
            </Button>
            <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Wallet
            </Button>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
            <Button variant="hero" onClick={() => navigate("/auth")}>
              Join Arena
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};