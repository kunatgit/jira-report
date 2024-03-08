import { useEffect } from 'react';
import { useRouter } from 'next/router';

const NotFoundPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to root path
    router.replace('/');
  }, []);

  return (
    <div>
      <p>Redirecting...</p>
    </div>
  );
};

export default NotFoundPage;
