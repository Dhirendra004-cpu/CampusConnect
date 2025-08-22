
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { db, storage } from "@/lib/firebase/config";
import type { Notice, NoticeCategory } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  PlusCircle,
  Loader2,
  FileEdit,
  Trash2,
  File,
  Badge,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";

const noticeSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  description: z.string().min(10, "Description is required."),
  category: z.enum(["Academic", "Exam", "Cultural", "Sports"]),
  file: z.instanceof(File).optional(),
});

type NoticeFormValues = z.infer<typeof noticeSchema>;

const categories: NoticeCategory[] = ["Academic", "Exam", "Cultural", "Sports"];

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const { toast } = useToast();

  const form = useForm<NoticeFormValues>({
    resolver: zodResolver(noticeSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "Academic",
    },
  });

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "notices"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const noticeData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as Notice[];
      setNotices(noticeData);
    } catch (error) {
      console.error("Error fetching notices: ", error);
      toast({ variant: "destructive", title: "Failed to fetch notices" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice);
    form.reset({
        title: notice.title,
        description: notice.description,
        category: notice.category,
        file: undefined
    });
    setDialogOpen(true);
  };
  
  const handleDelete = async (noticeId: string) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;
    try {
        await deleteDoc(doc(db, "notices", noticeId));
        toast({ title: "Notice deleted successfully!" });
        fetchNotices(); // Refresh list
    } catch (error) {
        console.error("Error deleting notice: ", error);
        toast({ variant: "destructive", title: "Failed to delete notice." });
    }
  };

  const onSubmit = async (values: NoticeFormValues) => {
    try {
      let fileUrl = editingNotice?.fileUrl || "";
      if (values.file) {
        const fileRef = ref(storage, `notices/${Date.now()}_${values.file.name}`);
        const snapshot = await uploadBytes(fileRef, values.file);
        fileUrl = await getDownloadURL(snapshot.ref);
      }

      const noticeData = {
        ...values,
        fileUrl,
        createdAt: editingNotice ? Timestamp.fromDate(editingNotice.createdAt) : Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      
      delete (noticeData as any).file;


      if (editingNotice) {
        // Update existing notice
        const noticeRef = doc(db, "notices", editingNotice.id);
        await updateDoc(noticeRef, noticeData);
        toast({ title: "Notice updated successfully!" });
      } else {
        // Add new notice
        await addDoc(collection(db, "notices"), noticeData);
        toast({ title: "Notice created successfully!" });
      }
      
      form.reset();
      setEditingNotice(null);
      setDialogOpen(false);
      fetchNotices();
    } catch (error) {
      console.error("Error saving notice:", error);
      toast({
        variant: "destructive",
        title: "Operation Failed",
        description: "Could not save the notice. Please try again.",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Notices</h1>
          <p className="text-muted-foreground">
            Create, edit, and delete notices for the campus.
          </p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(isOpen) => {
            setDialogOpen(isOpen);
            if (!isOpen) {
              form.reset();
              setEditingNotice(null);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2" />
              Create Notice
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingNotice ? "Edit Notice" : "Create New Notice"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Exam Schedule" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Detailed information..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="file"
                  render={({ field: { onChange, value, ...rest }}) => (
                    <FormItem>
                      <FormLabel>Attachment (Optional)</FormLabel>
                      <FormControl>
                        <Input type="file" onChange={(e) => onChange(e.target.files?.[0])} {...rest} />
                      </FormControl>
                      <FormDescription>
                        {editingNotice?.fileUrl && !value && "A file is already attached. Uploading a new one will replace it."}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 animate-spin" />}
                    {editingNotice ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Existing Notices</CardTitle>
          <CardDescription>A list of all published notices.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Attachment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notices.map((notice) => (
                  <TableRow key={notice.id}>
                    <TableCell className="font-medium">{notice.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{notice.category}</Badge>
                    </TableCell>
                    <TableCell>{format(notice.createdAt, "PPP")}</TableCell>
                    <TableCell>
                      {notice.fileUrl ? (
                        <a href={notice.fileUrl} target="_blank" rel="noopener noreferrer">
                            <File className="h-5 w-5 text-blue-500" />
                        </a>
                      ) : (
                        "None"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(notice)}>
                        <FileEdit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(notice.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {!loading && notices.length === 0 && <p className="text-center text-muted-foreground py-8">No notices found.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
