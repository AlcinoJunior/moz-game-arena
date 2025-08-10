import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { GameCard } from "@/components/GameCard";
import { TournamentCard } from "@/components/TournamentCard";
import { Trophy, Users, Gamepad2, Wallet, ArrowRight, Zap, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/gaming-hero.jpg";

interface Game {
  id: string;
  name: string;
  type: string;
  description: string;
  min_players: number;
  max_players: number;
}

interface Tournament {
  id: string;
  title: string;
  description: string;
  max_participants: number;
  entry_fee: number;
  prize_pool: number;
  status: string;
  start_date: string;
  game?: {
    name: string;
    type: string;
  };
}

const Index = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGames();
    fetchTournaments();
    
    // Check auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const fetchGames = async () => {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .limit(6);
    
    if (!error && data) {
      setGames(data);
    }
  };

  const fetchTournaments = async () => {
    const { data, error } = await supabase
      .from('tournaments')
      .select(`
        *,
        game:games(name, type)
      `)
      .eq('status', 'upcoming')
      .limit(3);
    
    if (!error && data) {
      setTournaments(data);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <img 
          src={heroImage} 
          alt="Gaming Arena" 
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        
        <div className="relative container mx-auto px-4 py-20 text-center">
          <Badge variant="secondary" className="mb-6 bg-secondary/20 text-secondary-foreground border-secondary/20">
            🇲🇿 Mozambique's Premier Gaming Platform
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Compete. Connect.
            </span>
            <br />
            <span className="text-foreground">Conquer.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join tournaments, challenge players in 1v1 betting matches, and climb the leaderboards 
            in Mozambique's ultimate gaming arena.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              variant="hero" 
              size="lg" 
              onClick={() => navigate(user ? "/dashboard" : "/auth")}
              className="animate-float"
            >
              <Gamepad2 className="w-5 h-5 mr-2" />
              {user ? "Enter Arena" : "Join the Arena"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="neon" size="lg">
              <Trophy className="w-5 h-5 mr-2" />
              View Tournaments
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 p-6">
              <Trophy className="w-8 h-8 text-gaming-gold mb-3 mx-auto" />
              <h3 className="font-semibold mb-2">Tournaments</h3>
              <p className="text-sm text-muted-foreground">Compete in organized tournaments with real prizes</p>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 p-6">
              <Zap className="w-8 h-8 text-primary mb-3 mx-auto" />
              <h3 className="font-semibold mb-2">1v1 Betting</h3>
              <p className="text-sm text-muted-foreground">Challenge players with M-Pesa and eMola betting</p>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 p-6">
              <Shield className="w-8 h-8 text-accent mb-3 mx-auto" />
              <h3 className="font-semibold mb-2">Secure Payments</h3>
              <p className="text-sm text-muted-foreground">Safe escrow system for all transactions</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Popular <span className="bg-gradient-primary bg-clip-text text-transparent">Games</span>
          </h2>
          <p className="text-muted-foreground">Choose your battleground and show your skills</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <GameCard 
              key={game.id} 
              game={game}
              onClick={() => navigate(user ? `/games/${game.id}` : "/auth")}
            />
          ))}
        </div>
      </section>

      {/* Tournaments Section */}
      {tournaments.length > 0 && (
        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Upcoming <span className="bg-gradient-gaming bg-clip-text text-transparent">Tournaments</span>
              </h2>
              <p className="text-muted-foreground">Join the competition and win amazing prizes</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {tournaments.map((tournament) => (
                <TournamentCard 
                  key={tournament.id} 
                  tournament={tournament}
                  onJoin={() => navigate(user ? `/tournaments/${tournament.id}/join` : "/auth")}
                  onView={() => navigate(`/tournaments/${tournament.id}`)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-gaming opacity-10" />
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-3xl font-bold mb-4">
            Ready to <span className="bg-gradient-primary bg-clip-text text-transparent">Dominate</span>?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of gamers in Mozambique's most competitive gaming platform. 
            Earn money, build your reputation, and become a legend.
          </p>
          
          {!user && (
            <Button 
              variant="hero" 
              size="lg" 
              onClick={() => navigate("/auth")}
              className="animate-glow"
            >
              <Users className="w-5 h-5 mr-2" />
              Join the Community
            </Button>
          )}
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-gaming rounded-lg flex items-center justify-center">
              <Gamepad2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold bg-gradient-primary bg-clip-text text-transparent">MozArena</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2024 MozArena. Gaming community platform for Mozambique.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
