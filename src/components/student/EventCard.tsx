"use client";

import type { Event } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar, MapPin, CheckCircle, Info } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"

export function EventCard({ event }: { event: Event }) {
    const [isRegistered, setIsRegistered] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleRegister = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsRegistered(true);
        toast({
            title: "Registration Successful!",
            description: `You are now registered for ${event.name}.`,
        });
        setIsLoading(false);
    }

  return (
    <div className="flex items-start justify-between gap-4 pt-4">
       <div className="space-y-1">
            <h3 className="font-semibold">{event.name}</h3>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-2">
                <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {format(event.date, "PPP")}</div>
                <span className="hidden sm:inline">•</span>
                <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {event.venue}</div>
            </div>
       </div>

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
                        <span>{event.venue}</span>
                    </div>
                    <p className="text-sm text-foreground">{event.description}</p>
                </div>
                <DialogFooter>
                    {isRegistered ? (
                        <Button disabled variant="outline">
                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                            Registered
                        </Button>
                    ) : (
                        <Button onClick={handleRegister} disabled={isLoading}>
                            {isLoading ? 'Registering...' : 'Register Now'}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>

    </div>
  );
}
