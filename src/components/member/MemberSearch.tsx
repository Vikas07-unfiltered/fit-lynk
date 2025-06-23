
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface MemberSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const MemberSearch = ({ searchTerm, onSearchChange }: MemberSearchProps) => {
  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        placeholder="Search by name, phone, or member ID..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};

export default MemberSearch;
