
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/shared/PageHeader";

type TournamentStatus = 'upcoming' | 'ongoing' | 'completed';

type Tournament = {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  location: string;
  status: TournamentStatus;
  team_count: number;
  created_by: string;
  created_at?: string;
  updated_at?: string;
};

const Tournaments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state for creating tournament
  const [tournamentName, setTournamentName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [teamCount, setTeamCount] = useState("8");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch tournaments from Supabase
  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map and validate tournament status
      const validatedTournaments = (data || []).map(tournament => ({
        ...tournament,
        status: validateTournamentStatus(tournament.status)
      }));
      
      setTournaments(validatedTournaments);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      toast({
        title: "Error",
        description: "Failed to load tournaments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to validate tournament status
  const validateTournamentStatus = (status: string): TournamentStatus => {
    if (status === "upcoming" || status === "ongoing" || status === "completed") {
      return status;
    }
    return "upcoming"; // Default to upcoming if invalid status
  };
  
  const handleCreateTournament = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a tournament",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .insert([{
          name: tournamentName,
          start_date: startDate,
          end_date: endDate,
          location,
          status: 'upcoming',
          team_count: parseInt(teamCount),
          created_by: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      setTournaments([
        {
          ...data,
          status: validateTournamentStatus(data.status)
        },
        ...tournaments
      ]);
      
      toast({
        title: "Tournament created",
        description: `${tournamentName} has been created successfully.`,
      });
      
      // Reset form
      setTournamentName("");
      setStartDate("");
      setEndDate("");
      setLocation("");
      setTeamCount("8");
      
      // Close dialog
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating tournament:", error);
      toast({
        title: "Error",
        description: "Failed to create tournament. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Filter tournaments based on search term
  const filteredTournaments = tournaments.filter(tournament => 
    tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tournament.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="p-8 text-center">Loading tournaments...</div>;
  }

  return (
    <div>
      <PageHeader
        title="Tournaments"
        description="Create and manage cricket tournaments"
        action={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Tournament
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Create New Tournament</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new cricket tournament.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleCreateTournament}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="tournament-name">Tournament Name</Label>
                    <Input
                      id="tournament-name"
                      value={tournamentName}
                      onChange={(e) => setTournamentName(e.target.value)}
                      placeholder="e.g. College Premier League 2024"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="start-date">Start Date</Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="end-date">End Date</Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. University Stadium"
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="team-count">Number of Teams</Label>
                    <Select
                      value={teamCount}
                      onValueChange={setTeamCount}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select number of teams" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4">4 Teams</SelectItem>
                        <SelectItem value="8">8 Teams</SelectItem>
                        <SelectItem value="12">12 Teams</SelectItem>
                        <SelectItem value="16">16 Teams</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Tournament"}
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
            placeholder="Search tournaments..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Tournaments</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tournament Name</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Teams</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTournaments.map((tournament) => (
                  <TableRow key={tournament.id}>
                    <TableCell className="font-medium">{tournament.name}</TableCell>
                    <TableCell>
                      {new Date(tournament.start_date).toLocaleDateString()} - {new Date(tournament.end_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{tournament.location}</TableCell>
                    <TableCell>{tournament.team_count}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tournament.status === "upcoming" ? "bg-blue-100 text-blue-800" :
                        tournament.status === "ongoing" ? "bg-green-100 text-green-800" :
                        "bg-purple-100 text-purple-800"
                      }`}>
                        {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/tournaments/${tournament.id}`)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredTournaments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No tournaments found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="upcoming">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tournament Name</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Teams</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTournaments.filter(t => t.status === "upcoming").map((tournament) => (
                  <TableRow key={tournament.id}>
                    <TableCell className="font-medium">{tournament.name}</TableCell>
                    <TableCell>
                      {new Date(tournament.start_date).toLocaleDateString()} - {new Date(tournament.end_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{tournament.location}</TableCell>
                    <TableCell>{tournament.team_count}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/tournaments/${tournament.id}`)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredTournaments.filter(t => t.status === "upcoming").length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No upcoming tournaments found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="ongoing">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tournament Name</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Teams</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTournaments.filter(t => t.status === "ongoing").map((tournament) => (
                  <TableRow key={tournament.id}>
                    <TableCell className="font-medium">{tournament.name}</TableCell>
                    <TableCell>
                      {new Date(tournament.start_date).toLocaleDateString()} - {new Date(tournament.end_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{tournament.location}</TableCell>
                    <TableCell>{tournament.team_count}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/tournaments/${tournament.id}`)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredTournaments.filter(t => t.status === "ongoing").length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No ongoing tournaments found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="completed">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tournament Name</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Teams</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTournaments.filter(t => t.status === "completed").map((tournament) => (
                  <TableRow key={tournament.id}>
                    <TableCell className="font-medium">{tournament.name}</TableCell>
                    <TableCell>
                      {new Date(tournament.start_date).toLocaleDateString()} - {new Date(tournament.end_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{tournament.location}</TableCell>
                    <TableCell>{tournament.team_count}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/tournaments/${tournament.id}`)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredTournaments.filter(t => t.status === "completed").length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No completed tournaments found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tournaments;
