
// Types for our data
export type PlayerRole = "batsman" | "bowler" | "all-rounder";

export interface Player {
  id: string;
  name: string;
  age: number;
  college: string;
  role: PlayerRole;
  imageUrl?: string;
  stats: {
    matches: number;
    runs: number;
    wickets: number;
    highestScore: number;
    bestBowling: string;
  };
}

export interface Team {
  id: string;
  name: string;
  college: string;
  logoUrl?: string;
  playerIds: string[];
  captain?: string;
  stats: {
    matches: number;
    won: number;
    lost: number;
    draw: number;
  };
}

export interface Match {
  id: string;
  team1Id: string;
  team2Id: string;
  date: string;
  venue: string;
  status: "upcoming" | "live" | "completed";
  result?: {
    winner: string;
    team1Score: string;
    team2Score: string;
    playerOfMatch?: string;
  };
}

// Mock data
export const players: Player[] = [
  {
    id: "p1",
    name: "Raj Sharma",
    age: 21,
    college: "Delhi College of Engineering",
    role: "batsman",
    imageUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&auto=format&fit=crop",
    stats: {
      matches: 15,
      runs: 820,
      wickets: 2,
      highestScore: 112,
      bestBowling: "1/12"
    }
  },
  {
    id: "p2",
    name: "Vikram Singh",
    age: 20,
    college: "IIT Delhi",
    role: "bowler",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&auto=format&fit=crop",
    stats: {
      matches: 12,
      runs: 85,
      wickets: 28,
      highestScore: 24,
      bestBowling: "5/21"
    }
  },
  {
    id: "p3",
    name: "Ankita Patel",
    age: 19,
    college: "Lady Shri Ram College",
    role: "all-rounder",
    imageUrl: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=400&h=400&auto=format&fit=crop",
    stats: {
      matches: 10,
      runs: 320,
      wickets: 15,
      highestScore: 65,
      bestBowling: "3/18"
    }
  },
  {
    id: "p4",
    name: "Prateek Verma",
    age: 22,
    college: "Delhi College of Engineering",
    role: "batsman",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&auto=format&fit=crop",
    stats: {
      matches: 14,
      runs: 780,
      wickets: 0,
      highestScore: 105,
      bestBowling: "-"
    }
  },
  {
    id: "p5",
    name: "Sanjana Gupta",
    age: 20,
    college: "Miranda House",
    role: "bowler",
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&auto=format&fit=crop",
    stats: {
      matches: 11,
      runs: 45,
      wickets: 23,
      highestScore: 12,
      bestBowling: "4/16"
    }
  },
  {
    id: "p6",
    name: "Amit Kumar",
    age: 21,
    college: "NSIT",
    role: "all-rounder",
    imageUrl: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=400&h=400&auto=format&fit=crop",
    stats: {
      matches: 15,
      runs: 420,
      wickets: 18,
      highestScore: 84,
      bestBowling: "3/22"
    }
  }
];

export const teams: Team[] = [
  {
    id: "t1",
    name: "DCE Thunder",
    college: "Delhi College of Engineering",
    logoUrl: "/team-logos/dce.png",
    playerIds: ["p1", "p4"],
    captain: "p1",
    stats: {
      matches: 8,
      won: 6,
      lost: 1,
      draw: 1
    }
  },
  {
    id: "t2",
    name: "IIT Strikers",
    college: "IIT Delhi",
    logoUrl: "/team-logos/iit.png",
    playerIds: ["p2"],
    captain: "p2",
    stats: {
      matches: 7,
      won: 5,
      lost: 2,
      draw: 0
    }
  },
  {
    id: "t3",
    name: "NSIT Warriors",
    college: "NSIT",
    logoUrl: "/team-logos/nsit.png",
    playerIds: ["p6"],
    captain: "p6",
    stats: {
      matches: 6,
      won: 3,
      lost: 2,
      draw: 1
    }
  },
  {
    id: "t4",
    name: "Lady Champions",
    college: "Miranda House & Lady Shri Ram College",
    logoUrl: "/team-logos/lsr.png",
    playerIds: ["p3", "p5"],
    stats: {
      matches: 5,
      won: 3,
      lost: 2,
      draw: 0
    }
  }
];

export const matches: Match[] = [
  {
    id: "m1",
    team1Id: "t1",
    team2Id: "t2",
    date: "2025-05-01T10:00:00",
    venue: "Delhi University Stadium",
    status: "upcoming"
  },
  {
    id: "m2",
    team1Id: "t3",
    team2Id: "t4",
    date: "2025-05-02T14:00:00",
    venue: "NSIT Cricket Ground",
    status: "upcoming"
  },
  {
    id: "m3",
    team1Id: "t1",
    team2Id: "t4",
    date: "2025-04-20T10:00:00",
    venue: "Delhi University Stadium",
    status: "completed",
    result: {
      winner: "t1",
      team1Score: "165/6 (20)",
      team2Score: "142/8 (20)",
      playerOfMatch: "p1"
    }
  },
  {
    id: "m4",
    team1Id: "t2",
    team2Id: "t3",
    date: "2025-04-18T14:00:00",
    venue: "IIT Cricket Ground",
    status: "completed",
    result: {
      winner: "t2",
      team1Score: "187/4 (20)",
      team2Score: "154/9 (20)",
      playerOfMatch: "p2"
    }
  }
];

// Utility functions to work with our mock data
export const getPlayerById = (id: string): Player | undefined => {
  return players.find(player => player.id === id);
};

export const getTeamById = (id: string): Team | undefined => {
  return teams.find(team => team.id === id);
};

export const getTeamPlayers = (teamId: string): Player[] => {
  const team = getTeamById(teamId);
  if (!team) return [];
  return team.playerIds.map(id => getPlayerById(id)).filter(Boolean) as Player[];
};

export const getTopBatsmen = (limit: number = 5): Player[] => {
  return [...players]
    .sort((a, b) => b.stats.runs - a.stats.runs)
    .slice(0, limit);
};

export const getTopBowlers = (limit: number = 5): Player[] => {
  return [...players]
    .sort((a, b) => b.stats.wickets - a.stats.wickets)
    .slice(0, limit);
};

export const getUpcomingMatches = (): Match[] => {
  return matches.filter(match => match.status === "upcoming")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const getRecentMatches = (): Match[] => {
  return matches.filter(match => match.status === "completed")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
