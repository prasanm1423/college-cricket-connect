
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageHeader from "@/components/shared/PageHeader";
import TeamCard from "@/components/shared/TeamCard";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const teamSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  college: z.string().min(1, "College name is required"),
});

type TeamFormValues = z.infer<typeof teamSchema>;

const Teams = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: "",
      college: "",
    },
  });
  
  useEffect(() => {
    fetchTeams();
  }, []);
  
  const fetchTeams = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching teams...");
      
      const { data, error } = await supabase
        .from("teams")
        .select("*");
      
      if (error) {
        console.error("Error fetching teams:", error);
        throw error;
      }
      
      console.log("Teams fetched:", data);
      setTeams(data || []);
    } catch (error) {
      console.error("Error fetching teams:", error);
      toast({
        title: "Error",
        description: "Failed to load teams",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const onSubmit = async (values: TeamFormValues) => {
    try {
      console.log("Creating new team:", values);
      
      const { data, error } = await supabase
        .from("teams")
        .insert([{
          name: values.name,
          college: values.college,
        }])
        .select();
      
      if (error) {
        console.error("Error creating team:", error);
        throw error;
      }
      
      console.log("Team created successfully:", data);
      
      toast({
        title: "Success",
        description: "Team created successfully",
      });
      
      form.reset();
      setIsDialogOpen(false);
      fetchTeams();
    } catch (error) {
      console.error("Error creating team:", error);
      toast({
        title: "Error",
        description: "Failed to create team",
        variant: "destructive",
      });
    }
  };
  
  // Filter teams based on search term
  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.college.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Process teams to ensure they have the right structure for TeamCard
  const processedTeams = filteredTeams.map(team => ({
    ...team,
    stats: {
      matches: 0,
      won: 0,
      lost: 0,
      draw: 0
    }
  }));
  
  return (
    <div>
      <PageHeader
        title="Teams"
        description="View and manage cricket teams"
        action={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Team
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Team</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter team name" {...field} />
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
                  
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Create Team</Button>
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
            placeholder="Search teams..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center p-12">
          <p>Loading teams...</p>
        </div>
      ) : processedTeams.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {processedTeams.map((team) => (
            <TeamCard 
              key={team.id} 
              team={team} 
              onClick={() => navigate(`/teams/${team.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center p-12">
          <h3 className="text-lg font-medium">No teams found</h3>
          <p className="text-muted-foreground mt-1">
            Try adjusting your search criteria or add a new team.
          </p>
        </div>
      )}
    </div>
  );
};

export default Teams;
