import { LoginForm } from '@/components/auth/LoginForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <>
      <div className="mb-8 flex items-center gap-3 text-primary">
          <Building2 className="h-10 w-10" />
          <h1 className="text-4xl font-bold font-headline">CampusConnect</h1>
      </div>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome Back!</CardTitle>
          <CardDescription>Sign in to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Don't have a student account?{' '}
        <Link href="/signup" className="font-semibold text-primary underline-offset-4 hover:underline">
          Sign up
        </Link>
      </p>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Need an admin account?{' '}
        <Link href="/signup/admin" className="font-semibold text-primary underline-offset-4 hover:underline">
          Register here
        </Link>
      </p>
    </>
  );
}
