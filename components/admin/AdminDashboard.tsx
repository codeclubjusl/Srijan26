"use client";

import { useState, useEffect } from "react";
import type { AuthUser } from "@/services/AuthService";
import {
    AdminEvent,
    EventParticipant,
    VerificationFilter,
} from "@/types/admin";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Download,
    Users,
    CheckCircle2,
    XCircle,
    Calendar,
    ChevronsUpDown,
    Check,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getEventRegistrationStatus } from "@/services/EventsService";
import { useConfirmationDialogContext } from "@/hooks/useConfirmationDialog";
import {
    closeEventRegistrations,
    openEventRegistrations,
} from "@/services/AdminService";
import toast from "react-hot-toast";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "../ui/command";

interface AdminDashboardProps {
    user: AuthUser;
    events: AdminEvent[];
}

export function AdminDashboard({ user, events }: AdminDashboardProps) {
    const [selectedEventSlug, setSelectedEventSlug] = useState<string>(
        events[0]?.slug || "",
    );
    const [verification, setVerification] = useState<VerificationFilter>("all");
    const [participants, setParticipants] = useState<EventParticipant[]>([]);
    const [loading, setLoading] = useState(false);
    const [registrationOpen, setRegistrationOpen] = useState(false);
    const [searchingEvent, setSearchingEvent] = useState(false);

    const dialog = useConfirmationDialogContext();
    const isEventParticipant = (value: unknown): value is EventParticipant => {
        if (!value || typeof value !== "object") return false;
        const v = value as EventParticipant;
        return (
            typeof v.id === "string" &&
            typeof v.name === "string" &&
            typeof v.email === "string"
        );
    };

    useEffect(() => {
        if (selectedEventSlug) {
            loadParticipants();
            getEventRegistrationStatus(selectedEventSlug).then((res) =>
                setRegistrationOpen(res),
            );
        }
    }, [selectedEventSlug, verification]);

    async function loadParticipants() {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                eventSlug: selectedEventSlug,
                verification,
            });
            const res = await fetch(
                `/api/admin/participants?${params.toString()}`,
            );
            if (!res.ok) throw new Error(`Request failed: ${res.status}`);
            const data = (await res.json()) as unknown;
            const normalized = Array.isArray(data)
                ? data.filter(isEventParticipant)
                : [];
            setParticipants(normalized);
        } catch (error) {
            console.error("Failed to load participants:", error);
        } finally {
            setLoading(false);
        }
    }

    const selectedEvent = events.find((e) => e.slug === selectedEventSlug);

    const verifiedCount = participants.filter((p) => p.emailVerified).length;
    const unverifiedCount = participants.filter((p) => !p.emailVerified).length;

    const handleExport = () => {
        if (!participants.length) return;
        const headers = [
            "Name",
            "Email",
            "Team",
            "Team Leader",
            "Phone",
            "College",
            "Verified",
        ];
        const rows = participants.map((p) => [
            p.name,
            p.email,
            p.teamName ?? "",
            p.teamLeaderName ?? "",
            p.phone ?? "",
            p.college ?? "",
            p.emailVerified ? "Yes" : "No",
        ]);
        const csv = [
            headers.join(","),
            ...rows.map((row) =>
                row
                    .map((cell) => {
                        const value = String(cell ?? "");
                        if (/[",\n]/.test(value)) {
                            return `"${value.replace(/"/g, '""')}"`;
                        }
                        return value;
                    })
                    .join(","),
            ),
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const safeSlug = selectedEventSlug || "event";
        a.href = url;
        a.download = `${safeSlug}-participants.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const isSuperAdmin = user.role === "SUPERADMIN";

    const handleCloseRegistrations = () => {
        dialog.showDialog(
            `Are you sure you want to close registrations for ${selectedEventSlug}?`,
            () => {
                closeEventRegistrations(selectedEventSlug)
                    .then((res) => {
                        if (res.ok) {
                            setRegistrationOpen(false);
                            toast.success("Registrations closed");
                        } else {
                            toast.error("Error occurred");
                        }
                    })
                    .catch(() => toast.error("Error occurred"));
            },
        );
    };

    const handleOpenRegistrations = () => {
        dialog.showDialog(
            `Are you sure you want to open registrations for ${selectedEventSlug}?`,
            () => {
                openEventRegistrations(selectedEventSlug)
                    .then((res) => {
                        if (res.ok) {
                            setRegistrationOpen(true);
                            toast.success("Registrations opened");
                        } else {
                            toast.error("Error occurred");
                        }
                    })
                    .catch(() => toast.error("Error occurred"));
            },
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900">
            <div className="border-b border-slate-200/70 bg-white/80 backdrop-blur">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
                                <Users className="h-5 w-5" />
                            </div>
                            <h1 className="text-xl font-semibold text-slate-900">
                                Admin Dashboard
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-sm text-slate-600">
                                    {user.email}
                                </p>
                            </div>
                            <Badge
                                className={`text-xs border ${isSuperAdmin ? "bg-slate-900 text-white border-slate-900" : "bg-slate-100 text-slate-800 border-slate-200"}`}
                            >
                                {user.role}
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="flex-1 w-full sm:w-auto sm:max-w-md">
                            <label className="text-sm font-medium text-slate-700 mb-2 block">
                                Select Event
                            </label>
                            {/* <Select
                value={selectedEventSlug}
                onValueChange={setSelectedEventSlug}
              >
                <SelectTrigger className="w-full bg-white border-slate-200 text-slate-900 shadow-sm">
                  <SelectValue placeholder="Choose an event" />
                </SelectTrigger>
                <SelectContent className="border-slate-200 bg-white shadow-lg">
                {events.map((event) => (
                  <SelectItem key={event.id} value={event.slug}>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-500" />
                      <span className="text-slate-900">{event.name}</span>
                      {!event.isVisible && (
                        <Badge className="text-xs bg-slate-900 text-white">
                          Hidden
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
              </Select> */}
                            <Popover
                                open={searchingEvent}
                                onOpenChange={setSearchingEvent}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={searchingEvent}
                                        className="w-full justify-between bg-white text-black"
                                    >
                                        {selectedEventSlug
                                            ? events.find(
                                                  (e) =>
                                                      e.slug ===
                                                      selectedEventSlug,
                                              )?.name
                                            : "Choose an event"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent className="w-full p-0 bg-slate-800">
                                    <Command className="w-full">
                                        <CommandInput placeholder="Search events..." />
                                        <CommandEmpty>
                                            No event found.
                                        </CommandEmpty>

                                        <CommandGroup className="w-full max-h-60 overflow-y-auto">
                                            {events.map((event) => (
                                                <CommandItem className="w-full"
                                                    key={event.id}
                                                    value={event.name}
                                                    onSelect={() => {
                                                        setSelectedEventSlug(event.slug);
                                                        setSearchingEvent(false);
                                                    }}
                                                >
                                                    {event.name}
                                                    <Check
                                                        className={`ml-auto h-4 w-4 ${
                                                            selectedEventSlug ===
                                                            event.slug
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        }`}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {selectedEvent && (
                        <>
                            <div className="grid gap-4 md:grid-cols-3">
                                <Card className="border-slate-200 shadow-sm bg-white/90">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-medium text-slate-600">
                                            Total Participants
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-slate-900">
                                            {participants.length}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-emerald-200/70 bg-emerald-50/70 shadow-sm">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-medium text-emerald-700">
                                            Verified
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-emerald-800">
                                            {verifiedCount}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-amber-200/70 bg-amber-50/70 shadow-sm">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-medium text-amber-700">
                                            Unverified
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-amber-800">
                                            {unverifiedCount}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card className="border-slate-200 shadow-sm bg-white/90">
                                <CardHeader>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div>
                                            <CardTitle className="text-slate-900">
                                                Participants
                                            </CardTitle>
                                            <CardDescription className="text-slate-600">
                                                Manage and view all registered
                                                participants for{" "}
                                                {selectedEvent.name}
                                            </CardDescription>
                                        </div>
                                        {registrationOpen ? (
                                            <button
                                                className="bg-black text-white py-2 px-4 rounded-sm cursor-pointer"
                                                onClick={
                                                    handleCloseRegistrations
                                                }
                                            >
                                                Close Registrations
                                            </button>
                                        ) : (
                                            <button
                                                className="bg-black text-white py-2 px-4 rounded-sm cursor-pointer"
                                                onClick={
                                                    handleOpenRegistrations
                                                }
                                            >
                                                Open Registrations
                                            </button>
                                        )}
                                        <Button
                                            onClick={handleExport}
                                            className="whitespace-nowrap bg-slate-900 text-white hover:bg-slate-800"
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Export Data
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <Tabs
                                            value={verification}
                                            onValueChange={(value) =>
                                                setVerification(
                                                    value as VerificationFilter,
                                                )
                                            }
                                        >
                                            <TabsList className="grid w-full max-w-md grid-cols-3 bg-slate-100 text-slate-700">
                                                <TabsTrigger
                                                    value="all"
                                                    className="data-[state=active]:bg-white data-[state=active]:text-slate-900"
                                                >
                                                    All
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="verified"
                                                    className="data-[state=active]:bg-white data-[state=active]:text-slate-900"
                                                >
                                                    Verified
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="unverified"
                                                    className="data-[state=active]:bg-white data-[state=active]:text-slate-900"
                                                >
                                                    Unverified
                                                </TabsTrigger>
                                            </TabsList>
                                        </Tabs>

                                        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                                            {loading ? (
                                                <div className="p-8 space-y-3">
                                                    <Skeleton className="h-4 w-full bg-slate-100" />
                                                    <Skeleton className="h-4 w-full bg-slate-100" />
                                                    <Skeleton className="h-4 w-full bg-slate-100" />
                                                </div>
                                            ) : participants.length === 0 ? (
                                                <div className="text-center py-12 text-slate-500">
                                                    No participants found
                                                </div>
                                            ) : (
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead className="text-slate-700">
                                                                Name
                                                            </TableHead>
                                                            <TableHead className="text-slate-700">
                                                                Email
                                                            </TableHead>
                                                            <TableHead className="text-slate-700">
                                                                Team
                                                            </TableHead>
                                                            <TableHead className="text-slate-700">
                                                                Leader
                                                            </TableHead>
                                                            <TableHead className="text-slate-700">
                                                                Phone
                                                            </TableHead>
                                                            <TableHead className="text-slate-700">
                                                                College
                                                            </TableHead>
                                                            <TableHead className="text-center text-slate-700">
                                                                Verified
                                                            </TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {participants.map(
                                                            (participant) => (
                                                                <TableRow
                                                                    key={
                                                                        participant.id
                                                                    }
                                                                >
                                                                    <TableCell className="font-medium text-slate-900">
                                                                        {
                                                                            participant.name
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell className="text-slate-700">
                                                                        {
                                                                            participant.email
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell className="text-slate-700">
                                                                        {participant.teamName || (
                                                                            <span className="text-slate-400">
                                                                                N/A
                                                                            </span>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell className="text-slate-700">
                                                                        {participant.teamLeaderName || (
                                                                            <span className="text-slate-400">
                                                                                N/A
                                                                            </span>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {participant.phone || (
                                                                            <span className="text-slate-400">
                                                                                N/A
                                                                            </span>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {participant.college || (
                                                                            <span className="text-slate-400">
                                                                                N/A
                                                                            </span>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell className="text-center">
                                                                        {participant.emailVerified ? (
                                                                            <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                                                                        ) : (
                                                                            <XCircle className="h-5 w-5 text-amber-500 mx-auto" />
                                                                        )}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ),
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {!selectedEvent && events.length === 0 && (
                        <Card className="border-slate-200 shadow-sm bg-white/90">
                            <CardContent className="pt-6">
                                <div className="text-center py-12 text-slate-500">
                                    No events assigned to you yet
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
