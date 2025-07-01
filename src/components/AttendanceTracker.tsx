import { useState, useEffect } from 'react';
import { useMembers } from '@/hooks/useMembers';
import { supabase } from '@/integrations/supabase/client';
import { QRCodeCanvas } from 'qrcode.react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, UserCheck, Clock, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const { members } = useMembers();
  const [showMembersModal, setShowMembersModal] = useState(false);
  const isMobile = useIsMobile();

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
    // Debug: log input and members
    console.log('Manual check-in input:', manualMemberName);
    console.log('Members:', members);
    // Accept either member name, id, or user_id for active members (case-insensitive, ignore all whitespace)
    const normalize = (s: string) => s.replace(/\s+/g, '').toLowerCase();
    const input = normalize(manualMemberName);
    const foundMember = members.find(m =>
      m.status === 'active' && (
        normalize(m.name) === input ||
        normalize(m.id) === input ||
        normalize(m.user_id) === input
      )
    );
    if (!foundMember) {
      toast({
        title: "Error",
        description: "Only active members can check in. Check the name, Member ID, or member status.",
        variant: "destructive",
      });
      setShowMembersModal(true); // Show modal for debugging
      return;
    }
    const now = new Date();
    const record: AttendanceRecord = {
      id: Date.now().toString(),
      memberName: foundMember.name,
      checkInTime: now.toTimeString().slice(0, 5),
      date: now.toISOString().split('T')[0],
    };
    setAttendanceRecords([record, ...attendanceRecords]);
    setManualMemberName('');
    toast({
      title: "Success",
      description: `${foundMember.name} checked in successfully`,
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

  // Fetch attendance records from Supabase for the current gym
  const fetchAttendance = async () => {
    if (!gym?.id) return;
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('gym_id', gym.id)
        .order('timestamp', { ascending: false });
      if (error) throw error;
      // Map Supabase attendance rows to AttendanceRecord for UI
      const mapped = (data || []).map((row: any) => ({
        id: row.id,
        memberName: row.member_id, // You may want to join with members for actual names
        checkInTime: row.timestamp ? new Date(row.timestamp).toTimeString().slice(0, 5) : '',
        checkOutTime: undefined, // Not implemented in your schema yet
        date: row.timestamp ? new Date(row.timestamp).toISOString().split('T')[0] : '',
        duration: undefined,
      }));
      setAttendanceRecords(mapped);
      toast({
        title: "Refreshed!",
        description: "Attendance records loaded.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || 'Failed to fetch attendance',
        variant: 'destructive',
      });
    }
  };

  // Fetch attendance on mount
  useEffect(() => {
    fetchAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gym?.id]);

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-2">
        <Button variant="outline" onClick={fetchAttendance}>
          Refresh
        </Button>
      </div>
      <div className={`grid grid-cols-1 ${isMobile ? 'gap-3' : 'md:grid-cols-3 gap-4'}`}>
        <Card>
          <CardHeader className={`${isMobile ? 'pb-2 px-4 pt-3' : 'pb-2'}`}>
            <CardTitle className={`${isMobile ? 'text-sm' : 'text-sm'} font-medium`}>Today's Check-ins</CardTitle>
          </CardHeader>
          <CardContent className={isMobile ? 'px-4 pb-3' : ''}>
            <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-blue-600`}>{todayStats.totalCheckIns}</div>
            <p className="text-xs text-gray-500">Total members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={`${isMobile ? 'pb-2 px-4 pt-3' : 'pb-2'}`}>
            <CardTitle className={`${isMobile ? 'text-sm' : 'text-sm'} font-medium`}>Currently Inside</CardTitle>
          </CardHeader>
          <CardContent className={isMobile ? 'px-4 pb-3' : ''}>
            <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-green-600`}>{todayStats.currentlyInside}</div>
            <p className="text-xs text-gray-500">Active members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={`${isMobile ? 'pb-2 px-4 pt-3' : 'pb-2'}`}>
            <CardTitle className={`${isMobile ? 'text-sm' : 'text-sm'} font-medium`}>Average Session</CardTitle>
          </CardHeader>
          <CardContent className={isMobile ? 'px-4 pb-3' : ''}>
            <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-purple-600`}>
              {todayStats.averageTime ? formatDuration(Math.round(todayStats.averageTime)) : '0h 0m'}
            </div>
            <p className="text-xs text-gray-500">Duration</p>
          </CardContent>
        </Card>
      </div>

      <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'lg:grid-cols-2 gap-6'}`}>
        <Card>
          <CardHeader className={isMobile ? 'px-4 pt-4 pb-3' : ''}>
            <CardTitle className={isMobile ? 'text-base' : ''}>Quick Check-in</CardTitle>
          </CardHeader>
          <CardContent className={`space-y-4 ${isMobile ? 'px-4 pb-4' : ''}`}>
            {/* QR code for public scan link */}
            {gym?.id && (
              <div className="flex flex-col items-center mb-2">
                <QRCodeCanvas value={`${window.location.origin}/scan-attendance?gym_id=${gym.id}`} size={140} />
                <div className="text-xs text-gray-500 mt-1">Scan to check in</div>
              </div>
            )}
            <div className="space-y-3">
              <Button
                onClick={() => setQrScanMode(!qrScanMode)}
                className={`w-full bg-blue-600 hover:bg-blue-700 ${isMobile ? 'h-12' : ''}`}
              >
                <UserCheck className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'} mr-2`} />
                {qrScanMode ? 'Stop QR Scan' : 'Scan QR Code'}
              </Button>

              {qrScanMode && (
                <div className={`p-4 border-2 border-dashed border-blue-300 rounded-lg text-center ${isMobile ? 'py-6' : ''}`}>
                  <div className={`${isMobile ? 'w-20 h-20' : 'w-16 h-16'} mx-auto bg-blue-100 rounded-lg flex items-center justify-center mb-2`}>
                    <UserCheck className={`${isMobile ? 'w-10 h-10' : 'w-8 h-8'} text-blue-600`} />
                  </div>
                  <p className={`${isMobile ? 'text-base' : 'text-sm'} text-gray-600`}>QR Scanner Active</p>
                  <p className="text-xs text-gray-500">Point camera at member's QR code</p>
                </div>
              )}

              <div className="relative">
                <span className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 text-center text-xs text-gray-500 bg-white px-2">
                  OR
                </span>
                <hr className="border-gray-300" />
              </div>

              <div className="space-y-3">
                <Input
                  placeholder="Enter member name"
                  value={manualMemberName}
                  onChange={(e) => setManualMemberName(e.target.value)}
                  className={isMobile ? 'h-12 text-base' : ''}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleManualCheckIn}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    Manual Check-in
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowMembersModal(true)}
                    className="whitespace-nowrap"
                  >
                    Show Members
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={isMobile ? 'px-4 pt-4 pb-3' : ''}>
            <CardTitle className={isMobile ? 'text-base' : ''}>Today's Activity</CardTitle>
          </CardHeader>
          <CardContent className={isMobile ? 'px-4 pb-4' : ''}>
            <div className="relative flex-1 max-w-md mb-4">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
              <Input
                placeholder={isMobile ? "Search members..." : "Search by name, phone, or member ID..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${isMobile ? 'pl-12 h-12 text-base' : 'pl-10'}`}
              />
            </div>

            <div className={`space-y-3 ${isMobile ? 'max-h-64' : 'max-h-80'} overflow-y-auto`}>
              {filteredRecords.map((record) => (
                <div
                  key={record.id}
                  className={`flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 ${isMobile ? 'flex-col gap-3' : ''}`}
                >
                  <div className={`flex items-center space-x-3 ${isMobile ? 'w-full' : ''}`}>
                    <div className={`${isMobile ? 'w-10 h-10' : 'w-8 h-8'} bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full flex items-center justify-center`}>
                      <UserCheck className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'} text-white`} />
                    </div>
                    <div className={isMobile ? 'flex-1' : ''}>
                      <p className={`font-medium ${isMobile ? 'text-base' : ''}`}>{record.memberName}</p>
                      <div className={`flex items-center gap-2 ${isMobile ? 'text-sm' : 'text-xs'} text-gray-600 ${isMobile ? 'flex-wrap' : ''}`}>
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
                  
                  <div className={`flex items-center gap-2 ${isMobile ? 'w-full justify-between' : ''}`}>
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
                          size={isMobile ? "default" : "sm"}
                          variant="outline"
                          onClick={() => handleCheckOut(record.id)}
                          className={isMobile ? 'flex-1' : ''}
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
              <div className={`text-center ${isMobile ? 'py-6' : 'py-8'}`}>
                <Calendar className={`${isMobile ? 'w-16 h-16' : 'w-12 h-12'} mx-auto text-gray-400 mb-2`} />
                <p className={`text-gray-600 ${isMobile ? 'text-base' : ''}`}>No attendance records for today</p>
                <p className="text-sm text-gray-500">Check-ins will appear here when members arrive</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* QR Code for attendance marking */}
      <div className="my-6">
        <Card>
          <CardHeader className={isMobile ? 'px-4 pt-4 pb-3' : ''}>
            <CardTitle className={isMobile ? 'text-base' : ''}>Scan to Mark Attendance</CardTitle>
          </CardHeader>
          <CardContent className={`flex flex-col items-center ${isMobile ? 'px-4 pb-4' : ''}`}>
            {gym?.id ? (
              <>
                <QRCodeCanvas 
                  value={`${window.location.origin}/scan-attendance?gym_id=${gym.id}`} 
                  size={isMobile ? 160 : 200} 
                />
                <div className={`mt-3 text-center break-all ${isMobile ? 'text-xs px-2' : 'text-sm'}`}>
                  {`${window.location.origin}/scan-attendance?gym_id=${gym.id}`}
                </div>
              </>
            ) : (
              <div className="text-red-600">No gym selected. Please log in as a gym owner.</div>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Members Modal for debugging */}
      {showMembersModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: 24, borderRadius: 8, maxHeight: '80vh', overflowY: 'auto', minWidth: 350 }}>
            <h2 style={{ fontWeight: 600, marginBottom: 12 }}>Members List (debug)</h2>
            <table style={{ width: '100%', fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Name</th>
                  <th style={{ textAlign: 'left' }}>ID</th>
                  <th style={{ textAlign: 'left' }}>User ID</th>
                  <th style={{ textAlign: 'left' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {members.map(m => (
                  <tr key={m.id} style={{ background: m.status !== 'active' ? '#ffeaea' : undefined }}>
                    <td>{m.name}</td>
                    <td>{m.id}</td>
                    <td>{m.user_id}</td>
                    <td>{m.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <Button onClick={() => setShowMembersModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendanceTracker;