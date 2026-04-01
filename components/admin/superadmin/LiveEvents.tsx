"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import React, {useState, useEffect} from 'react'
import EditEventDetails from '../EditEventDetails';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, Radio, Trash2 } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LiveEvent } from '@/types/superadmin';
import { EVENTS_DATA } from '@/data/eventsList';
import { cn } from '@/lib/utils';

function LiveEvents({activeTab}:{activeTab:string}) {
    const [liveEventSearchOpen, setLiveEventSearchOpen] = useState(false);
    const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
    const [loadingLiveEvents, setLoadingLiveEvents] = useState(false);
    const [newEventSlug, setNewEventSlug] = useState("");
    const [newEventRound, setNewEventRound] = useState("");
    const [manualEventName, setManualEventName] = useState("");
    const [newEventLocation, setNewEventLocation] = useState("");
    const [editingEventId, setEditingEventId] = useState<string | null>(null);

    useEffect(() => {
        fetchLiveEvents();
    },[])

    async function fetchLiveEvents() {
        setLoadingLiveEvents(true);
        try {
            const res = await fetch("/api/live-events");
            if (res.ok) {
                const data = await res.json();
                setLiveEvents(data);
            }
        } catch (error) {
            console.error("Failed to fetch live events", error);
        } finally {
            setLoadingLiveEvents(false);
        }
    }

async function handleLiveEventSubmit() {
        if (!newEventRound || !newEventLocation) return;

        let eventName = "";
        let eventSlug = newEventSlug;

        if (newEventRound === "Workshop") {
            if (!manualEventName) return;
            eventName = manualEventName;
            // Generate a temporary slug for workshops if not already set (e.g. during edit)
            eventSlug = eventSlug || `workshop-${Date.now()}`;
        } else {
            if (!newEventSlug) return;
            const selectedEvent = EVENTS_DATA.find(e => e.slug === newEventSlug);
            if (!selectedEvent) return;
            eventName = selectedEvent.title;
        }

        if (editingEventId) {
            await updateLiveEvent(eventName, eventSlug);
        } else {
            await addLiveEvent(eventName, eventSlug);
        }
    }

    async function addLiveEvent(eventName: string, eventSlug: string) {
        try {
            const res = await fetch("/api/live-events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    slug: eventSlug,
                    name: eventName,
                    round: newEventRound,
                    location: newEventLocation
                })
            });

            if (res.ok) {
                resetLiveEventForm();
                fetchLiveEvents();
            }
        } catch (error) {
            console.error("Failed to add live event", error);
        }
    }

    async function updateLiveEvent(eventName: string, eventSlug: string) {
        if (!editingEventId) return;
        try {
            const res = await fetch("/api/live-events", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: editingEventId,
                    slug: eventSlug,
                    name: eventName,
                    round: newEventRound,
                    location: newEventLocation
                })
            });

            if (res.ok) {
                resetLiveEventForm();
                fetchLiveEvents();
            }
        } catch (error) {
            console.error("Failed to update live event", error);
        }
    }

    async function deleteLiveEvent(id: string) {
        if (!confirm("Are you sure you want to delete this event?")) return;
        try {
            const res = await fetch(`/api/live-events?id=${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                if (editingEventId === id) resetLiveEventForm();
                fetchLiveEvents();
            }
        } catch (error) {
            console.error("Failed to delete live event", error);
        }
    }

    function startEditing(event: LiveEvent) {
        setEditingEventId(event.id);
        setNewEventSlug(event.slug);
        setNewEventRound(event.round);
        setNewEventLocation(event.location);
        if (event.round === "Workshop") {
            setManualEventName(event.name);
        }
    }

    function resetLiveEventForm() {
        setEditingEventId(null);
        setNewEventSlug("");
        setManualEventName("");
        setNewEventRound("");
        setNewEventLocation("");
    }

  return (
    <TabsContent value="live-events" className="space-y-4">
                            <Card className="border-slate-200 shadow-sm">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Manage Live Events</CardTitle>
                                        <CardDescription>Events added here will be displayed on the homepage ticker.</CardDescription>
                                    </div>
                                    {activeTab === "live-events" && (
                                        <div className="flex items-center gap-2">
                                            <EditEventDetails slug={newEventSlug || liveEvents[0]?.slug} label="Create Event" />
                                            <EditEventDetails slug={newEventSlug || liveEvents[0]?.slug} />
                                        </div>
                                    )}
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end p-4 rounded-lg border border-slate-200">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Select Event</label>
                                            {newEventRound === "Workshop" ? (
                                                <Input
                                                    placeholder="Enter Workshop Name"
                                                    value={manualEventName}
                                                    onChange={(e) => setManualEventName(e.target.value)}
                                                    className="bg-white text-slate-900 border-slate-200 placeholder:text-slate-400"
                                                />
                                            ) : (
                                                <Popover open={liveEventSearchOpen} onOpenChange={setLiveEventSearchOpen}>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            className="w-full justify-between bg-white text-slate-900 border-slate-200 hover:bg-slate-50"
                                                        >
                                                            {newEventSlug
                                                                ? EVENTS_DATA.find((e) => e.slug === newEventSlug)?.title
                                                                : "Choose Event..."}
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-full p-0 bg-zinc-800 border-slate-200">
                                                        <Command className="bg-zinc-800">
                                                            <CommandInput placeholder="Search event..." className="border-none focus:ring-0" />
                                                            <CommandList>
                                                                <CommandEmpty>No event found.</CommandEmpty>
                                                                <CommandGroup className="max-h-60 overflow-y-auto">
                                                                    {EVENTS_DATA.map((e) => {
                                                                        const slug = e.slug;
                                                                        return (
                                                                            <CommandItem
                                                                                key={slug}
                                                                                value={`${e.title} ${slug}`}
                                                                                onSelect={() => {
                                                                                    setNewEventSlug(slug);
                                                                                    setLiveEventSearchOpen(false);
                                                                                }}
                                                                                className="text-white cursor-pointer"
                                                                            >
                                                                                <Check
                                                                                    className={cn(
                                                                                        "mr-2 h-4 w-4",
                                                                                        newEventSlug === slug ? "opacity-100" : "opacity-0"
                                                                                    )}
                                                                                />
                                                                                {e.title}
                                                                            </CommandItem>
                                                                        );
                                                                    })}
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Round</label>
                                            <Select value={newEventRound} onValueChange={setNewEventRound}>
                                                <SelectTrigger className="bg-white text-slate-900 border-slate-200">
                                                    <SelectValue placeholder="Round/Stage" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white border-slate-200 text-slate-900">
                                                    <SelectItem value="Prelims" className="text-slate-900 focus:bg-slate-100 focus:text-slate-900">Prelims</SelectItem>
                                                    <SelectItem value="Finals" className="text-slate-900 focus:bg-slate-100 focus:text-slate-900">Finals</SelectItem>
                                                    <SelectItem value="Workshop" className="text-slate-900 focus:bg-slate-100 focus:text-slate-900">Workshop</SelectItem>
                                                    <SelectItem value="Medal Ceremony" className="text-slate-900 focus:bg-slate-100 focus:text-slate-900">Medal Ceremony</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Location</label>
                                            <Input
                                                placeholder="e.g. Exam Hall"
                                                value={newEventLocation}
                                                onChange={(e) => setNewEventLocation(e.target.value)}
                                                className="bg-white text-slate-900 border-slate-200 placeholder:text-slate-400"
                                            />
                                        </div>
                                        <Button
                                            onClick={handleLiveEventSubmit}
                                            disabled={(!newEventSlug && newEventRound !== "Workshop") || (newEventRound === "Workshop" && !manualEventName) || !newEventRound || !newEventLocation}
                                            className="bg-white hover:bg-yellow text-black min-w-[120px]"
                                        >
                                            <Radio className="mr-2 h-4 w-4" />
                                            {editingEventId ? "Update Event" : "Set Live"}
                                        </Button>
                                        {editingEventId && (
                                            <Button
                                                variant="outline"
                                                onClick={resetLiveEventForm}
                                                className="min-w-[80px] bg-white text-slate-900 border-slate-200 hover:bg-slate-100"
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                    </div>

                                    <div className="rounded-md border border-slate-200 overflow-hidden">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Event Name</TableHead>
                                                    <TableHead>Round</TableHead>
                                                    <TableHead>Location</TableHead>
                                                    <TableHead className="text-right">Action</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {loadingLiveEvents ? (
                                                    <TableRow>
                                                        <TableCell colSpan={4} className="h-24 text-center">Loading...</TableCell>
                                                    </TableRow>
                                                ) : liveEvents.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                                                            No live events currently active.
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    liveEvents.map((event) => (
                                                        <TableRow key={event.id}>
                                                            <TableCell className="font-medium">{event.name}</TableCell>
                                                            <TableCell>{event.round}</TableCell>
                                                            <TableCell>{event.location}</TableCell>
                                                            <TableCell className="text-right flex justify-end gap-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => startEditing(event)}
                                                                    className="h-8 bg-white text-slate-900 border-slate-200 hover:bg-slate-100"
                                                                >
                                                                    Edit
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => deleteLiveEvent(event.id)}
                                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
  )
}

export default LiveEvents