
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, Bell } from 'lucide-react';
import { Member } from '@/types/member';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';

interface MemberCardProps {
  member: Member;
  onShowQR: (member: Member) => void;
}

const MemberCard = ({ member, onShowQR }: MemberCardProps) => {
  const [isSendingNotification, setIsSendingNotification] = useState(false);

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const sendIndividualNotification = async () => {
    setIsSendingNotification(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-expiry-notifications', {
        body: {
          member_id: member.id,
          individual_notification: true
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Notification sent to ${member.name}`,
      });
    } catch (error) {
      console.error('Error sending individual notification:', error);
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive",
      });
    } finally {
      setIsSendingNotification(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
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
            onClick={() => onShowQR(member)}
            className="flex-1"
          >
            <Calendar className="w-4 h-4 mr-1" />
            QR Code
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={sendIndividualNotification}
            disabled={isSendingNotification}
            className="border-orange-500 text-orange-600 hover:bg-orange-50"
          >
            <Bell className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberCard;
