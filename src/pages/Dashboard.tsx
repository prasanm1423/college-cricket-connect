
import React from "react";
import { 
  Calendar,
  Users,
  Shield,
  BarChart,
  Award
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import PlayerCard from "@/components/shared/PlayerCard";
import TeamCard from "@/components/shared/TeamCard";
import MatchCard from "@/components/shared/MatchCard";

import {
  getTopBatsmen,
  getTopBowlers,
  getUpcomingMatches,
  getRecentMatches,
  players,
  teams,
  matches
} from "@/data/mockData";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const topBatsmen = getTopBatsmen(3);
  const topBowlers = getTopBowlers(3);
  const upcomingMatches = getUpcomingMatches();
  const recentMatches = getRecentMatches();
  
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Welcome to College Cricket Connect"
        action={
          <Link to="/admin">
            <Button>Go to Admin</Button>
          </Link>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Players"
          value={players.length}
          icon={<Users size={24} />}
        />
        <StatCard
          title="Teams"
          value={teams.length}
          icon={<Shield size={24} />}
        />
        <StatCard
          title="Matches"
          value={matches.length}
          icon={<Calendar size={24} />}
        />
        <StatCard
          title="Upcoming Matches"
          value={upcomingMatches.length}
          icon={<Calendar size={24} />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Upcoming Matches</h2>
            <Link to="/matches">
              <Button variant="link" className="text-cricket-accent">
                View all
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {upcomingMatches.length > 0 ? (
              upcomingMatches.slice(0, 2).map(match => (
                <MatchCard key={match.id} match={match} />
              ))
            ) : (
              <Card className="p-8 text-center text-muted-foreground">
                No upcoming matches
              </Card>
            )}
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Results</h2>
            <Link to="/matches">
              <Button variant="link" className="text-cricket-accent">
                View all
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {recentMatches.length > 0 ? (
              recentMatches.slice(0, 2).map(match => (
                <MatchCard key={match.id} match={match} />
              ))
            ) : (
              <Card className="p-8 text-center text-muted-foreground">
                No recent matches
              </Card>
            )}
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Top Performers</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-medium mb-4">
              <Award className="text-cricket-accent" />
              Top Batsmen
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {topBatsmen.map(player => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="flex items-center gap-2 text-lg font-medium mb-4">
              <Award className="text-cricket-accent" />
              Top Bowlers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {topBowlers.map(player => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">College Teams</h2>
          <Link to="/teams">
            <Button variant="link" className="text-cricket-accent">
              View all teams
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {teams.map(team => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
