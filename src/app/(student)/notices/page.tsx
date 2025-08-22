
"use client";

import { NoticeCard } from "@/components/student/NoticeCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db } from "@/lib/firebase/config";
import type { Notice, NoticeCategory } from "@/lib/types";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { Loader2, Newspaper, Filter } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

const categories: NoticeCategory[] = ["Academic", "Exam", "Cultural", "Sports"];

export default function NoticesPage() {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<NoticeCategory | "all">("all");

    useEffect(() => {
        const fetchNotices = async () => {
            setLoading(true);
            try {
                const noticesRef = collection(db, "notices");
                const q = selectedCategory === "all"
                    ? query(noticesRef, orderBy("createdAt", "desc"))
                    : query(noticesRef, where("category", "==", selectedCategory), orderBy("createdAt", "desc"));

                const querySnapshot = await getDocs(q);
                const noticeData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt.toDate() })) as Notice[];
                setNotices(noticeData);
            } catch (error) {
                console.error("Error fetching notices:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotices();
    }, [selectedCategory]);

    return (
        <div className="space-y-8">
             <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Notices</h1>
                    <p className="text-muted-foreground">All announcements and updates.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {loading ? (
                 <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                 </div>
            ) : (
                <Card className="shadow-md">
                    <CardContent className="pt-6">
                        {notices.length > 0 ? (
                            <div className="space-y-6">
                                {notices.map((notice) => (
                                    <NoticeCard key={notice.id} notice={notice} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Newspaper className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">No Notices Found</h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    There are no notices in the selected category.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
