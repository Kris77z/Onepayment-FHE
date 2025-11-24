'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-4 text-muted-foreground">页面未找到</p>
      <Link href="/">
        <Button className="mt-8">返回首页</Button>
      </Link>
    </div>
  );
}

