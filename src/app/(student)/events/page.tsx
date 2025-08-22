
"use client";

import { EventCard } from "@/components/student/EventCard";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/firebase/config";
import type { Event } from "@/lib/types";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { Loader2, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const eventsRef = collection(db, "events");
                const q = query(eventsRef, orderBy("date", "asc"));
                const querySnapshot = await getDocs(q);
                const eventData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), date: doc.data().date.toDate() })) as Event[];
                setEvents(eventData);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Upcoming Events</h1>
                <p className="text-muted-foreground">Explore and register for events happening on campus.</p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            ) : (
                <Card className="shadow-md">
                    <CardContent className="pt-6">
                        {events.length > 0 ? (
                            <div className="space-y-6">
                                {events.map((event) => (
                                    <EventCard key={event.id} event={event} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">No Events Found</h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    There are no upcoming events scheduled at the moment.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
