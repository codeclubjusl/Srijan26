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
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Download, CheckCircle2, XCircle } from "lucide-react";
import { downloadCSV } from "@/utils/downloadCSV";
import { UserData } from "@/types/superadmin";

function AllUsers() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    useEffect(() => {
        fetchUsers()
    },[])
    
    async function fetchUsers() {
        setLoadingUsers(true);
        try {
            const res = await fetch("/api/superadmin/users");
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoadingUsers(false);
        }
    }
    const exportUsers = () => {
        if (!users.length) return;
        const headers = [
            "Name",
            "Email",
            "Phone",
            "College",
            "Department",
            "Year",
            "Role",
        ];
        const rows = users.map((u) => [
            u.name,
            u.email,
            u.phone || "",
            u.college || "",
            u.department || "",
            u.year || "",
            u.role,
        ]);

        downloadCSV(headers, rows, "all-users.csv");
    };
    return (
        <TabsContent value="users" className="space-y-4 text-lg">
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>All Users</CardTitle>
                        <CardDescription className="text-base">
                            Total registered users: {users.length}
                        </CardDescription>
                    </div>
                    <Button
                        onClick={exportUsers}
                        className="bg-white text-black hover:bg-yellow transition-colors duration-200"
                    >
                        <Download className="mr-2 h-4 w-4" /> Export CSV
                    </Button>
                </CardHeader>
                <CardContent>
                    {loadingUsers ? (
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                        </div>
                    ) : (
                        <div className="rounded-md border border-slate-200 overflow-x-auto">
                            <Table className="text-base">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>College</TableHead>
                                        <TableHead>Dept</TableHead>
                                        <TableHead>Year</TableHead>
                                        <TableHead>Verified</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((u) => (
                                        <TableRow key={u.id}>
                                            <TableCell className="font-medium">
                                                {u.name}
                                            </TableCell>
                                            <TableCell>{u.email}</TableCell>
                                            <TableCell>
                                                {u.phone || "-"}
                                            </TableCell>
                                            <TableCell>
                                                {u.college || "-"}
                                            </TableCell>
                                            <TableCell>
                                                {u.department || "-"}
                                            </TableCell>
                                            <TableCell>
                                                {u.year || "-"}
                                            </TableCell>
                                            <TableCell>
                                                {u.emailVerified ? (
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                                ) : (
                                                    <XCircle className="h-4 w-4 text-amber-500" />
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
    );
}

export default AllUsers;
