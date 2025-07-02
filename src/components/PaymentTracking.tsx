import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, IndianRupee, Bell } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePayments } from '@/hooks/usePayments';
import { NewPayment } from '@/types/payment';
import MemberLookup from './payment/MemberLookup';

const PaymentTracking = () => {
  const { payments, loading, addPayment } = usePayments();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<{ id: string; user_id: string; name: string } | null>(null);
  const [newPayment, setNewPayment] = useState({
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    method: '',
    planName: '',
    notes: '',
  });
  const isMobile = useIsMobile();

  const filteredPayments = payments.filter(payment =>
    payment.member_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.member_user_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPayment = async () => {
    if (!selectedMember || !newPayment.amount || !newPayment.method || !newPayment.planName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const paymentData: NewPayment = {
      member_id: selectedMember.id,
      member_user_id: selectedMember.user_id,
      member_name: selectedMember.name,
      amount: parseFloat(newPayment.amount),
      payment_date: newPayment.paymentDate,
      payment_method: newPayment.method,
      plan_name: newPayment.planName,
      notes: newPayment.notes || undefined,
    };

    const success = await addPayment(paymentData);
    if (success) {
      setNewPayment({ amount: '', paymentDate: new Date().toISOString().split('T')[0], method: '', planName: '', notes: '' });
      setSelectedMember(null);
      setIsAddDialogOpen(false);
    }
  };

  const sendReminder = (payment: any) => {
    toast({
      title: "Reminder Sent",
      description: `Payment reminder sent to ${payment.member_name}`,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      overdue: 'bg-red-100 text-red-800',
    };
    return variants[status as keyof typeof variants] || '';
  };

  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + Number(p.amount), 0);
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="space-y-4">
      <div className={`grid grid-cols-1 ${isMobile ? 'gap-3' : 'md:grid-cols-3 gap-4'}`}>
        <Card>
          <CardHeader className={`${isMobile ? 'pb-2 px-4 pt-3' : 'pb-2'}`}>
            <CardTitle className={`${isMobile ? 'text-sm' : 'text-sm'} font-medium`}>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent className={isMobile ? 'px-4 pb-3' : ''}>
            <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-green-600`}>₹{totalRevenue}</div>
            <p className="text-xs text-gray-500">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={`${isMobile ? 'pb-2 px-4 pt-3' : 'pb-2'}`}>
            <CardTitle className={`${isMobile ? 'text-sm' : 'text-sm'} font-medium`}>Pending Payments</CardTitle>
          </CardHeader>
          <CardContent className={isMobile ? 'px-4 pb-3' : ''}>
            <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-yellow-600`}>₹{pendingAmount}</div>
            <p className="text-xs text-gray-500">Awaiting collection</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={`${isMobile ? 'pb-2 px-4 pt-3' : 'pb-2'}`}>
            <CardTitle className={`${isMobile ? 'text-sm' : 'text-sm'} font-medium`}>Payment Rate</CardTitle>
          </CardHeader>
          <CardContent className={isMobile ? 'px-4 pb-3' : ''}>
            <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-blue-600`}>
              {payments.length > 0 ? Math.round((payments.filter(p => p.status === 'completed').length / payments.length) * 100) : 0}%
            </div>
            <p className="text-xs text-gray-500">On-time payments</p>
          </CardContent>
        </Card>
      </div>

      <div className={`flex ${isMobile ? 'flex-col' : 'flex-col sm:flex-row'} gap-4 items-start ${isMobile ? '' : 'sm:items-center'} justify-between`}>
        <div className={`relative flex-1 ${isMobile ? 'w-full' : 'max-w-md'}`}>
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
          <Input
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`${isMobile ? 'pl-12 h-12 text-base' : 'pl-10'}`}
          />
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className={`bg-emerald-600 hover:bg-emerald-700 ${isMobile ? 'w-full h-12' : ''}`}>
              <IndianRupee className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'} mr-2`} />
              Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent className={`${isMobile ? 'w-[95vw] max-w-none mx-auto' : 'sm:max-w-md'}`}>
            <DialogHeader>
              <DialogTitle className={isMobile ? 'text-lg' : ''}>Record New Payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <MemberLookup
                selectedMember={selectedMember}
                onMemberSelect={setSelectedMember}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount" className={isMobile ? 'text-sm' : ''}>Amount Paid</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                    placeholder="0.00"
                    className={isMobile ? 'h-12 text-base mt-1' : 'mt-1'}
                  />
                </div>
                
                <div>
                  <Label htmlFor="paymentDate" className={isMobile ? 'text-sm' : ''}>Payment Date</Label>
                  <Input
                    id="paymentDate"
                    type="date"
                    value={newPayment.paymentDate}
                    onChange={(e) => setNewPayment({ ...newPayment, paymentDate: e.target.value })}
                    className={isMobile ? 'h-12 text-base mt-1' : 'mt-1'}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="method" className={isMobile ? 'text-sm' : ''}>Payment Method</Label>
                <Select onValueChange={(value) => setNewPayment({ ...newPayment, method: value })}>
                  <SelectTrigger className={isMobile ? 'h-12 text-base mt-1' : 'mt-1'}>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Card">Credit/Debit Card</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="UPI">UPI/Digital Wallet</SelectItem>
                    <SelectItem value="Cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="planName" className={isMobile ? 'text-sm' : ''}>Plan Name</Label>
                <Input
                  id="planName"
                  value={newPayment.planName}
                  onChange={(e) => setNewPayment({ ...newPayment, planName: e.target.value })}
                  placeholder="Enter plan name (e.g., Monthly Premium, Annual Basic)"
                  className={isMobile ? 'h-12 text-base mt-1' : 'mt-1'}
                />
              </div>
              
              <div>
                <Label htmlFor="notes" className={isMobile ? 'text-sm' : ''}>Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={newPayment.notes}
                  onChange={(e) => setNewPayment({ ...newPayment, notes: e.target.value })}
                  placeholder="Additional notes about the payment..."
                  className={isMobile ? 'text-base mt-1' : 'mt-1'}
                  rows={3}
                />
              </div>
              
              <Button 
                onClick={handleAddPayment} 
                className={`w-full bg-emerald-600 hover:bg-emerald-700 ${isMobile ? 'h-12' : ''}`}
                disabled={!selectedMember}
              >
                Record Payment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {filteredPayments.map((payment) => (
          <Card key={payment.id} className="hover:shadow-md transition-shadow">
            <CardContent className={`${isMobile ? 'p-4' : 'p-4'}`}>
              <div className={`flex items-center justify-between ${isMobile ? 'flex-col gap-4' : ''}`}>
                <div className={`flex-1 ${isMobile ? 'w-full' : ''}`}>
                  <div className={`flex items-center gap-3 mb-3 ${isMobile ? 'mb-2' : ''}`}>
                    <div className={`${isMobile ? 'w-12 h-12' : 'w-10 h-10'} bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center`}>
                      <IndianRupee className={`${isMobile ? 'w-6 h-6' : 'w-5 h-5'} text-white`} />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${isMobile ? 'text-base' : ''}`}>{payment.member_name}</h3>
                      <p className={`${isMobile ? 'text-sm' : 'text-sm'} text-gray-600`}>{payment.plan_name} Plan • ID: {payment.member_user_id}</p>
                    </div>
                  </div>
                  
                  <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-2 md:grid-cols-4 gap-4'} ${isMobile ? 'text-sm' : 'text-sm'}`}>
                    <div>
                      <span className="font-medium">Amount:</span>
                      <p className={`text-green-600 font-bold ${isMobile ? 'text-base' : ''}`}>₹{Number(payment.amount).toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="font-medium">Date:</span>
                      <p>{new Date(payment.payment_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="font-medium">Method:</span>
                      <p>{payment.payment_method}</p>
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>
                      <Badge className={getStatusBadge(payment.status)}>
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {payment.notes && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                    <span className="font-medium">Notes:</span> {payment.notes}
                  </div>
                )}
                
                {payment.status === 'pending' && (
                  <Button
                    size={isMobile ? "default" : "sm"}
                    variant="outline"
                    onClick={() => sendReminder(payment)}
                    className={`${isMobile ? 'w-full' : 'ml-4'}`}
                  >
                    <Bell className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'} mr-1`} />
                    Send Reminder
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center h-32">
          <div className="text-lg">Loading payments...</div>
        </div>
      )}

      {!loading && filteredPayments.length === 0 && (
        <Card className={`${isMobile ? 'p-6' : 'p-8'} text-center`}>
          <IndianRupee className={`${isMobile ? 'w-16 h-16' : 'w-12 h-12'} mx-auto text-gray-400 mb-4`} />
          <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-medium text-gray-900 mb-2`}>No payments found</h3>
          <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
            {searchTerm ? 'No payments match your search criteria' : 'Record your first payment to get started'}
          </p>
        </Card>
      )}
    </div>
  );
};

export default PaymentTracking;