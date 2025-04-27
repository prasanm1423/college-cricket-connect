
import React from "react";
import { Player } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PlayerCardProps {
  player: Player;
  onClick?: () => void;
  className?: string;
}

const PlayerCard = ({ player, onClick, className }: PlayerCardProps) => {
  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "batsman":
        return "role-batsman";
      case "bowler":
        return "role-bowler";
      case "all-rounder":
        return "role-allrounder";
      default:
        return "";
    }
  };

  // Default stats if they're not available
  const stats = player.stats || {
    runs: 0,
    wickets: 0,
    matches: 0,
    highestScore: 0,
    bestBowling: "0/0"
  };

  return (
    <Card 
      className={cn("overflow-hidden cursor-pointer hover:shadow-md transition-shadow", className)}
      onClick={onClick}
    >
      <div className="relative h-40">
        <img
          src={player.imageUrl || "https://via.placeholder.com/300x200?text=Player"}
          alt={player.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <span className={cn("badge-role", getRoleBadgeClass(player.role))}>
            {player.role}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 truncate">{player.name}</h3>
        <p className="text-sm text-muted-foreground mb-3">{player.college}</p>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="stat-box">
            <span className="text-xs text-muted-foreground">Runs</span>
            <span className="font-bold">{stats.runs}</span>
          </div>
          <div className="stat-box">
            <span className="text-xs text-muted-foreground">Wickets</span>
            <span className="font-bold">{stats.wickets}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PlayerCard;
