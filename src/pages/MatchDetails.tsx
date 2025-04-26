
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Clock,
  Award,
  Edit,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PageHeader from "@/components/shared/PageHeader";
import { format } from "date-fns";

type MatchStatus = "upcoming" | "live" | "completed";

type MatchDetails = {
  id: string;
  team1_id: string;
  team2_id: string;
  venue: string;
  date: string;
  status: MatchStatus;
  tournament_id?: string;
  created_by?: string;
  created_at?: string;
  result?: {
    winner: string;
    team1Score: string;
    team2Score: string;
    playerOfMatch?: string;
  };
};

type Team = {
  id: string;
  name: string;
  college: string;
};

type Player = {
  id: string;
  name: string;
  college: string;
  role: string;
  age: number;
  team_id?: string;
};

const MatchDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [match, setMatch] = useState<MatchDetails | null>(null);
  const [team1, setTeam1] = useState<Team | null>(null);
  const [team2, setTeam2] = useState<Team | null>(null);
  const [playerOfMatch, setPlayerOfMatch] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchMatchDetails() {
      if (!id) return;
      
      setIsLoading(true);
      try {
        // Fetch match details
        const { data: matchData, error: matchError } = await supabase
          .from('matches')
          .select('*')
          .eq('id', id)
          .single();
          
        if (matchError) throw matchError;
        if (!matchData) {
          toast({
            title: "Error",
            description: "Match not found",
            variant: "destructive",
          });
          navigate('/matches');
          return;
        }
        
        // Fetch team details
        const [team1Response, team2Response] = await Promise.all([
          supabase.from('teams').select('*').eq('id', matchData.team1_id).single(),
          supabase.from('teams').select('*').eq('id', matchData.team2_id).single()
        ]);
        
        if (team1Response.error) throw team1Response.error;
        if (team2Response.error) throw team2Response.error;
        
        // Ensure match status is a valid MatchStatus
        const status = validateMatchStatus(matchData.status);
        
        setMatch({
          ...matchData,
          status,
          result: null // We'll implement this later
        });
        setTeam1(team1Response.data);
        setTeam2(team2Response.data);
        
      } catch (error) {
        console.error("Error fetching match details:", error);
        toast({
          title: "Error",
          description: "Failed to load match details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchMatchDetails();
  }, [id, navigate, toast]);
  
  // Helper function to validate match status
  const validateMatchStatus = (status: string): MatchStatus => {
    if (status === "upcoming" || status === "live" || status === "completed") {
      return status;
    }
    return "upcoming"; // Default to upcoming if invalid status
  };
  
  if (isLoading) {
    return <div className="p-8 text-center">Loading match details...</div>;
  }
  
  if (!match || !team1 || !team2) {
    return (
      <div className="text-center p-12">
        <h3 className="text-lg font-medium">Match not found</h3>
        <Button 
          variant="link" 
          onClick={() => navigate("/matches")}
          className="mt-2"
        >
          Return to Matches
        </Button>
      </div>
    );
  }
  
  const matchDate = new Date(match.date);
  const isToday = new Date().toDateString() === matchDate.toDateString();
  
  return (
    <div>
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/matches")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Matches
      </Button>
      
      <PageHeader
        title={`${team1.name} vs ${team2.name}`}
        description={match.venue}
        action={
          match.status !== "completed" ? (
            <Button onClick={() => navigate(`/matches/${id}/update`)}>
              <Edit className="mr-2 h-4 w-4" />
              {match.status === "live" ? "Update Score" : "Edit Match"}
            </Button>
          ) : undefined
        }
      />
      
      <div className="mb-8">
        <Card>
          <div className={cn(
            "p-3 text-center font-medium border-b",
            match.status === "upcoming" ? "bg-blue-100 text-blue-800" :
            match.status === "live" ? "bg-red-100 text-red-800" :
            "bg-green-100 text-green-800"
          )}>
            {match.status === "upcoming" ? "Upcoming Match" : 
             match.status === "live" ? "LIVE" : "Match Completed"}
            {isToday && match.status === "upcoming" && " • Today"}
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-10">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">{team1.name.substring(0, 2)}</span>
                </div>
                <h3 className="text-xl font-semibold">{team1.name}</h3>
                <p className="text-sm text-muted-foreground">{team1.college}</p>
                
                {match.status !== "upcoming" && match.result && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-xl font-bold">{match.result.team1Score}</p>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-muted-foreground mb-2">VS</div>
                {match.status === "completed" && match.result && (
                  <div className={`px-4 py-2 rounded-lg ${
                    match.result.winner === team1.id ? "bg-blue-100 text-blue-800" :
                    match.result.winner === team2.id ? "bg-green-100 text-green-800" :
                    "bg-amber-100 text-amber-800"
                  }`}>
                    <p className="font-medium">
                      {match.result.winner === team1.id ? `${team1.name} won` :
                       match.result.winner === team2.id ? `${team2.name} won` :
                       "Match Drawn"}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">{team2.name.substring(0, 2)}</span>
                </div>
                <h3 className="text-xl font-semibold">{team2.name}</h3>
                <p className="text-sm text-muted-foreground">{team2.college}</p>
                
                {match.status !== "upcoming" && match.result && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-xl font-bold">{match.result.team2Score}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
                <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>{format(new Date(match.date), "PPP")}</span>
              </div>
              
              <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
                <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>{format(new Date(match.date), "p")}</span>
              </div>
              
              <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
                <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>{match.venue}</span>
              </div>
            </div>
            
            {match.status === "completed" && playerOfMatch && (
              <div className="mt-10 text-center">
                <div className="inline-flex items-center px-4 py-2 bg-amber-50 rounded-full text-amber-800 mb-2">
                  <Award className="h-5 w-5 mr-2" />
                  Player of the Match
                </div>
                <h4 className="text-xl font-semibold">{playerOfMatch.name}</h4>
                <p className="text-muted-foreground">{playerOfMatch.college}</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

// Helper function for class names
const cn = (...classes: (string | undefined | boolean)[]) => {
  return classes.filter(Boolean).join(' ');
};

export default MatchDetails;
