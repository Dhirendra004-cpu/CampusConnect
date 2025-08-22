
"use client";

import { EventCard } from "@/components/student/EventCard";
import { NoticeCard } from "@/components/student/NoticeCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/firebase/config";
import type { Event, Notice } from "@/lib/types";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { Calendar, Loader2, Newspaper } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function StudentDashboard() {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch recent notices
                const noticesQuery = query(collection(db, "notices"), orderBy("createdAt", "desc"), limit(3));
                const noticeSnapshot = await getDocs(noticesQuery);
                const noticeData = noticeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt.toDate() })) as Notice[];
                setNotices(noticeData);

                // Fetch upcoming events
                const eventsQuery = query(collection(db, "events"), orderBy("date", "asc"), limit(3));
                const eventSnapshot = await getDocs(eventsQuery);
                const eventData = eventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), date: doc.data().date.toDate() })) as Event[];
                setEvents(eventData);

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, Student!</h1>
        <p className="text-muted-foreground">Here's a quick look at what's happening on campus.</p>
      </div>

      {loading ? (
         <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
         </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Card className="shadow-md">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Newspaper className="h-6 w-6" />
                            </div>
                            <div>
                                <CardTitle>Latest Notices</CardTitle>
                                <CardDescription>Stay informed with the latest updates.</CardDescription>
                            </div>
                        </div>
                         <Button asChild variant="link">
                            <Link href="/notices">View All</Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {notices.length > 0 ? notices.map((notice, index) => (
                        <div key={notice.id}>
                            <NoticeCard notice={notice} />
                            {index < notices.length - 1 && <Separator className="mt-4" />}
                        </div>
                    )) : <p className="text-sm text-muted-foreground">No new notices right now.</p>}
                </CardContent>
            </Card>
            
            <Card className="shadow-md">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                                <Calendar className="h-6 w-6" />
                            </div>
                            <div>
                                <CardTitle>Upcoming Events</CardTitle>
                                <CardDescription>Don't miss out on these events.</CardDescription>
                            </div>
                        </div>
                        <Button asChild variant="link">
                            <Link href="/events">View All</Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {events.length > 0 ? events.map((event, index) => (
                         <div key={event.id}>
                            <EventCard event={event} />
                            {index < events.length - 1 && <Separator className="mt-4" />}
                        </div>
                    )) : <p className="text-sm text-muted-foreground">No upcoming events scheduled.</p>}
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
