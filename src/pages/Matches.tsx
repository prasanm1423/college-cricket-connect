
import React, { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/shared/PageHeader";
import MatchCard from "@/components/shared/MatchCard";

import { matches } from "@/data/mockData";

const Matches = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Filter matches based on search term and status filter
  const filteredMatches = matches.filter(match => {
    const matchesSearch = match.venue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || match.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  const upcomingMatches = filteredMatches.filter(m => m.status === "upcoming");
  const liveMatches = filteredMatches.filter(m => m.status === "live");
  const completedMatches = filteredMatches.filter(m => m.status === "completed");
  
  return (
    <div>
      <PageHeader
        title="Matches"
        description="View and manage cricket matches"
        action={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Schedule Match
          </Button>
        }
      />
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search venues..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All matches</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="live">Live</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Matches</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="live">Live</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {filteredMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMatches.map((match) => (
                <MatchCard 
                  key={match.id} 
                  match={match} 
                  onClick={() => navigate(`/matches/${match.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-12">
              <h3 className="text-lg font-medium">No matches found</h3>
              <p className="text-muted-foreground mt-1">
                Try adjusting your search criteria or schedule a new match.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="upcoming">
          {upcomingMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingMatches.map((match) => (
                <MatchCard 
                  key={match.id} 
                  match={match} 
                  onClick={() => navigate(`/matches/${match.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-12">
              <h3 className="text-lg font-medium">No upcoming matches</h3>
              <p className="text-muted-foreground mt-1">
                Schedule a new match to see it here.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="live">
          {liveMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveMatches.map((match) => (
                <MatchCard 
                  key={match.id} 
                  match={match} 
                  onClick={() => navigate(`/matches/${match.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-12">
              <h3 className="text-lg font-medium">No live matches</h3>
              <p className="text-muted-foreground mt-1">
                There are no matches in progress at the moment.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          {completedMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedMatches.map((match) => (
                <MatchCard 
                  key={match.id} 
                  match={match} 
                  onClick={() => navigate(`/matches/${match.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-12">
              <h3 className="text-lg font-medium">No completed matches</h3>
              <p className="text-muted-foreground mt-1">
                Completed matches will appear here.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Matches;
