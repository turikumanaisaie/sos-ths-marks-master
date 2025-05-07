
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Users, 
  BookOpen, 
  GraduationCap, 
  FileText, 
  BarChart, 
  Settings,
  ClipboardList
} from 'lucide-react';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, active }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors",
        active
          ? "bg-school-primary text-white"
          : "text-gray-700 hover:bg-school-accent hover:text-school-primary"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 bg-white shadow-md border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="font-bold text-lg text-school-primary mb-2">SOS THS MIS</h2>
        <p className="text-xs text-gray-500 mb-6">Marks Management System</p>
      </div>
      
      <nav className="px-2 space-y-1">
        <SidebarLink
          to="/dashboard"
          icon={<Home className="h-5 w-5" />}
          label="Dashboard"
          active={isActive('/dashboard')}
        />
        <SidebarLink
          to="/trainees"
          icon={<Users className="h-5 w-5" />}
          label="Trainees"
          active={isActive('/trainees')}
        />
        <SidebarLink
          to="/trades"
          icon={<GraduationCap className="h-5 w-5" />}
          label="Trades"
          active={isActive('/trades')}
        />
        <SidebarLink
          to="/modules"
          icon={<BookOpen className="h-5 w-5" />}
          label="Modules"
          active={isActive('/modules')}
        />
        <SidebarLink
          to="/marks"
          icon={<ClipboardList className="h-5 w-5" />}
          label="Marks"
          active={isActive('/marks')}
        />
        <SidebarLink
          to="/reports/trainee"
          icon={<FileText className="h-5 w-5" />}
          label="Trainee Reports"
          active={isActive('/reports/trainee')}
        />
        <SidebarLink
          to="/reports/course"
          icon={<BarChart className="h-5 w-5" />}
          label="Course Reports"
          active={isActive('/reports/course')}
        />
        <SidebarLink
          to="/settings"
          icon={<Settings className="h-5 w-5" />}
          label="Settings"
          active={isActive('/settings')}
        />
      </nav>
    </div>
  );
};

export default Sidebar;
