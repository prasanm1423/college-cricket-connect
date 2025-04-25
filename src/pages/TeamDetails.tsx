
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Users, 
  Award, 
  Calendar,
  Edit,
  Shield
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
import PlayerCard from "@/components/shared/PlayerCard";

import { getTeamById, getTeamPlayers } from "@/data/mockData";

const TeamDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const team = getTeamById(id || "");
  
  if (!team) {
    return (
      <div className="text-center p-12">
        <h3 className="text-lg font-medium">Team not found</h3>
        <Button 
          variant="link" 
          onClick={() => navigate("/teams")}
          className="mt-2"
        >
          Return to Teams
        </Button>
      </div>
    );
  }
  
  const players = getTeamPlayers(team.id);
  const captain = players.find(p => p.id === team.captain);
  
  return (
    <div>
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/teams")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Teams
      </Button>
      
      <PageHeader
        title={team.name}
        description={team.college}
        action={
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Team
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-1 p-6">
          <div className="flex flex-col items-center text-center">
            {team.logoUrl ? (
              <img
                src={team.logoUrl}
                alt={team.name}
                className="w-32 h-32 object-contain mb-4"
              />
            ) : (
              <div className="w-32 h-32 bg-cricket-green-dark rounded-full flex items-center justify-center mb-4">
                <Shield className="h-16 w-16 text-white" />
              </div>
            )}
            
            <h2 className="text-xl font-semibold mb-1">{team.name}</h2>
            <p className="text-sm text-muted-foreground mb-4">{team.college}</p>
            
            {captain && (
              <div className="bg-amber-50 p-3 rounded-md flex items-center mb-4 w-full">
                <Award className="h-5 w-5 mr-2 text-amber-600" />
                <div>
                  <p className="text-xs text-amber-700">Team Captain</p>
                  <p className="font-medium">{captain.name}</p>
                </div>
              </div>
            )}
            
            <div className="w-full mt-2 space-y-3">
              <div className="flex items-center p-2 bg-muted rounded-md">
                <Users className="h-4 w-4 mr-3 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Squad Size</p>
                  <p className="font-medium">{players.length} Players</p>
                </div>
              </div>
              
              <div className="flex items-center p-2 bg-muted rounded-md">
                <Calendar className="h-4 w-4 mr-3 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Matches Played</p>
                  <p className="font-medium">{team.stats.matches}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="md:col-span-2 p-6">
          <h3 className="text-lg font-medium mb-4">Team Statistics</h3>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-sm text-blue-600 font-medium">Matches Played</p>
              <p className="text-2xl font-bold mt-1">{team.stats.matches}</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-sm text-green-600 font-medium">Matches Won</p>
              <p className="text-2xl font-bold mt-1">{team.stats.won}</p>
            </div>
            
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <p className="text-sm text-red-600 font-medium">Matches Lost</p>
              <p className="text-2xl font-bold mt-1">{team.stats.lost}</p>
            </div>
          </div>
          
          <h4 className="text-md font-medium mb-2 flex items-center">
            <Award className="h-4 w-4 mr-2 text-cricket-accent" />
            Team Performance
          </h4>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stat</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Win Rate</TableCell>
                <TableCell>{team.stats.won} / {team.stats.matches}</TableCell>
                <TableCell>
                  {((team.stats.won / team.stats.matches) * 100).toFixed(1)}%
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Loss Rate</TableCell>
                <TableCell>{team.stats.lost} / {team.stats.matches}</TableCell>
                <TableCell>
                  {((team.stats.lost / team.stats.matches) * 100).toFixed(1)}%
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Draw Rate</TableCell>
                <TableCell>{team.stats.draw} / {team.stats.matches}</TableCell>
                <TableCell>
                  {((team.stats.draw / team.stats.matches) * 100).toFixed(1)}%
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </div>
      
      <h3 className="text-lg font-semibold mb-4">Team Players</h3>
      
      {players.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {players.map((player) => (
            <PlayerCard 
              key={player.id} 
              player={player} 
              onClick={() => navigate(`/players/${player.id}`)}
              className={player.id === team.captain ? "border-2 border-amber-400" : ""}
            />
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-muted rounded-md">
          <p className="text-muted-foreground">No players assigned to this team yet.</p>
          <Button className="mt-4">Add Players</Button>
        </div>
      )}
    </div>
  );
};

export default TeamDetails;
