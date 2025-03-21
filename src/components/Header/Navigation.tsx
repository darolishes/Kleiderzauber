import React from 'react';
import { Link } from 'react-router-dom';
import { Images, User as UserIcon, LogOut, Camera } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

interface NavigationProps {
  user: User | null;
  onSignOut: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ user, onSignOut }) => {
  if (!user) {
    return (
      <div className="flex items-center">
        <Link
          to="/auth"
          className="px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <Link
        to="/wardrobe"
        className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50"
        title="Wardrobe"
      >
        <Images className="h-5 w-5" />
      </Link>
      <Link
        to="/try-on"
        className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50"
        title="Try On"
      >
        <Camera className="h-5 w-5" />
      </Link>
      <Link
        to="/profile"
        className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50"
        title="Profile"
      >
        <UserIcon className="h-5 w-5" />
      </Link>
      <button
        onClick={onSignOut}
        className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50"
        title="Sign out"
      >
        <LogOut className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Navigation;