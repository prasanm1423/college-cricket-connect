
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Team {
  id: string;
  name: string;
  college: string;
}

interface TeamListProps {
  teams: Team[];
  tournamentId: string;
  onTeamRemoved: () => void;
}

export const TeamList = ({ teams, tournamentId, onTeamRemoved }: TeamListProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRemoveTeam = async (teamId: string) => {
    try {
      const { error } = await supabase
        .from('tournament_teams')
        .delete()
        .match({ tournament_id: tournamentId, team_id: teamId });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Team removed from tournament",
      });
      
      onTeamRemoved();
    } catch (error) {
      console.error('Error removing team:', error);
      toast({
        title: "Error",
        description: "Failed to remove team from tournament",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {teams.map((team) => (
        <Card key={team.id} className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">{team.name}</h3>
                <p className="text-sm text-muted-foreground">{team.college}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveTeam(team.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => navigate(`/teams/${team.id}`)}
          >
            View Team
          </Button>
        </Card>
      ))}
    </div>
  );
};
