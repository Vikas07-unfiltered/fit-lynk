
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { NewMember } from '@/types/member';

interface AddMemberDialogProps {
  onAddMember: (member: NewMember) => Promise<boolean>;
}

const AddMemberDialog = ({ onAddMember }: AddMemberDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newMember, setNewMember] = useState<NewMember>({
    name: '',
    phone: '',
    whatsapp_number: '',
    plan: '',
  });

  const handleAddMember = async () => {
    const success = await onAddMember(newMember);
    if (success) {
      setNewMember({ name: '', phone: '', whatsapp_number: '', plan: '' });
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
            <Label htmlFor="plan">Membership Plan *</Label>
            <Select onValueChange={(value) => setNewMember({ ...newMember, plan: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Basic">Basic - ₹2999/month</SelectItem>
                <SelectItem value="Premium">Premium - ₹4999/month</SelectItem>
                <SelectItem value="VIP">VIP - ₹7999/month</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAddMember} className="w-full bg-emerald-600 hover:bg-emerald-700">
            Add Member
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
