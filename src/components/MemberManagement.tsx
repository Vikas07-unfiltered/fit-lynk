
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, User, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import QRCodeGenerator from './QRCodeGenerator';

interface Member {
  id: string;
  name: string;
  phone: string;
  plan: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  lastPayment: string;
  photo?: string;
}

const MemberManagement = () => {
  const [members, setMembers] = useState<Member[]>([
    {
      id: '1',
      name: 'John Doe',
      phone: '+1234567890',
      plan: 'Premium',
      status: 'active',
      joinDate: '2024-01-15',
      lastPayment: '2024-06-01',
    },
    {
      id: '2',
      name: 'Jane Smith',
      phone: '+1234567891',
      plan: 'Basic',
      status: 'active',
      joinDate: '2024-02-20',
      lastPayment: '2024-06-05',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      phone: '+1234567892',
      plan: 'Premium',
      status: 'pending',
      joinDate: '2024-06-20',
      lastPayment: '2024-06-20',
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [newMember, setNewMember] = useState({
    name: '',
    phone: '',
    plan: '',
  });

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.includes(searchTerm)
  );

  const handleAddMember = () => {
    if (!newMember.name || !newMember.phone || !newMember.plan) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const member: Member = {
      id: Date.now().toString(),
      name: newMember.name,
      phone: newMember.phone,
      plan: newMember.plan,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      lastPayment: new Date().toISOString().split('T')[0],
    };

    setMembers([...members, member]);
    setNewMember({ name: '', phone: '', plan: '' });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Member added successfully",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return variants[status as keyof typeof variants] || '';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                  placeholder="+1234567890"
                />
              </div>
              <div>
                <Label htmlFor="plan">Membership Plan</Label>
                <Select onValueChange={(value) => setNewMember({ ...newMember, plan: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic - $39/month</SelectItem>
                    <SelectItem value="Premium">Premium - $69/month</SelectItem>
                    <SelectItem value="VIP">VIP - $99/month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddMember} className="w-full bg-emerald-600 hover:bg-emerald-700">
                Add Member
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <p className="text-sm text-gray-600">{member.phone}</p>
                  </div>
                </div>
                <Badge className={getStatusBadge(member.status)}>
                  {member.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Plan:</span>
                <span className="text-emerald-600 font-semibold">{member.plan}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Joined:</span>
                <span>{member.joinDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Last Payment:</span>
                <span>{member.lastPayment}</span>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedMember(member)}
                  className="flex-1"
                >
                  <Calendar className="w-4 h-4 mr-1" />
                  QR Code
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedMember && (
        <QRCodeGenerator
          member={selectedMember}
          isOpen={!!selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}

      {filteredMembers.length === 0 && (
        <Card className="p-8 text-center">
          <User className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No members found</h3>
          <p className="text-gray-600">Try adjusting your search or add new members.</p>
        </Card>
      )}
    </div>
  );
};

export default MemberManagement;
