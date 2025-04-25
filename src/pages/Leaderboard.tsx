
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

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

import { players, teams } from "@/data/mockData";

const Leaderboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Sort players by runs (for batsmen) and wickets (for bowlers)
  const topBatsmen = [...players]
    .sort((a, b) => b.stats.runs - a.stats.runs)
    .filter(player => 
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.college.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  const topBowlers = [...players]
    .sort((a, b) => b.stats.wickets - a.stats.wickets)
    .filter(player => 
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.college.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  const topTeams = [...teams]
    .sort((a, b) => (b.stats.won / b.stats.matches) - (a.stats.won / a.stats.matches))
    .filter(team => 
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.college.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  return (
    <div>
      <PageHeader
        title="Leaderboard"
        description="Top performing players and teams"
      />
      
      <div className="mb-6 max-w-md">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search players or teams..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="batsmen" className="space-y-4">
        <TabsList>
          <TabsTrigger value="batsmen">Top Batsmen</TabsTrigger>
          <TabsTrigger value="bowlers">Top Bowlers</TabsTrigger>
          <TabsTrigger value="teams">Top Teams</TabsTrigger>
        </TabsList>
        
        <TabsContent value="batsmen">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Rank</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead>College</TableHead>
                  <TableHead className="text-right">Matches</TableHead>
                  <TableHead className="text-right">Runs</TableHead>
                  <TableHead className="text-right">Avg</TableHead>
                  <TableHead className="text-right">Highest Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topBatsmen.map((player, index) => (
                  <TableRow 
                    key={player.id} 
                    className="cursor-pointer"
                    onClick={() => navigate(`/players/${player.id}`)}
                  >
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-muted mr-2 overflow-hidden">
                          {player.imageUrl ? (
                            <img 
                              src={player.imageUrl} 
                              alt={player.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-cricket-green-dark flex items-center justify-center">
                              <span className="text-xs text-white font-bold">
                                {player.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        {player.name}
                      </div>
                    </TableCell>
                    <TableCell>{player.college}</TableCell>
                    <TableCell className="text-right">{player.stats.matches}</TableCell>
                    <TableCell className="text-right font-bold">{player.stats.runs}</TableCell>
                    <TableCell className="text-right">
                      {(player.stats.runs / player.stats.matches).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">{player.stats.highestScore}</TableCell>
                  </TableRow>
                ))}
                
                {topBatsmen.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="bowlers">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Rank</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead>College</TableHead>
                  <TableHead className="text-right">Matches</TableHead>
                  <TableHead className="text-right">Wickets</TableHead>
                  <TableHead className="text-right">Avg</TableHead>
                  <TableHead className="text-right">Best Bowling</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topBowlers.map((player, index) => (
                  <TableRow 
                    key={player.id} 
                    className="cursor-pointer"
                    onClick={() => navigate(`/players/${player.id}`)}
                  >
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-muted mr-2 overflow-hidden">
                          {player.imageUrl ? (
                            <img 
                              src={player.imageUrl} 
                              alt={player.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-cricket-green-dark flex items-center justify-center">
                              <span className="text-xs text-white font-bold">
                                {player.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        {player.name}
                      </div>
                    </TableCell>
                    <TableCell>{player.college}</TableCell>
                    <TableCell className="text-right">{player.stats.matches}</TableCell>
                    <TableCell className="text-right font-bold">{player.stats.wickets}</TableCell>
                    <TableCell className="text-right">
                      {(player.stats.wickets / player.stats.matches).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">{player.stats.bestBowling}</TableCell>
                  </TableRow>
                ))}
                
                {topBowlers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="teams">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Rank</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>College</TableHead>
                  <TableHead className="text-right">Matches</TableHead>
                  <TableHead className="text-right">Won</TableHead>
                  <TableHead className="text-right">Lost</TableHead>
                  <TableHead className="text-right">Draw</TableHead>
                  <TableHead className="text-right">Win %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topTeams.map((team, index) => (
                  <TableRow 
                    key={team.id} 
                    className="cursor-pointer"
                    onClick={() => navigate(`/teams/${team.id}`)}
                  >
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-cricket-green-dark mr-2 flex items-center justify-center">
                          <span className="text-xs text-white font-bold">
                            {team.name.substring(0, 2)}
                          </span>
                        </div>
                        {team.name}
                      </div>
                    </TableCell>
                    <TableCell>{team.college}</TableCell>
                    <TableCell className="text-right">{team.stats.matches}</TableCell>
                    <TableCell className="text-right font-bold">{team.stats.won}</TableCell>
                    <TableCell className="text-right">{team.stats.lost}</TableCell>
                    <TableCell className="text-right">{team.stats.draw}</TableCell>
                    <TableCell className="text-right">
                      {((team.stats.won / team.stats.matches) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
                
                {topTeams.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No results found.
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

export default Leaderboard;
