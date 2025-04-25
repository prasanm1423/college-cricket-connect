
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
import PageHeader from "@/components/shared/PageHeader";
import PlayerCard from "@/components/shared/PlayerCard";

import { players, PlayerRole } from "@/data/mockData";

const Players = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);
  
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
          <Button>
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
            <SelectItem value={undefined as any}>All roles</SelectItem>
            <SelectItem value="batsman">Batsman</SelectItem>
            <SelectItem value="bowler">Bowler</SelectItem>
            <SelectItem value="all-rounder">All-rounder</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {filteredPlayers.length > 0 ? (
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
