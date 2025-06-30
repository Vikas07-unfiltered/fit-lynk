import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// TODO: Replace with your actual Supabase URL and anon key
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL || '',
  process.env.REACT_APP_SUPABASE_ANON_KEY || ''
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
      setError('Failed to record attendance. Please try again.');
    } else {
      setSuccess('Attendance recorded successfully!');
      setMemberId('');
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Mark Your Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="memberId" className="block mb-2 font-medium">Member ID</label>
              <Input
                id="memberId"
                type="text"
                value={memberId}
                onChange={e => setMemberId(e.target.value)}
                placeholder="Enter your Member ID"
                required
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Attendance'}
            </Button>
            {success && <div className="text-green-600 mt-2">{success}</div>}
            {error && <div className="text-red-600 mt-2">{error}</div>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScanAttendance;
