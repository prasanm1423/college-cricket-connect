
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Award, 
  BookOpen, 
  Edit
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

import { getPlayerById } from "@/data/mockData";

const PlayerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const player = getPlayerById(id || "");
  
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
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Player
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
              <img
                src={player.imageUrl || "https://via.placeholder.com/300x300?text=Player"}
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
                  {(player.stats.runs / player.stats.matches).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Wickets</TableCell>
                <TableCell>{player.stats.wickets}</TableCell>
                <TableCell>
                  {(player.stats.wickets / player.stats.matches).toFixed(2)}
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
    </div>
  );
};

export default PlayerDetails;
