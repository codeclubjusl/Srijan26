"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SuperAdminDashboardProps } from "@/types/superadmin";
import LiveEvents from "./superadmin/LiveEvents";
import AllUsers from "./superadmin/Users";
import Merchandise from "./superadmin/Merchandise";
import { Users } from "lucide-react";
import ManageAdmins from "./superadmin/ManageAdmins";

export function SuperAdminDashboard({ user }: SuperAdminDashboardProps) {
    // Manage Admins State
    const [activeTab, setActiveTab] = useState<string>("users");
    const [clearingCache, setClearingCache] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    async function handleClearCache() {
        if (!confirm("Are you sure you want to clear all Next.js caches? This will affect all live site data until re-fetched.")) return;
        setClearingCache(true);
        try {
            const res = await fetch("/api/superadmin/clear-cache", {
                method: "POST"
            });
            const data = await res.json();
            if (res.ok) {
                alert("Cache cleared successfully!");
            } else {
                alert(data.error || "Failed to clear cache");
            }
        } catch (error) {
            console.error("Failed to clear cache", error);
            alert("Error clearing cache");
        } finally {
            setClearingCache(false);
        }
    }    

    return (
        <div className="min-h-screen bg-gradient-to-br">
            <div className="border-b border-slate-200/70 backdrop-blur sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-yellow text-black flex items-center justify-center shadow-sm">
                                <Users className="h-5 w-5" />
                            </div>
                            <h1 className="text-xl font-semibold text-yellow">SuperAdmin Dashboard</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleClearCache}
                                disabled={clearingCache}
                                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                            >
                                {clearingCache ? "Clearing..." : "Clear Caches"}
                            </Button>
                            <div className="text-right hidden sm:block">
                                <p className="text-sm text-yellow">{user.email}</p>
                            </div>
                            <Badge className="bg-yellow text-black border-slate-900">SUPERADMIN</Badge>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {!isMounted ? null : (
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <TabsList className="p-1 rounded-lg border">
                            <TabsTrigger value="users" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">Users</TabsTrigger>
                            <TabsTrigger value="merchandise" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">Merchandise</TabsTrigger>
                            <TabsTrigger value="live-events" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">Live Events</TabsTrigger>
                            <TabsTrigger value="manage-admins" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">Manage Admins</TabsTrigger>
                        </TabsList>

                        <AllUsers />
                        <Merchandise />
                        <LiveEvents activeTab={activeTab} />
                        <ManageAdmins />
                        
                    </Tabs>
                )}
            </div>
        </div>
    );
}
