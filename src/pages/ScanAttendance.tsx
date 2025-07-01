
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

// TODO: Replace with your actual Supabase anon key below
const supabase = createClient(
  'https://ahuwcoocemayyphdrmjz.supabase.co',
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodXdjb29jZW1heXlwaGRybWp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MDQ4NzIsImV4cCI6MjA2NjI4MDg3Mn0.vE-fSJMD91TZicpK6eLyHZi7tprfh4hVi_wjRolj_2w"
);

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ScanAttendance: React.FC = () => {
  const query = useQuery();
  const gymId = query.get('gym_id') || '';
  const [memberId, setMemberId] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const isMobile = useIsMobile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    if (!gymId || !memberId) {
      setError('Please provide both Gym ID and Member ID.');
      setLoading(false);
      return;
    }
    // Insert attendance record
    const { error: insertError } = await supabase.from('attendance').insert([
      {
        gym_id: gymId,
        member_id: memberId,
        method: 'qr_scan',
        timestamp: new Date().toISOString(),
      },
    ]);
    if (insertError) {
      setError('Failed to record attendance: ' + insertError.message);
    } else {
      setSuccess('Attendance recorded successfully!');
      setMemberId('');
    }
    setLoading(false);
  };

  return (
    <div className={`flex justify-center items-center min-h-screen bg-gray-50 ${isMobile ? 'px-4' : ''}`}>
      <Card className={`w-full ${isMobile ? 'max-w-sm' : 'max-w-md'}`}>
        <CardHeader className={isMobile ? 'pb-4' : ''}>
          <CardTitle className={`${isMobile ? 'text-lg text-center' : ''}`}>
            Mark Your Attendance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="memberId" className={`block mb-2 font-medium ${isMobile ? 'text-sm' : ''}`}>
                Member ID
              </label>
              <Input
                id="memberId"
                type="text"
                value={memberId}
                onChange={e => setMemberId(e.target.value)}
                placeholder="Enter your Member ID"
                required
                className={isMobile ? 'h-12 text-base' : ''}
              />
            </div>
            <Button 
              type="submit" 
              disabled={loading}
              className={`${isMobile ? 'h-12 text-base' : ''}`}
            >
              {loading ? 'Submitting...' : 'Submit Attendance'}
            </Button>
            {success && (
              <div className={`text-green-600 mt-2 ${isMobile ? 'text-sm' : ''}`}>
                {success}
              </div>
            )}
            {error && (
              <div className={`text-red-600 mt-2 ${isMobile ? 'text-sm' : ''}`}>
                {error}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScanAttendance;
