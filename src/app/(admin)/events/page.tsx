
"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { db, storage } from "@/lib/firebase/config";
import type { Event } from "@/lib/types";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { collection, addDoc, getDocs, orderBy, query, Timestamp, deleteDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { format } from "date-fns";
import { PlusCircle, Loader2, FileEdit, Trash2, CalendarIcon, Users, Download, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const eventSchema = z.object({
  name: z.string().min(5, "Event name must be at least 5 characters."),
  description: z.string().min(10, "Description is required."),
  venue: z.string().min(3, "Venue is required."),
  organizer: z.string().min(3, "Organizer is required."),
  date: z.date({ required_error: "A date for the event is required." }),
  file: z.instanceof(File).optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null);
  const [isViewOpen, setViewOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: { name: "", description: "", venue: "", organizer: "" },
  });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "events"), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      const eventData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
      })) as Event[];
      setEvents(eventData);
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to fetch events" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    form.reset({
      ...event,
      file: undefined,
    });
    setFormOpen(true);
  };

  const handleDelete = async (eventId: string) => {
      try {
          await deleteDoc(doc(db, "events", eventId));
          toast({ title: "Event deleted successfully!" });
          fetchEvents();
      } catch (error) {
          toast({ variant: "destructive", title: "Failed to delete event." });
      }
  };

  const handleViewParticipants = (event: Event) => {
    setViewingEvent(event);
    setViewOpen(true);
  };
  
  const onSubmit = async (values: EventFormValues) => {
    try {
      let fileUrl = editingEvent?.fileUrl || "";
      if (values.file) {
        const fileRef = ref(storage, `events/${Date.now()}_${values.file.name}`);
        const snapshot = await uploadBytes(fileRef, values.file);
        fileUrl = await getDownloadURL(snapshot.ref);
      }

      const eventData = {
        ...values,
        fileUrl,
        date: Timestamp.fromDate(values.date),
        updatedAt: Timestamp.now(),
      };
      
      delete (eventData as any).file;

      if (editingEvent) {
        const eventRef = doc(db, "events", editingEvent.id);
        await updateDoc(eventRef, eventData);
        toast({ title: "Event updated successfully!" });
      } else {
        await addDoc(collection(db, "events"), { ...eventData, createdAt: Timestamp.now(), registeredStudents: [] });
        toast({ title: "Event created successfully!" });
      }
      
      form.reset();
      setEditingEvent(null);
      setFormOpen(false);
      fetchEvents();
    } catch (error) {
      toast({ variant: "destructive", title: "Operation Failed" });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Events</h1>
          <p className="text-muted-foreground">
            Create, organize, and track college events.
          </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingEvent(null); form.reset({ name: "", description: "", venue: "", organizer: "" }); }}>
                <PlusCircle className="mr-2" />Create Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingEvent ? "Edit Event" : "Create New Event"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="description" render={({ field }) => ( <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="venue" render={({ field }) => ( <FormItem><FormLabel>Venue</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="organizer" render={({ field }) => ( <FormItem><FormLabel>Organizer</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="date" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Date</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="file" render={({ field: { onChange, value, ...rest }}) => (
                    <FormItem><FormLabel>Attachment (Optional)</FormLabel>
                        <FormControl><Input type="file" onChange={(e) => onChange(e.target.files?.[0])} {...rest} /></FormControl>
                        <FormDescription>{editingEvent?.fileUrl && !value && "A file is already attached. Uploading a new one will replace it."}</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}/>
                <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="secondary" onClick={() => setFormOpen(false)}>Cancel</Button></DialogClose>
                    <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting && <Loader2 className="mr-2 animate-spin" />}{editingEvent ? "Update" : "Create"}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader><CardTitle>Existing Events</CardTitle><CardDescription>A list of all scheduled events.</CardDescription></CardHeader>
        <CardContent>
          {loading ? <div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div> : (
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Date</TableHead><TableHead>Venue</TableHead><TableHead>Participants</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.name}</TableCell>
                    <TableCell>{format(event.date, "PPP")}</TableCell>
                    <TableCell>{event.venue}</TableCell>
                    <TableCell>{event.registeredStudents?.length || 0}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleViewParticipants(event)}><Users className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(event)}><FileEdit className="h-4 w-4" /></Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete the event.</AlertDialogDescription></AlertDialogHeader>
                                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(event.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {!loading && events.length === 0 && <p className="text-center text-muted-foreground py-8">No events found.</p>}
        </CardContent>
      </Card>
        
        {viewingEvent && (
             <Dialog open={isViewOpen} onOpenChange={setViewOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Participants for {viewingEvent.name}</DialogTitle>
                        <DialogDescription>
                            {viewingEvent.registeredStudents?.length || 0} student(s) registered.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-80 overflow-y-auto">
                       {viewingEvent.registeredStudents && viewingEvent.registeredStudents.length > 0 ? (
                            <ul className="space-y-2 py-4">
                                {viewingEvent.registeredStudents.map((studentId, index) => (
                                    <li key={index} className="text-sm p-2 bg-muted rounded-md">{studentId}</li>
                                ))}
                            </ul>
                       ) : <p className="py-4 text-sm text-muted-foreground">No students have registered yet.</p>}
                    </div>
                </DialogContent>
            </Dialog>
        )}
    </div>
  );
}
