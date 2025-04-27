
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAvailableTeams();
    }
  }, [isOpen, tournamentId]);

  const fetchAvailableTeams = async () => {
    try {
      setIsFetching(true);
      console.log('Fetching available teams for tournament:', tournamentId);
      
      // Get teams that are already in the tournament
      const { data: existingTeams, error: existingError } = await supabase
        .from('tournament_teams')
        .select('team_id')
        .eq('tournament_id', tournamentId);

      if (existingError) {
        console.error('Error fetching existing teams:', existingError);
        throw existingError;
      }

      console.log('Existing team IDs:', existingTeams);
      const existingTeamIds = existingTeams?.map(t => t.team_id) || [];
      
      // Fetch all teams
      const { data: allTeams, error } = await supabase
        .from('teams')
        .select('*');

      if (error) {
        console.error('Error fetching teams:', error);
        throw error;
      }

      console.log('All teams:', allTeams);
      
      // Filter out teams that are already in the tournament
      const availableTeams = allTeams?.filter(team => 
        !existingTeamIds.includes(team.id)
      ) || [];
      
      console.log('Available teams:', availableTeams);
      setTeams(availableTeams);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast({
        title: "Error",
        description: "Failed to load available teams",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };

  const handleAddTeams = async () => {
    if (selectedTeams.length === 0) {
      toast({
        title: "No teams selected",
        description: "Please select at least one team to add",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    console.log('Adding teams to tournament:', selectedTeams);
    
    try {
      const { error } = await supabase
        .from('tournament_teams')
        .insert(
          selectedTeams.map(teamId => ({
            tournament_id: tournamentId,
            team_id: teamId,
          }))
        );

      if (error) {
        console.error('Error adding teams:', error);
        throw error;
      }

      console.log('Teams added successfully');
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

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSelectedTeams([]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Teams
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Teams to Tournament</DialogTitle>
          <DialogDescription>
            Select teams to add to this tournament.
          </DialogDescription>
        </DialogHeader>
        
        {isFetching ? (
          <div className="flex justify-center items-center py-8">
            <p>Loading available teams...</p>
          </div>
        ) : teams.length === 0 ? (
          <div className="text-center p-6">
            <p className="text-muted-foreground">No available teams found. All teams may already be added to this tournament.</p>
          </div>
        ) : (
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
        )}
        
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
