import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DriverDashboard from '@/components/DriverDashboard';
import supabaseBrowserClient from '@/lib/supabase/client';

const DriverDashboardPage = () => {
  const [driverId, setDriverId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabaseBrowserClient.auth.getUser();
      if (user && user.user_metadata.userType === 'driver') {
        setDriverId(user.id);
      } else {
        router.push('/');
      }
    };

    checkAuth();
  }, [router]);

  if (!driverId) {
    return <div>Loading...</div>;
  }

  return <DriverDashboard driverId={driverId} />;
};

export default DriverDashboardPage;
