import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { Member } from '@/types/member';

interface MemberListTableProps {
  members: Member[];
}

const MemberListTable = ({ members }: MemberListTableProps) => {
  if (members.length === 0) {
    return (
      <div className="text-center py-8">
        <Users className="w-12 h-12 mx-auto text-gray-400 mb-2" />
        <p className="text-gray-600">No members found</p>
        <p className="text-gray-500 text-sm">Add members to see them listed here</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead>Last Payment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id} className="hover-scale">
              <TableCell className="font-medium">{member.user_id}</TableCell>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.phone}</TableCell>
              <TableCell>{member.plan}</TableCell>
              <TableCell>
                <Badge 
                  variant={member.status === 'active' ? 'default' : 'secondary'}
                  className={member.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                >
                  {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>{new Date(member.join_date).toLocaleDateString()}</TableCell>
              <TableCell>
                {member.last_payment ? new Date(member.last_payment).toLocaleDateString() : 'No payment'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MemberListTable;