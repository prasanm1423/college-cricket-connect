
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

interface Team {
  id: string;
  name: string;
  college: string;
}

interface AddTeamsDialogProps {
  tournamentId: string;
  onTeamsAdded: () => void;
}

export const AddTeamsDialog = ({ tournamentId, onTeamsAdded }: AddTeamsDialogProps) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAvailableTeams();
  }, [tournamentId]);

  const fetchAvailableTeams = async () => {
    try {
      const { data: existingTeams, error: existingError } = await supabase
        .from('tournament_teams')
        .select('team_id')
        .eq('tournament_id', tournamentId);

      if (existingError) throw existingError;

      const existingTeamIds = existingTeams.map(t => t.team_id);

      const { data: allTeams, error } = await supabase
        .from('teams')
        .select('*')
        .not('id', 'in', `(${existingTeamIds.length ? existingTeamIds.join(',') : '00000000-0000-0000-0000-000000000000'})`);

      if (error) throw error;
      setTeams(allTeams);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast({
        title: "Error",
        description: "Failed to load available teams",
        variant: "destructive",
      });
    }
  };

  const handleAddTeams = async () => {
    if (selectedTeams.length === 0) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('tournament_teams')
        .insert(
          selectedTeams.map(teamId => ({
            tournament_id: tournamentId,
            team_id: teamId,
          }))
        );

      if (error) throw error;

      toast({
        title: "Success",
        description: "Teams added to tournament successfully",
      });
      
      setIsOpen(false);
      setSelectedTeams([]);
      onTeamsAdded();
    } catch (error) {
      console.error('Error adding teams:', error);
      toast({
        title: "Error",
        description: "Failed to add teams to tournament",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Teams
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Teams to Tournament</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] mt-4">
          <div className="space-y-4">
            {teams.map((team) => (
              <div key={team.id} className="flex items-center space-x-2">
                <Checkbox
                  id={team.id}
                  checked={selectedTeams.includes(team.id)}
                  onCheckedChange={(checked) => {
                    setSelectedTeams(prev =>
                      checked
                        ? [...prev, team.id]
                        : prev.filter(id => id !== team.id)
                    );
                  }}
                />
                <label htmlFor={team.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {team.name} - {team.college}
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="mt-4 flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddTeams}
            disabled={selectedTeams.length === 0 || isLoading}
          >
            {isLoading ? "Adding..." : "Add Selected Teams"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
