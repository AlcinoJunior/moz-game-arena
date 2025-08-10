import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock } from "lucide-react";

interface Game {
  id: string;
  name: string;
  type: string;
  description: string;
  min_players: number;
  max_players: number;
}

interface GameCardProps {
  game: Game;
  onClick?: () => void;
}

export const GameCard = ({ game, onClick }: GameCardProps) => {
  return (
    <Card 
      className="relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-glow hover:-translate-y-2 group bg-card/50 backdrop-blur-sm border-border/50"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-gaming opacity-0 group-hover:opacity-10 transition-opacity" />
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
              {game.name}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2">
              {game.description}
            </p>
          </div>
          <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground">
            {game.type.toUpperCase()}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{game.min_players}-{game.max_players} players</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>Quick Match</span>
          </div>
        </div>
        
        <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-primary w-0 group-hover:w-full transition-all duration-500" />
        </div>
      </div>
    </Card>
  );
};