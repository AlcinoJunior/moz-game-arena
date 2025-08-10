import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Trophy, DollarSign } from "lucide-react";

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

interface TournamentCardProps {
  tournament: Tournament;
  onJoin?: () => void;
  onView?: () => void;
}

export const TournamentCard = ({ tournament, onJoin, onView }: TournamentCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'upcoming': return 'default';
      case 'ongoing': return 'secondary';
      case 'completed': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <Card className="relative overflow-hidden group hover:shadow-neon transition-all duration-300 bg-card/80 backdrop-blur-sm border-border/50">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary" />
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                {tournament.title}
              </h3>
              <Badge variant={getStatusVariant(tournament.status)} className="capitalize">
                {tournament.status}
              </Badge>
            </div>
            {tournament.game && (
              <p className="text-sm text-muted-foreground">
                {tournament.game.name} • {tournament.game.type.toUpperCase()}
              </p>
            )}
          </div>
          <Trophy className="w-6 h-6 text-gaming-gold" />
        </div>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {tournament.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{formatDate(tournament.start_date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-primary" />
            <span>{tournament.max_participants} max</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-gaming-gold" />
            <span>${tournament.entry_fee} entry</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Trophy className="w-4 h-4 text-gaming-gold" />
            <span>${tournament.prize_pool} prize</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={onView}
          >
            View Details
          </Button>
          {tournament.status === 'upcoming' && (
            <Button 
              variant="gaming" 
              size="sm" 
              className="flex-1"
              onClick={onJoin}
            >
              Join Tournament
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};