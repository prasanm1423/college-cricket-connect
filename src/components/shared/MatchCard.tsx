
import React from "react";
import { Match, getTeamById } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";

interface MatchCardProps {
  match: Match;
  onClick?: () => void;
  className?: string;
}

const MatchCard = ({ match, onClick, className }: MatchCardProps) => {
  const team1 = getTeamById(match.team1Id);
  const team2 = getTeamById(match.team2Id);
  
  if (!team1 || !team2) return null;
  
  const matchDate = new Date(match.date);
  const isToday = new Date().toDateString() === matchDate.toDateString();
  
  return (
    <Card 
      className={cn("overflow-hidden cursor-pointer hover:shadow-md transition-shadow", className)}
      onClick={onClick}
    >
      <div className={cn(
        "p-2 text-center text-sm font-medium",
        match.status === "upcoming" ? "bg-blue-100 text-blue-800" :
        match.status === "live" ? "bg-red-100 text-red-800" :
        "bg-green-100 text-green-800"
      )}>
        {match.status === "upcoming" ? "Upcoming" : 
         match.status === "live" ? "LIVE" : "Completed"}
        {isToday && match.status === "upcoming" && " • Today"}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col items-center text-center w-1/3">
            <div className="w-12 h-12 rounded-full bg-cricket-green-dark flex items-center justify-center mb-2">
              <span className="text-white font-bold text-sm">{team1.name.substring(0, 2)}</span>
            </div>
            <span className="font-medium text-sm">{team1.name}</span>
            {match.status === "completed" && (
              <span className="text-sm text-muted-foreground mt-1">
                {match.result?.team1Score}
              </span>
            )}
          </div>
          
          <div className="text-center text-muted-foreground">
            <span className="text-lg font-bold">VS</span>
          </div>
          
          <div className="flex flex-col items-center text-center w-1/3">
            <div className="w-12 h-12 rounded-full bg-cricket-green-light flex items-center justify-center mb-2">
              <span className="text-white font-bold text-sm">{team2.name.substring(0, 2)}</span>
            </div>
            <span className="font-medium text-sm">{team2.name}</span>
            {match.status === "completed" && (
              <span className="text-sm text-muted-foreground mt-1">
                {match.result?.team2Score}
              </span>
            )}
          </div>
        </div>
        
        {match.status === "completed" && match.result && (
          <div className="bg-muted p-2 rounded-md text-center mb-4">
            <span className="font-medium">
              {getTeamById(match.result.winner)?.name} won
            </span>
          </div>
        )}
        
        <div className="text-sm text-muted-foreground space-y-1">
          <div className="flex items-center">
            <Calendar size={16} className="mr-1" />
            <span>{format(new Date(match.date), "PPp")}</span>
          </div>
          <div className="flex items-center">
            <MapPin size={16} className="mr-1" />
            <span>{match.venue}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MatchCard;
