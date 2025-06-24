
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const GymHeader = () => {
  const { gym, user, signOut } = useAuth();

  if (!gym || !user) return null;

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Building className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{gym.name}</h2>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
            Owner
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-1" />
            Settings
          </Button>
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-1" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GymHeader;
