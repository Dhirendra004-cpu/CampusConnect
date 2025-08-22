import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Newspaper, Calendar, Users } from "lucide-react";
import Link from "next/link";

const stats = [
    { title: "Total Notices", value: "125", icon: Newspaper, color: "text-blue-500" },
    { title: "Total Events", value: "32", icon: Calendar, color: "text-purple-500" },
    { title: "Total Students", value: "4,321", icon: Users, color: "text-green-500" },
];

export default function AdminDashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground">Overview and management of college activities.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat, index) => (
                    <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">Managed within the system</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle>Manage Notices</CardTitle>
                        <CardDescription>Create, update, and publish notices for students and faculty.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4 text-sm text-muted-foreground">Keep everyone informed about academic schedules, examinations, and other important announcements.</p>
                        <Button asChild>
                           <Link href="/admin/notices">
                             <PlusCircle className="mr-2 h-4 w-4"/> Create New Notice
                           </Link>
                        </Button>
                    </CardContent>
                </Card>
                 <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle>Manage Events</CardTitle>
                        <CardDescription>Organize and manage college events like workshops and cultural fests.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4 text-sm text-muted-foreground">Create new events, view registrations, and manage event details to ensure everything runs smoothly.</p>
                         <Button asChild>
                           <Link href="/admin/events">
                             <PlusCircle className="mr-2 h-4 w-4"/> Create New Event
                           </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
