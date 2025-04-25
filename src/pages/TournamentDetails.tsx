
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Users, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PageHeader from "@/components/shared/PageHeader";

// Mock data for tournaments until we set up the database
const mockTournaments = [
  {
    id: "t1",
    name: "College Premier League 2023",
    startDate: "2023-06-15",
    endDate: "2023-07-30",
    location: "Delhi University Stadium",
    status: "completed",
    teamCount: 8,
    description: "The annual premier cricket tournament for colleges across Delhi, featuring the top 8 teams competing for the championship trophy.",
    teams: ["Delhi University", "JNU", "DTU", "NSIT", "IIIT Delhi", "Jamia Millia", "Amity", "IP University"],
    matches: [
      {
        id: "m1",
        team1: "Delhi University",
        team2: "JNU",
        date: "2023-06-15",
        venue: "Main Ground",
        result: "Delhi University won by 5 wickets"
      },
      {
        id: "m2",
        team1: "DTU",
        team2: "NSIT",
        date: "2023-06-16",
        venue: "Secondary Ground",
        result: "DTU won by 25 runs"
      },
      {
        id: "m3",
        team1: "IIIT Delhi",
        team2: "Jamia Millia",
        date: "2023-06-17",
        venue: "Main Ground",
        result: "Jamia Millia won by 3 wickets"
      }
    ],
    standings: [
      { position: 1, team: "Delhi University", played: 7, won: 6, lost: 1, points: 12 },
      { position: 2, team: "DTU", played: 7, won: 5, lost: 2, points: 10 },
      { position: 3, team: "Jamia Millia", played: 7, won: 4, lost: 3, points: 8 },
      { position: 4, team: "NSIT", played: 7, won: 4, lost: 3, points: 8 }
    ]
  },
  {
    id: "t2",
    name: "Inter-College Cup 2024",
    startDate: "2024-03-10",
    endDate: "2024-04-25",
    location: "Mumbai University Ground",
    status: "ongoing",
    teamCount: 12,
    description: "A prestigious cricket tournament bringing together college teams from across Maharashtra to compete for the Inter-College Cup.",
    teams: ["Mumbai University", "Pune University", "VJTI", "SPIT", "KJSIT", "Somaiya", "DY Patil", "NMIMS", "Ruia", "Xavier's", "Mithibai", "Jai Hind"],
    matches: [
      {
        id: "m1",
        team1: "Mumbai University",
        team2: "Pune University",
        date: "2024-03-10",
        venue: "Main Ground",
        result: "Mumbai University won by 7 wickets"
      },
      {
        id: "m2",
        team1: "VJTI",
        team2: "SPIT",
        date: "2024-03-11",
        venue: "Secondary Ground",
        result: "VJTI won by 15 runs"
      },
      {
        id: "m3",
        team1: "KJSIT",
        team2: "Somaiya",
        date: "2024-03-12",
        venue: "Main Ground",
        result: "Match in progress"
      }
    ],
    standings: [
      { position: 1, team: "Mumbai University", played: 4, won: 4, lost: 0, points: 8 },
      { position: 2, team: "VJTI", played: 4, won: 3, lost: 1, points: 6 },
      { position: 3, team: "Somaiya", played: 3, won: 2, lost: 1, points: 4 },
      { position: 4, team: "KJSIT", played: 3, won: 2, lost: 1, points: 4 }
    ]
  },
  {
    id: "t3",
    name: "University Championship 2024",
    startDate: "2024-09-05",
    endDate: "2024-10-20",
    location: "Chennai Central Stadium",
    status: "upcoming",
    teamCount: 16,
    description: "The largest collegiate cricket championship in South India, featuring 16 university teams competing in a month-long tournament.",
    teams: ["Chennai University", "Anna University", "SRM", "VIT", "Loyola", "MCC", "PSG", "SASTRA", "NIT Trichy", "BITS Pilani", "IIT Madras", "SSN", "CEG", "Crescent", "Hindustan", "Sathyabama"],
    matches: [],
    standings: []
  }
];

const TournamentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Find the tournament based on the ID from the URL
  const tournament = mockTournaments.find(t => t.id === id);
  
  if (!tournament) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Tournament Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The tournament you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate("/tournaments")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tournaments
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate("/tournaments")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tournaments
        </Button>
      </div>
      
      <PageHeader
        title={tournament.name}
        description={tournament.description}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="flex items-center pt-6">
            <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">
                {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center pt-6">
            <MapPin className="h-5 w-5 text-muted-foreground mr-2" />
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{tournament.location}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center pt-6">
            <Users className="h-5 w-5 text-muted-foreground mr-2" />
            <div>
              <p className="text-sm text-muted-foreground">Teams</p>
              <p className="font-medium">{tournament.teamCount} teams</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="matches">Matches</TabsTrigger>
            <TabsTrigger value="standings">Standings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Tournament Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">About</h3>
                    <p className="text-muted-foreground mt-1">
                      {tournament.description}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium">Format</h3>
                    <p className="text-muted-foreground mt-1">
                      The tournament follows a round-robin format in the group stage, followed by knockout rounds in the playoffs. 
                      Each match consists of 20 overs per side.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium">Status</h3>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tournament.status === "upcoming" ? "bg-blue-100 text-blue-800" :
                        tournament.status === "ongoing" ? "bg-green-100 text-green-800" :
                        "bg-purple-100 text-purple-800"
                      }`}>
                        {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="teams">
            <Card>
              <CardHeader>
                <CardTitle>Participating Teams</CardTitle>
              </CardHeader>
              <CardContent>
                {tournament.teams.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {tournament.teams.map((team, index) => (
                      <div key={index} className="border rounded-md p-4 text-center hover:bg-muted/50 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                          <Trophy className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-medium truncate">{team}</h3>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No teams registered yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="matches">
            <Card>
              <CardHeader>
                <CardTitle>Matches</CardTitle>
              </CardHeader>
              <CardContent>
                {tournament.matches.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Teams</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Venue</TableHead>
                          <TableHead>Result</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tournament.matches.map((match) => (
                          <TableRow key={match.id}>
                            <TableCell className="font-medium">
                              {match.team1} vs {match.team2}
                            </TableCell>
                            <TableCell>{new Date(match.date).toLocaleDateString()}</TableCell>
                            <TableCell>{match.venue}</TableCell>
                            <TableCell>{match.result}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No matches scheduled yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="standings">
            <Card>
              <CardHeader>
                <CardTitle>Standings</CardTitle>
              </CardHeader>
              <CardContent>
                {tournament.standings.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Position</TableHead>
                          <TableHead>Team</TableHead>
                          <TableHead>Played</TableHead>
                          <TableHead>Won</TableHead>
                          <TableHead>Lost</TableHead>
                          <TableHead>Points</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tournament.standings.map((standing) => (
                          <TableRow key={standing.position}>
                            <TableCell>#{standing.position}</TableCell>
                            <TableCell className="font-medium">{standing.team}</TableCell>
                            <TableCell>{standing.played}</TableCell>
                            <TableCell>{standing.won}</TableCell>
                            <TableCell>{standing.lost}</TableCell>
                            <TableCell>{standing.points}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No standings available yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TournamentDetails;
