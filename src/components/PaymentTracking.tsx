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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{totalRevenue}</div>
            <p className="text-xs text-gray-500">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">₹{pendingAmount}</div>
            <p className="text-xs text-gray-500">Awaiting collection</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Payment Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {payments.length > 0 ? Math.round((payments.filter(p => p.status === 'completed').length / payments.length) * 100) : 0}%
            </div>
            <p className="text-xs text-gray-500">On-time payments</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <IndianRupee className="w-4 h-4 mr-2" />
              Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Record New Payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="memberName">Member Name</Label>
                <Input
                  id="memberName"
                  value={newPayment.memberName}
                  onChange={(e) => setNewPayment({ ...newPayment, memberName: e.target.value })}
                  placeholder="Enter member name"
                />
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="method">Payment Method</Label>
                <Select onValueChange={(value) => setNewPayment({ ...newPayment, method: value })}>
                  <SelectTrigger>
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
                <Label htmlFor="plan">Plan</Label>
                <Select onValueChange={(value) => setNewPayment({ ...newPayment, plan: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic - ₹2999/month</SelectItem>
                    <SelectItem value="Premium">Premium - ₹4999/month</SelectItem>
                    <SelectItem value="VIP">VIP - ₹7999/month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddPayment} className="w-full bg-emerald-600 hover:bg-emerald-700">
                Record Payment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {filteredPayments.map((payment) => (
          <Card key={payment.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                      <IndianRupee className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{payment.memberName}</h3>
                      <p className="text-sm text-gray-600">{payment.plan} Plan</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Amount:</span>
                      <p className="text-green-600 font-bold">₹{payment.amount}</p>
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
                    size="sm"
                    variant="outline"
                    onClick={() => sendReminder(payment)}
                    className="ml-4"
                  >
                    <Bell className="w-4 h-4 mr-1" />
                    Send Reminder
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPayments.length === 0 && (
        <Card className="p-8 text-center">
          <IndianRupee className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
          <p className="text-gray-600">Record your first payment to get started</p>
        </Card>
      )}
    </div>
  );
};

export default PaymentTracking;
