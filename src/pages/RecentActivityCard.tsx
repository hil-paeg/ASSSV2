'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import EscalationPyramid from '@/components/escalation/EscalationPyramid';


interface Admin {
  admin_id: number;
  name: string;
  designation: string;
  email?: string;
  mobile_number?: string;
}

export default function RecentActivityCard() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPyramid = async () => {
      if (!user?.clientId) {
        setError('No client ID found for user.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`/api/clients/${user.clientId}/escalation-pyramid`);

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const data = await res.json();
        setAdmins(data); 
      } catch (err: any) {
        console.error('Error fetching escalation pyramid:', err);
        setError(err.message || 'Failed to load pyramid');
      } finally {
        setLoading(false);
      }
    };

    fetchPyramid();
  }, [user?.clientId]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Escalation Pyramid</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : admins.length === 0 ? (
          <p className="text-gray-500">No escalation pyramid found for this client.</p>
        ) : (
          <EscalationPyramid admins={admins} />
        )}
      </CardContent>
    </Card>
  );
}

