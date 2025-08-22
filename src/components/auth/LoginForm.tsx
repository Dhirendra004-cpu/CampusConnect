
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { auth, db } from '@/lib/firebase/config';
import type { UserRole } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [role, setRole] = useState<UserRole>('student');
  const [isResetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      toast({
        variant: "destructive",
        title: 'Email Required',
        description: 'Please enter your email address to reset your password.',
      });
      return;
    }
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast({
        title: 'Password Reset Email Sent',
        description: 'Please check your inbox for instructions to reset your password.',
      });
      setResetDialogOpen(false);
    } catch (error: any) {
      console.error("Password Reset Error:", error);
      toast({
        variant: "destructive",
        title: 'Password Reset Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setResetLoading(false);
    }
  };


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists() || userDoc.data().role !== role) {
        await auth.signOut();
        throw new Error(`You are not registered as a ${role}.`);
      }

      toast({
        title: "Success!",
        description: "Logged in successfully. Redirecting...",
      });

      if (role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }

    } catch (error: any) {
      console.error("Login Error:", error);
      toast({
        variant: "destructive",
        title: 'Login Failed',
        description: error.message || 'An unexpected error occurred.',
      });
      setLoading(false);
    }
  }

  const renderForm = () => (
     <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder={`${role}@example.edu`} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                     <Dialog open={isResetDialogOpen} onOpenChange={setResetDialogOpen}>
                        <DialogTrigger asChild>
                            <Button type="button" variant="link" className="p-0 h-auto text-xs" onClick={() => setResetEmail(form.getValues('email'))}>
                                Forgot Password?
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Reset Password</DialogTitle>
                                <DialogDescription>
                                    Enter your email address below and we'll send you a link to reset your password.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-2 py-4">
                                <Label htmlFor="reset-email">Email</Label>
                                <Input 
                                    id="reset-email" 
                                    type="email"
                                    placeholder="your.email@example.com"
                                    value={resetEmail} 
                                    onChange={(e) => setResetEmail(e.target.value)} 
                                />
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">Cancel</Button>
                                </DialogClose>
                                <Button type="button" onClick={handlePasswordReset} disabled={resetLoading}>
                                    {resetLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Send Reset Link
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Login as {role.charAt(0).toUpperCase() + role.slice(1)}
          </Button>
        </form>
      </Form>
  );

  return (
    <Tabs value={role} onValueChange={(value) => { setRole(value as UserRole); form.reset(); }} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="student">Student</TabsTrigger>
        <TabsTrigger value="admin">Admin</TabsTrigger>
      </TabsList>
      <TabsContent value="student">
        {renderForm()}
      </TabsContent>
      <TabsContent value="admin">
        {renderForm()}
      </TabsContent>
    </Tabs>
  );
}
