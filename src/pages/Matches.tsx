
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/shared/PageHeader";
import MatchCard from "@/components/shared/MatchCard";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type Match = {
  id: string;
  team1_id: string;
  team2_id: string;
  venue: string;
  date: string;
  status: "upcoming" | "live" | "completed";
  tournament_id?: string;
  team1?: { name: string; college: string };
  team2?: { name: string; college: string };
};

type Team = {
  id: string;
  name: string;
  college: string;
};

const Matches = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state for creating match
  const [team1Id, setTeam1Id] = useState("");
  const [team2Id, setTeam2Id] = useState("");
  const [venue, setVenue] = useState("");
  const [matchDate, setMatchDate] = useState("");
  const [matchTime, setMatchTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch matches and teams from Supabase
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Fetch matches
        const { data: matchesData, error: matchesError } = await supabase
          .from('matches')
          .select(`
            id, 
            team1_id,
            team2_id,
            venue, 
            date, 
            status,
            tournament_id
          `)
          .order('date', { ascending: false });

        if (matchesError) throw matchesError;

        // Fetch teams
        const { data: teamsData, error: teamsError } = await supabase
          .from('teams')
          .select('id, name, college');

        if (teamsError) throw teamsError;
        
        setTeams(teamsData || []);
        
        // Map team details to matches
        const matchesWithTeamDetails = matchesData?.map(match => {
          const team1 = teamsData?.find(team => team.id === match.team1_id);
          const team2 = teamsData?.find(team => team.id === match.team2_id);
          
          return {
            ...match,
            team1,
            team2
          };
        }) || [];
        
        setMatches(matchesWithTeamDetails);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load matches. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [toast]);
  
  const handleCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to schedule a match",
        variant: "destructive",
      });
      return;
    }
    
    if (team1Id === team2Id) {
      toast({
        title: "Invalid teams",
        description: "Both teams cannot be the same",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Combine date and time
      const dateTime = `${matchDate}T${matchTime}:00`;
      
      const { data, error } = await supabase
        .from('matches')
        .insert([{
          team1_id: team1Id,
          team2_id: team2Id,
          venue,
          date: dateTime,
          status: 'upcoming',
          created_by: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Find team details for the new match
      const team1 = teams.find(team => team.id === team1Id);
      const team2 = teams.find(team => team.id === team2Id);
      
      // Add the new match with team details to the state
      setMatches([
        {
          ...data,
          team1,
          team2
        },
        ...matches
      ]);
      
      toast({
        title: "Match scheduled",
        description: "Match has been scheduled successfully.",
      });
      
      // Reset form
      setTeam1Id("");
      setTeam2Id("");
      setVenue("");
      setMatchDate("");
      setMatchTime("");
      
      // Close dialog
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error scheduling match:", error);
      toast({
        title: "Error",
        description: "Failed to schedule match. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Filter matches based on search term and status filter
  const filteredMatches = matches.filter(match => {
    const matchesSearch = match.venue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || match.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  const upcomingMatches = filteredMatches.filter(m => m.status === "upcoming");
  const liveMatches = filteredMatches.filter(m => m.status === "live");
  const completedMatches = filteredMatches.filter(m => m.status === "completed");
  
  if (isLoading) {
    return <div className="p-8 text-center">Loading matches...</div>;
  }
  
  return (
    <div>
      <PageHeader
        title="Matches"
        description="View and manage cricket matches"
        action={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Match
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Schedule New Match</DialogTitle>
                <DialogDescription>
                  Fill in the details to schedule a new cricket match.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleCreateMatch}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="team1">Team 1</Label>
                      <Select
                        value={team1Id}
                        onValueChange={setTeam1Id}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select team" />
                        </SelectTrigger>
                        <SelectContent>
                          {teams.map((team) => (
                            <SelectItem key={team.id} value={team.id}>
                              {team.name} ({team.college})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="team2">Team 2</Label>
                      <Select
                        value={team2Id}
                        onValueChange={setTeam2Id}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select team" />
                        </SelectTrigger>
                        <SelectContent>
                          {teams.map((team) => (
                            <SelectItem key={team.id} value={team.id}>
                              {team.name} ({team.college})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="venue">Venue</Label>
                    <Input
                      id="venue"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      placeholder="e.g. University Stadium"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="match-date">Match Date</Label>
                      <Input
                        id="match-date"
                        type="date"
                        value={matchDate}
                        onChange={(e) => setMatchDate(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="match-time">Match Time</Label>
                      <Input
                        id="match-time"
                        type="time"
                        value={matchTime}
                        onChange={(e) => setMatchTime(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Scheduling..." : "Schedule Match"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search venues..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All matches</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="live">Live</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Matches</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="live">Live</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {filteredMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMatches.map((match) => (
                <MatchCard 
                  key={match.id} 
                  match={{
                    id: match.id,
                    team1Id: match.team1_id,
                    team2Id: match.team2_id,
                    date: new Date(match.date).toISOString(),
                    venue: match.venue,
                    status: match.status,
                    result: null // We'll implement this later
                  }}
                  onClick={() => navigate(`/matches/${match.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-12">
              <h3 className="text-lg font-medium">No matches found</h3>
              <p className="text-muted-foreground mt-1">
                Try adjusting your search criteria or schedule a new match.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="upcoming">
          {upcomingMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingMatches.map((match) => (
                <MatchCard 
                  key={match.id} 
                  match={{
                    id: match.id,
                    team1Id: match.team1_id,
                    team2Id: match.team2_id,
                    date: new Date(match.date).toISOString(),
                    venue: match.venue,
                    status: match.status,
                    result: null
                  }}
                  onClick={() => navigate(`/matches/${match.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-12">
              <h3 className="text-lg font-medium">No upcoming matches</h3>
              <p className="text-muted-foreground mt-1">
                Schedule a new match to see it here.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="live">
          {liveMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveMatches.map((match) => (
                <MatchCard 
                  key={match.id} 
                  match={{
                    id: match.id,
                    team1Id: match.team1_id,
                    team2Id: match.team2_id,
                    date: new Date(match.date).toISOString(),
                    venue: match.venue,
                    status: match.status,
                    result: null
                  }}
                  onClick={() => navigate(`/matches/${match.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-12">
              <h3 className="text-lg font-medium">No live matches</h3>
              <p className="text-muted-foreground mt-1">
                There are no matches in progress at the moment.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          {completedMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedMatches.map((match) => (
                <MatchCard 
                  key={match.id} 
                  match={{
                    id: match.id,
                    team1Id: match.team1_id,
                    team2Id: match.team2_id,
                    date: new Date(match.date).toISOString(),
                    venue: match.venue,
                    status: match.status,
                    result: null
                  }}
                  onClick={() => navigate(`/matches/${match.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-12">
              <h3 className="text-lg font-medium">No completed matches</h3>
              <p className="text-muted-foreground mt-1">
                Completed matches will appear here.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Matches;
