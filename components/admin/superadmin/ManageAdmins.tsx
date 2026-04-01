"use client";
import React, { useEffect, useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Check,
    ChevronsUpDown,
    Search,
    ShieldCheck,
    Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EventDB, UserSearch } from "@/types/superadmin";

function ManageAdmins() {
    const [eventAdmins, setEventAdmins] = useState<UserSearch[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<string>("");
    const [eventSearchOpen, setEventSearchOpen] = useState(false);
    const [loadingAdmins, setLoadingAdmins] = useState(false);
    const [userSearchQuery, setUserSearchQuery] = useState("");
    const [searchedUsers, setSearchedUsers] = useState<UserSearch[]>([]);
    const [searchingUsers, setSearchingUsers] = useState(false);
    const [dbEvents, setDbEvents] = useState<EventDB[]>([]);

    useEffect(() => {
        if (selectedEventId) {
            fetchEventAdmins(selectedEventId);
        } else {
            setEventAdmins([]);
        }
    }, [selectedEventId]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (userSearchQuery.length >= 5) {
                searchUsers(userSearchQuery);
            } else {
                setSearchedUsers([]);
            }
        }, 800);

        return () => clearTimeout(delayDebounceFn);
    }, [userSearchQuery]);

    useEffect(() => {
        fetchDbEvents();
    }, []);

    async function fetchDbEvents() {
        try {
            const res = await fetch("/api/superadmin/admins?action=getEvents");
            if (res.ok) {
                const data = await res.json();
                setDbEvents(data);
            }
        } catch (error) {
            console.error("Failed to fetch db events", error);
        }
    }

    async function searchUsers(query: string) {
        setSearchingUsers(true);
        try {
            const encodedQuery = encodeURIComponent(query);
            const res = await fetch(`/api/superadmin/admins?action=searchUsers&query=${encodedQuery}`);
            if (res.ok) {
                const data = await res.json();
                setSearchedUsers(data);
            }
        } catch (error) {
            console.error("Failed to search users", error);
        } finally {
            setSearchingUsers(false);
        }
    }

    async function fetchEventAdmins(eventId: string) {
        setLoadingAdmins(true);
        try {
            const res = await fetch(
                `/api/superadmin/admins?action=getAdmins&eventId=${eventId}`,
            );
            if (res.ok) {
                const data = await res.json();
                setEventAdmins(data);
            }
        } catch (error) {
            console.error("Failed to fetch event admins", error);
        } finally {
            setLoadingAdmins(false);
        }
    }

    async function handleAddAdmin(targetUserId: string) {
        if (!selectedEventId) return;
        try {
            const res = await fetch("/api/superadmin/admins", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    eventId: selectedEventId,
                    userId: targetUserId,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                fetchEventAdmins(selectedEventId);
                setSearchedUsers([]);
                setUserSearchQuery("");
                alert("Admin added successfully");
            } else {
                alert(data.error || "Failed to add admin");
            }
        } catch (error) {
            console.error("Failed to add admin", error);
        }
    }

    async function handleRemoveAdmin(targetUserId: string) {
        if (!selectedEventId) return;
        if (!confirm("Are you sure you want to remove this admin?")) return;
        try {
            const res = await fetch(
                `/api/superadmin/admins?eventId=${selectedEventId}&userId=${targetUserId}`,
                {
                    method: "DELETE",
                },
            );

            if (res.ok) {
                fetchEventAdmins(selectedEventId);
                alert("Admin removed successfully");
            } else {
                const data = await res.json();
                alert(data.error || "Failed to remove admin");
            }
        } catch (error) {
            console.error("Failed to remove admin", error);
        }
    }
    return (
        <TabsContent value="manage-admins" className="space-y-4">
            <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle>Manage Event Admins</CardTitle>
                    <CardDescription>
                        Assign or remove admins for specific events. Max 3
                        admins per event.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Side: Select Event and Search User */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Select Event
                                </label>
                                <Popover
                                    open={eventSearchOpen}
                                    onOpenChange={setEventSearchOpen}
                                >
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={eventSearchOpen}
                                            className="w-full justify-between bg-white text-slate-900 border-slate-200 hover:bg-slate-50"
                                        >
                                            {selectedEventId
                                                ? dbEvents.find(
                                                      (event) =>
                                                          event.id ===
                                                          selectedEventId,
                                                  )?.name
                                                : "Select event..."}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0 border-slate-200">
                                        <Command className="bg-slate-900">
                                            <CommandInput
                                                placeholder="Search event..."
                                                className="border-none focus:ring-0"
                                            />
                                            <CommandList>
                                                <CommandEmpty>
                                                    No event found.
                                                </CommandEmpty>
                                                <CommandGroup>
                                                    {dbEvents.map((event) => (
                                                        <CommandItem
                                                            key={event.id}
                                                            value={`${event.name} ${event.slug}`}
                                                            onSelect={() => {
                                                                setSelectedEventId(
                                                                    event.id,
                                                                );
                                                                setEventSearchOpen(
                                                                    false,
                                                                );
                                                            }}
                                                            className="text-slate-100 hover:bg-slate-100 cursor-pointer"
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    selectedEventId ===
                                                                        event.id
                                                                        ? "opacity-100"
                                                                        : "opacity-0",
                                                                )}
                                                            />
                                                            {event.name}
                                                            <span className="ml-2 text-xs text-slate-400">
                                                                ({event.slug})
                                                            </span>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {selectedEventId && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Search User (by email)
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                        <Input
                                            placeholder="Type at least 3 characters..."
                                            className="pl-9 bg-white text-slate-900 border-slate-200"
                                            value={userSearchQuery}
                                            onChange={(e) =>
                                                setUserSearchQuery(
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    {searchingUsers && (
                                        <p className="text-xs text-slate-400">
                                            Searching...
                                        </p>
                                    )}
                                    {searchedUsers.length > 0 && (
                                        <div className="mt-2 border border-slate-200 rounded-md bg-white divide-y divide-slate-100 overflow-hidden shadow-sm">
                                            {searchedUsers.map((u) => (
                                                <div
                                                    key={u.id}
                                                    className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
                                                >
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900">
                                                            {u.name}
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            {u.email}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        className="bg-slate-900 text-white hover:bg-slate-800 h-8"
                                                        onClick={() =>
                                                            handleAddAdmin(u.id)
                                                        }
                                                        disabled={
                                                            eventAdmins.some(
                                                                (ea) =>
                                                                    ea.id ===
                                                                    u.id,
                                                            ) ||
                                                            eventAdmins.length >=
                                                                3
                                                        }
                                                    >
                                                        {eventAdmins.some(
                                                            (ea) =>
                                                                ea.id === u.id,
                                                        )
                                                            ? "Already Admin"
                                                            : "Add Admin"}
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Right Side: Current Admins */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2">
                                <ShieldCheck className="h-5 w-5 text-yellow" />
                                <h3 className="font-semibold text-white">
                                    Current Admins{" "}
                                    {selectedEventId &&
                                        `(${eventAdmins.length}/3)`}
                                </h3>
                            </div>
                            <div className="rounded-md border border-slate-200 min-h-[200px]">
                                {!selectedEventId ? (
                                    <div className="h-full flex items-center justify-center text-slate-200 text-sm p-4 text-center">
                                        Please select an event to view and
                                        manage admins.
                                    </div>
                                ) : loadingAdmins ? (
                                    <div className="p-4 space-y-3">
                                        <Skeleton className="h-12 w-full" />
                                        <Skeleton className="h-12 w-full" />
                                    </div>
                                ) : eventAdmins.length === 0 ? (
                                    <div className="h-full flex items-center justify-center text-slate-400 text-sm p-4 text-center italic">
                                        No admins assigned to this event yet.
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-100">
                                        {eventAdmins.map((admin) => (
                                            <div
                                                key={admin.id}
                                                className="p-4 flex items-center justify-between border-b"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                                                        {admin.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-100">
                                                            {admin.name}
                                                        </p>
                                                        <p className="text-xs text-slate-200">
                                                            {admin.email}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() =>
                                                        handleRemoveAdmin(
                                                            admin.id,
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    );
}

export default ManageAdmins;
