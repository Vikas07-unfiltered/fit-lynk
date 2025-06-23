import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, User, Calendar, Phone } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import QRCodeGenerator from './QRCodeGenerator';

interface Member {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  whatsapp_number?: string;
  plan: string;
  status: string; // Changed from strict union to string to match database
  join_date: string;
  last_payment: string | null;
  photo_url?: string;
}

const MemberManagement = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [newMember, setNewMember] = useState({
    name: '',
    phone: '',
    whatsapp_number: '',
    plan: '',
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast({
        title: "Error",
        description: "Failed to fetch members",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.includes(searchTerm) ||
    member.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.whatsapp_number && member.whatsapp_number.includes(searchTerm))
  );

  const handleAddMember = async () => {
    if (!newMember.name || !newMember.phone || !newMember.plan) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const memberData = {
        name: newMember.name,
        phone: newMember.phone,
        whatsapp_number: newMember.whatsapp_number || null,
        plan: newMember.plan,
        status: 'active',
        last_payment: new Date().toISOString().split('T')[0],
      };

      const { data, error } = await supabase
        .from('members')
        .insert(memberData) // Fixed: removed array wrapper since we're inserting single object
        .select()
        .single();

      if (error) throw error;

      setMembers([data, ...members]);
      setNewMember({ name: '', phone: '', whatsapp_number: '', plan: '' });
      setIsAddDialogOpen(false);
      
      toast({
        title: "Success",
        description: `Member added successfully with ID: ${data.user_id}`,
      });
    } catch (error) {
      console.error('Error adding member:', error);
      toast({
        title: "Error",
        description: "Failed to add member",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading members...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by name, phone, or member ID..."
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
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                  placeholder="+1234567890"
                />
              </div>
              <div>
                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                <Input
                  id="whatsapp"
                  value={newMember.whatsapp_number}
                  onChange={(e) => setNewMember({ ...newMember, whatsapp_number: e.target.value })}
                  placeholder="+1234567890 (for payment reminders)"
                />
              </div>
              <div>
                <Label htmlFor="plan">Membership Plan *</Label>
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
                    <p className="text-sm text-emerald-600 font-semibold">ID: {member.user_id}</p>
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
                <span className="font-medium">Phone:</span>
                <span>{member.phone}</span>
              </div>
              {member.whatsapp_number && (
                <div className="flex justify-between text-sm">
                  <span className="font-medium">WhatsApp:</span>
                  <span className="flex items-center">
                    <Phone className="w-3 h-3 mr-1 text-green-600" />
                    {member.whatsapp_number}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="font-medium">Joined:</span>
                <span>{member.join_date}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Last Payment:</span>
                <span>{member.last_payment || 'No payment'}</span>
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

      {filteredMembers.length === 0 && !loading && (
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
