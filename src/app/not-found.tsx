import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center p-4">
      <div className="flex flex-col items-center justify-center max-w-md">
        <AlertTriangle className="w-20 h-20 text-destructive mb-6" />
        <h1 className="text-5xl font-bold tracking-tight">404 - Not Found</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
