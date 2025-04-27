
import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Shield, Award } from "lucide-react";

interface TeamStats {
  matches?: number;
  won?: number;
  lost?: number;
  draw?: number;
}

interface Team {
  id: string;
  name: string;
  college: string;
  captain?: string | null;
  logoUrl?: string;
  stats?: TeamStats;
  created_at?: string;
  created_by?: string | null;
}

interface Player {
  id: string;
  name: string;
}

interface TeamCardProps {
  team: Team;
  onClick?: () => void;
  className?: string;
}

const TeamCard = ({ team, onClick, className }: TeamCardProps) => {
  // Initialize empty array for players if getTeamPlayers function is not available
  const players: Player[] = [];
  
  // Create default stats object if not provided
  const stats: TeamStats = team.stats || { matches: 0, won: 0, lost: 0, draw: 0 };
  
  return (
    <Card 
      className={cn("overflow-hidden cursor-pointer hover:shadow-md transition-shadow", className)}
      onClick={onClick}
    >
      <div className="bg-cricket-green-dark p-4 flex items-center justify-center">
        {team.logoUrl ? (
          <img
            src={team.logoUrl}
            alt={team.name}
            className="w-16 h-16 object-contain"
          />
        ) : (
          <Shield className="w-16 h-16 text-white" />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 truncate">{team.name}</h3>
        <p className="text-sm text-muted-foreground mb-3">{team.college}</p>
        
        <div className="flex items-center mb-3">
          <div className="flex -space-x-2">
            {players.slice(0, 3).map((player) => (
              <div 
                key={player.id} 
                className="w-8 h-8 rounded-full bg-cricket-green-light flex items-center justify-center border-2 border-white text-xs font-bold text-white"
                title={player.name}
              >
                {player.name.charAt(0)}
              </div>
            ))}
            {players.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-cricket-accent flex items-center justify-center border-2 border-white text-xs font-bold text-white">
                +{players.length - 3}
              </div>
            )}
          </div>
          <span className="ml-2 text-sm text-muted-foreground">
            {players.length} Players
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="stat-box">
            <span className="text-xs text-muted-foreground">Matches</span>
            <span className="font-bold">{stats.matches}</span>
          </div>
          <div className="stat-box">
            <span className="text-xs text-muted-foreground">Won</span>
            <span className="font-bold">{stats.won}</span>
          </div>
        </div>
        
        {team.captain && (
          <div className="mt-3 flex items-center text-sm text-muted-foreground">
            <Award size={16} className="mr-1 text-cricket-accent" />
            Captain: {team.captain}
          </div>
        )}
      </div>
    </Card>
  );
};

export default TeamCard;
