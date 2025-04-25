
import React, { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Users, 
  Shield, 
  Calendar, 
  BarChart, 
  Settings, 
  LogIn,
  UserPlus,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

type NavItemProps = {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
};

const NavItem = ({ to, icon: Icon, label, isActive }: NavItemProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-2 px-4 py-3 rounded-md transition-colors",
        isActive
          ? "bg-cricket-green-dark text-white"
          : "text-gray-700 hover:bg-cricket-green-light/20"
      )}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </Link>
  );
};

const MainLayout = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Dummy authentication for now
  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b p-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-cricket-green-dark flex items-center justify-center">
            <span className="text-white font-bold text-sm">CC</span>
          </div>
          <h1 className="text-xl font-bold text-cricket-green-dark">College Cricket</h1>
        </Link>
        <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>
      
      {/* Sidebar for desktop and mobile when open */}
      <aside 
        className={cn(
          "w-full md:w-64 bg-white border-r border-gray-200 flex flex-col",
          "fixed inset-y-0 left-0 z-50 md:relative", 
          "transform transition-transform duration-200 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          "md:h-screen md:sticky md:top-0"
        )}
      >
        <div className="p-4 border-b border-gray-200 hidden md:block">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-cricket-green-dark flex items-center justify-center">
              <span className="text-white font-bold text-sm">CC</span>
            </div>
            <h1 className="text-xl font-bold text-cricket-green-dark">College Cricket</h1>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavItem 
            to="/" 
            icon={Home} 
            label="Dashboard" 
            isActive={location.pathname === "/"} 
          />
          <NavItem 
            to="/players" 
            icon={Users} 
            label="Players" 
            isActive={location.pathname.startsWith("/players")} 
          />
          <NavItem 
            to="/teams" 
            icon={Shield} 
            label="Teams" 
            isActive={location.pathname.startsWith("/teams")} 
          />
          <NavItem 
            to="/matches" 
            icon={Calendar} 
            label="Matches" 
            isActive={location.pathname.startsWith("/matches")} 
          />
          <NavItem 
            to="/leaderboard" 
            icon={BarChart} 
            label="Leaderboard" 
            isActive={location.pathname.startsWith("/leaderboard")} 
          />
          {isLoggedIn && (
            <NavItem 
              to="/admin" 
              icon={Settings} 
              label="Admin" 
              isActive={location.pathname.startsWith("/admin")} 
            />
          )}
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
            >
              <LogIn size={20} className="rotate-180" />
              <span className="font-medium">Logout</span>
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                to="/login"
                className="w-full flex items-center gap-2 px-4 py-2 rounded-md bg-cricket-green-dark text-white hover:bg-cricket-green-dark/90 transition-colors"
              >
                <LogIn size={20} />
                <span className="font-medium">Login</span>
              </Link>
              <Link
                to="/register"
                className="w-full flex items-center gap-2 px-4 py-2 rounded-md border border-cricket-green-dark text-cricket-green-dark hover:bg-cricket-green-dark/10 transition-colors"
              >
                <UserPlus size={20} />
                <span className="font-medium">Register</span>
              </Link>
            </div>
          )}
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        {/* Render nested routes */}
        <Outlet />
      </main>
      
      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;
