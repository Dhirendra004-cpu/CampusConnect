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
import type { Event, Notice } from "@/lib/types";
import { Calendar, Newspaper } from "lucide-react";

// Mock data - in a real app, this would come from Firestore
const mockNotices: Notice[] = [
    { id: '1', title: 'Mid-term Exam Schedule', category: 'Exam', createdAt: new Date('2024-10-15'), description: 'The schedule for the upcoming mid-term examinations has been published.' },
    { id: '2', title: 'Annual Sports Day "Momentum"', category: 'Sports', createdAt: new Date('2024-10-12'), description: 'Get ready for the annual sports day! Registrations are now open.' },
    { id: '3', title: 'Library Closure for Maintenance', category: 'Academic', createdAt: new Date('2024-10-10'), description: 'The central library will be closed for maintenance from Oct 18 to Oct 20.' },
];

const mockEvents: Event[] = [
    { id: '1', name: 'Tech Symposium 2024', date: new Date('2024-11-05'), venue: 'Main Auditorium', organizer: 'Computer Science Dept.', description: 'A symposium on emerging technologies.' },
    { id: '2', name: 'Inter-College Debate Competition', date: new Date('2024-11-12'), venue: 'Seminar Hall B', organizer: 'Literary Club', description: 'Showcase your oratory skills.' },
    { id: '3', name: 'Startup Pitch Challenge', date: new Date('2024-11-20'), venue: 'Innovation Hub', organizer: 'Entrepreneurship Cell', description: 'Pitch your startup idea to win seed funding.' },
];

export default function StudentDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, Student!</h1>
        <p className="text-muted-foreground">Here's a quick look at what's happening on campus.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card className="shadow-md">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Newspaper className="h-6 w-6" />
                    </div>
                    <div>
                        <CardTitle>Latest Notices</CardTitle>
                        <CardDescription>Stay informed with the latest updates.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {mockNotices.map((notice, index) => (
                    <div key={notice.id}>
                        <NoticeCard notice={notice} />
                        {index < mockNotices.length - 1 && <Separator className="mt-4" />}
                    </div>
                ))}
            </CardContent>
        </Card>
        
        <Card className="shadow-md">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                        <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                        <CardTitle>Upcoming Events</CardTitle>
                        <CardDescription>Don't miss out on these events.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {mockEvents.map((event, index) => (
                     <div key={event.id}>
                        <EventCard event={event} />
                        {index < mockEvents.length - 1 && <Separator className="mt-4" />}
                    </div>
                ))}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
