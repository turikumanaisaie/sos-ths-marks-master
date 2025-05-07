
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-school-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold">SOS THS</h1>
          <span className="text-sm bg-white text-school-primary px-2 py-1 rounded">MIS</span>
        </Link>
        
        {user ? (
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>{user.username}</span>
            </div>
            <Button 
              variant="outline" 
              className="bg-transparent border-white text-white hover:bg-white hover:text-school-primary"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span>Logout</span>
            </Button>
          </div>
        ) : (
          <Link to="/login">
            <Button 
              variant="outline" 
              className="bg-transparent border-white text-white hover:bg-white hover:text-school-primary"
            >
              <User className="h-4 w-4 mr-2" />
              <span>Login</span>
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
