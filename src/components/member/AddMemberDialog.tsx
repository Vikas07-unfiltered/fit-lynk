
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { NewMember } from '@/types/member';

interface AddMemberDialogProps {
  onAddMember: (member: NewMember) => Promise<boolean>;
}

const membershipPlans = [
  { value: 'Basic', label: 'Basic - ₹2999/month', price: 2999, duration: 1 },
  { value: 'Premium', label: 'Premium - ₹4999/month', price: 4999, duration: 1 },
  { value: 'VIP', label: 'VIP - ₹7999/month', price: 7999, duration: 1 },
  { value: 'Basic-3', label: 'Basic - ₹8500/3 months', price: 8500, duration: 3 },
  { value: 'Premium-3', label: 'Premium - ₹14500/3 months', price: 14500, duration: 3 },
  { value: 'VIP-3', label: 'VIP - ₹23000/3 months', price: 23000, duration: 3 },
  { value: 'Basic-6', label: 'Basic - ₹16500/6 months', price: 16500, duration: 6 },
  { value: 'Premium-6', label: 'Premium - ₹28500/6 months', price: 28500, duration: 6 },
  { value: 'VIP-6', label: 'VIP - ₹45000/6 months', price: 45000, duration: 6 },
  { value: 'Basic-12', label: 'Basic - ₹32000/year', price: 32000, duration: 12 },
  { value: 'Premium-12', label: 'Premium - ₹55000/year', price: 55000, duration: 12 },
  { value: 'VIP-12', label: 'VIP - ₹85000/year', price: 85000, duration: 12 },
];

const AddMemberDialog = ({ onAddMember }: AddMemberDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [joinDate, setJoinDate] = useState<Date>();
  const [firstPaymentDate, setFirstPaymentDate] = useState<Date>();
  const [newMember, setNewMember] = useState<NewMember>({
    name: '',
    phone: '',
    plan: '',
  });

  const handleAddMember = async () => {
    const memberData = {
      ...newMember,
      join_date: joinDate ? format(joinDate, 'yyyy-MM-dd') : undefined,
      first_payment_date: firstPaymentDate ? format(firstPaymentDate, 'yyyy-MM-dd') : undefined,
    };

    const success = await onAddMember(memberData);
    if (success) {
      setNewMember({ name: '', phone: '', plan: '' });
      setJoinDate(undefined);
      setFirstPaymentDate(undefined);
      setIsOpen(false);
    }
  };

  const selectedPlan = membershipPlans.find(plan => plan.value === newMember.plan);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
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
            <Label htmlFor="join-date">Join Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !joinDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {joinDate ? format(joinDate, "PPP") : <span>Select join date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={joinDate}
                  onSelect={setJoinDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="first-payment">First Payment Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !firstPaymentDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {firstPaymentDate ? format(firstPaymentDate, "PPP") : <span>Select payment date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={firstPaymentDate}
                  onSelect={setFirstPaymentDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="plan">Membership Plan & Duration *</Label>
            <Select onValueChange={(value) => setNewMember({ ...newMember, plan: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a plan and duration" />
              </SelectTrigger>
              <SelectContent>
                <div className="p-2 text-xs font-semibold text-gray-500 border-b">Monthly Plans</div>
                {membershipPlans.filter(plan => plan.duration === 1).map((plan) => (
                  <SelectItem key={plan.value} value={plan.value}>
                    {plan.label}
                  </SelectItem>
                ))}
                <div className="p-2 text-xs font-semibold text-gray-500 border-b mt-2">Quarterly Plans (10% off)</div>
                {membershipPlans.filter(plan => plan.duration === 3).map((plan) => (
                  <SelectItem key={plan.value} value={plan.value}>
                    {plan.label}
                  </SelectItem>
                ))}
                <div className="p-2 text-xs font-semibold text-gray-500 border-b mt-2">Half-Yearly Plans (15% off)</div>
                {membershipPlans.filter(plan => plan.duration === 6).map((plan) => (
                  <SelectItem key={plan.value} value={plan.value}>
                    {plan.label}
                  </SelectItem>
                ))}
                <div className="p-2 text-xs font-semibold text-gray-500 border-b mt-2">Annual Plans (20% off)</div>
                {membershipPlans.filter(plan => plan.duration === 12).map((plan) => (
                  <SelectItem key={plan.value} value={plan.value}>
                    {plan.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedPlan && (
              <div className="mt-2 p-3 bg-emerald-50 rounded border text-sm">
                <div className="font-medium text-emerald-800">Plan Details:</div>
                <div className="text-emerald-700">
                  Duration: {selectedPlan.duration} month{selectedPlan.duration > 1 ? 's' : ''}
                </div>
                <div className="text-emerald-700">
                  Total Cost: ₹{selectedPlan.price.toLocaleString()}
                </div>
                <div className="text-emerald-700">
                  Per Month: ₹{Math.round(selectedPlan.price / selectedPlan.duration).toLocaleString()}
                </div>
              </div>
            )}
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
