
"use client";

import type { Event } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar, MapPin, CheckCircle, Info, Download, UserPlus, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/AuthProvider";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export function EventCard({ event }: { event: Event }) {
    const { user } = useAuth();
    const [isRegistered, setIsRegistered] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (user && event.registeredStudents) {
            setIsRegistered(event.registeredStudents.includes(user.uid));
        }
    }, [user, event.registeredStudents]);

    const handleRegisterToggle = async () => {
        if (!user) {
            toast({ variant: "destructive", title: "You must be logged in to register."});
            return;
        }
        setIsLoading(true);

        try {
            const eventRef = doc(db, "events", event.id);
            if (isRegistered) {
                await updateDoc(eventRef, {
                    registeredStudents: arrayRemove(user.uid)
                });
                toast({ title: "Successfully Unregistered", description: `You are no longer registered for ${event.name}.` });
            } else {
                 await updateDoc(eventRef, {
                    registeredStudents: arrayUnion(user.uid)
                });
                toast({ title: "Registration Successful!", description: `You are now registered for ${event.name}.` });
            }
            setIsRegistered(!isRegistered);
            // This is a cheap way to refresh the parent component's data. A more robust solution might use a state manager.
            window.dispatchEvent(new Event('refetchEvents'));
        } catch (error) {
            console.error("Registration failed:", error);
            toast({ variant: "destructive", title: "Registration Failed", description: "Could not update your registration." });
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <div className="flex items-start justify-between gap-4 pt-4">
       <div className="space-y-1">
            <h3 className="font-semibold">{event.name}</h3>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-2">
                <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {format(event.date, "PPP")}</div>
                <span className="hidden sm:inline">•</span>
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:underline">
                    <MapPin className="h-3.5 w-3.5" /> {event.venue}
                </a>
            </div>
       </div>

        <div className="flex gap-2">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="secondary" size="sm">
                        <Info className="mr-2 h-4 w-4" /> Info
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-2xl">{event.name}</DialogTitle>
                        <DialogDescription>
                            Organized by {event.organizer}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                       <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{format(event.date, "eeee, MMMM d, yyyy 'at' p")}</span>
                       </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue)}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                {event.venue}
                            </a>
                        </div>
                        <p className="text-sm text-foreground">{event.description}</p>
                         {event.fileUrl && (
                            <Button asChild variant="outline">
                                <a href={event.fileUrl} target="_blank" rel="noopener noreferrer">
                                    <Download className="mr-2 h-4 w-4" /> Download Attachment
                                </a>
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
            <Button onClick={handleRegisterToggle} disabled={isLoading} size="sm" variant={isRegistered ? "outline" : "default"}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isRegistered ? <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> : <UserPlus className="mr-2 h-4 w-4" />}
                {isRegistered ? 'Registered' : 'Register'}
            </Button>
        </div>

    </div>
  );
}
