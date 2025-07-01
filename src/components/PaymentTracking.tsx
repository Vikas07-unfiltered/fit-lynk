import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, IndianRupee, Bell } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface Payment {
  id: string;
  memberName: string;
  amount: number;
  date: string;
  method: string;
  status: 'completed' | 'pending' | 'overdue';
  plan: string;
  dueDate?: string;
}

const PaymentTracking = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({
    memberName: '',
    amount: '',
    method: '',
    plan: '',
  });
  const isMobile = useIsMobile();

  const filteredPayments = payments.filter(payment =>
    payment.memberName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPayment = () => {
    if (!newPayment.memberName || !newPayment.amount || !newPayment.method) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const payment: Payment = {
      id: Date.now().toString(),
      memberName: newPayment.memberName,
      amount: parseFloat(newPayment.amount),
      date: new Date().toISOString().split('T')[0],
      method: newPayment.method,
      status: 'completed',
      plan: newPayment.plan || 'Basic',
    };

    setPayments([payment, ...payments]);
    setNewPayment({ memberName: '', amount: '', method: '', plan: '' });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Payment recorded successfully",
    });
  };

  const sendReminder = (payment: Payment) => {
    toast({
      title: "Reminder Sent",
      description: `Payment reminder sent to ${payment.memberName}`,
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

  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

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
              <div>
                <Label htmlFor="memberName" className={isMobile ? 'text-sm' : ''}>Member Name</Label>
                <Input
                  id="memberName"
                  value={newPayment.memberName}
                  onChange={(e) => setNewPayment({ ...newPayment, memberName: e.target.value })}
                  placeholder="Enter member name"
                  className={isMobile ? 'h-12 text-base mt-1' : ''}
                />
              </div>
              <div>
                <Label htmlFor="amount" className={isMobile ? 'text-sm' : ''}>Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                  placeholder="0.00"
                  className={isMobile ? 'h-12 text-base mt-1' : ''}
                />
              </div>
              <div>
                <Label htmlFor="method" className={isMobile ? 'text-sm' : ''}>Payment Method</Label>
                <Select onValueChange={(value) => setNewPayment({ ...newPayment, method: value })}>
                  <SelectTrigger className={isMobile ? 'h-12 text-base mt-1' : ''}>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Card">Credit/Debit Card</SelectItem>
                    <SelectItem value="Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="UPI">UPI/Digital Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="plan" className={isMobile ? 'text-sm' : ''}>Plan</Label>
                <Select onValueChange={(value) => setNewPayment({ ...newPayment, plan: value })}>
                  <SelectTrigger className={isMobile ? 'h-12 text-base mt-1' : ''}>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic - ₹2999/month</SelectItem>
                    <SelectItem value="Premium">Premium - ₹4999/month</SelectItem>
                    <SelectItem value="VIP">VIP - ₹7999/month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleAddPayment} 
                className={`w-full bg-emerald-600 hover:bg-emerald-700 ${isMobile ? 'h-12' : ''}`}
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
                      <h3 className={`font-semibold ${isMobile ? 'text-base' : ''}`}>{payment.memberName}</h3>
                      <p className={`${isMobile ? 'text-sm' : 'text-sm'} text-gray-600`}>{payment.plan} Plan</p>
                    </div>
                  </div>
                  
                  <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-2 md:grid-cols-4 gap-4'} ${isMobile ? 'text-sm' : 'text-sm'}`}>
                    <div>
                      <span className="font-medium">Amount:</span>
                      <p className={`text-green-600 font-bold ${isMobile ? 'text-base' : ''}`}>₹{payment.amount}</p>
                    </div>
                    <div>
                      <span className="font-medium">Date:</span>
                      <p>{payment.date}</p>
                    </div>
                    <div>
                      <span className="font-medium">Method:</span>
                      <p>{payment.method}</p>
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>
                      <Badge className={getStatusBadge(payment.status)}>
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                
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

      {filteredPayments.length === 0 && (
        <Card className={`${isMobile ? 'p-6' : 'p-8'} text-center`}>
          <IndianRupee className={`${isMobile ? 'w-16 h-16' : 'w-12 h-12'} mx-auto text-gray-400 mb-4`} />
          <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-medium text-gray-900 mb-2`}>No payments found</h3>
          <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>Record your first payment to get started</p>
        </Card>
      )}
    </div>
  );
};

export default PaymentTracking;