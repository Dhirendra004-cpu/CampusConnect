"use client";

import type { Notice } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Eye, Download, Tag } from "lucide-react";

const categoryColors: { [key: string]: string } = {
  Academic: "bg-blue-100 text-blue-800",
  Exam: "bg-red-100 text-red-800",
  Cultural: "bg-purple-100 text-purple-800",
  Sports: "bg-green-100 text-green-800",
};

export function NoticeCard({ notice }: { notice: Notice }) {
  return (
    <div className="flex items-start justify-between gap-4 pt-4">
      <div className="space-y-1">
        <h3 className="font-semibold">{notice.title}</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Tag className="h-3.5 w-3.5" />
            <Badge variant="outline" className={`${categoryColors[notice.category] || ''} border-none`}>{notice.category}</Badge>
            <span>•</span>
            <span>{format(notice.createdAt, "MMM d, yyyy")}</span>
        </div>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <Eye className="mr-2 h-4 w-4" /> View
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">{notice.title}</DialogTitle>
            <DialogDescription>
                <Badge variant="outline" className={`${categoryColors[notice.category] || ''} border-none`}>{notice.category}</Badge>
                <span className="mx-2 text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                    Posted on {format(notice.createdAt, "PPP")}
                </span>
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-sm text-foreground">
            {notice.description}
          </div>
          {notice.fileUrl && (
            <div className="mt-4">
                <Button asChild>
                    <a href={notice.fileUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" /> Download Attachment
                    </a>
                </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
