
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Award, 
  BookOpen, 
  Edit,
  Trash2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import PageHeader from "@/components/shared/PageHeader";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PlayerStats {
  runs: number;
  wickets: number;
  matches: number;
  highestScore: number;
  bestBowling: string;
}

interface Player {
  id: string;
  name: string;
  college: string;
  role: string;
  age: number;
  team_id?: string | null;
  image_url?: string | null;
  batting_style?: string | null;
  bowling_style?: string | null;
  last_performance_date?: string | null;
  stats: PlayerStats;
}

const PlayerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [player, setPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  useEffect(() => {
    if (id) {
      fetchPlayer(id);
    }
  }, [id]);
  
  const fetchPlayer = async (playerId: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("id", playerId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        // Add default stats since we don't have real stats yet
        const playerWithStats = {
          ...data,
          stats: {
            runs: 0,
            wickets: 0,
            matches: 0,
            highestScore: 0,
            bestBowling: "0/0"
          }
        };
        
        setPlayer(playerWithStats);
      } else {
        setPlayer(null);
      }
    } catch (error) {
      console.error("Error fetching player:", error);
      toast({
        title: "Error",
        description: "Failed to load player details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!player) return;
    
    try {
      const { error } = await supabase
        .from("players")
        .delete()
        .eq("id", player.id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Player deleted successfully",
      });
      
      navigate("/players");
    } catch (error) {
      console.error("Error deleting player:", error);
      toast({
        title: "Error",
        description: "Failed to delete player",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="text-center p-12">
        <p>Loading player details...</p>
      </div>
    );
  }
  
  if (!player) {
    return (
      <div className="text-center p-12">
        <h3 className="text-lg font-medium">Player not found</h3>
        <Button 
          variant="link" 
          onClick={() => navigate("/players")}
          className="mt-2"
        >
          Return to Players
        </Button>
      </div>
    );
  }
  
  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "batsman":
        return "bg-blue-100 text-blue-800";
      case "bowler":
        return "bg-green-100 text-green-800";
      case "all-rounder":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };
  
  return (
    <div>
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/players")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Players
      </Button>
      
      <PageHeader
        title={player.name}
        description={`${player.role.charAt(0).toUpperCase() + player.role.slice(1)}`}
        action={
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => navigate(`/players?edit=${player.id}`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Player
            </Button>
            <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
              <img
                src={player.image_url || "https://via.placeholder.com/300x300?text=Player"}
                alt={player.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <h2 className="text-xl font-semibold mb-1">{player.name}</h2>
            
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeClass(player.role)}`}>
              {player.role}
            </span>
            
            <div className="w-full mt-6 space-y-3">
              <div className="flex items-center p-2 bg-muted rounded-md">
                <User className="h-4 w-4 mr-3 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Age</p>
                  <p className="font-medium">{player.age} years</p>
                </div>
              </div>
              
              <div className="flex items-center p-2 bg-muted rounded-md">
                <BookOpen className="h-4 w-4 mr-3 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">College</p>
                  <p className="font-medium">{player.college}</p>
                </div>
              </div>
              
              <div className="flex items-center p-2 bg-muted rounded-md">
                <Calendar className="h-4 w-4 mr-3 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Matches Played</p>
                  <p className="font-medium">{player.stats.matches}</p>
                </div>
              </div>
              
              {player.last_performance_date && (
                <div className="flex items-center p-2 bg-muted rounded-md">
                  <Calendar className="h-4 w-4 mr-3 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Last Performance</p>
                    <p className="font-medium">{formatDate(player.last_performance_date)}</p>
                  </div>
                </div>
              )}
              
              {player.batting_style && (
                <div className="flex items-center p-2 bg-blue-50 rounded-md">
                  <div className="flex-1">
                    <p className="text-xs text-blue-600">Batting Style</p>
                    <p className="font-medium text-blue-800">
                      {player.batting_style.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </p>
                  </div>
                </div>
              )}
              
              {player.bowling_style && (
                <div className="flex items-center p-2 bg-green-50 rounded-md">
                  <div className="flex-1">
                    <p className="text-xs text-green-600">Bowling Style</p>
                    <p className="font-medium text-green-800">
                      {player.bowling_style.charAt(0).toUpperCase() + player.bowling_style.slice(1)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
        
        <Card className="md:col-span-2 p-6">
          <h3 className="text-lg font-medium mb-4">Player Statistics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-sm text-blue-600 font-medium">Total Runs</p>
              <p className="text-2xl font-bold mt-1">{player.stats.runs}</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-sm text-green-600 font-medium">Total Wickets</p>
              <p className="text-2xl font-bold mt-1">{player.stats.wickets}</p>
            </div>
            
            <div className="bg-amber-50 rounded-lg p-4 text-center">
              <p className="text-sm text-amber-600 font-medium">Highest Score</p>
              <p className="text-2xl font-bold mt-1">{player.stats.highestScore}</p>
            </div>
          </div>
          
          <h4 className="text-md font-medium mb-2 flex items-center">
            <Award className="h-4 w-4 mr-2 text-cricket-accent" />
            Performance Breakdown
          </h4>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stat Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Average per Match</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Runs</TableCell>
                <TableCell>{player.stats.runs}</TableCell>
                <TableCell>
                  {player.stats.matches > 0 
                    ? (player.stats.runs / player.stats.matches).toFixed(2) 
                    : "0.00"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Wickets</TableCell>
                <TableCell>{player.stats.wickets}</TableCell>
                <TableCell>
                  {player.stats.matches > 0 
                    ? (player.stats.wickets / player.stats.matches).toFixed(2) 
                    : "0.00"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Highest Score</TableCell>
                <TableCell>{player.stats.highestScore}</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Best Bowling</TableCell>
                <TableCell>{player.stats.bestBowling}</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {player.name}. This action cannot be undone.
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

export default PlayerDetails;
