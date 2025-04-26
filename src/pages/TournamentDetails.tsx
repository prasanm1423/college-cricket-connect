
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PageHeader from "@/components/shared/PageHeader";
import { AddTeamsDialog } from "@/components/tournament/AddTeamsDialog";
import { TeamList } from "@/components/tournament/TeamList";

interface Tournament {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  location: string;
  status: string;
  team_count: number;
}

interface Team {
  id: string;
  name: string;
  college: string;
}

const TournamentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchTournamentDetails();
    fetchTournamentTeams();
  }, [id]);

  const fetchTournamentDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setTournament(data);
    } catch (error) {
      console.error('Error fetching tournament:', error);
      toast({
        title: "Error",
        description: "Failed to load tournament details",
        variant: "destructive",
      });
      navigate('/tournaments');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTournamentTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('tournament_teams')
        .select(`
          team_id,
          teams:team_id (
            id,
            name,
            college
          )
        `)
        .eq('tournament_id', id);

      if (error) throw error;
      
      // Extract team details from the nested response
      const tournamentTeams = data.map(item => item.teams) as Team[];
      setTeams(tournamentTeams);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast({
        title: "Error",
        description: "Failed to load tournament teams",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading tournament details...</div>;
  }

  if (!tournament) {
    return (
      <div className="text-center p-12">
        <h3 className="text-lg font-medium">Tournament not found</h3>
        <Button 
          variant="link" 
          onClick={() => navigate("/tournaments")}
          className="mt-2"
        >
          Return to Tournaments
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/tournaments")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Tournaments
      </Button>

      <PageHeader
        title={tournament.name}
        description={`${tournament.team_count} teams tournament`}
        action={
          <div className="flex gap-2">
            <AddTeamsDialog
              tournamentId={tournament.id}
              onTeamsAdded={fetchTournamentTeams}
            />
            <Button
              onClick={() => navigate(`/tournaments/${tournament.id}/matches`)}
            >
              View Matches
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="p-6 flex items-center">
            <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">
                {new Date(tournament.start_date).toLocaleDateString()} - {new Date(tournament.end_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6 flex items-center">
            <MapPin className="h-5 w-5 text-muted-foreground mr-2" />
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{tournament.location}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6 flex items-center">
            <Users className="h-5 w-5 text-muted-foreground mr-2" />
            <div>
              <p className="text-sm text-muted-foreground">Teams</p>
              <p className="font-medium">{teams.length} / {tournament.team_count}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Participating Teams</h2>
        </div>

        {teams.length > 0 ? (
          <TeamList
            teams={teams}
            tournamentId={tournament.id}
            onTeamRemoved={fetchTournamentTeams}
          />
        ) : (
          <div className="text-center p-12 bg-muted rounded-lg">
            <p className="text-muted-foreground mb-4">No teams have been added to this tournament yet.</p>
            <AddTeamsDialog
              tournamentId={tournament.id}
              onTeamsAdded={fetchTournamentTeams}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TournamentDetails;
