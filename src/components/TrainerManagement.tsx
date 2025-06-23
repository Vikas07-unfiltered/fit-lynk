
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, User, DollarSign, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Trainer {
  id: string;
  name: string;
  phone: string;
  specialty: string;
  hourlyRate: number;
  status: 'active' | 'inactive';
  joinDate: string;
  totalSessions: number;
  monthlyEarnings: number;
  rating: number;
}

const TrainerManagement = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTrainer, setNewTrainer] = useState({
    name: '',
    phone: '',
    specialty: '',
    hourlyRate: '',
  });

  const filteredTrainers = trainers.filter(trainer =>
    trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTrainer = () => {
    if (!newTrainer.name || !newTrainer.phone || !newTrainer.specialty || !newTrainer.hourlyRate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const trainer: Trainer = {
      id: Date.now().toString(),
      name: newTrainer.name,
      phone: newTrainer.phone,
      specialty: newTrainer.specialty,
      hourlyRate: parseFloat(newTrainer.hourlyRate),
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      totalSessions: 0,
      monthlyEarnings: 0,
      rating: 5.0,
    };

    setTrainers([...trainers, trainer]);
    setNewTrainer({ name: '', phone: '', specialty: '', hourlyRate: '' });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Trainer added successfully",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
    };
    return variants[status as keyof typeof variants] || '';
  };

  const totalEarnings = trainers.reduce((sum, trainer) => sum + trainer.monthlyEarnings, 0);
  const totalSessions = trainers.reduce((sum, trainer) => sum + trainer.totalSessions, 0);
  const averageRating = trainers.length > 0 ? trainers.reduce((sum, trainer) => sum + trainer.rating, 0) / trainers.length : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Trainers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{trainers.length}</div>
            <p className="text-xs text-gray-500">Active staff</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalEarnings}</div>
            <p className="text-xs text-gray-500">Total trainer payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {averageRating ? averageRating.toFixed(1) : '0.0'}
            </div>
            <p className="text-xs text-gray-500">Customer satisfaction</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search trainers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Trainer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Trainer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newTrainer.name}
                  onChange={(e) => setNewTrainer({ ...newTrainer, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={newTrainer.phone}
                  onChange={(e) => setNewTrainer({ ...newTrainer, phone: e.target.value })}
                  placeholder="+1234567890"
                />
              </div>
              <div>
                <Label htmlFor="specialty">Specialty</Label>
                <Select onValueChange={(value) => setNewTrainer({ ...newTrainer, specialty: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Strength Training">Strength Training</SelectItem>
                    <SelectItem value="Cardio">Cardio</SelectItem>
                    <SelectItem value="Yoga & Pilates">Yoga & Pilates</SelectItem>
                    <SelectItem value="CrossFit">CrossFit</SelectItem>
                    <SelectItem value="Personal Training">Personal Training</SelectItem>
                    <SelectItem value="Group Classes">Group Classes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  value={newTrainer.hourlyRate}
                  onChange={(e) => setNewTrainer({ ...newTrainer, hourlyRate: e.target.value })}
                  placeholder="45"
                />
              </div>
              <Button onClick={handleAddTrainer} className="w-full bg-emerald-600 hover:bg-emerald-700">
                Add Trainer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTrainers.map((trainer) => (
          <Card key={trainer.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{trainer.name}</CardTitle>
                    <p className="text-sm text-gray-600">{trainer.specialty}</p>
                  </div>
                </div>
                <Badge className={getStatusBadge(trainer.status)}>
                  {trainer.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Phone:</span>
                  <p className="text-gray-600 truncate">{trainer.phone}</p>
                </div>
                <div>
                  <span className="font-medium">Rate:</span>
                  <p className="text-emerald-600 font-semibold">${trainer.hourlyRate}/hr</p>
                </div>
                <div>
                  <span className="font-medium">Sessions:</span>
                  <p>{trainer.totalSessions}</p>
                </div>
                <div>
                  <span className="font-medium">Rating:</span>
                  <p className="text-yellow-600">⭐ {trainer.rating}</p>
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Monthly Earnings:</span>
                  <span className="text-green-600 font-bold">${trainer.monthlyEarnings}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Joined:</span>
                  <span>{trainer.joinDate}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Calendar className="w-4 h-4 mr-1" />
                  Schedule
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <DollarSign className="w-4 h-4 mr-1" />
                  Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTrainers.length === 0 && (
        <Card className="p-8 text-center">
          <User className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No trainers found</h3>
          <p className="text-gray-600">Add your first trainer to get started</p>
        </Card>
      )}
    </div>
  );
};

export default TrainerManagement;
