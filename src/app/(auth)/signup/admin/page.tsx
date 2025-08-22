import { AdminSignupForm } from '@/components/auth/AdminSignupForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminSignupPage() {
  return (
    <>
      <div className="mb-8 flex items-center gap-3 text-primary">
          <Building2 className="h-10 w-10" />
          <h1 className="text-4xl font-bold font-headline">CampusConnect</h1>
      </div>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Create an Admin Account</CardTitle>
          <CardDescription>Register a new administrator for the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminSignupForm />
        </CardContent>
      </Card>
       <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
}
