import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Shirt as Tshirt, Images, User as UserIcon, LogOut, Camera } from 'lucide-react';
import Navigation from './Navigation';

const Header: React.FC = () => {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center px-2 py-2 text-gray-900">
              <Tshirt className="h-6 w-6" />
              <span className="ml-2 font-semibold">Virtual Try-On</span>
            </Link>
          </div>

          <Navigation user={user} onSignOut={handleSignOut} />
        </div>
      </div>
    </nav>
  );
};

export default Header;