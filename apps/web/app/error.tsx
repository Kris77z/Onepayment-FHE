'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">500</h1>
      <p className="mt-4 text-muted-foreground">发生了错误</p>
      <div className="mt-8 flex gap-4">
        <Button onClick={reset}>重试</Button>
        <Button variant="outline" onClick={() => window.location.href = '/'}>
          返回首页
        </Button>
      </div>
    </div>
  );
}

