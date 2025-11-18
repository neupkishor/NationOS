'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';

export function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.configure({ showSpinner: false });

    // The route change start event is not needed as nprogress is started on component mount and
    // is stopped when the new page is loaded.
    const handleStop = () => NProgress.done();

    NProgress.start();

    return () => {
      handleStop(); // Ensure progress stops on component unmount
    };
  }, [pathname, searchParams]);

  return null;
}
