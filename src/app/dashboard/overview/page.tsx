'use client';

import { getSession, useSession } from 'next-auth/react';
import { useEffect } from 'react';

const OverViewPage = () => {
  // throw new Error('Lỗi trong Page!'); // Giả lập lỗi xảy ra
  const { data: sessionData } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      const session = await getSession();
      console.log({ session });
      console.log({ sessionData });
    };
    fetchData();
  }, []);

  return <div>This is content of page file overview page</div>;
};

export default OverViewPage;
