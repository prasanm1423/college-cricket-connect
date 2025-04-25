
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageHeader from "@/components/shared/PageHeader";
import TeamCard from "@/components/shared/TeamCard";

import { teams } from "@/data/mockData";

const Teams = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter teams based on search term
  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.college.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });
  
  return (
    <div>
      <PageHeader
        title="Teams"
        description="View and manage cricket teams"
        action={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Team
          </Button>
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
      
      {filteredTeams.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTeams.map((team) => (
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
