
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import PageHeader from "@/components/shared/PageHeader";
import PlayerCard from "@/components/shared/PlayerCard";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const playerSchema = z.object({
  name: z.string().min(1, "Player name is required"),
  college: z.string().min(1, "College name is required"),
  role: z.string().min(1, "Player role is required"),
  age: z.string()
    .min(1, "Age is required")
    .transform(val => parseInt(val))
    .refine(val => !isNaN(val) && val > 0, {
      message: "Age must be a positive number"
    }),
  team_id: z.string().optional(),
});

type PlayerFormValues = z.infer<typeof playerSchema>;

const Players = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<PlayerFormValues>({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      name: "",
      college: "",
      role: "",
      age: "",
      team_id: undefined,
    },
  });
  
  useEffect(() => {
    fetchPlayers();
    fetchTeams();
  }, []);
  
  const fetchPlayers = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching players...");
      
      const { data, error } = await supabase
        .from("players")
        .select("*");
      
      if (error) {
        console.error("Error fetching players:", error);
        throw error;
      }
      
      console.log("Players fetched:", data);
      setPlayers(data || []);
    } catch (error) {
      console.error("Error fetching players:", error);
      toast({
        title: "Error",
        description: "Failed to load players",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchTeams = async () => {
    try {
      console.log("Fetching teams for player assignment...");
      
      const { data, error } = await supabase
        .from("teams")
        .select("id, name, college");
      
      if (error) {
        console.error("Error fetching teams:", error);
        throw error;
      }
      
      console.log("Teams fetched for player assignment:", data);
      setTeams(data || []);
    } catch (error) {
      console.error("Error fetching teams:", error);
      toast({
        title: "Error",
        description: "Failed to load teams",
        variant: "destructive",
      });
    }
  };
  
  const onSubmit = async (values: PlayerFormValues) => {
    try {
      console.log("Creating new player:", values);
      
      const newPlayer = {
        name: values.name,
        college: values.college,
        role: values.role,
        age: values.age,
        team_id: values.team_id || null,
      };
      
      const { data, error } = await supabase
        .from("players")
        .insert([newPlayer])
        .select();
      
      if (error) {
        console.error("Error creating player:", error);
        throw error;
      }
      
      console.log("Player created successfully:", data);
      
      toast({
        title: "Success",
        description: "Player created successfully",
      });
      
      form.reset();
      setIsDialogOpen(false);
      fetchPlayers();
    } catch (error) {
      console.error("Error creating player:", error);
      toast({
        title: "Error",
        description: "Failed to create player",
        variant: "destructive",
      });
    }
  };
  
  // Filter players based on search term and role filter
  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.college.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || player.role === roleFilter;
    return matchesSearch && matchesRole;
  });
  
  return (
    <div>
      <PageHeader
        title="Players"
        description="View and manage player profiles"
        action={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Player
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Player</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Player Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter player name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="college"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>College</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter college name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter age" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select player role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="batsman">Batsman</SelectItem>
                            <SelectItem value="bowler">Bowler</SelectItem>
                            <SelectItem value="all-rounder">All-rounder</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="team_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team (Optional)</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select team (optional)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">No Team</SelectItem>
                            {teams.map((team) => (
                              <SelectItem key={team.id} value={team.id}>
                                {team.name} - {team.college}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Create Player</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        }
      />
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search players..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select
          value={roleFilter}
          onValueChange={setRoleFilter}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={undefined as any}>All roles</SelectItem>
            <SelectItem value="batsman">Batsman</SelectItem>
            <SelectItem value="bowler">Bowler</SelectItem>
            <SelectItem value="all-rounder">All-rounder</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {isLoading ? (
        <div className="text-center p-12">
          <p>Loading players...</p>
        </div>
      ) : filteredPlayers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPlayers.map((player) => (
            <PlayerCard 
              key={player.id} 
              player={player} 
              onClick={() => navigate(`/players/${player.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center p-12">
          <h3 className="text-lg font-medium">No players found</h3>
          <p className="text-muted-foreground mt-1">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default Players;
