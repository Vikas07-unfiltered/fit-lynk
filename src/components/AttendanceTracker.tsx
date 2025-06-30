
import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, UserCheck, Clock, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AttendanceRecord {
  id: string;
  memberName: string;
  checkInTime: string;
  checkOutTime?: string;
  date: string;
  duration?: number;
}

const AttendanceTracker = () => {
  const { gym } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [qrScanMode, setQrScanMode] = useState(false);
  const [manualMemberName, setManualMemberName] = useState('');

  const todayRecords = attendanceRecords.filter(record => 
    record.date === new Date().toISOString().split('T')[0]
  );

  const filteredRecords = todayRecords.filter(record =>
    record.memberName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleManualCheckIn = () => {
    if (!manualMemberName.trim()) {
      toast({
        title: "Error",
        description: "Please enter member name",
        variant: "destructive",
      });
      return;
    }

    const now = new Date();
    const record: AttendanceRecord = {
      id: Date.now().toString(),
      memberName: manualMemberName,
      checkInTime: now.toTimeString().slice(0, 5),
      date: now.toISOString().split('T')[0],
    };

    setAttendanceRecords([record, ...attendanceRecords]);
    setManualMemberName('');
    
    toast({
      title: "Success",
      description: `${manualMemberName} checked in successfully`,
    });
  };

  const handleCheckOut = (recordId: string) => {
    const now = new Date();
    const checkOutTime = now.toTimeString().slice(0, 5);
    
    setAttendanceRecords(records =>
      records.map(record => {
        if (record.id === recordId && !record.checkOutTime) {
          const checkInHour = parseInt(record.checkInTime.split(':')[0]);
          const checkInMinute = parseInt(record.checkInTime.split(':')[1]);
          const checkOutHour = parseInt(checkOutTime.split(':')[0]);
          const checkOutMinute = parseInt(checkOutTime.split(':')[1]);
          
          const duration = (checkOutHour * 60 + checkOutMinute) - (checkInHour * 60 + checkInMinute);
          
          return {
            ...record,
            checkOutTime,
            duration: Math.max(0, duration),
          };
        }
        return record;
      })
    );

    toast({
      title: "Success",
      description: "Member checked out successfully",
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const todayStats = {
    totalCheckIns: todayRecords.length,
    currentlyInside: todayRecords.filter(r => !r.checkOutTime).length,
    averageTime: todayRecords.filter(r => r.duration).reduce((sum, r) => sum + (r.duration || 0), 0) / 
                 todayRecords.filter(r => r.duration).length || 0,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's Check-ins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{todayStats.totalCheckIns}</div>
            <p className="text-xs text-gray-500">Total members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Currently Inside</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{todayStats.currentlyInside}</div>
            <p className="text-xs text-gray-500">Active members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {todayStats.averageTime ? formatDuration(Math.round(todayStats.averageTime)) : '0h 0m'}
            </div>
            <p className="text-xs text-gray-500">Duration</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Check-in</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button
                onClick={() => setQrScanMode(!qrScanMode)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                {qrScanMode ? 'Stop QR Scan' : 'Scan QR Code'}
              </Button>

              {qrScanMode && (
                <div className="p-4 border-2 border-dashed border-blue-300 rounded-lg text-center">
                  <div className="w-16 h-16 mx-auto bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                    <UserCheck className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600">QR Scanner Active</p>
                  <p className="text-xs text-gray-500">Point camera at member's QR code</p>
                </div>
              )}

              <div className="relative">
                <span className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 text-center text-xs text-gray-500 bg-white px-2">
                  OR
                </span>
                <hr className="border-gray-300" />
              </div>

              <div className="space-y-2">
                <Input
                  placeholder="Enter member name"
                  value={manualMemberName}
                  onChange={(e) => setManualMemberName(e.target.value)}
                />
                <Button
                  onClick={handleManualCheckIn}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  Manual Check-in
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative flex-1 max-w-md mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {filteredRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full flex items-center justify-center">
                      <UserCheck className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{record.memberName}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>In: {record.checkInTime}</span>
                        {record.checkOutTime && (
                          <>
                            <span>• Out: {record.checkOutTime}</span>
                            <span>• {formatDuration(record.duration || 0)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {record.checkOutTime ? (
                      <Badge className="bg-gray-100 text-gray-800">
                        Completed
                      </Badge>
                    ) : (
                      <>
                        <Badge className="bg-green-100 text-green-800">
                          Active
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCheckOut(record.id)}
                        >
                          Check Out
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredRecords.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600">No attendance records for today</p>
                <p className="text-sm text-gray-500">Check-ins will appear here when members arrive</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    {/* QR Code for attendance marking */}
    <div className="my-8">
      <Card>
        <CardHeader>
          <CardTitle>Scan to Mark Attendance</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {gym?.id ? (
            <>
              <QRCodeCanvas value={`${window.location.origin}/scan-attendance?gym_id=${gym.id}`} size={200} />
              <div style={{ marginTop: 10, wordBreak: 'break-all', fontSize: 12 }}>
                {`${window.location.origin}/scan-attendance?gym_id=${gym.id}`}
              </div>
            </>
          ) : (
            <div className="text-red-600">No gym selected. Please log in as a gym owner.</div>
          )}
        </CardContent>
      </Card>
    </div>
  </div>
  );
};

export default AttendanceTracker;
