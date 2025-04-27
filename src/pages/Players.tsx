
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Plus, Search, Trash2 } from "lucide-react";

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
import ImageUpload from "@/components/shared/ImageUpload";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const playerSchema = z.object({
  name: z.string().min(1, "Player name is required"),
  college: z.string().min(1, "College name is required"),
  role: z.string().min(1, "Player role is required"),
  age: z.string()
    .min(1, "Age is required")
    .transform(val => parseInt(val, 10))
    .refine(val => !isNaN(val) && val > 0, {
      message: "Age must be a positive number"
    }),
  team_id: z.string().optional(),
  batting_style: z.string().optional(),
  bowling_style: z.string().optional(),
  image_url: z.string().optional(),
  last_performance_date: z.string().optional(),
});

type PlayerFormValues = z.infer<typeof playerSchema>;

interface Player {
  id: string;
  name: string;
  college: string;
  role: string;
  age: number;
  team_id?: string;
  image_url?: string | null;
  batting_style?: string | null;
  bowling_style?: string | null;
  last_performance_date?: string | null;
  stats: {
    runs: number;
    wickets: number;
    matches: number;
    highestScore: number;
    bestBowling: string;
  };
  imageUrl?: string | null;
}

const Players = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);
  
  const { toast } = useToast();
  
  const form = useForm<PlayerFormValues>({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      name: "",
      college: "",
      role: "",
      age: "",
      team_id: undefined,
      batting_style: "",
      bowling_style: "",
      image_url: undefined,
      last_performance_date: "",
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
      
      const playersWithStats = data?.map(player => ({
        ...player,
        stats: {
          runs: 0,
          wickets: 0,
          matches: 0,
          highestScore: 0,
          bestBowling: "0/0"
        },
        imageUrl: player.image_url
      })) || [];
      
      setPlayers(playersWithStats);
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
  
  const openEditDialog = (player: Player) => {
    setCurrentPlayer(player);
    setIsEditMode(true);
    
    form.reset({
      name: player.name,
      college: player.college,
      role: player.role,
      age: String(player.age),
      team_id: player.team_id || undefined,
      batting_style: player.batting_style || "",
      bowling_style: player.bowling_style || "",
      image_url: player.image_url || undefined,
      last_performance_date: player.last_performance_date || "",
    });
    
    setIsDialogOpen(true);
  };
  
  const openAddDialog = () => {
    setCurrentPlayer(null);
    setIsEditMode(false);
    
    form.reset({
      name: "",
      college: "",
      role: "",
      age: "",
      team_id: undefined,
      batting_style: "",
      bowling_style: "",
      image_url: undefined,
      last_performance_date: "",
    });
    
    setIsDialogOpen(true);
  };
  
  const confirmDelete = (player: Player) => {
    setPlayerToDelete(player);
    setDeleteDialogOpen(true);
  };
  
  const handleDelete = async () => {
    if (!playerToDelete) return;
    
    try {
      const { error } = await supabase
        .from("players")
        .delete()
        .eq("id", playerToDelete.id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Player deleted successfully",
      });
      
      // Remove from local state
      setPlayers(players.filter(p => p.id !== playerToDelete.id));
    } catch (error) {
      console.error("Error deleting player:", error);
      toast({
        title: "Error",
        description: "Failed to delete player",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setPlayerToDelete(null);
    }
  };
  
  const onSubmit = async (values: PlayerFormValues) => {
    try {
      console.log("Creating/updating player:", values);
      
      const playerData = {
        name: values.name,
        college: values.college,
        role: values.role,
        age: values.age,
        team_id: values.team_id === "no-team" ? null : values.team_id,
        image_url: values.image_url,
        batting_style: values.batting_style || null,
        bowling_style: values.bowling_style || null,
        last_performance_date: values.last_performance_date || null,
      };
      
      if (isEditMode && currentPlayer) {
        // Update existing player
        const { data, error } = await supabase
          .from("players")
          .update(playerData)
          .eq("id", currentPlayer.id)
          .select();
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Player updated successfully",
        });
        
        // Update local state
        setPlayers(players.map(p => 
          p.id === currentPlayer.id 
            ? {...p, ...playerData, imageUrl: playerData.image_url} 
            : p
        ));
      } else {
        // Create new player
        const { data, error } = await supabase
          .from("players")
          .insert([playerData])
          .select();
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Player created successfully",
        });
        
        // Add to local state with default stats
        if (data && data[0]) {
          const newPlayer = {
            ...data[0],
            stats: {
              runs: 0,
              wickets: 0,
              matches: 0,
              highestScore: 0,
              bestBowling: "0/0"
            },
            imageUrl: data[0].image_url
          };
          setPlayers([...players, newPlayer]);
        }
      }
      
      form.reset();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating/updating player:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditMode ? 'update' : 'create'} player`,
        variant: "destructive",
      });
    }
  };
  
  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.college.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || roleFilter === "all" || player.role === roleFilter;
    return matchesSearch && matchesRole;
  });
  
  return (
    <div>
      <PageHeader
        title="Players"
        description="View and manage player profiles"
        action={
          <Button onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Player
          </Button>
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
            <SelectItem value="all">All roles</SelectItem>
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
            <div key={player.id} className="relative group">
              <PlayerCard 
                player={player} 
                onClick={() => navigate(`/players/${player.id}`)}
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <Button 
                  size="icon"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditDialog(player);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon"
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDelete(player);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
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
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Player" : "Add New Player"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <ImageUpload 
                bucketName="player-images"
                onImageUploaded={(url) => form.setValue('image_url', url)}
                onImageRemoved={() => form.setValue('image_url', undefined)}
                currentImageUrl={form.watch('image_url')}
              />

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
                      value={field.value}
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
              
              {(form.watch('role') === 'batsman' || form.watch('role') === 'all-rounder') && (
                <FormField
                  control={form.control}
                  name="batting_style"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Batting Style</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select batting style" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="right-handed">Right-handed</SelectItem>
                          <SelectItem value="left-handed">Left-handed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              {(form.watch('role') === 'bowler' || form.watch('role') === 'all-rounder') && (
                <FormField
                  control={form.control}
                  name="bowling_style"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bowling Style</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select bowling style" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fast">Fast</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="spin">Spin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="last_performance_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Performance Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
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
                      value={field.value || "no-team"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select team (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="no-team">No Team</SelectItem>
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
                <Button type="submit">{isEditMode ? "Update" : "Create"} Player</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {playerToDelete?.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Players;
