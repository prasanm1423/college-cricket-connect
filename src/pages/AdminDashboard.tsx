
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Shield, 
  Calendar, 
  Settings,
  Plus,
  Edit,
  Trash,
  Search
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import PageHeader from "@/components/shared/PageHeader";

import { players, teams, matches } from "@/data/mockData";

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        description="Manage players, teams, and matches"
      />
      
      <Tabs defaultValue="players" className="space-y-4">
        <TabsList className="mb-4">
          <TabsTrigger value="players" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Players</span>
          </TabsTrigger>
          <TabsTrigger value="teams" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            <span>Teams</span>
          </TabsTrigger>
          <TabsTrigger value="matches" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Matches</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="players">
          <div className="mb-4 flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search players..." className="pl-8" />
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Player
            </Button>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>College</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {players.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell>
                      <div className="font-medium">{player.name}</div>
                    </TableCell>
                    <TableCell>{player.college}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        player.role === "batsman" ? "bg-blue-100 text-blue-800" :
                        player.role === "bowler" ? "bg-green-100 text-green-800" :
                        "bg-purple-100 text-purple-800"
                      }`}>
                        {player.role}
                      </span>
                    </TableCell>
                    <TableCell>{player.age}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-3.5 w-3.5" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <Trash className="h-3.5 w-3.5" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="teams">
          <div className="mb-4 flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search teams..." className="pl-8" />
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Team
            </Button>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team Name</TableHead>
                  <TableHead>College</TableHead>
                  <TableHead>Players</TableHead>
                  <TableHead>Record (W-L-D)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.map((team) => (
                  <TableRow key={team.id}>
                    <TableCell>
                      <div className="font-medium">{team.name}</div>
                    </TableCell>
                    <TableCell>{team.college}</TableCell>
                    <TableCell>{team.playerIds.length}</TableCell>
                    <TableCell>
                      {team.stats.won}-{team.stats.lost}-{team.stats.draw}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-3.5 w-3.5" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <Trash className="h-3.5 w-3.5" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="matches">
          <div className="mb-4 flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search matches..." className="pl-8" />
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Match
            </Button>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teams</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matches.map((match) => {
                  const team1 = teams.find(t => t.id === match.team1Id);
                  const team2 = teams.find(t => t.id === match.team2Id);
                  
                  if (!team1 || !team2) return null;
                  
                  return (
                    <TableRow key={match.id}>
                      <TableCell>
                        <div className="font-medium">
                          {team1.name} vs {team2.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(match.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{match.venue}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          match.status === "upcoming" ? "bg-blue-100 text-blue-800" :
                          match.status === "live" ? "bg-red-100 text-red-800" :
                          "bg-green-100 text-green-800"
                        }`}>
                          {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {match.status === "upcoming" && (
                            <>
                              <Button variant="outline" size="sm">
                                <Edit className="h-3.5 w-3.5" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600">
                                <Trash className="h-3.5 w-3.5" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </>
                          )}
                          
                          {match.status === "live" && (
                            <Button variant="default" size="sm">
                              Update Score
                            </Button>
                          )}
                          
                          {match.status === "completed" && (
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">System Settings</h3>
            <p className="text-muted-foreground mb-6">
              Configure application settings and preferences.
            </p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">Site Name</Label>
                <Input id="site-name" defaultValue="College Cricket Connect" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="site-description">Site Description</Label>
                <Input id="site-description" defaultValue="College level cricket management system" />
              </div>
              
              <div className="pt-4">
                <Button>Save Settings</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
